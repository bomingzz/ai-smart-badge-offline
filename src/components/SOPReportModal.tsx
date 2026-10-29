import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, CheckCircle2, AlertTriangle, XCircle, Download, 
  Copy, Check, ShieldCheck, Award, Clock, 
  User, MapPin, Cpu, Sparkles, Mic, Video, Layers, FileCheck, ChevronRight, ArrowLeft
} from 'lucide-react';

export interface SOPStepAnalysis {
  stepNo: number;
  title: string;
  sopStandard: string;
  aiVideoEvidence: string;
  status: 'passed' | 'failed' | 'warning';
  confidence: number;
  timeRange: string;
  snapshotUrl?: string;
  notes?: string;
}

export interface SOPReportDetail {
  taskId: string;
  reportId: string;
  taskCategory: string;
  title: string;
  sopName: string;
  inspectTime: string;
  deviceModel: string;
  deviceName: string;
  location: string;
  operator: string;
  score: number;
  overallStatus: 'passed' | 'failed' | 'warning';
  modelEngine: string;
  totalDuration: string;
  summary: string;
  steps: SOPStepAnalysis[];
  audioRecord?: {
    duration: string;
    transcription: string;
    audioFeatures: string;
  };
  recommendations: string[];
}

export const MAJOR_SOP_TASKS: SOPReportDetail[] = [
  {
    taskId: 'ee',
    reportId: 'SOP-RPT-20260717-EE01',
    taskCategory: '高危电工作业安全审计 SOP',
    title: '高危电工作业安全审计 - 大任务 SOP 质检报告',
    sopName: '《AQ-2026 高压电气配电柜定检及 LOTO 锁扣安全规程》',
    inspectTime: '2026-07-17 10:30:00',
    deviceModel: 'Smart-Glass Pro (配电防爆视角)',
    deviceName: '巡检安全帽-01 / B区配电房',
    location: 'B区高压配电房 #02变压柜',
    operator: '张伟 (高级电工工号 #EE-9041)',
    score: 78,
    overallStatus: 'warning',
    modelEngine: '高危电工作业安全审计大模型 v2.4 (mAP 99.2%)',
    totalDuration: '01:34',
    summary: '本大任务经 AI 视频多模态模型与 SOP 帧级标准比对：操作员严格遵照断电隔离、LOTO 锁扣挂牌正常，但在步骤二识别到左手未穿戴 20kV 高压绝缘手套，触发零容忍安全红线告警，系统已触发声光广播报警并生成紧急纠偏工单。',
    steps: [
      {
        stepNo: 1,
        title: '断电隔离与 LOTO 锁扣挂牌程序',
        sopStandard: '必须断开高压隔离刀闸，并在控制把手佩戴个人专属防操作蓝色锁扣与“有人工作”警告标牌，双人交叉核验。',
        aiVideoEvidence: '视觉模型精确识别到蓝色 LOTO 挂锁落锁到位，标牌文字清晰对齐，挂牌停留动作达 3.2 秒，符合防误触操作标准。',
        status: 'passed',
        confidence: 99.8,
        timeRange: '10:30:05 - 10:30:22 (17s)',
        snapshotUrl: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=600&auto=format&fit=crop',
        notes: '挂锁与警示牌无遮挡，视觉检测置信度 99.8%'
      },
      {
        stepNo: 2,
        title: '高压绝缘 PPE 防护服穿戴核验',
        sopStandard: '作业人员必须穿戴 20kV 绝缘手套、防爆绝缘面罩、绝缘安全靴，且手套无破损裂纹。',
        aiVideoEvidence: '视觉多模态关键点识别警报：操作员在接触带电设备时，左手未穿戴 20kV 高压绝缘手套（严重违规），触发零容忍安全红线！系统已触发声光广播报警并生成紧急纠偏工单。',
        status: 'failed',
        confidence: 99.4,
        timeRange: '10:30:23 - 10:30:48 (25s)',
        snapshotUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
        notes: '左手绝缘手套缺失，严重非标违规'
      },
      {
        stepNo: 3,
        title: '三相验电与残余电荷放电测试',
        sopStandard: '使用校准合格的高压验电器，对 A/B/C 三相接线端子逐一接触，观察验电声光提示音。',
        aiVideoEvidence: '视频识别到验电棒依次接触三相接线柱，音频传感器同步捕获到规范低频脉冲蜂鸣声（74dB），确定系统无残留电压。',
        status: 'passed',
        confidence: 98.9,
        timeRange: '10:30:49 - 10:31:15 (26s)',
        snapshotUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
        notes: '音视频多模态协同核验通过'
      },
      {
        stepNo: 4,
        title: '配电箱盖板复位与现场封印闭环',
        sopStandard: '检修完毕将配电箱盖板复位，顺时针紧固 4 颗防松螺栓，拍照上传安监云端打包。',
        aiVideoEvidence: '视觉定位到 4 枚螺栓均已固定，封印贴纸平整完好，现场无遗留螺丝刀等金属工具。图像数据打包写入分布式存储。',
        status: 'passed',
        confidence: 97.5,
        timeRange: '10:31:16 - 10:31:34 (18s)',
        snapshotUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
        notes: '工单已自动闭环，数据生成哈希摘要'
      }
    ],
    recommendations: [
      '针对步骤二“未穿戴 20kV 高压绝缘手套”违规，系统已下发阻断纠偏工单，需在工牌端核验确认。',
      '带电作业前必须严格进行个人与班组 PPE 交叉互检，确保高压绝缘面罩、绝缘手套、绝缘靴穿戴规范无破损。',
      '建议每月定期校准高压验电器声光灵敏度与 Smart-Glass 镜片红外测温模组。'
    ]
  },
  {
    taskId: 'ck',
    reportId: 'SOP-RPT-20260717-CK02',
    taskCategory: '后厨操作标准化 SOP 质检',
    title: '后厨操作标准化 - 大任务 SOP 质检报告',
    sopName: '《FS-2026 餐饮后厨冷链生鲜与切配卫生 SOP 规程》',
    inspectTime: '2026-07-17 08:45:00',
    deviceModel: 'Smart-Glass Pro (主厨视角)',
    deviceName: '主厨视角设备 / A区后厨',
    location: 'A区后厨 (冷作与粗加工间)',
    operator: '李明 (主厨 #CK-102)',
    score: 98,
    overallStatus: 'passed',
    modelEngine: '后厨操作标准化视检与语音融合引擎 v3.1',
    totalDuration: '00:45',
    summary: '本大任务通过多模态 AI 对主厨语音汇报与现场视频进行帧级对齐审计：冷柜温度测量与数显 100% 对齐、生熟切配区域物理隔离合规、厨师口罩帽着装合格，食安综合风险评级为“低风险/合规”。',
    steps: [
      {
        stepNo: 1,
        title: '生熟砧板与刀具分类隔离规程',
        sopStandard: '红色切生肉砧板与绿色切蔬果/白色切熟食砧板物理距离 ≥ 1.5 米，刀具专板专用。',
        aiVideoEvidence: '视觉语义分割识别到红色与绿色切配区距离为 1.85 米，刀具放置于专用消毒刀架，无交叉污染风险。',
        status: 'passed',
        confidence: 99.4,
        timeRange: '00:00 - 00:15',
        snapshotUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',
        notes: '砧板色标清晰，分区完好'
      },
      {
        stepNo: 2,
        title: '冷冰柜存温口述与数显表 OCR 验证',
        sopStandard: '冷藏柜温度须维持在 0-4℃ 之间，主厨口述汇报并指向数显仪表盘。',
        aiVideoEvidence: '音频识别“冷区冰柜温度3度”，视觉 OCR 提取数字表盘“3.2℃”，语音与图像特征 100% 对齐匹配。',
        status: 'passed',
        confidence: 98.6,
        timeRange: '00:16 - 00:30',
        snapshotUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop',
        notes: '语音与仪表数字一致性校验通过'
      },
      {
        stepNo: 3,
        title: '后厨人员口罩与网帽穿戴规范',
        sopStandard: '工作帽需严密包裹头发，口罩遮挡鼻梁与下巴，无外露首饰或长指甲。',
        aiVideoEvidence: '人脸与姿态关键点检测：主厨口罩完全覆盖鼻梁，网帽无发丝外露，符合食品安全严格卫生规范。',
        status: 'passed',
        confidence: 99.1,
        timeRange: '00:31 - 00:45',
        snapshotUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop',
        notes: '符合餐饮食安 GB-14881 卫生要求'
      }
    ],
    audioRecord: {
      duration: '00:45',
      transcription: '“主厨查验汇报——冷区冰柜温度3度（正常），生熟砧板彻底分离，刀具系统消毒完毕。”',
      audioFeatures: '语调平稳 | 声学声纹匹配度 99.2% | 无嘈杂异响'
    },
    recommendations: [
      '晨间备菜卫生完全符合餐饮食安规范，予以月度考核加分。',
      '建议午高峰用餐前再次启动刀具消毒柜进行二次紫外线杀菌。'
    ]
  },
  {
    taskId: 'sf',
    reportId: 'SOP-RPT-20260717-SF03',
    taskCategory: '园区消防通道与周界巡检 SOP',
    title: '园区消防通道与周界巡检 - 大任务 SOP 质检报告',
    sopName: '《SF-2026 园区消防通道与安全出口管理规范》',
    inspectTime: '2026-07-17 07:15:00',
    deviceModel: 'Aura V2 (全景巡检雷达)',
    deviceName: '夜巡记录仪-东门 / 园区安保',
    location: '园区东侧二楼消防通道',
    operator: '安保巡检系统 (边缘 AI 网关)',
    score: 62,
    overallStatus: 'warning',
    modelEngine: 'AI 园区全景巡检雷达 v1.8 (动态告警引擎)',
    totalDuration: '00:40',
    summary: '边缘 AI 巡检任务捕获东侧消防通道堆放纸箱货物，实际可用净宽不足。系统自动下发警报并派工单至保洁中心，复核图像确认货物已在 15 分钟内清理完毕，工单成功闭环。',
    steps: [
      {
        stepNo: 1,
        title: '消防通道 2.4 米净空巡检规程',
        sopStandard: '消防主通道全天候严禁堆放任何纸箱、托盘、装卸货物或违停设备。',
        aiVideoEvidence: '视觉模型识别到 3 堆木质托盘与装卸纸箱占用通道，实际剩余通行宽度 1.1 米（标准≥2.4米），判定为隐患占用。',
        status: 'failed',
        confidence: 99.6,
        timeRange: '00:00 - 00:10',
        snapshotUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbfde?q=80&w=600&auto=format&fit=crop',
        notes: '触发级别-1 级安全警报，自动触发派单'
      },
      {
        stepNo: 2,
        title: '边缘 AI 联动告警与工单自动下发',
        sopStandard: '检测到占用超 5 分钟，边缘网关须向园区安保中心与保洁主管发送急件工单。',
        aiVideoEvidence: '系统于 07:15:12 生成整改工单 #WO-8821，喇叭播放“消防通道严禁堆物”提示音，保洁人员开始响应。',
        status: 'passed',
        confidence: 100.0,
        timeRange: '00:11 - 00:20',
        snapshotUrl: 'https://images.unsplash.com/photo-1497250681554-fc1adfc1b9ce?q=80&w=600&auto=format&fit=crop',
        notes: '工单下发延迟 < 800ms'
      },
      {
        stepNo: 3,
        title: '现场清理闭环与复核恢复净空',
        sopStandard: '责任人需在 15 分钟内彻底清理完毕，上传复核图像解除警报。',
        aiVideoEvidence: '07:35:00 监控图像复核：占用货物已被搬离，通道恢复 2.5 米完整净空，警报自动解除闭环。',
        status: 'passed',
        confidence: 98.2,
        timeRange: '00:21 - 00:40',
        snapshotUrl: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=600&auto=format&fit=crop',
        notes: '隐患已消除，归档至月度安全台账'
      }
    ],
    recommendations: [
      '违规占用隐患已完成即时整改闭环，风险已彻底解除。',
      '建议在该区域地面加画“消防通道 违者罚款”黄色反光标识线。'
    ]
  },
  {
    taskId: 'mf',
    reportId: 'SOP-RPT-20260717-MF04',
    taskCategory: '离散制造精密组装 SOP 复核',
    title: '离散制造精密组装工序 - 大任务 SOP 质检报告',
    sopName: '《MF-2026 变速箱力矩紧固与精细装配 SOP 规范》',
    inspectTime: '2026-07-17 14:00:00',
    deviceModel: 'LOOKI Pro 工业眼镜',
    deviceName: '精细装配线-03工位',
    location: 'C区制造车间 03 组装台',
    operator: '王强 (装配技师 #MF-502)',
    score: 96,
    overallStatus: 'passed',
    modelEngine: '离散制造组装工序复核大模型 v2.2',
    totalDuration: '01:10',
    summary: '全流程视觉防错审计：关键零部件二维码扫描校验无误，定扭矩扳手完成 5 点交错紧固，数值均在 45±2 N·m 标准区间，合规打包入库。',
    steps: [
      {
        stepNo: 1,
        title: '零配件二维码扫描与物料防错匹配',
        sopStandard: '安装前使用眼镜摄像头对零件二维追溯码进行光感对焦，核对批次型号。',
        aiVideoEvidence: '视觉模型实时解析物料二维码“PART-8821-C”，防错匹配成功，避免错装误装。',
        status: 'passed',
        confidence: 99.5,
        timeRange: '00:00 - 00:20',
        snapshotUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
        notes: '零部件 BOM 对比一致'
      },
      {
        stepNo: 2,
        title: '定扭矩电动扳手五点交错紧固核验',
        sopStandard: '五螺栓盖板必须采用星形交错顺序紧固，目标扭矩 45 N·m。',
        aiVideoEvidence: '姿态与工具轨迹对齐：识别到按 1-3-5-2-4 顺序依次对 5 枚螺栓进行交错加力，未漏拧。',
        status: 'passed',
        confidence: 98.7,
        timeRange: '00:21 - 00:50',
        snapshotUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
        notes: '交错顺序与扭矩对齐通过'
      },
      {
        stepNo: 3,
        title: '光学防错传感器自动盖章留档',
        sopStandard: '装配完毕后，摄像头进行 3D 深度拟合测量，合格后上传品质云。',
        aiVideoEvidence: '深度点云检测显示盖板缝隙≤0.1mm，品质结果“PASS”，工单自动完成离线归档。',
        status: 'passed',
        confidence: 99.0,
        timeRange: '00:51 - 01:10',
        snapshotUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
        notes: '高精装配合规，生成合格质检单'
      }
    ],
    recommendations: [
      '工序组装严丝合缝，各项参数均符合精细装配 ISO9001 质量要求。'
    ]
  }
];

