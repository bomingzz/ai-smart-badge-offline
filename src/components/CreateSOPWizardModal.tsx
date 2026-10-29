import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FilePlus, Check, ChevronRight, ArrowLeft, ArrowRight, Plus, Trash2, 
  ChevronUp, ChevronDown, Sparkles, Play, Code2, ShieldCheck, CheckCircle2, 
  AlertTriangle, XCircle, Search, Cpu, Battery, Radio, Copy, Layers, 
  Clock, Zap, Sliders, CheckSquare, Square, RefreshCw, Send, HelpCircle,
  Edit3, GitCommit, Shuffle, FileText
} from 'lucide-react';
import { mockDeviceGroups } from '../data';

export type AlarmLevel = 'P0' | 'P1' | 'P2';

export const ALARM_LEVEL_OPTIONS: { 
  value: AlarmLevel; 
  label: string; 
  shortLabel: string;
  desc: string; 
  icon: string; 
  badgeClass: string;
}[] = [
  { 
    value: 'P0', 
    label: 'P0 致命告警 (阻断派单)', 
    shortLabel: 'P0 致命级',
    desc: '零容忍严重违规，立即声光阻断并自动下发紧急整改工单', 
    icon: '🚨', 
    badgeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30' 
  },
  { 
    value: 'P1', 
    label: 'P1 严重告警 (违规记入)', 
    shortLabel: 'P1 严重级',
    desc: '关键流程非标违规，记录严重违规并通知主管介入', 
    icon: '⚠️', 
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30' 
  },
  { 
    value: 'P2', 
    label: 'P2 一般预警 (震动提醒)', 
    shortLabel: 'P2 预警级',
    desc: '步骤轻度偏离或超时，工牌轻度震动与黄色预警提醒', 
    icon: '🔔', 
    badgeClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' 
  }
];

export interface SOPStepRule {
  id: string;
  stepNo: number;
  title: string;
  sopStandard: string;
  alarmLevel: AlarmLevel;
  stepMaxDuration: number; // in seconds
  isRequired?: boolean;
}

export interface SOPPresetTemplate {
  id: string;
  name: string;
  category: string;
  industry: string;
  description: string;
  maxTotalDuration: number;
  isStrictSequential?: boolean;
  steps: Omit<SOPStepRule, 'id'>[];
  customPrompt: string;
  reportPrompt?: string;
}

