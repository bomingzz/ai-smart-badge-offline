import { Device, TraditionalClip } from '../types';

export type SopTaskId = 'ck' | 'ee' | 'sf' | 'mf';

export interface SOPAnalysisTemplate {
  id: SopTaskId;
  shortName: string;
  name: string;
  category: string;
  icon: string;
  desc: string;
  engineName: string;
  stepsCount: number;
}

export interface ClipSOPRecord {
  sopTaskId: SopTaskId;
  sopShortName: string;
  sopFullName: string;
  icon: string;
  timelineEventId: string;
  analyzedAt: string;
}

export const AVAILABLE_SOP_TEMPLATES: SOPAnalysisTemplate[] = [
  {
    id: 'ck',
    shortName: '餐饮后厨SOP',
    name: '餐饮后厨冷链生鲜与切配卫生 SOP',
    category: '食安合规监督',
    icon: '🍳',
    desc: '覆盖生熟砧板刀具分类隔离、冷柜温度 OCR 识别对齐、后厨人员口罩帽子卫生规范。',
    engineName: '后厨视觉与语音融合多模态引擎 v3.1',
    stepsCount: 3
  },
  {
    id: 'ee',
    shortName: '高压电工SOP',
    name: '高压电气配电柜定检及 LOTO 规程',
    category: '高危作业安全',
    icon: '⚡',
    desc: '覆盖断电锁定挂牌 (LOTO)、20kV 高压绝缘 PPE 穿戴、三相验电放电及盖板封印闭环。',
    engineName: '高压电气智能合规监督大模型 v4.0',
    stepsCount: 4
  },
  {
    id: 'sf',
    shortName: '消防巡检SOP',
    name: '园区消防通道与周界巡检 SOP',
    category: '园区安全防范',
    icon: '🚨',
    desc: '包含消防主通道 2.4 米净空巡检、应急疏散指示灯查验及物料违规占用抓拍自动派单。',
    engineName: 'AI 园区全景巡检雷达 v1.8',
    stepsCount: 3
  },
  {
    id: 'mf',
    shortName: '精密装配SOP',
    name: '离散制造精密组装与力矩紧固 SOP',
    category: '工业智造质检',
    icon: '⚙️',
    desc: '包含零部件二维码扫码防错、定扭矩扳手交错紧固、工序完成自动打标入库。',
    engineName: '离散制造组装工序复核大模型 v2.2',
    stepsCount: 3
  }
];

export function getDefaultSopTemplateForClip(
  clip: Pick<TraditionalClip, 'description'>,
  device?: Pick<Device, 'name' | 'location'> | null
): SOPAnalysisTemplate {
  const text = `${clip.description} ${device?.name || ''} ${device?.location || ''}`.toLowerCase();
  if (text.includes('后厨') || text.includes('备餐') || text.includes('切配') || text.includes('厨房') || text.includes('冷作')) {
    return AVAILABLE_SOP_TEMPLATES.find(t => t.id === 'ck') || AVAILABLE_SOP_TEMPLATES[0];
  } else if (text.includes('配电') || text.includes('高压') || text.includes('电工')) {
    return AVAILABLE_SOP_TEMPLATES.find(t => t.id === 'ee') || AVAILABLE_SOP_TEMPLATES[1];
  } else if (text.includes('消防') || text.includes('巡检') || text.includes('安保') || text.includes('门')) {
    return AVAILABLE_SOP_TEMPLATES.find(t => t.id === 'sf') || AVAILABLE_SOP_TEMPLATES[2];
  } else if (text.includes('车床') || text.includes('精修') || text.includes('装配') || text.includes('制造')) {
    return AVAILABLE_SOP_TEMPLATES.find(t => t.id === 'mf') || AVAILABLE_SOP_TEMPLATES[3];
  }
  return AVAILABLE_SOP_TEMPLATES[0];
}

export function resolveCurrentExecutingSopId(
  clip: Pick<TraditionalClip, 'id' | 'description'>,
  clipExecutingSopMap: Record<string, SopTaskId>,
  clipSopRecords: Record<string, ClipSOPRecord[]>,
  device?: Pick<Device, 'name' | 'location'> | null
): SopTaskId {
  const mapped = clipExecutingSopMap[clip.id];
  if (mapped) return mapped;
  const records = clipSopRecords[clip.id] || [];
  if (records.length > 0) return records[0].sopTaskId;
  return getDefaultSopTemplateForClip(clip, device).id;
}

export function resolveSopTemplateById(id: SopTaskId): SOPAnalysisTemplate {
  return AVAILABLE_SOP_TEMPLATES.find(t => t.id === id) || AVAILABLE_SOP_TEMPLATES[0];
}

export function applySingleSopSelection(
  clipExecutingSopMap: Record<string, SopTaskId>,
  clipId: string,
  selectedSopId: SopTaskId
): Record<string, SopTaskId> {
  return {
    ...clipExecutingSopMap,
    [clipId]: selectedSopId
  };
}