export function generateSOPReportHTML(report: SOPReportDetail): string {
  const stepsHTML = report.steps.map(step => `
    <div class="step-card">
      <div class="step-header">
        <div class="step-title-wrap">
          <span class="step-num">${step.stepNo}</span>
          <span class="step-title">${step.title}</span>
        </div>
        <span class="badge ${step.status}">
          ${step.status === 'passed' ? '✓ 合规 Passed' : step.status === 'warning' ? '⚠ 预警 Warning' : '✕ 不合规 Failed'}
        </span>
      </div>
      
      <div class="comparison-grid">
        <div class="box standard">
          <div class="box-label">SOP 标准规程要求</div>
          <div class="box-content">${step.sopStandard}</div>
        </div>
        <div class="box evidence">
          <div class="box-label">AI 视频分析对照识别结果 (${step.timeRange})</div>
          <div class="box-content">${step.aiVideoEvidence}</div>
        </div>
      </div>
      
      <div class="step-footer">
        <span>${step.notes || '模型验证一致'}</span>
        <div class="confidence">
          <span>识别置信度</span>
          <div class="progress-bar"><div class="fill" style="width: ${step.confidence}%"></div></div>
          <strong>${step.confidence}%</strong>
        </div>
      </div>
    </div>
  `).join('');

  const recommendationsHTML = report.recommendations.map(r => `<li>${r}</li>`).join('');

  const audioHTML = report.audioRecord ? `
    <div class="audio-section">
      <h3 style="font-size: 14px; color: #a7f3d0; margin-bottom: 8px;">🎤 多模态语音与音纹分析结果</h3>
      <div class="transcription">${report.audioRecord.transcription}</div>
      <div class="audio-meta">
        <span>音频时长: ${report.audioRecord.duration}</span>
        <span>${report.audioRecord.audioFeatures}</span>
      </div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.title}</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #151d30;
      --border: #232f48;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --primary-light: #818cf8;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 32px 16px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .category-badge {
      display: inline-block;
      background: rgba(99, 102, 241, 0.15);
      color: var(--primary-light);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .report-id { font-family: monospace; color: var(--text-muted); font-size: 13px; margin-left: 8px; }
    h1 { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 6px; }
    .score-card {
      text-align: center;
      background: rgba(11, 15, 25, 0.6);
      border: 1px solid var(--border);
      padding: 16px 24px;
      border-radius: 16px;
      min-width: 140px;
    }
    .score-val { font-size: 38px; font-weight: 800; font-family: monospace; }
    .score-val.passed { color: var(--success); }
    .score-val.warning { color: var(--warning); }
    .score-val.failed { color: var(--danger); }
    .score-label { font-size: 12px; color: var(--text-muted); }
    
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      background: rgba(11, 15, 25, 0.5);
      border: 1px solid var(--border);
      padding: 20px;
      border-radius: 16px;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .meta-item label { display: block; color: var(--text-muted); font-size: 11px; margin-bottom: 2px; }
    .meta-item span { font-weight: 600; color: #e2e8f0; }

    .summary-box {
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 18px 20px;
      border-radius: 16px;
      margin-bottom: 28px;
      font-size: 14px;
      color: #c7d2fe;
      line-height: 1.6;
    }

    .section-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #f1f5f9; }
    
    .step-card {
      background: rgba(11, 15, 25, 0.7);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .step-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .step-title-wrap { display: flex; align-items: center; gap: 10px; }
    .step-num {
      width: 24px; height: 24px; border-radius: 50%; background: #232f48;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; font-family: monospace;
      color: #e2e8f0;
    }
    .step-title { font-size: 14px; font-weight: 600; color: #f8fafc; }
    
    .badge { padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .badge.passed { background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge.warning { background: rgba(245, 158, 11, 0.15); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge.failed { background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }

    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; font-size: 13px; }
    @media (max-width: 640px) { .comparison-grid { grid-template-columns: 1fr; } }
    
    .box { padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border); }
    .box.standard { background: rgba(11, 15, 25, 0.8); }
    .box.evidence { background: rgba(99, 102, 241, 0.08); border-color: rgba(99, 102, 241, 0.25); }
    .box-label { font-size: 11px; text-transform: uppercase; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; }
    .box.evidence .box-label { color: var(--primary-light); }
    .box-content { color: #e2e8f0; }

    .step-footer { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.05); margin-top: 10px; padding-top: 10px; }
    .confidence { display: flex; align-items: center; gap: 8px; }
    .progress-bar { width: 80px; height: 6px; background: #232f48; border-radius: 3px; overflow: hidden; }
    .fill { height: 100%; background: var(--primary); border-radius: 3px; }

    .audio-section { background: rgba(11, 15, 25, 0.5); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 24px; }
    .transcription { background: rgba(0, 0, 0, 0.4); padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border); font-size: 13px; color: #a7f3d0; margin: 8px 0; font-family: monospace; }
    .audio-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }

    .rec-box { background: rgba(11, 15, 25, 0.5); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 28px; }
    .rec-box ul { padding-left: 20px; font-size: 13px; color: #cbd5e1; }
    .rec-box li { margin-bottom: 6px; }

    .footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 20px; color: var(--text-muted); font-size: 12px; }
    .print-btn { background: var(--primary); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
    .print-btn:hover { background: #4f46e5; }
    @media print {
      body { background: #fff; color: #000; padding: 0; }
      .container { border: none; box-shadow: none; max-width: 100%; padding: 0; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <span class="category-badge">${report.taskCategory}</span>
        <span class="report-id">${report.reportId}</span>
        <h1>${report.title}</h1>
        <div style="font-size: 13px; color: var(--text-muted);">对照标准: ${report.sopName}</div>
      </div>
      <div class="score-card">
        <div class="score-val ${report.overallStatus}">${report.score}</div>
        <div class="score-label">SOP 合规得分</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <label>核验时间</label>
        <span>${report.inspectTime}</span>
      </div>
      <div class="meta-item">
        <label>现场责任人</label>
        <span>${report.operator}</span>
      </div>
      <div class="meta-item">
        <label>物理位置</label>
        <span>${report.location}</span>
      </div>
      <div class="meta-item">
        <label>采集设备</label>
        <span>${report.deviceName}</span>
      </div>
      <div class="meta-item" style="grid-column: span 2;">
        <label>AI 推理引擎</label>
        <span>${report.modelEngine}</span>
      </div>
    </div>

    <div class="summary-box">
      <strong>✨ 大任务 AI 视频多模态分析总结：</strong><br/>
      ${report.summary}
    </div>

    <div class="section-title">
      🛡️ SOP 步骤逐条视频对比解析 (${report.steps.length} 项)
    </div>

    ${stepsHTML}

    ${audioHTML}

    <div class="rec-box">
      <h3 style="font-size: 14px; margin-bottom: 10px; color: #f59e0b;">🏆 AI 安监 Copilot 建议与优化项</h3>
      <ul>
        ${recommendationsHTML}
      </ul>
    </div>

    <div class="footer">
      <div>🛡️ 工业大模型安监中心 电子核对签章留档 (生成时间: ${new Date().toLocaleString('zh-CN')})</div>
      <button class="print-btn" onclick="window.print()">打印 / 导出 PDF</button>
    </div>
  </div>
</body>
</html>`;
}