const PRESET_TEMPLATES: SOPPresetTemplate[] = [
  {
    id: 't_blank',
    name: '空白 SOP 规则模板',
    category: '通用配置',
    industry: '自定义领域',
    description: '完全自主定义，从零配置步骤链、告警等级与 AI 大模型 Prompt 调试规程。',
    maxTotalDuration: 10,
    isStrictSequential: true,
    customPrompt: '请作为穿戴设备 AI 视听合规审计官，依据上述步骤逐帧校验操作员动作，对缺失或非标动作触发 Warning/Fail 告警。',
    reportPrompt: '请作为第一视角 AI 质检审计专家，依据上述步骤执行情况及音视频凭证，生成包含【作业概况】、【核心违规与扣分项】、【整改与改进建议】的标准质检分析报告。',
    steps: [
      {
        stepNo: 1,
        title: '初始防护与环境安查',
        sopStandard: '作业人员到达指定区域后，先进行人身 PPE 防护穿戴检查并核验周围环境。',
        alarmLevel: 'P1',
        stepMaxDuration: 30,
        isRequired: true
      }
    ]
  },
  {
    id: 't_power',
    name: '高压电气配电柜定检及 LOTO 锁扣规程',
    category: '高危电力',
    industry: '电力与重工业',
    description: '针对高压配电房断电检修，强制要求挂锁(LOTO)、绝缘服穿戴与三相验电流程。',
    maxTotalDuration: 15,
    isStrictSequential: true,
    customPrompt: '必须严格判定接地线拉拽紧固二次复核动作，缺失则标记 warning。检测防护面罩落锁停留时间须大于 2 秒。三相验电需声音与画面协同',
    reportPrompt: '请生成《高压电工作业安全审计与定检报告》，按以下结构输出：【核验总评】综合得分与高危阻断记录；【LOTO与绝缘防护】锁扣挂牌与PPE穿戴复核结果；【验电与接地】三相验电声音画面协同证据；【整改闭环】列明阻断派单与限期整改事项。',
    steps: [
      {
        stepNo: 1,
        title: '断电隔离与 LOTO 锁扣挂牌',
        sopStandard: '必须断开高压隔离刀闸，并在控制把手佩戴个人专属防操作蓝色锁扣与警告标牌。',
        alarmLevel: 'P0',
        stepMaxDuration: 45,
        isRequired: true
      },
      {
        stepNo: 2,
        title: '高压绝缘 PPE 防护服穿戴',
        sopStandard: '穿戴 20kV 绝缘手套、防爆绝缘面罩、绝缘安全靴，且手套无破损裂纹。',
        alarmLevel: 'P0',
        stepMaxDuration: 60,
        isRequired: true
      },
      {
        stepNo: 3,
        title: '三相验电与残余电荷放电',
        sopStandard: '使用校准合格的高压验电器对 A/B/C 三相接线端子逐一接触验电。',
        alarmLevel: 'P0',
        stepMaxDuration: 60,
        isRequired: true
      }
    ]
  },
  {
    id: 't_kitchen',
    name: '餐饮后厨冷链生鲜与切配卫生 SOP',
    category: '食品安全',
    industry: '餐饮与食品',
    description: '涵盖生熟砧板防交叉污染、冰柜温度口述数显 OCR 对齐及厨师口罩帽着装规范。',
    maxTotalDuration: 10,
    isStrictSequential: true,
    customPrompt: '检测切配区红/绿砧板颜色语义分割，发现生熟混用瞬间触发 Failed 警报。提取口述温度与仪表数字对比，差异大于 1℃ 提示 Warning。',
    reportPrompt: '请基于后厨视音频多模态识别结果，汇总生熟切配隔离、口罩工作帽规范、冷柜存温核验三大指标，生成包含【合规总览】、【违规明细与扣分】、【后厨食安改进建议】的质检报告。',
    steps: [
      {
        stepNo: 1,
        title: '生熟砧板与刀具分类隔离',
        sopStandard: '红色切生肉砧板与绿色切蔬果砧板物理隔离 ≥ 1.5 米，刀具专板专用。',
        alarmLevel: 'P0',
        stepMaxDuration: 30,
        isRequired: true
      },
      {
        stepNo: 2,
        title: '冷冰柜存温口述与数显表 OCR 验证',
        sopStandard: '冷藏柜维持 0-4℃，主厨口述汇报并指向数显仪表盘，音视频对齐校验。',
        alarmLevel: 'P2',
        stepMaxDuration: 30,
        isRequired: false
      },
      {
        stepNo: 3,
        title: '口罩与工作帽规范穿戴',
        sopStandard: '工作帽包裹全部头发，口罩遮挡鼻梁与下巴，无裸露首饰。',
        alarmLevel: 'P1',
        stepMaxDuration: 20,
        isRequired: true
      }
    ]
  },
  {
    id: 't_manufacturing',
    name: '离散制造精密组装与拧紧工序 SOP',
    category: '工业制造',
    industry: '精密制造',
    description: '零部件二维码追溯防错、定扭矩电批交错紧固与 3D 点云测量核验。',
    maxTotalDuration: 20,
    isStrictSequential: true,
    customPrompt: '高精捕捉定扭矩扳手的 5 点交错紧固顺序 (1-3-5-2-4)，若跳步拧紧或漏拧直接触发高亮报警。',
    reportPrompt: '请生成《精密制造装配与工序追溯报告》：详细记录零件二维码 BOM 匹配状态、定扭扳手五点交错紧固扭矩达标率、漏拧/跳步违规工步定位及工单放行建议。',
    steps: [
      {
        stepNo: 1,
        title: '零配件二维码扫描与物料防错',
        sopStandard: '对零件二维追溯码进行光感对焦扫描，核对 BOM 批次型号。',
        alarmLevel: 'P1',
        stepMaxDuration: 30,
        isRequired: true
      },
      {
        stepNo: 2,
        title: '定扭矩电动扳手五点交错紧固',
        sopStandard: '五螺栓盖板采用星形交错顺序紧固，目标扭矩 45 N·m。',
        alarmLevel: 'P0',
        stepMaxDuration: 60,
        isRequired: true
      }
    ]
  }
];

export interface SOPConfigData {
  id: string;
  name: string;
  description?: string;
  industryCategory?: string;
  maxTotalDuration?: number;
  isStrictSequential?: boolean; // 是否强制顺序执行
  customPrompt?: string;
  reportPrompt?: string; // 报告模板提示词
  steps: SOPStepRule[];
  selectedDeviceIds?: string[];
  isActive?: boolean;
  category?: 'Safety' | 'Compliance' | 'Operations';
  industry?: 'catering' | 'heavy_industry' | 'logistics' | 'manufacturing';
  isCustom?: boolean;
  stepsCount?: number;
  devicesCount?: number;
}

export interface CreateSOPWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessDispatch?: (newSop: SOPConfigData) => void;
  initialData?: SOPConfigData | null;
  mode?: 'create' | 'edit';
}

