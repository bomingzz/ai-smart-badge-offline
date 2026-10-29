import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FilePlus, Edit3, Trash2, CheckCircle2, 
  Search, Layers
} from 'lucide-react';
import { CreateSOPWizardModal, SOPStepRule, SOPConfigData } from './CreateSOPWizardModal';

export interface Skill {
  id: string;
  name: string;
  description: string;
  industry: 'catering' | 'heavy_industry' | 'logistics' | 'manufacturing';
  category: 'Safety' | 'Compliance' | 'Operations';
  isActive: boolean;
  recommended?: boolean;
  isCustom?: boolean;
  stepsCount?: number;
  devicesCount?: number;
  steps?: SOPStepRule[];
  customPrompt?: string;
  reportPrompt?: string; // 报告模板提示词
  maxTotalDuration?: number;
  selectedDeviceIds?: string[];
  isStrictSequential?: boolean; // 是否强制顺序执行
}

const categoryMap: Record<string, string> = {
  'Safety': '安全合规与预警',
  'Compliance': 'SOP 标准化审计',
  'Operations': '日常维保与协同'
};

const initialSkills: Skill[] = [
  { 
    id: 's1', 
    name: '后厨操作标准化视检引擎', 
    description: '用于多维度监控生熟切配分离、卫生着装合规、菜品存放超时等后厨核心 SOP 指标。', 
    industry: 'catering', 
    category: 'Compliance', 
    isActive: true,
    stepsCount: 3,
    devicesCount: 4,
    maxTotalDuration: 15,
    isStrictSequential: true,
    customPrompt: '检测切配区红/绿砧板颜色语义分割，发现生熟混用瞬间触发 Failed 警报。提取口述温度与仪表数字对比。',
    reportPrompt: '请基于后厨多模态识别结果，汇总生熟切配隔离、口罩工作帽规范、冷柜存温核验三大指标，生成包含【合规总览】、【违规明细与扣分】、【后厨食安改进建议】的质检报告。',
    selectedDeviceIds: ['d1', 'd3', 'd4'],
    steps: [
      { id: 's1_1', stepNo: 1, title: '生熟砧板与刀具分类隔离', sopStandard: '红色切生肉砧板与绿色切蔬果砧板物理隔离 ≥ 1.5 米，刀具专板专用。', alarmLevel: 'P0', stepMaxDuration: 30, isRequired: true },
      { id: 's1_2', stepNo: 2, title: '冷冰柜存温口述与数显表 OCR 验证', sopStandard: '冷藏柜维持 0-4℃，主厨口述汇报并指向数显仪表盘，音视频对齐校验。', alarmLevel: 'P2', stepMaxDuration: 30, isRequired: false },
      { id: 's1_3', stepNo: 3, title: '口罩与工作帽规范穿戴', sopStandard: '工作帽包裹全部头发，口罩遮挡鼻梁与下巴，无裸露首饰。', alarmLevel: 'P1', stepMaxDuration: 20, isRequired: true }
    ]
  },
  { 
    id: 's5', 
    name: '后厨烟火与温控预警系统', 
    description: '边缘端实时热源监测。检测后厨违规离人离岗、明火燃气泄漏及冷链储藏温度越线。', 
    industry: 'catering', 
    category: 'Safety', 
    isActive: false,
    stepsCount: 2,
    devicesCount: 3,
    maxTotalDuration: 10,
    isStrictSequential: false,
    customPrompt: '监控燃气明火状态与离人离岗时长，超过3分钟未有人在岗触发严重预警。',
    reportPrompt: '请生成后厨消防与热源安全巡检报告：汇总燃气灶明火离人离岗超限记录、灭火毯与防烟面罩齐备状况，输出安全隐患级别及排查建议。',
    selectedDeviceIds: ['d1', 'd2'],
    steps: [
      { id: 's5_1', stepNo: 1, title: '燃气灶明火离人离岗监测', sopStandard: '点火后灶台 1 米范围内需持续有人监护，离岗超 3 分钟触发强声光预警。', alarmLevel: 'P0', stepMaxDuration: 180, isRequired: true },
      { id: 's5_2', stepNo: 2, title: '灭火毯与应急阀门例行检查', sopStandard: '每日开档前确认燃气总电磁阀及防烟面罩齐备有效。', alarmLevel: 'P1', stepMaxDuration: 40, isRequired: false }
    ]
  },
  { 
    id: 's2', 
    name: '高危电工作业安全审计', 
    description: '极低延迟防护检测模块，高频捕捉高压电工作业的防护装备穿戴及 LOTO 挂牌锁定流程规范。', 
    industry: 'heavy_industry', 
    category: 'Safety', 
    isActive: true,
    stepsCount: 3,
    devicesCount: 5,
    maxTotalDuration: 20,
    isStrictSequential: true,
    customPrompt: '必须严格判定接地线拉拽紧固二次复核动作，缺失则标记 warning。检测防护面罩落锁停留时间须大于 2 秒。',
    reportPrompt: '请生成高压电工作业安全审计报告，重点输出：1. LOTO 锁扣挂牌规范度；2. 绝缘 PPE 穿戴完整性；3. 三相验电及接地线复核判定；4. 针对高危隐患列明阻断整改措施。',
    selectedDeviceIds: ['d1', 'd3', 'd4', 'd5'],
    steps: [
      { id: 's2_1', stepNo: 1, title: '断电隔离与 LOTO 锁扣挂牌', sopStandard: '必须断开高压隔离刀闸，并在控制把手佩戴个人专属防操作蓝色锁扣与警告标牌。', alarmLevel: 'P0', stepMaxDuration: 45, isRequired: true },
      { id: 's2_2', stepNo: 2, title: '高压绝缘 PPE 防护服穿戴', sopStandard: '穿戴 20kV 绝缘手套、防爆绝缘面罩、绝缘安全靴，且手套无破损裂纹。', alarmLevel: 'P0', stepMaxDuration: 60, isRequired: true },
      { id: 's2_3', stepNo: 3, title: '三相验电与残余电荷放电', sopStandard: '使用校准合格的高压验电器对 A/B/C 三相接线端子逐一接触验电。', alarmLevel: 'P0', stepMaxDuration: 60, isRequired: true }
    ]
  },
  { 
    id: 's6', 
    name: '高空作业防坠安全绳审计', 
    description: '高处作业行为守护。实时核验安全带、防坠锁扣是否正确高挂低用，智能防范高空坠落险情。', 
    industry: 'heavy_industry', 
    category: 'Safety', 
    isActive: false, 
    recommended: true,
    stepsCount: 2,
    devicesCount: 3,
    maxTotalDuration: 15,
    selectedDeviceIds: ['d3', 'd4'],
    steps: [
      { id: 's6_1', stepNo: 1, title: '全身式双钩安全带穿戴', sopStandard: '安全带双钩高挂低用，挂钩必须扣在牢固构件或专用生命线上。', alarmLevel: 'P0', stepMaxDuration: 45, isRequired: true },
      { id: 's6_2', stepNo: 2, title: '防坠速差自控器锁止点确认', sopStandard: '每次位移必须交替扣牢双钩，严禁失去保护移动。', alarmLevel: 'P0', stepMaxDuration: 30, isRequired: true }
    ]
  },
  { 
    id: 's3', 
    name: 'AI 园区全景巡检雷达', 
    description: '整合红外与低光增强技术，针对园区动态追踪识别违规停放、起火点、物料违规堆积等消防隐患。', 
    industry: 'logistics', 
    category: 'Safety', 
    isActive: false, 
    recommended: true,
    stepsCount: 2,
    devicesCount: 4,
    maxTotalDuration: 25,
    selectedDeviceIds: ['d2', 'd5'],
    steps: [
      { id: 's3_1', stepNo: 1, title: '消防通道 2.4 米净空核对', sopStandard: '核验园区消防疏散走廊物料堆叠高度与宽度，违停车辆立即报警。', alarmLevel: 'P1', stepMaxDuration: 30, isRequired: true },
      { id: 's3_2', stepNo: 2, title: '危化品库区防爆温湿度巡检', sopStandard: '对易燃易爆物料周界红外热成像测温，超过 38℃ 触发预警。', alarmLevel: 'P0', stepMaxDuration: 40, isRequired: true }
    ]
  },
  { 
    id: 's7', 
    name: '叉车防碰撞与危险区域警报', 
    description: '高精度动态人车间距测算。在叉车超速、越线、侵入行人通道或装卸盲区时发出声光强告警。', 
    industry: 'logistics', 
    category: 'Safety', 
    isActive: false,
    stepsCount: 2,
    devicesCount: 3,
    maxTotalDuration: 20,
    selectedDeviceIds: ['d4', 'd5'],
    steps: [
      { id: 's7_1', stepNo: 1, title: '出入库盲区限速 5km/h 测算', sopStandard: '进入仓库转弯处必须鸣笛，车速不得超过 5 公里/小时。', alarmLevel: 'P1', stepMaxDuration: 20, isRequired: true },
      { id: 's7_2', stepNo: 2, title: '人车 2 米安全距离动态防碰撞', sopStandard: '行人进入叉车后方 2 米盲区时自动触发声光强报警并提示避让。', alarmLevel: 'P0', stepMaxDuration: 15, isRequired: true }
    ]
  },
  { 
    id: 's4', 
    name: '设施维修专家远程协同', 
    description: '开启第一视角极清音视频流与 AR 标注支持，连线云端专家库工程师远程排除设备突发故障。', 
    industry: 'manufacturing', 
    category: 'Operations', 
    isActive: false,
    stepsCount: 2,
    devicesCount: 2,
    maxTotalDuration: 30,
    selectedDeviceIds: ['d1', 'd4'],
    steps: [
      { id: 's4_1', stepNo: 1, title: '第一视角工况图谱对齐', sopStandard: '工牌摄像头对准设备铭牌及故障指示灯，调取设备图纸 AR 空间定位。', alarmLevel: 'P2', stepMaxDuration: 60, isRequired: false },
      { id: 's4_2', stepNo: 2, title: '远程专家交互标注与解算', sopStandard: '专家端音视频双向推流，云端实时下发拆装标记指引。', alarmLevel: 'P2', stepMaxDuration: 120, isRequired: false }
    ]
  },
  { 
    id: 's8', 
    name: '离散制造组装工序复核系统', 
    description: '对精细装配流水线作业步骤（装配、拧紧、贴标）执行帧级核对，彻底防止手工工段漏件错件。', 
    industry: 'manufacturing', 
    category: 'Compliance', 
    isActive: false,
    stepsCount: 3,
    devicesCount: 4,
    maxTotalDuration: 20,
    customPrompt: '高精捕捉定扭矩扳手的 5 点交错紧固顺序 (1-3-5-2-4)，若跳步拧紧或漏拧直接触发高亮报警。',
    selectedDeviceIds: ['d1', 'd3'],
    steps: [
      { id: 's8_1', stepNo: 1, title: '零配件二维码扫描与物料防错', sopStandard: '对零件二维追溯码进行光感对焦扫描，核对 BOM 批次型号。', alarmLevel: 'P1', stepMaxDuration: 30, isRequired: true },
      { id: 's8_2', stepNo: 2, title: '定扭矩电动扳手五点交错紧固', sopStandard: '五螺栓盖板采用星形交错顺序紧固，目标扭矩 45 N·m。', alarmLevel: 'P0', stepMaxDuration: 60, isRequired: true },
      { id: 's8_3', stepNo: 3, title: '外观合规与成品贴标核查', sopStandard: '贴附合格证并核验边缘无翘起，拍照完成工单归档。', alarmLevel: 'P2', stepMaxDuration: 25, isRequired: true }
    ]
  }
];

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Wizard Modal State for Creation & Editing
  const [isSopWizardOpen, setIsSopWizardOpen] = useState<boolean>(false);
  const [editingSop, setEditingSop] = useState<Skill | null>(null);
  const [wizardMode, setWizardMode] = useState<'create' | 'edit'>('create');
  const [successNotification, setSuccessNotification] = useState<{ message: string; sopId: string } | null>(null);

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  // Open Create Mode
  const handleOpenCreateSop = () => {
    setEditingSop(null);
    setWizardMode('create');
    setIsSopWizardOpen(true);
  };

  // Open Edit Mode
  const handleEditSop = (skill: Skill) => {
    setEditingSop(skill);
    setWizardMode('edit');
    setIsSopWizardOpen(true);
  };

  // Delete Custom SOP
  const handleDeleteSop = (id: string) => {
    if (confirm('确认删除此项自定义 SOP 规程吗？')) {
      setSkills(prev => prev.filter(s => s.id !== id));
      if (successNotification?.sopId === id) {
        setSuccessNotification(null);
      }
    }
  };

  // Save SOP from Wizard
  const handleSaveSop = (sopData: SOPConfigData) => {
    if (wizardMode === 'edit') {
      setSkills(prev => prev.map(s => {
        if (s.id === sopData.id) {
          return {
            ...s,
            name: sopData.name,
            description: sopData.description || s.description,
            stepsCount: sopData.steps?.length || s.stepsCount || 3,
            devicesCount: sopData.selectedDeviceIds?.length || s.devicesCount || 3,
            steps: sopData.steps,
            selectedDeviceIds: sopData.selectedDeviceIds,
            maxTotalDuration: sopData.maxTotalDuration,
            isStrictSequential: sopData.isStrictSequential !== undefined ? sopData.isStrictSequential : true,
            customPrompt: sopData.customPrompt,
            reportPrompt: sopData.reportPrompt,
            isActive: s.isActive
          };
        }
        return s;
      }));
      setSuccessNotification({
        message: `SOP 规程「${sopData.name}」已更新并重新同步至终端！`,
        sopId: sopData.id
      });
    } else {
      const newSkill: Skill = {
        id: sopData.id || `sop_custom_${Date.now()}`,
        name: sopData.name,
        description: sopData.description || `已通过 4 阶段链式向导成功下发。绑定了 ${sopData.selectedDeviceIds?.length || 3} 台穿戴终端设备。`,
        industry: sopData.industry || 'heavy_industry',
        category: sopData.category || 'Compliance',
        isActive: true,
        recommended: true,
        isCustom: true,
        stepsCount: sopData.steps?.length || 3,
        devicesCount: sopData.selectedDeviceIds?.length || 3,
        steps: sopData.steps,
        selectedDeviceIds: sopData.selectedDeviceIds,
        maxTotalDuration: sopData.maxTotalDuration,
        isStrictSequential: sopData.isStrictSequential !== undefined ? sopData.isStrictSequential : true,
        customPrompt: sopData.customPrompt,
        reportPrompt: sopData.reportPrompt
      };
      setSkills(prev => [newSkill, ...prev]);
      setSuccessNotification({
        message: `SOP 规程「${sopData.name}」配置完成并下发成功！`,
        sopId: newSkill.id
      });
    }
    setIsSopWizardOpen(false);
  };

  // Filter skills by search query
  const filteredSkills = skills.filter(s => {
    return !searchQuery.trim() || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-4 pb-24"
    >
      {/* Page Title & Main Action (Fixed Layout without horizontal squeeze) */}
      <div className="pt-3 border-b border-slate-200 pb-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-800">
            模型配置与 SOP 算法中心
          </h2>

          {/* Primary Action Button (Without AI 推荐 or 物品标记 buttons) */}
          <button
            onClick={handleOpenCreateSop}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition-all active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <FilePlus className="w-4 h-4 text-blue-100" />
            <span>新增 SOP 向导</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          管理与配置部署于穿戴式设备的视听多模态模型与 SOP 审计规程。支持步骤链向导编排、规则在线编辑与算法实时下发。
        </p>
      </div>

      {/* SOP Configuration Finished / Updated Notification Banner */}
      {successNotification && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-emerald-950 truncate">{successNotification.message}</p>
              <p className="text-[10px] text-emerald-700">规程策略已实时同步至穿戴终端，点击右侧可再次编辑。</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => {
                const target = skills.find(s => s.id === successNotification.sopId);
                if (target) handleEditSop(target);
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3 h-3" />
              <span>编辑规程</span>
            </button>
            <button
              onClick={() => setSuccessNotification(null)}
              className="w-6 h-6 text-emerald-600 hover:text-emerald-800 flex items-center justify-center rounded-lg hover:bg-emerald-100/50 cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search Input Toolbar */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索规程名称或关键词..."
          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 pl-8"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Cards List Section */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-0.5">
            SOP 规程与算法模型列表
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            共计 {filteredSkills.length} 项 (已激活 {filteredSkills.filter(s => s.isActive).length} 项)
          </span>
        </div>
        
        {filteredSkills.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <Layers className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-600 font-bold mb-1">未找到匹配的 SOP 规程</p>
            <p className="text-[11px] text-slate-400 mb-4">请尝试切换分类筛选，或点击右上方创建新的规程</p>
            <button
              onClick={handleOpenCreateSop}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              + 新增 SOP 规则
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {filteredSkills.map((skill) => (
              <SkillCard 
                key={skill.id} 
                skill={skill} 
                onToggle={() => toggleSkill(skill.id)} 
                onEdit={() => handleEditSop(skill)}
                onDelete={skill.isCustom ? () => handleDeleteSop(skill.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* SOP Creation & Editing Wizard Modal */}
      <CreateSOPWizardModal
        isOpen={isSopWizardOpen}
        onClose={() => {
          setIsSopWizardOpen(false);
          setEditingSop(null);
        }}
        mode={wizardMode}
        initialData={editingSop ? {
          id: editingSop.id,
          name: editingSop.name,
          description: editingSop.description,
          industryCategory: editingSop.industry === 'catering' ? '餐饮与食品' : editingSop.industry === 'heavy_industry' ? '电力与重工业' : editingSop.industry === 'logistics' ? '园区安保' : '电力与重工业',
          maxTotalDuration: editingSop.maxTotalDuration || 15,
          customPrompt: editingSop.customPrompt || '必须严格判定作业关键动作，缺失则标记 warning。',
          reportPrompt: editingSop.reportPrompt || '请基于本次 SOP 步骤链执行记录与视音频多模态凭证，按【作业概况】、【核心违规与扣分项】、【整改与改进建议】结构化生成标准质检审计报告。',
          isStrictSequential: editingSop.isStrictSequential !== undefined ? editingSop.isStrictSequential : true,
          steps: editingSop.steps || [
            { id: `${editingSop.id}_1`, stepNo: 1, title: '初始作业合规核验', sopStandard: editingSop.description, alarmLevel: 'P0', stepMaxDuration: 45, isRequired: true }
          ],
          selectedDeviceIds: editingSop.selectedDeviceIds || ['d1', 'd3', 'd4'],
          isActive: editingSop.isActive,
          category: editingSop.category,
          industry: editingSop.industry,
          isCustom: editingSop.isCustom
        } : null}
        onSuccessDispatch={handleSaveSop}
      />
    </motion.div>
  );
}

function SkillCard({ 
  skill, 
  onToggle, 
  onEdit, 
  onDelete 
}: { 
  key?: React.Key;
  skill: Skill; 
  onToggle: () => void; 
  onEdit: () => void; 
  onDelete?: () => void; 
}) {
  return (
    <div className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between ${
      skill.isActive 
        ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-400/20' 
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      <div>
        {/* Top: Title + Toggle */}
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] leading-snug line-clamp-2 flex-1" title={skill.name}>
            {skill.name}
          </h4>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={`relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-0.5 ${
              skill.isActive ? 'bg-blue-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={skill.isActive}
            title={skill.isActive ? '点击停用算法' : '点击激活算法'}
          >
            <span 
              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                skill.isActive ? 'translate-x-3.5' : 'translate-x-0'
              }`} 
            />
          </button>
        </div>

        {/* Badges & Status */}
        <div className="flex items-center flex-wrap gap-1 mb-1.5">
          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
            skill.isActive 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-slate-100 text-slate-500'
          }`}>
            {skill.isActive ? '运行中' : '已停用'}
          </span>
          {skill.isCustom && (
            <span className="text-[9px] font-bold bg-blue-100 text-blue-700 border border-blue-200 px-1 py-0.2 rounded">
              自定义
            </span>
          )}
          {skill.recommended && !skill.isActive && (
            <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1 py-0.2 rounded">
              建议开启
            </span>
          )}
          {skill.isStrictSequential !== undefined && (
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
              skill.isStrictSequential 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-teal-50 text-teal-700 border-teal-200'
            }`}>
              {skill.isStrictSequential ? '强顺序' : '自由时序'}
            </span>
          )}
        </div>

        {/* Meta info: Type & Steps */}
        <div className="text-[10px] text-slate-500 font-mono mb-2 flex items-center justify-between">
          <span className="truncate max-w-[95px] text-slate-600">{categoryMap[skill.category]}</span>
          {skill.stepsCount && (
            <span className="text-slate-400 font-medium whitespace-nowrap">
              {skill.stepsCount}步骤
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 mb-2.5">
          {skill.description}
        </p>
      </div>

      {/* Card Bottom Action Bar: Edit Entry */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 mt-auto">
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer flex-shrink-0"
            title="删除此自定义规程"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Dedicated Edit Entry Button */}
        <button
          onClick={onEdit}
          className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer"
          title="查看与编辑规程步骤与配置"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
          <span>编辑规程</span>
        </button>
      </div>
    </div>
  );
}