export function downloadSOPReportAsHTML(report: SOPReportDetail) {
  const htmlContent = generateSOPReportHTML(report);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report.reportId}_${report.taskCategory}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function resolveSOPReport(initialTaskId?: string, currentEvent?: any): SOPReportDetail {
  const matchedTask = MAJOR_SOP_TASKS.find(
    t => t.taskId === initialTaskId || 
         (currentEvent && (t.taskId === currentEvent.sopId || t.taskId === currentEvent.id))
  ) || MAJOR_SOP_TASKS[0];

  if (!currentEvent) {
    return matchedTask;
  }

  // Dynamic build from currentEvent
  const eventSteps: SOPStepAnalysis[] = (currentEvent.steps && currentEvent.steps.length > 0)
    ? currentEvent.steps.map((st: any, idx: number) => ({
        stepNo: st.stepNo || idx + 1,
        title: st.title,
        sopStandard: st.sopStandard,
        aiVideoEvidence: st.aiEvidence || st.aiVideoEvidence || '视觉模型完成对照核验',
        status: st.status || 'passed',
        confidence: st.confidence || 98.5,
        timeRange: st.timeRange || '00:00 - 00:30',
        snapshotUrl: st.snapshotUrl || matchedTask.steps[idx]?.snapshotUrl,
        notes: st.notes || matchedTask.steps[idx]?.notes
      }))
    : matchedTask.steps;

  return {
    taskId: currentEvent.sopId || currentEvent.id || matchedTask.taskId,
    reportId: matchedTask.reportId || `SOP-RPT-${(currentEvent.id || 'EVT').toUpperCase()}-01`,
    taskCategory: currentEvent.sopName || matchedTask.taskCategory,
    title: `${currentEvent.sopName || matchedTask.taskCategory} - 任务质检报告`,
    sopName: currentEvent.sopName || matchedTask.sopName,
    inspectTime: currentEvent.timestamp 
      ? new Date(currentEvent.timestamp).toLocaleString('zh-CN', { hour12: false })
      : matchedTask.inspectTime,
    deviceModel: matchedTask.deviceModel || 'Smart-Glass Pro (现场视角)',
    deviceName: matchedTask.deviceName || '巡检安全设备',
    location: matchedTask.location || '作业现场',
    operator: matchedTask.operator || '现场操作员',
    score: currentEvent.sopScore !== undefined ? currentEvent.sopScore : matchedTask.score,
    overallStatus: currentEvent.sopOverallStatus || matchedTask.overallStatus,
    modelEngine: matchedTask.modelEngine,
    totalDuration: matchedTask.totalDuration,
    summary: currentEvent.detail || matchedTask.summary,
    steps: eventSteps,
    audioRecord: matchedTask.audioRecord,
    recommendations: matchedTask.recommendations
  };
}