export function CreateSOPWizardModal({ 
  isOpen, 
  onClose, 
  onSuccessDispatch, 
  initialData, 
  mode = 'create' 
}: CreateSOPWizardModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1 State: Base & Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('t_blank');
  const [sopName, setSopName] = useState<string>('新智能穿戴作业 SOP 审计规程');
  const [industryCategory, setIndustryCategory] = useState<string>('电力与重工业');
  const [maxTotalDuration, setMaxTotalDuration] = useState<number>(15);
  const [sopDescription, setSopDescription] = useState<string>('用于穿戴式无屏眼镜/安全帽的 AI 第一视角视频多模态合规审计。');
  const [reportPrompt, setReportPrompt] = useState<string>('请基于本次 SOP 步骤链执行记录与视音频多模态凭证，按【作业概况】、【核心违规与扣分项】、【整改与改进建议】结构化生成标准质检审计报告。');

  // Step 2 State: Step Chain Ordering
  const [isStrictSequential, setIsStrictSequential] = useState<boolean>(true);
  const [steps, setSteps] = useState<SOPStepRule[]>([
    {
      id: 'step_1',
      stepNo: 1,
      title: '断电隔离与 LOTO 锁扣挂牌',
      sopStandard: '必须断开高压隔离刀闸，并在控制把手佩戴个人专属防操作蓝色锁扣与警告标牌。',
      alarmLevel: 'P0',
      stepMaxDuration: 45,
      isRequired: true
    },
    {
      id: 'step_2',
      stepNo: 2,
      title: '高压绝缘 PPE 防护服穿戴',
      sopStandard: '穿戴 20kV 绝缘手套、防爆绝缘面罩、绝缘安全靴，且手套无破损裂纹。',
      alarmLevel: 'P0',
      stepMaxDuration: 60,
      isRequired: true
    }
  ]);

  // Step 3 State: Local Video Debugging, Video Player Box & Human Audit
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('https://assets.mixkit.co/videos/preview/mixkit-security-camera-monitoring-a-building-41618-large.mp4');
  const [uploadedVideoName, setUploadedVideoName] = useState<string>('SOP_巡检示范视频_01.mp4');
  const [uploadedVideoSize, setUploadedVideoSize] = useState<string>('18.4 MB');
  const [humanAuditStatus, setHumanAuditStatus] = useState<'pending' | 'verified_accurate' | 'flagged_mismatch'>('pending');
  const [customPrompt, setCustomPrompt] = useState<string>(
    '必须严格判定接地线拉拽紧固二次复核动作，缺失则标记 warning。检测防护面罩落锁停留时间须大于 2 秒。'
  );
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Step 4 State: Device Binding
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(['d1', 'd3', 'd4']);
  const [deviceSearchQuery, setDeviceSearchQuery] = useState<string>('');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchProgress, setDispatchProgress] = useState<number>(0);

  // Synchronize state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSopName(initialData.name || '');
        setIndustryCategory(initialData.industryCategory || '电力与重工业');
        setMaxTotalDuration(initialData.maxTotalDuration || 15);
        setSopDescription(initialData.description || '');
        setCustomPrompt(initialData.customPrompt || '必须严格判定接地线拉拽紧固二次复核动作，缺失则标记 warning。检测防护面罩落锁停留时间须大于 2 秒。');
        setReportPrompt(initialData.reportPrompt || '请基于本次 SOP 步骤链执行记录与视音频多模态凭证，按【作业概况】、【核心违规与扣分项】、【整改与改进建议】结构化生成标准质检审计报告。');
        if (initialData.steps && initialData.steps.length > 0) {
          setSteps(initialData.steps);
        }
        setIsStrictSequential(initialData.isStrictSequential !== undefined ? initialData.isStrictSequential : true);
        if (initialData.selectedDeviceIds && initialData.selectedDeviceIds.length > 0) {
          setSelectedDeviceIds(initialData.selectedDeviceIds);
        }
        setSelectedTemplateId('custom');
      } else {
        // Default new SOP values
        setSopName('新智能穿戴作业 SOP 审计规程');
        setIndustryCategory('电力与重工业');
        setMaxTotalDuration(15);
        setSopDescription('用于穿戴式无屏眼镜/安全帽的 AI 第一视角视频多模态合规审计。');
        setReportPrompt('请基于本次 SOP 步骤链执行记录与视音频多模态凭证，按【作业概况】、【核心违规与扣分项】、【整改与改进建议】结构化生成标准质检审计报告。');
        setSelectedTemplateId('t_blank');
        setIsStrictSequential(true);
        setSteps([
          {
            id: 'step_1',
            stepNo: 1,
            title: '断电隔离与 LOTO 锁扣挂牌',
            sopStandard: '必须断开高压隔离刀闸，并在控制把手佩戴个人专属防操作蓝色锁扣与警告标牌。',
            alarmLevel: 'P0',
            stepMaxDuration: 45,
            isRequired: true
          },
          {
            id: 'step_2',
            stepNo: 2,
            title: '高压绝缘 PPE 防护服穿戴',
            sopStandard: '穿戴 20kV 绝缘手套、防爆绝缘面罩、绝缘安全靴，且手套无破损裂纹。',
            alarmLevel: 'P0',
            stepMaxDuration: 60,
            isRequired: true
          }
        ]);
        setSelectedDeviceIds(['d1', 'd3', 'd4']);
      }
      setCurrentStep(1);
      setHumanAuditStatus('pending');
      setTestResult(null);
      setIsDispatching(false);
      setDispatchProgress(0);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Select a preset template
  const handleSelectTemplate = (template: SOPPresetTemplate) => {
    setSelectedTemplateId(template.id);
    setSopName(template.name);
    setIndustryCategory(template.industry);
    setMaxTotalDuration(template.maxTotalDuration);
    setSopDescription(template.description);
    setCustomPrompt(template.customPrompt);
    if (template.reportPrompt) {
      setReportPrompt(template.reportPrompt);
    }
    setIsStrictSequential(template.isStrictSequential !== undefined ? template.isStrictSequential : true);

    // Load steps with fresh IDs
    const loadedSteps = template.steps.map((s, idx) => ({
      ...s,
      id: `step_${idx + 1}_${Date.now()}`
    }));
    setSteps(loadedSteps);
  };

  // Step Chain CRUD Operations
  const handleAddStep = () => {
    const newNo = steps.length + 1;
    setSteps(prev => [
      ...prev,
      {
        id: `step_${Date.now()}`,
        stepNo: newNo,
        title: `自定义步骤 ${newNo}`,
        sopStandard: '请详细描述该步骤的标准操作细则与关键帧动作判定逻辑。',
        alarmLevel: 'P1',
        stepMaxDuration: 30,
        isRequired: true
      }
    ]);
  };

  const handleDeleteStep = (id: string) => {
    if (steps.length <= 1) return;
    const filtered = steps.filter(s => s.id !== id);
    const reordered = filtered.map((s, idx) => ({ ...s, stepNo: idx + 1 }));
    setSteps(reordered);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    // Re-index
    const reordered = newSteps.map((s, idx) => ({ ...s, stepNo: idx + 1 }));
    setSteps(reordered);
  };

  const handleUpdateStep = (id: string, key: keyof SOPStepRule, value: any) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  // Handle local video file select
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUploadedVideoUrl(fileUrl);
      setUploadedVideoName(file.name);
      setUploadedVideoSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setHumanAuditStatus('pending');
      setTestResult(null);
    }
  };

  // Step 3: Run AI Video Trial Execution
  const handleRunAiTrial = () => {
    setIsRunningTest(true);
    setTestResult(null);

    setTimeout(() => {
      setIsRunningTest(false);

      const stepResults = steps.map((st, idx) => {
        const levelOpt = ALARM_LEVEL_OPTIONS.find(o => o.value === st.alarmLevel) || ALARM_LEVEL_OPTIONS[1];
        if (idx === steps.length - 1 && steps.length > 2) {
          return {
            stepNo: st.stepNo,
            title: st.title,
            alarmLevel: st.alarmLevel,
            levelOpt,
            status: 'pass' as const,
            confidence: 97.6,
            timestamp: `00:0${idx + 2}.4`,
            detail: `[AI 视频帧比对] 成功捕捉到 ${st.title} 动作关键帧，符合 SOP 标准细则`
          };
        } else if (idx === 1 && steps.length > 1) {
          return {
            stepNo: st.stepNo,
            title: st.title,
            alarmLevel: st.alarmLevel,
            levelOpt,
            status: 'warning' as const,
            confidence: 78.4,
            timestamp: `00:0${idx + 1}.8`,
            detail: `[AI 触发预警] 识别到 ${st.title} 动作停留时长略低，触发「${levelOpt.label}」`
          };
        } else {
          return {
            stepNo: st.stepNo,
            title: st.title,
            alarmLevel: st.alarmLevel,
            levelOpt,
            status: 'pass' as const,
            confidence: Number((96.5 + Math.random() * 2.5).toFixed(1)),
            timestamp: `00:0${idx + 1}.2`,
            detail: `[AI 视频匹配] 识别到 ${st.title} 标准动作完成，帧比对度 ≥96%`
          };
        }
      });

      const hasFail = stepResults.some(s => s.status === 'fail');
      const hasWarning = stepResults.some(s => s.status === 'warning');

      setTestResult({
        evaluationId: `AI-EVAL-${Math.floor(100000 + Math.random() * 900000)}`,
        overallScore: hasFail ? 65 : hasWarning ? 88 : 98,
        status: hasFail ? 'fail' : hasWarning ? 'warning' : 'pass',
        modelLatencyMs: 210,
        stepResults
      });
    }, 1200);
  };

  // Step 4: Dispatch to Devices
  const handleDispatchSOP = () => {
    if (selectedDeviceIds.length === 0) {
      alert('请至少勾选一台绑定的穿戴设备或终端');
      return;
    }

    setIsDispatching(true);
    setDispatchProgress(10);

    const interval = setInterval(() => {
      setDispatchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDispatching(false);
            if (onSuccessDispatch) {
              onSuccessDispatch({
                id: initialData?.id || `sop_custom_${Date.now()}`,
                name: sopName,
                description: sopDescription,
                industryCategory,
                maxTotalDuration,
                isStrictSequential,
                customPrompt,
                reportPrompt,
                steps,
                stepsCount: steps.length,
                selectedDeviceIds,
                devicesCount: selectedDeviceIds.length,
                isActive: initialData ? initialData.isActive : true,
                category: initialData?.category || 'Compliance',
                industry: initialData?.industry || 'heavy_industry',
                isCustom: true
              });
            }
            onClose();
          }, 600);
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  // Device List helper
  const allDevices = mockDeviceGroups.flatMap(g => g.devices.map(d => ({ ...d, groupName: g.name })));
  const filteredDevices = allDevices.filter(d => 
    d.name.toLowerCase().includes(deviceSearchQuery.toLowerCase()) || 
    d.location.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
    d.groupName.toLowerCase().includes(deviceSearchQuery.toLowerCase())
  );

  const toggleDeviceSelect = (id: string) => {
    setSelectedDeviceIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllDevices = () => {
    if (selectedDeviceIds.length === filteredDevices.length) {
      setSelectedDeviceIds([]);
    } else {
      setSelectedDeviceIds(filteredDevices.map(d => d.id));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden h-[90vh] sm:h-[88vh] z-10 flex flex-col mx-auto"
        >
          {/* Mobile App Header Bar */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-all active:scale-95 flex-shrink-0 cursor-pointer shadow-xs"
                aria-label="返回"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    {mode === 'edit' ? 'SOP 规程编辑' : 'SOP 规则向导'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">
                    {currentStep} / 4
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5 truncate">
                  {mode === 'edit' ? `编辑 SOP 规程: ${sopName}` : '新增 SOP 规则与下发'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors font-bold text-xs active:scale-95 cursor-pointer"
              aria-label="关闭"
            >
              ✕
            </button>
          </div>

          {/* Wizard Step Progress Tracker Bar */}
          <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-200">
            {/* Step Progress Line */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1 mb-2.5 p-0.5">
              {[1, 2, 3, 4].map(num => (
                <div
                  key={num}
                  className={`h-full flex-1 rounded-full transition-all duration-300 ${
                    num <= currentStep ? 'bg-blue-600 shadow-xs' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Mobile Touch Step Chips - 4 Segment Grid */}
            <div className="grid grid-cols-4 gap-1">
              {[
                { num: 1, name: '基础信息' },
                { num: 2, name: '步骤链' },
                { num: 3, name: '视频调试' },
                { num: 4, name: '设备下发' }
              ].map((st) => {
                const isActive = currentStep === st.num;
                const isCompleted = currentStep > st.num;

                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => {
                      if (mode === 'edit' || isCompleted || currentStep > st.num) setCurrentStep(st.num);
                    }}
                    className={`py-1.5 px-0.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 min-h-[38px] active:scale-95 cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold ring-1 ring-blue-500/20' 
                        : isCompleted
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md text-[9px] font-mono font-bold flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : st.num}
                    </div>
                    <span className="text-[10px] font-medium truncate">{st.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Wizard Content Area */}
          <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3.5 custom-scrollbar flex-1 pb-24">
            
            {/* STEP 1: 基础属性配置 */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    SOP 规程基础信息配置
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">填写 SOP 基本名称、行业领域与流程参数配置。</p>
                </div>

                {mode === 'edit' && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-xl text-xs flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>您正在编辑此规程。可调整基础信息，或点击上方步骤快速跳转编辑步骤链与下发设备。</span>
                  </div>
                )}

                {/* Basic Attribute Form */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">SOP 规程名称</label>
                    <input
                      type="text"
                      value={sopName}
                      onChange={(e) => setSopName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 min-h-[42px]"
                      placeholder="如：高压配电柜巡检规程"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">行业领域</label>
                      <select
                        value={industryCategory}
                        onChange={(e) => setIndustryCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 min-h-[42px]"
                      >
                        <option value="电力与重工业">电力与重工业</option>
                        <option value="餐饮与食品">餐饮与食品安全</option>
                        <option value="医疗与护理">医疗与护理查房</option>
                        <option value="精密制造">离散精密制造</option>
                        <option value="园区安保">园区与仓储安保</option>
                      </select>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>流程上限时长</span>
                        <span className="font-mono text-blue-600 font-bold text-xs">{maxTotalDuration} 分钟</span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={60}
                        value={maxTotalDuration}
                        onChange={(e) => setMaxTotalDuration(Number(e.target.value))}
                        className="w-full accent-blue-600 my-1 h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">场景与功能备注</label>
                    <input
                      type="text"
                      value={sopDescription}
                      onChange={(e) => setSopDescription(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 min-h-[42px]"
                      placeholder="简要说明使用硬件与目的"
                    />
                  </div>

                  {/* 报告模板提示词录入框 */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>报告模板提示词</span>
                        <span className="text-[10px] text-slate-400 font-normal">（驱动大模型生成质检/巡检报告）</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {reportPrompt.length} 字
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (industryCategory === '餐饮与食品') {
                              setReportPrompt('请基于后厨视音频多模态识别结果，汇总生熟切配隔离、口罩工作帽规范、冷柜存温核验三大指标，生成包含【合规总览】、【违规明细与扣分】、【后厨食安改进建议】的质检报告。');
                            } else if (industryCategory === '电力与重工业') {
                              setReportPrompt('请生成《高压电工作业安全审计与定检报告》，按以下结构输出：【核验总评】综合得分与高危阻断记录；【LOTO与绝缘防护】锁扣挂牌与PPE穿戴复核结果；【验电与接地】三相验电声音画面协同证据；【整改闭环】列明阻断派单与限期整改事项。');
                            } else if (industryCategory === '精密制造') {
                              setReportPrompt('请生成《精密制造装配与工序追溯报告》：详细记录零件二维码 BOM 匹配状态、定扭扳手五点交错紧固扭矩达标率、漏拧/跳步违规工步定位及工单放行建议。');
                            } else {
                              setReportPrompt('请作为穿戴设备 AI 质检审计官，依据本次 SOP 步骤链执行记录与多模态凭证，按【作业概况】、【核心违规与扣分项】、【整改与改进建议】结构化生成标准质检审计报告。');
                            }
                          }}
                          className="text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 cursor-pointer hover:underline"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>填入推荐模板</span>
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        value={reportPrompt}
                        onChange={(e) => setReportPrompt(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-y min-h-[84px] leading-relaxed"
                        placeholder="输入 AI 质检与巡检报告生成提示词，例如：请基于本次 SOP 步骤执行情况，汇总违规项及扣分原因，按【作业概况】、【违规明细】、【整改建议】结构化输出质检报告..."
                      />
                    </div>

                    {/* 快捷插入结构化标签 */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">快速插入结构:</span>
                      {[
                        { label: '+ 作业概况', insert: '【作业概况】' },
                        { label: '+ 核心违规与扣分', insert: '【核心违规与扣分项】' },
                        { label: '+ 整改防范建议', insert: '【整改防范行动建议】' },
                        { label: '+ 综合评级得分', insert: '【综合评级与得分】' }
                      ].map((tag) => (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => {
                            setReportPrompt(prev => {
                              if (!prev) return tag.insert;
                              if (prev.includes(tag.insert)) return prev;
                              return `${prev.trim()} ${tag.insert}`;
                            });
                          }}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 text-[10px] text-slate-500 transition-all cursor-pointer active:scale-95 shadow-2xs"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: 强顺序步骤链编排 */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      SOP 步骤链编排
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">按作业顺序添加步骤，支持调整步骤顺序与告警规则。</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 flex-shrink-0 min-h-[40px] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>加步骤</span>
                  </button>
                </div>

                {/* 强制顺序执行开关（极简模式，无多余介绍） */}
                <div 
                  onClick={() => setIsStrictSequential(!isStrictSequential)}
                  className="flex items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 cursor-pointer active:scale-98 transition-all"
                >
                  <span className="text-xs font-bold text-slate-700">
                    强制顺序执行 (isStrictSequential)
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsStrictSequential(!isStrictSequential);
                    }}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isStrictSequential ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={isStrictSequential}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isStrictSequential ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Steps Chain List */}
                <div className="space-y-3.5">
                  {steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 relative shadow-xs"
                    >
                      {/* Step Header Bar */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                            {step.stepNo}
                          </span>
                          <span className="text-xs font-bold text-slate-800">步骤 {step.stepNo}</span>
                        </div>

                        {/* Order adjustment & deletion touch action buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'up')}
                            disabled={idx === 0}
                            className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-25 active:scale-95 border border-slate-200 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                            title="上移"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'down')}
                            disabled={idx === steps.length - 1}
                            className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-25 active:scale-95 border border-slate-200 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                            title="下移"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {steps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteStep(step.id)}
                              className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 ml-1 active:scale-95 border border-rose-200 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                              title="删除步骤"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inputs Form Fields */}
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-700 text-xs font-bold mb-1">步骤名称</label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 min-h-[42px]"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 text-xs font-bold mb-1">规范要求细则 (SOP 标准)</label>
                          <textarea
                            rows={2}
                            value={step.sopStandard}
                            onChange={(e) => handleUpdateStep(step.id, 'sopStandard', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-slate-700 text-xs font-bold mb-1 flex items-center justify-between">
                              <span>违规告警等级</span>
                              <span className="text-[10px] text-slate-400 font-normal">未合规触发</span>
                            </label>
                            <select
                              value={step.alarmLevel || 'P1'}
                              onChange={(e) => handleUpdateStep(step.id, 'alarmLevel', e.target.value as AlarmLevel)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 min-h-[40px] font-medium"
                            >
                              {ALARM_LEVEL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.icon} {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-700 text-xs font-bold mb-1">容忍时长(秒)</label>
                            <input
                              type="number"
                              value={step.stepMaxDuration}
                              onChange={(e) => handleUpdateStep(step.id, 'stepMaxDuration', Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono min-h-[40px]"
                            />
                          </div>
                        </div>

                        {/* Alarm Level Description Sub-badge */}
                        {(() => {
                          const currentOpt = ALARM_LEVEL_OPTIONS.find(o => o.value === step.alarmLevel) || ALARM_LEVEL_OPTIONS[1];
                          return (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border flex items-center gap-1 flex-shrink-0 ${currentOpt.badgeClass}`}>
                                <span>{currentOpt.icon}</span>
                                <span>{currentOpt.shortLabel}</span>
                              </span>
                              <span className="truncate text-slate-600">{currentOpt.desc}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: 视频调试与在线试运行 */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-600" />
                    SOP 规则视频在线调试 (本地上传)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">播放本地调试视频并对比下方 AI 逐步骤检测 Badge，由人工评估判断识别效果。</p>
                </div>

                <div className="space-y-3">
                  {/* Video Player Box */}
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                        <Play className="w-3.5 h-3.5 text-blue-600 fill-current" />
                        <span className="truncate">{uploadedVideoName}</span>
                      </span>
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex-shrink-0">
                        {uploadedVideoSize}
                      </span>
                    </div>

                    {/* HTML5 Video Element Box */}
                    <div className="relative w-full rounded-xl overflow-hidden bg-black border border-slate-200 group">
                      <video
                        src={uploadedVideoUrl}
                        controls
                        className="w-full h-44 object-cover rounded-xl"
                        poster="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        AI 关键帧监听中
                      </div>
                    </div>

                    {/* Change / Upload Local Video Button */}
                    <label className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                      <span>上传 / 更换本地调试视频片段</span>
                    </label>
                  </div>

                  {/* Action Button: Run AI Online Trial */}
                  <button
                    type="button"
                    onClick={handleRunAiTrial}
                    disabled={isRunningTest}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-600/25 active:scale-95 disabled:opacity-50 min-h-[46px] cursor-pointer"
                  >
                    {isRunningTest ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>云端 AI 模型分析实测中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-blue-100" />
                        <span>运行 AI 规则在线试运行</span>
                      </>
                    )}
                  </button>

                  {/* Test Results Output Panel */}
                  {testResult && (
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                      {/* Overall Compliance Score Header */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl font-mono font-bold flex items-center justify-center text-sm ${
                            testResult.status === 'pass'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : testResult.status === 'warning'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {testResult.overallScore}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              {testResult.status === 'pass' && '合规得分：高分通过'}
                              {testResult.status === 'warning' && '合规得分：存在预警'}
                              {testResult.status === 'fail' && '合规得分：未通过考核'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">云端推理延迟 {testResult.modelLatencyMs}ms</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                            testResult.status === 'pass'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : testResult.status === 'warning'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {testResult.overallScore}分
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            isStrictSequential
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-teal-50 text-teal-700 border-teal-200'
                          }`}>
                            {isStrictSequential ? '时序链: 顺序吻合' : '时序链: 自由模式'}
                          </span>
                        </div>
                      </div>

                      {/* Per-Step Detection Badges List */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-700 block flex items-center justify-between">
                          <span>逐步骤 AI 检测结果 (对比上方播放框)：</span>
                          <span className="text-[10px] text-slate-500 font-normal">人工校验核对</span>
                        </span>
                        {testResult.stepResults.map((sr: any) => (
                          <div key={sr.stepNo} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-800 truncate">
                                #{sr.stepNo} {sr.title}
                              </span>

                              {/* Per-step Status Badge */}
                              {sr.status === 'pass' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 flex-shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Pass ({sr.confidence}%)
                                </span>
                              )}
                              {sr.status === 'warning' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 flex-shrink-0">
                                  <AlertTriangle className="w-3 h-3 text-amber-600" /> Warning ({sr.confidence}%)
                                </span>
                              )}
                              {sr.status === 'fail' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 flex-shrink-0">
                                  <XCircle className="w-3 h-3 text-rose-600" /> Fail ({sr.confidence}%)
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight">
                              {sr.detail}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Human Manual Verification Control Bar */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            人工效果判断与核验反馈
                          </span>
                          {humanAuditStatus === 'verified_accurate' && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ 人工已确认准确
                            </span>
                          )}
                          {humanAuditStatus === 'flagged_mismatch' && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              ! 已标记人工修正
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          播放对比视频与 AI 检测 Badges 结果后，请选择人工核验结论：
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setHumanAuditStatus('verified_accurate')}
                            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border active:scale-95 cursor-pointer ${
                              humanAuditStatus === 'verified_accurate'
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>确认 AI 识别准确</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setHumanAuditStatus('flagged_mismatch')}
                            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border active:scale-95 cursor-pointer ${
                              humanAuditStatus === 'flagged_mismatch'
                                ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>标记误报 / 漏报修正</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 4: 设备组绑定与策略下发 */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-600" />
                    绑定穿戴终端与策略下发
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">选择需要推流此 SOP 规程的硬件终端。</p>
                </div>

                {/* Search & Select Tools */}
                <div className="flex flex-col sm:flex-row gap-2 justify-between">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={deviceSearchQuery}
                      onChange={(e) => setDeviceSearchQuery(e.target.value)}
                      placeholder="搜索设备或位置..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 min-h-[42px]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={toggleSelectAllDevices}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 min-h-[42px] active:scale-95 cursor-pointer border border-slate-200"
                  >
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>{selectedDeviceIds.length === filteredDevices.length ? '取消全选' : '全选全部终端'}</span>
                  </button>
                </div>

                {/* Device Touch List */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {filteredDevices.map((dev) => {
                    const isChecked = selectedDeviceIds.includes(dev.id);
                    return (
                      <div
                        key={dev.id}
                        onClick={() => toggleDeviceSelect(dev.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between active:scale-98 ${
                          isChecked
                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-200'
                          }`}>
                            {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{dev.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">{dev.groupName} | {dev.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {dev.status === 'online' && (
                            <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">在线</span>
                          )}
                          {dev.status === 'warning' && (
                            <span className="text-[10px] text-amber-700 font-bold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">预警</span>
                          )}
                          {dev.status === 'offline' && (
                            <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">离线</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dispatch Progress Overlay if active */}
                {isDispatching && (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-blue-900">
                      <span className="flex items-center gap-2 font-bold">
                        <Send className="w-4 h-4 text-blue-600 animate-bounce" />
                        推送中 ({selectedDeviceIds.length}台终端)...
                      </span>
                      <span className="font-mono font-bold text-blue-700 text-sm">{dispatchProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300 rounded-full shadow-xs"
                        style={{ width: `${dispatchProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Modal Bottom Action Bar */}
          <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between sticky bottom-0 z-40 backdrop-blur-xl shadow-md pb-safe">
            {/* Back Button */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors min-h-[46px] active:scale-95 border border-slate-200 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>上一步</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-mono pl-1">步骤 1 / 4</span>
            )}

            {/* Next / Dispatch Button */}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(prev => Math.min(4, prev + 1));
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-blue-600/30 active:scale-95 min-h-[46px] cursor-pointer"
              >
                <span>下一步</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDispatchSOP}
                disabled={isDispatching}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/30 active:scale-95 disabled:opacity-50 min-h-[46px] cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{mode === 'edit' ? '保存修改并同步终端' : '完成并下发 SOP 规则'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