interface SOPReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTaskId?: string;
  currentEvent?: any | null;
  singleTaskOnly?: boolean;
}

export function SOPReportModal({ 
  isOpen, 
  onClose, 
  initialTaskId = 'ee',
  currentEvent,
  singleTaskOnly = false
}: SOPReportModalProps) {
  const [downloadedReportId, setDownloadedReportId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewingTaskId, setViewingTaskId] = useState<string>(initialTaskId);

  useEffect(() => {
    if (isOpen) {
      if (currentEvent) {
        setViewingTaskId(currentEvent.sopId || currentEvent.id || initialTaskId);
      } else {
        setViewingTaskId(initialTaskId);
      }
      setCopied(false);
    }
  }, [isOpen, initialTaskId, currentEvent]);

  const isSingleMode = singleTaskOnly || Boolean(currentEvent);

  const activeReport = useMemo(() => {
    return resolveSOPReport(viewingTaskId, isSingleMode ? currentEvent : null);
  }, [viewingTaskId, isSingleMode, currentEvent]);

  if (!isOpen) return null;

  const handleDownloadReport = (report: SOPReportDetail) => {
    downloadSOPReportAsHTML(report);
    setDownloadedReportId(report.reportId);
    setTimeout(() => setDownloadedReportId(null), 3500);
  };

  const handleCopyReportId = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh] my-auto mx-auto"
        >
          {/* Header Bar */}
          <div className="px-4 sm:px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs flex-shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                    任务质检分析报告
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    activeReport.overallStatus === 'passed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : activeReport.overallStatus === 'warning'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {activeReport.score}分 · {
                      activeReport.overallStatus === 'passed' ? '合规达标' :
                      activeReport.overallStatus === 'warning' ? '预警整改' : '违规未通过'
                    }
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 truncate">
                  {activeReport.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors font-bold text-xs cursor-pointer flex-shrink-0 ml-2"
              aria-label="关闭"
            >
              ✕
            </button>
          </div>

          {/* Download Success Banner Notification */}
          {downloadedReportId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between font-mono"
            >
              <span className="flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                已成功导出: <strong className="truncate">[{downloadedReportId}.html]</strong>
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex-shrink-0 ml-1">HTML 格式</span>
            </motion.div>
          )}

          {/* Single Task Analysis Report View (No other tasks list) */}
          <div className="p-4 overflow-y-auto space-y-3.5 custom-scrollbar flex-1">
            {/* Top Score & Meta Card */}
            <div className={`p-4 rounded-2xl border ${
              activeReport.overallStatus === 'passed'
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-amber-50/40 border-amber-200'
            }`}>
              <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl font-mono font-bold flex flex-col items-center justify-center shadow-xs border flex-shrink-0 ${
                    activeReport.overallStatus === 'passed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}>
                    <span className="text-xl leading-none">{activeReport.score}</span>
                    <span className="text-[9px] font-sans font-medium mt-0.5">质检得分</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      {activeReport.sopName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {activeReport.overallStatus === 'passed' 
                        ? '全流程步骤严格符合标准规范，无违规扣分项' 
                        : '现场视频识别到非标操作，已联动下发纠偏工单'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyReportId(activeReport.reportId)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 text-[10px] font-mono flex items-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer flex-shrink-0"
                  title="点击复制报告编号"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '已复制' : '复制编号'}</span>
                </button>
              </div>

              {/* Task Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 text-[11px]">
                <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] mb-0.5">报告编号</span>
                  <span className="font-mono font-bold text-slate-800 truncate block">{activeReport.reportId}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] mb-0.5">质检时间</span>
                  <span className="font-mono text-slate-700 truncate block">{activeReport.inspectTime}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] mb-0.5">巡检人员</span>
                  <span className="font-semibold text-slate-700 truncate block">{activeReport.operator}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] mb-0.5">终端设备</span>
                  <span className="font-semibold text-slate-700 truncate block">{activeReport.deviceName}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] mb-0.5">检验区域</span>
                  <span className="text-slate-700 truncate block">{activeReport.location}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] mb-0.5">作业时长</span>
                  <span className="font-mono font-bold text-blue-700 truncate block">{activeReport.totalDuration}</span>
                </div>
              </div>
            </div>

            {/* AI Summary Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1 shadow-xs">
              <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI 视频多模态分析总结</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {activeReport.summary}
              </p>
            </div>

            {/* Steps Breakdown Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>SOP 规程逐步骤核验详情 ({activeReport.steps.length} 步)</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  工业视觉帧级对照
                </span>
              </div>

              <div className="space-y-3">
                {activeReport.steps.map((st) => {
                  const isPassed = st.status === 'passed';
                  const isFailed = st.status === 'failed';
                  return (
                    <div
                      key={st.stepNo}
                      className={`p-3.5 rounded-2xl border transition-all shadow-xs ${
                        isFailed 
                          ? 'bg-rose-50/30 border-rose-300' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Step Header */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                            {st.stepNo}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {st.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold border flex items-center gap-1 ${
                            isPassed 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : isFailed
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {isPassed ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>通过 ({st.confidence}%)</span>
                              </>
                            ) : isFailed ? (
                              <>
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>不合规 ({st.confidence}%)</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>预警 ({st.confidence}%)</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Standard Requirements */}
                      <div className="mt-2.5 space-y-2 text-xs">
                        <div className="text-[11px] text-slate-600 leading-normal bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <strong className="text-slate-700 block mb-0.5">SOP 规程标准：</strong>
                          {st.sopStandard}
                        </div>

                        {/* AI Detection Result Box */}
                        <div className={`p-2.5 rounded-xl border leading-normal text-[11px] ${
                          isFailed 
                            ? 'bg-rose-50 border-rose-200 text-rose-800' 
                            : 'bg-blue-50/60 border-blue-200 text-slate-800'
                        }`}>
                          <strong className={`block mb-0.5 flex items-center gap-1 ${
                            isFailed ? 'text-rose-700' : 'text-blue-700'
                          }`}>
                            <Sparkles className="w-3 h-3" />
                            AI 现场核验识别结果：
                          </strong>
                          {st.aiVideoEvidence}
                        </div>

                        {/* Snapshot Image */}
                        {st.snapshotUrl && (
                          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                            <img
                              src={st.snapshotUrl}
                              alt={st.title}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-blue-300 border border-white/10 flex items-center gap-1">
                              <Video className="w-3 h-3 text-blue-400" />
                              <span>步骤现场关键帧抓拍</span>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-slate-200">
                              {st.timeRange}
                            </div>
                          </div>
                        )}

                        {/* Step Notes */}
                        {st.notes && (
                          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 pt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span>{st.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audio Record Section */}
            {activeReport.audioRecord && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-600" />
                  <span>多模态现场语音与音纹分析结果</span>
                </h4>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium">
                  {activeReport.audioRecord.transcription}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    音频时长: {activeReport.audioRecord.duration}
                  </span>
                  <span>{activeReport.audioRecord.audioFeatures}</span>
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {activeReport.recommendations && activeReport.recommendations.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>AI 安监 Copilot 建议与整改处置要求</span>
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-700">
                  {activeReport.recommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between sticky bottom-0 z-20 backdrop-blur-xl">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono truncate mr-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">工业 AI 电子核对签章 (已数字存证)</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleDownloadReport(activeReport)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 HTML 报告</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

