import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Tag, Mic, Shield, Eye, EyeOff, Wifi, WifiOff, 
  Battery, Clock, AlertCircle, CheckCircle2, Sparkles, BookOpen, 
  Wrench, Briefcase, RotateCcw, ArrowRight, Plus, Check, 
  User, Building2, BadgeCheck, Layers, FileText, Radio, VolumeX
} from 'lucide-react';
import { Device, BadgeCardConfig } from '../types';
import { BadgeCardGeneratorModal, DEFAULT_BADGE_CARD_CONFIG } from './BadgeCardGeneratorModal';

interface EInkBadgeModuleProps {
  device?: Device | null;
  badgeCardConfig?: BadgeCardConfig;
  onUpdateBadgeCardConfig?: (newConfig: BadgeCardConfig) => void;
  onBack?: () => void;
}

export type EInkMode = 'office' | 'field' | 'learning';
export type OfficePage = 'identity' | 'assistant_home' | 'todo_list' | 'todo_detail' | 'due_list';

export interface EInkTodoItem {
  id: string;
  title: string;
  source: '语音口述' | 'Tag打标' | '现场打标';
  isImportant: boolean;
  sopRuleMatched?: string; // Q5: 重要度由后台SOP规则配置产出
  status: 'pending' | 'in_progress' | 'completed';
  dueLabel: string;
  isOverdue: boolean;
  speakerContext: string;
  bottleneck: string; // 5.5 困难点/卡点
  createdAt: string;
}

export interface FieldTagRecord {
  id: string;
  index: number;
  time: string;
  summary: string;
  isImportant: boolean;
  followUpCycle: string;
}

const INITIAL_TODOS: EInkTodoItem[] = [
  {
    id: 'td_1',
    title: '给王总回冷链改造报价',
    source: '语音口述',
    isImportant: true,
    sopRuleMatched: '对话分析SOP：含“王总/报价/今天”自动标红高优',
    status: 'pending',
    dueLabel: '今日 15:00 到期',
    isOverdue: true,
    speakerContext: '王总巡视冷作间时口头交代，下午三点前发最终改造核价单',
    bottleneck: '缺采购部2号压缩机底价确认，需催询李经理',
    createdAt: '09:20'
  },
  {
    id: 'td_2',
    title: '复核B区2号配电柜LOTO挂锁',
    source: '现场打标',
    isImportant: true,
    sopRuleMatched: '安全定检SOP：涉及高压隔离锁扣异常自动标红高优',
    status: 'pending',
    dueLabel: '已超 2 小时',
    isOverdue: true,
    speakerContext: '早检SOP第1步打标记录：2号柜副锁标牌字迹模糊需更换',
    bottleneck: '新防误触标牌在备件库申领中，待安全员签字',
    createdAt: '08:45'
  },
  {
    id: 'td_3',
    title: '冷链库温控探头偏差校准',
    source: 'Tag打标',
    isImportant: false,
    sopRuleMatched: '后厨温控SOP：温差>1.5℃触发跟进待办',
    status: 'in_progress',
    dueLabel: '今日 17:30',
    isOverdue: false,
    speakerContext: '晨间巡检发现3号冷柜显示温度比实测偏高1.8℃',
    bottleneck: '需等下午14:00食材出库高峰过后再断电校准',
    createdAt: '09:50'
  },
  {
    id: 'td_4',
    title: '签收生鲜供应商批次检疫单',
    source: '语音口述',
    isImportant: false,
    sopRuleMatched: '对话分析SOP：常规收货凭证归档',
    status: 'pending',
    dueLabel: '今日 16:00',
    isOverdue: false,
    speakerContext: '库管老周提醒下午生鲜车到货后补签检疫回执',
    bottleneck: '供应商随车单据尚未送达前台',
    createdAt: '10:05'
  },
  {
    id: 'td_5',
    title: '跟师新员工小陈演练生熟隔离',
    source: '语音口述',
    isImportant: false,
    sopRuleMatched: '带教SOP：新员工首周每日实操抽检',
    status: 'pending',
    dueLabel: '今日 18:00',
    isOverdue: false,
    speakerContext: '店长早会安排晚高峰前带小陈走一遍刀具色标规程',
    bottleneck: '无卡点，待晚班交接时执行',
    createdAt: '10:15'
  },
  {
    id: 'td_6',
    title: '盘点消防通道应急照明备用电池',
    source: '现场打标',
    isImportant: false,
    sopRuleMatched: '消防周检SOP：常规耗材月度清点',
    status: 'pending',
    dueLabel: '明日 12:00',
    isOverdue: false,
    speakerContext: '西侧走廊3号灯自检闪烁，需核对仓库备用电池库存',
    bottleneck: '排在第6位，待前5条高优待办完成后自动递补上屏',
    createdAt: '10:22'
  },
  {
    id: 'td_7',
    title: '提交本周班组工牌充电架巡检表',
    source: 'Tag打标',
    isImportant: false,
    sopRuleMatched: '日常行政SOP：周五例行台账汇总',
    status: 'pending',
    dueLabel: '明日 17:00',
    isOverdue: false,
    speakerContext: '行政主管顺口提了一句下班前把充电位编号核对表发群里',
    bottleneck: '排在第7位，手机App可查看全量明细',
    createdAt: '10:28'
  }
];

const INITIAL_FIELD_TAGS: FieldTagRecord[] = [
  {
    id: 'ft_1',
    index: 1,
    time: '10:12',
    summary: '冷作间排水沟格栅第2块松动，需工程部紧固',
    isImportant: true,
    followUpCycle: '今日16:00前跟进'
  },
  {
    id: 'ft_2',
    index: 2,
    time: '10:18',
    summary: '红色生肉案板消毒记录卡未签字，已当场督促补签',
    isImportant: false,
    followUpCycle: '已现场闭环'
  },
  {
    id: 'ft_3',
    index: 3,
    time: '10:25',
    summary: '2号冷柜门封条轻微老化漏冷，需申领备件更换',
    isImportant: true,
    followUpCycle: '明日12:00前跟进'
  }
];

const LEARNING_SOP_STEPS = [
  {
    stepNo: 1,
    total: 6,
    title: '断电隔离并挂个人LOTO蓝锁',
    instruction: '先断开主隔离开关，用验电器确认无电后，在手柄挂个人专属蓝锁与警示牌。',
    mentorTip: '师傅提示：严禁只按急停不拉闸！必须双人核对锁扣落锁到位。'
  },
  {
    stepNo: 2,
    total: 6,
    title: '生熟砧板与刀具色标物理隔离',
    instruction: '红板切生肉、绿板切果蔬、白板切熟食，作业间距保持 ≥ 1.5 米。',
    mentorTip: '师傅提示：用完立即归位消毒刀架，切勿顺手混放台面。'
  },
  {
    stepNo: 3,
    total: 6,
    title: '断电后再拆温控面板检修',
    instruction: '使用绝缘螺丝刀卸下四角固定螺钉，轻掀面板避免拉扯排线。',
    mentorTip: '师傅提示：拆前面板前先拍一张端子排线照，防回装接错线序。'
  }
];

export function EInkBadgeModule({
  device,
  badgeCardConfig,
  onUpdateBadgeCardConfig,
  onBack
}: EInkBadgeModuleProps) {
  // ============================================================================
  // 1. 对外身份信息状态 (同步 480×720 PNG 工牌身份名片配置)
  // ============================================================================
  const [cardConfig, setCardConfig] = useState<BadgeCardConfig>(
    badgeCardConfig || DEFAULT_BADGE_CARD_CONFIG
  );
  const [isCardGeneratorOpen, setIsCardGeneratorOpen] = useState<boolean>(false);

  useEffect(() => {
    if (badgeCardConfig) {
      setCardConfig(badgeCardConfig);
    }
  }, [badgeCardConfig]);

  const identityInfo = {
    name: cardConfig.name,
    role: cardConfig.primaryRole,
    secondaryRole: cardConfig.secondaryRole,
    empNo: cardConfig.empNo || '012345',
    companyDept: cardConfig.companyName,
    website: cardConfig.website,
    avatarUrl: cardConfig.portraitUrl
  };

  // ============================================================================
  // 2. 墨水屏模式与页面流转状态 (Q4: 手动/语音切换，不做AI自动切换)
  // ============================================================================
  const [einkMode, setEinkMode] = useState<EInkMode>('office');
  const [officePage, setOfficePage] = useState<OfficePage>('identity');
  const [selectedDetailIndex, setSelectedDetailIndex] = useState<number>(0);

  // Q7: 翻页后 30 秒无操作自动回落身份页（保护隐私）
  const [fallbackSeconds, setFallbackSeconds] = useState<number>(30);

  // 硬件状态栏与隐私合规状态 (5.9 & 9.4: 录音/摄像与物理隐私盖实时一致)
  const [isPrivacyCoverOpen, setIsPrivacyCoverOpen] = useState<boolean>(true);
  const [isAudioRecording, setIsAudioRecording] = useState<boolean>(true);
  const [isOnline] = useState<boolean>(true);
  const [refreshTypeBadge, setRefreshTypeBadge] = useState<'局部刷新' | '全屏刷新'>('极低频常显' as any);

  // 屏幕即时短反馈 & 纯视觉到期提醒横幅 (5.2 & 5.6.2 & Q3: 无声音/无震动，标红视觉强调)
  const [instantFeedback, setInstantFeedback] = useState<string | null>(null);
  const [duePopupBanner, setDuePopupBanner] = useState<string | null>(null);

  // 待办数据与现场打标数据
  const [todos, setTodos] = useState<EInkTodoItem[]>(INITIAL_TODOS);
  const [fieldTaskName] = useState<string>('A区后厨冷链与切配卫生巡检');
  const [fieldTags, setFieldTags] = useState<FieldTagRecord[]>(INITIAL_FIELD_TAGS);
  const [showShiftSummaryOnScreen, setShowShiftSummaryOnScreen] = useState<boolean>(false);

  // 跟师学习态状态 (5.8 P2)
  const [learningStepIdx, setLearningStepIdx] = useState<number>(0);
  const [showStuckMentorTip, setShowStuckMentorTip] = useState<boolean>(true);

  // 手机端协同面板 Tab 与自定义语音输入
  const [companionTab, setCompanionTab] = useState<'todos' | 'field_summary' | 'identity_config'>('todos');
  const [voiceDraftText, setVoiceDraftText] = useState<string>('');
  const [editingBottleneckId, setEditingBottleneckId] = useState<string | null>(null);
  const [bottleneckDraft, setBottleneckDraft] = useState<string>('');

  // ============================================================================
  // 排序与 Top 5 截断逻辑 (5.4 & Q2: 不分Tab，固定显示前5条，重要度优先 -> 到期优先)
  // ============================================================================
  const activeTodos = React.useMemo(() => {
    return todos
      .filter(t => t.status !== 'completed')
      .sort((a, b) => {
        if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
        if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
        return 0;
      });
  }, [todos]);

  // Q2: 墨水屏固定只显示前 5 条，高优完成后低优自动递补
  const top5ScreenTodos = activeTodos.slice(0, 5);
  const importantActiveCount = activeTodos.filter(t => t.isImportant).length;
  const dueOrOverdueTodos = activeTodos.filter(t => t.isOverdue || t.isImportant);
  const currentDetailTodo = top5ScreenTodos[selectedDetailIndex] || top5ScreenTodos[0];

  // ============================================================================
  // Q7: 30 秒无操作自动回落身份页定时器
  // ============================================================================
  useEffect(() => {
    const isPrivatePage = einkMode === 'office' && officePage !== 'identity';
    if (!isPrivatePage) {
      setFallbackSeconds(30);
      return;
    }

    const timer = setInterval(() => {
      setFallbackSeconds(prev => {
        if (prev <= 1) {
          setOfficePage('identity');
          setRefreshTypeBadge('全屏刷新');
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [einkMode, officePage]);

  const resetFallbackTimer = (refreshMode: '局部刷新' | '全屏刷新' = '局部刷新') => {
    setFallbackSeconds(30);
    setRefreshTypeBadge(refreshMode);
  };

  const triggerScreenFeedback = (msg: string) => {
    setInstantFeedback(msg);
    resetFallbackTimer('局部刷新');
    setTimeout(() => {
      setInstantFeedback(null);
    }, 2400);
  };

  // ============================================================================
  // 物理按键与线下记录操作 (第 6 章 无触屏交互)
  // ============================================================================
  // 1. Tag 键单击：办公模式下翻页 / 待办详情切换；现场模式下打标；学习模式下下一步
  const handleTagSingleClick = () => {
    if (einkMode === 'office') {
      const order: OfficePage[] = ['identity', 'assistant_home', 'todo_list', 'todo_detail', 'due_list'];
      const nextIdx = (order.indexOf(officePage) + 1) % order.length;
      const nextPage = order[nextIdx];
      const isFullRefresh = officePage === 'identity' || nextPage === 'identity';
      setOfficePage(nextPage);
      resetFallbackTimer(isFullRefresh ? '全屏刷新' : '局部刷新');
    } else if (einkMode === 'field') {
      handleAddFieldTag('现场巡检关键问题点标记（待核查跟进）', true);
    } else if (einkMode === 'learning') {
      setLearningStepIdx(prev => (prev + 1) % LEARNING_SOP_STEPS.length);
      resetFallbackTimer('局部刷新');
    }
  };

  // 2. Tag 键长按：办公模式上翻页 / 快速记待办
  const handleTagLongPress = () => {
    if (einkMode === 'office') {
      const order: OfficePage[] = ['identity', 'assistant_home', 'todo_list', 'todo_detail', 'due_list'];
      const prevIdx = (order.indexOf(officePage) - 1 + order.length) % order.length;
      const prevPage = order[prevIdx];
      const isFullRefresh = officePage === 'identity' || prevPage === 'identity';
      setOfficePage(prevPage);
      resetFallbackTimer(isFullRefresh ? '全屏刷新' : '局部刷新');
    } else if (einkMode === 'field') {
      handleQuickVoiceRecord('老板现场叮嘱：冷链区挡鼠板下午四点前加固');
    } else {
      setShowStuckMentorTip(prev => !prev);
      resetFallbackTimer('局部刷新');
    }
  };

  // 3. 手动返回身份页 (Q7)
  const handleReturnToIdentity = () => {
    setEinkMode('office');
    setOfficePage('identity');
    setShowShiftSummaryOnScreen(false);
    setRefreshTypeBadge('全屏刷新');
    setFallbackSeconds(30);
  };

  // 4. 线下记录一句话待办 (5.2 先记后理 + Q5 后台SOP规则自动推断重要度)
  const handleQuickVoiceRecord = (text: string, sourceType: '语音口述' | 'Tag打标' = '语音口述') => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Q5: 模拟后台“线下对话分析 SOP 规则”自动推断重要度与到期时间（员工记录时不填表）
    const isHighPriority = /王总|老板|店长|报价|断电|高压|漏冷|立即|三点|四点|紧急|安全/.test(trimmed);
    const inferredRule = isHighPriority
      ? '对话分析SOP：识别到关键角色/时限/安全词，自动判定【重要】并标红'
      : '对话分析SOP：常规口述事项，归入今日待办队列';

    const newTodo: EInkTodoItem = {
      id: `td_${Date.now()}`,
      title: trimmed.length > 16 ? trimmed.slice(0, 16) : trimmed,
      source: sourceType,
      isImportant: isHighPriority,
      sopRuleMatched: inferredRule,
      status: 'pending',
      dueLabel: isHighPriority ? '今日 16:00 到期' : '今日 18:00',
      isOverdue: false,
      speakerContext: `线下${sourceType}原始记录：“${trimmed}”`,
      bottleneck: '刚刚线下记录，云端 Agent 已自动提取关键人、时限与卡点',
      createdAt: '刚刚'
    };

    setTodos(prev => [newTodo, ...prev]);
    setVoiceDraftText('');
    triggerScreenFeedback(`✓ 已记：${newTodo.title}`);
  };

  // 5. 现场 SOP 打标记录 (5.7)
  const handleAddFieldTag = (summaryText: string, important = true) => {
    const nextIdx = fieldTags.length + 1;
    const newTag: FieldTagRecord = {
      id: `ft_${Date.now()}`,
      index: nextIdx,
      time: '10:32',
      summary: summaryText,
      isImportant: important,
      followUpCycle: important ? '今日17:00前跟进' : '已记录待复盘'
    };
    setFieldTags(prev => [newTag, ...prev]);

    // 同时沉淀一条现场打标待办到待办池
    const newFieldTodo: EInkTodoItem = {
      id: `td_f_${Date.now()}`,
      title: summaryText.slice(0, 15),
      source: '现场打标',
      isImportant: important,
      sopRuleMatched: '现场巡检打标SOP：作业异常点自动转待跟进项',
      status: 'pending',
      dueLabel: important ? '今日 17:00 到期' : '明日跟进',
      isOverdue: false,
      speakerContext: `【${fieldTaskName}】第 ${nextIdx} 处现场 Tag 打标记录`,
      bottleneck: '现场作业打标生成，待收工后协同工程/班组闭环',
      createdAt: '10:32'
    };
    setTodos(prev => [newFieldTodo, ...prev]);
    setShowShiftSummaryOnScreen(false);
    triggerScreenFeedback(`✓ 已打标 第 ${nextIdx} 处`);
  };

  // 6. 触发纯视觉到期提醒弹出 (5.6.2 & Q3: 严格纯视觉无声音无震动)
  const handleTriggerDuePopup = () => {
    const target = dueOrOverdueTodos[0] || top5ScreenTodos[0];
    const bannerMsg = target
      ? `到期提醒：${target.title}（${target.dueLabel}）`
      : '到期提醒：给王总回冷链改造报价（15:00 到期）';
    setDuePopupBanner(bannerMsg);
    resetFallbackTimer('局部刷新');
  };

  // 7. 手机端勾选完成待办 (高优完成后，第6条自动递补进入墨水屏 Top 5)
  const handleToggleTodoComplete = (id: string) => {
    setTodos(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' }
          : item
      )
    );
    setRefreshTypeBadge('局部刷新');
  };

  const currentLearningStep = LEARNING_SOP_STEPS[learningStepIdx];
  const isIdentityDefaultView = einkMode === 'office' && officePage === 'identity';

  if (isCardGeneratorOpen) {
    return (
      <BadgeCardGeneratorModal
        isOpen={isCardGeneratorOpen}
        initialConfig={cardConfig}
        onClose={() => setIsCardGeneratorOpen(false)}
        onSaveAndSync={(newConfig, navigateToBadge) => {
          setCardConfig(newConfig);
          onUpdateBadgeCardConfig?.(newConfig);
          setEinkMode('office');
          setOfficePage('identity');
          setRefreshTypeBadge('全屏刷新');
          if (navigateToBadge) {
            setIsCardGeneratorOpen(false);
          }
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-24 text-slate-800">
      {/* Top Sub-Navigation Bar */}
      <div className="flex items-center justify-between pt-0.5">
        {onBack ? (
          <button
            type="button"
            id="eink-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>返回</span>
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-mono font-bold">
            3.7" 480×720 6色墨水屏
          </span>
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
            纯视觉 · 零动画
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. 模式切换与核心原则顶栏 (Q4: 手动/语音切换模式，不做AI场景自动识别)         */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>墨水屏 AI 工牌 · 随身师傅工作台</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              对外亮身份（默认待机）· 对内亮能力（翻页查看，30s无操作自动回落）
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {refreshTypeBadge}
          </span>
        </div>

        {/* Manual / Voice Mode Selector (Q4) */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            id="mode-office-btn"
            onClick={() => {
              setEinkMode('office');
              setShowShiftSummaryOnScreen(false);
              setRefreshTypeBadge('全屏刷新');
            }}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
              einkMode === 'office'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>日常办公态</span>
          </button>

          <button
            type="button"
            id="mode-field-btn"
            onClick={() => {
              setEinkMode('field');
              setShowShiftSummaryOnScreen(false);
              setRefreshTypeBadge('全屏刷新');
            }}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
              einkMode === 'field'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-600" />
            <span>现场作业态</span>
          </button>

          <button
            type="button"
            id="mode-learning-btn"
            onClick={() => {
              setEinkMode('learning');
              setRefreshTypeBadge('全屏刷新');
            }}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
              einkMode === 'learning'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>跟师学习(P2)</span>
          </button>
        </div>

        {/* Sub-page indicator when in Office Mode */}
        {einkMode === 'office' && (
          <div className="flex items-center justify-between gap-1 pt-0.5">
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {[
                { id: 'identity', label: '① 身份页(默认)' },
                { id: 'assistant_home', label: '② 助理首页' },
                { id: 'todo_list', label: '③ 今日待办(5条)' },
                { id: 'todo_detail', label: '④ 困难点摘要' },
                { id: 'due_list', label: '⑤ 到期提醒' }
              ].map((pg) => (
                <button
                  key={pg.id}
                  type="button"
                  id={`eink-page-${pg.id}`}
                  onClick={() => {
                    setOfficePage(pg.id as OfficePage);
                    resetFallbackTimer(pg.id === 'identity' || officePage === 'identity' ? '全屏刷新' : '局部刷新');
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer border ${
                    officePage === pg.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pg.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. 3.7寸 (480×720) 魔点科技墨水屏工牌实体外观 + 右侧物理按键操控台          */}
      {/*    1:1 还原工业设计图：顶部跑道型镜头与椭圆隐私盖滑块 + 6色墨水屏无框质感   */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border border-slate-200/90 rounded-3xl p-4 shadow-xs flex flex-col items-center relative">
        
        {/* Privacy Fallback Protection Bar (Q7: 30s 无操作自动回落身份页) */}
        <div className="w-full flex items-center justify-between mb-3.5 px-1">
          {isIdentityDefaultView ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>对外待机态：今日 {activeTodos.length} 件事（{importantActiveCount} 件重要已隐藏）</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold">
              <Clock className="w-3 h-3 text-amber-700" />
              <span>对内私密态：{fallbackSeconds}s 无操作自动回落身份页</span>
            </div>
          )}

          {!isIdentityDefaultView && (
            <button
              type="button"
              id="manual-return-identity-btn"
              onClick={handleReturnToIdentity}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>回身份页</span>
            </button>
          )}
        </div>

        {/* Physical Smart Badge Shell + Side Hardware Keys */}
        <div className="relative flex items-center justify-center">
          
          {/* Metallic Silver Outer Bezel & Pure White Body (1:1 Industrial Design) */}
          <div className="relative w-[280px] rounded-[44px] p-[4px] bg-gradient-to-b from-[#d8dce2] via-[#eef0f3] to-[#b8bec7] shadow-[0_20px_42px_rgba(15,23,42,0.16),0_4px_12px_rgba(15,23,42,0.08)]">
            {/* Left Side Physical Volume/Action Key Protrusion */}
            <div className=" -left-[3px] top-[76px] w-[3px] h-14 rounded-l-full bg-gradient-to-b from-[#aeb4be] via-[#d5dae2] to-[#989fa9] absolute" />
            {/* Right Side Physical Tag Key Protrusion */}
            <div className="-right-[3px] top-[84px] w-[3px] h-16 rounded-r-full bg-gradient-to-b from-[#aeb4be] via-[#d5dae2] to-[#989fa9] absolute" />

            {/* White Ceramic/Polycarbonate Front Face */}
            <div className="w-full rounded-[40px] bg-gradient-to-br from-[#ffffff] via-[#f8f9fb] to-[#e6e8ed] px-4 pt-3.5 pb-5 border border-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.95)]">
              
              {/* Top Raised Pill-Shaped Camera, Oval Privacy Cover & Cyan LED Bar */}
              <div className="h-[46px] mb-3.5 px-3.5 rounded-full bg-gradient-to-b from-[#f4f5f7] via-[#eceef2] to-[#e2e5ea] border border-[#cfd4dc] shadow-[0_3px_6px_rgba(15,23,42,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-between relative">
                
                {/* Left: Oval Speaker Micro-Perforated Grille */}
                <div className="w-[46px] h-[13px] rounded-full bg-[#e8ebf0] border border-[#b9c0cc] shadow-inner flex flex-col items-center justify-center gap-[2px] px-1.5">
                  <div className="flex items-center gap-[2px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(dot => (
                      <span key={`r1-${dot}`} className="w-[1.5px] h-[1.5px] rounded-full bg-slate-600/80" />
                    ))}
                  </div>
                  <div className="flex items-center gap-[2px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(dot => (
                      <span key={`r2-${dot}`} className="w-[1.5px] h-[1.5px] rounded-full bg-slate-600/80" />
                    ))}
                  </div>
                </div>

                {/* Center-Right: Camera Lens + Sliding White Oval Privacy Cover */}
                <button
                  type="button"
                  id="toggle-privacy-cover-btn"
                  onClick={() => {
                    setIsPrivacyCoverOpen(prev => !prev);
                    resetFallbackTimer('局部刷新');
                  }}
                  className="relative w-[108px] h-[32px] flex items-center cursor-pointer select-none"
                  title="点击拨动物理摄像头隐私滑盖（左滑遮挡镜头 / 右滑开启镜头）"
                >
                  {/* Circular Dark Optical Camera Lens at Left-Center */}
                  <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-b from-[#2b2e33] to-[#121316] border-[2px] border-[#383c44] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center ml-1">
                    <div className="w-[14px] h-[14px] rounded-full bg-[#152232] border border-[#2d4663] flex items-center justify-center">
                      <div className="w-[5px] h-[5px] rounded-full bg-[#38bdf8]/60 blur-[0.3px]" />
                    </div>
                  </div>

                  {/* White Oval Physical Slider Cap (Pure clean white matching reference design) */}
                  <div
                    className={`absolute top-[1px] h-[30px] w-[68px] rounded-full bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#eff1f5] border border-[#d0d5dd] shadow-[0_2px_6px_rgba(15,23,42,0.16),inset_0_1px_1px_rgba(255,255,255,1)] ${
                      isPrivacyCoverOpen ? 'left-[38px]' : 'left-[0px]'
                    }`}
                  />
                </button>

                {/* Rightmost: Glowing Cyan Status Indicator LED */}
                <span
                  className={`w-[8px] h-[8px] rounded-full ${
                    isAudioRecording
                      ? 'bg-[#22d3ee] shadow-[0_0_8px_#06b6d4]'
                      : 'bg-slate-300'
                  }`}
                />
              </div>

              {/* ================================================================= */}
              {/* 3.7-INCH (480×720) 6-COLOR E-INK DISPLAY VIEWPORT                 */}
              {/* ================================================================= */}
              <div
                id="eink-screen-canvas"
                className={`w-[240px] h-[360px] rounded-[20px] select-none relative overflow-hidden ${
                  isIdentityDefaultView
                    ? cardConfig.theme === 'dark'
                      ? 'bg-gradient-to-br from-[#020202] via-[#121212] to-[#242424] shadow-[inset_0_1px_3px_rgba(255,255,255,0.08)]'
                      : 'bg-gradient-to-br from-[#F4F4F4] via-[#EBEBEB] to-[#DFDFDF] shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]'
                    : 'bg-[#F3F2ED] border border-[#27272A]/40 p-3 flex flex-col justify-between text-[#18181B] shadow-[inset_0_1px_4px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* =============================================================== */}
                {/* CASE 1: DEFAULT STANDBY IDENTITY SCREEN (480×720 PNG / Live)    */}
                {/* =============================================================== */}
                {isIdentityDefaultView ? (
                  <div className="w-full h-full relative overflow-hidden">
                    {cardConfig.generatedPngDataUrl ? (
                      <img
                        src={cardConfig.generatedPngDataUrl}
                        alt={`${cardConfig.name} 480x720 工牌名片`}
                        className="w-full h-full object-cover block pointer-events-none select-none"
                      />
                    ) : (
                      <>
                        {/* Top-Left Brand Logo + Name + Role Block */}
                        <div className="relative z-20 pt-6 pl-5 pr-3">
                          {/* Moredian Geometric "M" Logo or Custom Logo + Company Name */}
                          <div className="flex items-center gap-2">
                            {cardConfig.logoType === 'custom' && cardConfig.customLogoUrl ? (
                              <img
                                src={cardConfig.customLogoUrl}
                                alt={cardConfig.companyName}
                                className="h-[18px] w-auto max-w-[38px] object-contain flex-shrink-0"
                              />
                            ) : (
                              <svg
                                viewBox="0 0 36 28"
                                className="w-[24px] h-[19px] flex-shrink-0"
                                fill="none"
                              >
                                <path
                                  d="M2 4L15 8.5V25L10.5 23.5V11.5L6.5 10V24.5L2 26V4Z"
                                  fill={cardConfig.theme === 'dark' ? '#FFFFFF' : '#4C6EF5'}
                                />
                                <path
                                  d="M34 4L21 8.5V25L25.5 23.5V11.5L29.5 10V24.5L34 26V4Z"
                                  fill={cardConfig.theme === 'dark' ? '#E4E4E7' : '#4263EB'}
                                />
                              </svg>
                            )}
                            <span
                              className={`text-[15px] font-semibold tracking-wider leading-none ${
                                cardConfig.theme === 'dark' ? 'text-white' : 'text-[#232533]'
                              }`}
                            >
                              {cardConfig.companyName || '魔点科技'}
                            </span>
                          </div>

                          {/* Large Employee Name */}
                          <div
                            className={`mt-3 text-[32px] font-black tracking-tight leading-[1.08] ${
                              cardConfig.theme === 'dark' ? 'text-white' : 'text-[#EA8A2A]'
                            }`}
                          >
                            {cardConfig.name.replace(/\s+/g, '')}
                          </div>

                          {/* Primary Role Title */}
                          <div
                            className={`mt-2 text-[19px] font-medium tracking-wide leading-snug ${
                              cardConfig.theme === 'dark' ? 'text-[#F4F4F5]' : 'text-[#27272A]'
                            }`}
                          >
                            {cardConfig.primaryRole}
                          </div>

                          {/* Optional Secondary Role Title with Em-Dash Line */}
                          {cardConfig.secondaryRole && cardConfig.secondaryRole.trim() && (
                            <div className="mt-2 flex items-center gap-2">
                              <span
                                className={`w-6 h-[2px] rounded-full ${
                                  cardConfig.theme === 'dark' ? 'bg-white' : 'bg-[#52525B]'
                                }`}
                              />
                              <span
                                className={`text-[13px] font-medium tracking-wide ${
                                  cardConfig.theme === 'dark' ? 'text-[#E4E4E7]' : 'text-[#3F3F46]'
                                }`}
                              >
                                {cardConfig.secondaryRole.trim()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom-Left Vertical Website Watermark (www.moredian.com) */}
                        <div
                          className={`absolute left-4 bottom-6 z-20 text-[12px] font-normal tracking-[0.04em] font-sans ${
                            cardConfig.theme === 'dark' ? 'text-[#E4E4E7]' : 'text-[#3F3F46]'
                          }`}
                          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                          {cardConfig.website || 'www.moredian.com'}
                        </div>

                        {/* Right & Bottom-Right Employee Portrait */}
                        {cardConfig.portraitUrl.includes('shenzhiyu_clean_bg') && cardConfig.theme === 'dark' ? (
                          <img
                            src={cardConfig.portraitUrl}
                            alt={cardConfig.name}
                            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none select-none"
                          />
                        ) : (
                          <img
                            src={cardConfig.portraitUrl}
                            alt={cardConfig.name}
                            style={{
                              WebkitMaskImage:
                                'linear-gradient(to bottom, transparent 0%, black 10%), linear-gradient(to right, transparent 0%, black 10%)',
                              WebkitMaskComposite: 'source-in',
                              maskComposite: 'intersect'
                            }}
                            className="absolute right-0 bottom-0 w-[178px] h-[272px] object-cover object-top z-10 pointer-events-none select-none"
                          />
                        )}
                      </>
                    )}

                    {/* Instant Recording or Due Reminder Overlay Banner if triggered while on Identity Screen */}
                    {instantFeedback && (
                      <div
                        id="eink-instant-feedback"
                        className="absolute top-2.5 left-2.5 right-2.5 z-30 px-2.5 py-1.5 bg-[#18181B] text-[#F3F2ED] rounded-lg text-[11px] font-bold shadow-sm"
                      >
                        {instantFeedback}
                      </div>
                    )}
                    {duePopupBanner && !instantFeedback && (
                      <div
                        id="eink-due-popup-banner"
                        className="absolute top-2.5 left-2.5 right-2.5 z-30 px-2.5 py-1.5 bg-[#C82829] text-white rounded-lg text-[10px] font-bold leading-snug shadow-sm"
                      >
                        <span className="inline-block px-1 bg-white text-[#C82829] text-[8px] font-extrabold rounded mr-1">
                          纯视觉提醒
                        </span>
                        <span>{duePopupBanner}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* =============================================================== */
                  /* CASE 2: INTERNAL PERSONAL ASSISTANT PAGES (Flipped / Field / Learning) */
                  /* =============================================================== */
                  <>
                    {/* Subtle E-Ink Paper Matte Texture */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_0)] [background-size:4px_4px]" />

                    {/* TOP ZONE: Permanent Collapsed Identity Header + Date & Battery */}
                    <div className="relative z-10 space-y-1">
                      <div className="flex items-center justify-between border-b border-[#27272A] pb-1.5 text-[10px] font-bold tracking-tight text-[#27272A]">
                        <span className="truncate">{identityInfo.name.replace(/\s+/g, '')} · {identityInfo.role}</span>
                        <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-bold text-[#3F3F46] flex-shrink-0">
                          <span>
                            {(() => {
                              const now = new Date();
                              return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                            })()}
                          </span>
                          <span>·</span>
                          <span>{device?.battery ?? 84}%</span>
                        </div>
                      </div>

                      {/* EVENT POPUP 1: Instant Recording Confirmation */}
                      {instantFeedback && (
                        <div
                          id="eink-instant-feedback"
                          className="mt-1 px-2 py-1.5 bg-[#18181B] text-[#F3F2ED] rounded border border-[#18181B] text-[11px] font-bold leading-tight"
                        >
                          {instantFeedback}
                        </div>
                      )}

                      {/* EVENT POPUP 2: Visual-Only Due Reminder Banner */}
                      {duePopupBanner && !instantFeedback && (
                        <div
                          id="eink-due-popup-banner"
                          className="mt-1 px-2 py-1.5 bg-[#C82829] text-white rounded border border-[#991B1B] text-[10px] font-bold leading-snug flex items-start justify-between gap-1"
                        >
                          <div>
                            <span className="inline-block px-1 bg-white text-[#C82829] text-[8px] font-extrabold rounded mr-1">
                              纯视觉提醒
                            </span>
                            <span>{duePopupBanner}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MIDDLE BODY ZONE: SWITCH BY MODE & PAGE */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center my-1.5 overflow-hidden">

                {/* ------------------------------------------------------------- */}
                {/* PAGE B: 5.3 助理首页 · 下一件要事（翻页进入 · 对内 · P0）        */}
                {/* ------------------------------------------------------------- */}
                {einkMode === 'office' && officePage === 'assistant_home' && (
                  <div className="flex flex-col justify-between h-full py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-[#3F3F46] tracking-wide">
                        ▼ 下一件要事 (TOP 1)
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#C82829] text-white font-bold">
                        最高优
                      </span>
                    </div>

                    {top5ScreenTodos[0] ? (
                      <div className="my-auto p-3 border-2 border-[#18181B] bg-[#FAF9F5] rounded-lg space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-xs ${
                            top5ScreenTodos[0].isImportant
                              ? 'bg-[#C82829] text-white'
                              : 'bg-[#27272A] text-white'
                          }`}>
                            {top5ScreenTodos[0].isImportant ? '★ 重要必办' : '待办'}
                          </span>
                          <span className={`text-[10px] font-mono font-bold ${
                            top5ScreenTodos[0].isOverdue ? 'text-[#C82829]' : 'text-[#52525B]'
                          }`}>
                            {top5ScreenTodos[0].dueLabel}
                          </span>
                        </div>

                        {/* Large Bold Title: Read in 3 seconds */}
                        <div className={`text-[19px] font-black leading-snug ${
                          top5ScreenTodos[0].isImportant ? 'text-[#C82829]' : 'text-[#18181B]'
                        }`}>
                          {top5ScreenTodos[0].title}
                        </div>

                        <div className="pt-2 border-t border-[#27272A]/20 flex items-center justify-between text-[11px] font-bold text-[#3F3F46]">
                          <span>来自：{top5ScreenTodos[0].source}</span>
                          <span className="font-mono text-[10px] text-[#71717A]">{top5ScreenTodos[0].createdAt}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto p-4 border border-dashed border-[#52525B] rounded-lg text-center text-xs font-bold text-[#52525B]">
                        今日待办已全部完成
                      </div>
                    )}

                    <div className="text-[9px] text-center text-[#52525B] font-mono">
                      [单击 Tag 键看前 5 条清单]
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* PAGE C: 5.4 今日待办列表（不分Tab · 固定显示前5条 · Q2 & Q5）    */}
                {/* ------------------------------------------------------------- */}
                {einkMode === 'office' && officePage === 'todo_list' && (
                  <div className="flex flex-col justify-between h-full py-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-extrabold text-[#18181B]">
                        今日待办 (固定前 5 条)
                      </span>
                      <span className="text-[9px] font-mono text-[#52525B]">
                        共 {activeTodos.length} 条
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-1">
                      {top5ScreenTodos.map((item, idx) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedDetailIndex(idx);
                            setOfficePage('todo_detail');
                            resetFallbackTimer('局部刷新');
                          }}
                          className={`px-2 py-1.5 rounded border text-left flex items-center justify-between gap-1.5 ${
                            item.isImportant
                              ? 'border-[#C82829] bg-[#FAF9F5]'
                              : 'border-[#27272A]/40 bg-[#FAF9F5]'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <span className={`text-[10px] font-mono font-extrabold ${
                                item.isImportant ? 'text-[#C82829]' : 'text-[#3F3F46]'
                              }`}>
                                {idx + 1}.
                              </span>
                              {item.isImportant && (
                                <span className="px-1 py-0.1 bg-[#C82829] text-white text-[8px] font-extrabold rounded-xs flex-shrink-0">
                                  重要
                                </span>
                              )}
                              <span className={`text-[11px] truncate ${
                                item.isImportant
                                  ? 'font-black text-[#C82829]'
                                  : 'font-bold text-[#18181B]'
                              }`}>
                                {item.title}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-[#52525B] flex-shrink-0 px-1 py-0.2 bg-[#E4E3DD] rounded-xs">
                            {item.source === '语音口述' ? '语音' : item.source === '现场打标' ? '现场' : 'Tag'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[9px] text-center text-[#52525B] font-mono mt-1">
                      超出5条回手机看 · 高优完结自动递补
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* PAGE D: 5.5 待办详情 · 困难点摘要（≤3行 · 谁的事/卡在哪）         */}
                {/* ------------------------------------------------------------- */}
                {einkMode === 'office' && officePage === 'todo_detail' && currentDetailTodo && (
                  <div className="flex flex-col justify-between h-full py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-[#18181B]">
                        待办摘要 ({selectedDetailIndex + 1}/{top5ScreenTodos.length})
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs ${
                        currentDetailTodo.isOverdue
                          ? 'bg-[#C82829] text-white'
                          : 'bg-[#27272A] text-white'
                      }`}>
                        {currentDetailTodo.dueLabel}
                      </span>
                    </div>

                    <div className="my-auto p-2.5 border-2 border-[#18181B] bg-[#FAF9F5] rounded-lg space-y-2">
                      <div className={`text-sm font-black leading-snug ${
                        currentDetailTodo.isImportant ? 'text-[#C82829]' : 'text-[#18181B]'
                      }`}>
                        {currentDetailTodo.title}
                      </div>

                      {/* Line 1-2: Who said what */}
                      <div className="text-[10px] font-semibold text-[#27272A] leading-snug line-clamp-2">
                        <span className="font-extrabold">来源背景：</span>
                        {currentDetailTodo.speakerContext}
                      </div>

                      {/* Line 3: Bottleneck / 卡点 (Highlighted in E-Ink Red) */}
                      <div className="p-1.5 bg-[#F3F2ED] border-l-2 border-[#C82829] text-[10px] font-bold text-[#C82829] leading-snug line-clamp-2">
                        <span>卡点/困难点：</span>
                        {currentDetailTodo.bottleneck}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-[#52525B]">
                      <span>完整详情回手机App闭环</span>
                      <span>[Tag键切换]</span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* PAGE E: 5.6 到期 / 跟进提醒清单（超时标红 · 不误事 · P0）        */}
                {/* ------------------------------------------------------------- */}
                {einkMode === 'office' && officePage === 'due_list' && (
                  <div className="flex flex-col justify-between h-full py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-[#C82829]">
                        ! 到期与待跟进清单
                      </span>
                      <span className="text-[9px] font-mono font-bold bg-[#C82829] text-white px-1.5 py-0.2 rounded-xs">
                        {dueOrOverdueTodos.length} 项需跟进
                      </span>
                    </div>

                    <div className="my-auto space-y-1.5">
                      {dueOrOverdueTodos.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="p-2 rounded border-2 border-[#C82829] bg-[#FAF9F5] space-y-0.5"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-black text-[#C82829] truncate">
                              {item.title}
                            </span>
                            <span className="text-[9px] font-mono font-extrabold bg-[#C82829] text-white px-1 rounded-xs flex-shrink-0">
                              {item.dueLabel}
                            </span>
                          </div>
                          <div className="text-[9px] font-semibold text-[#3F3F46] truncate">
                            卡点：{item.bottleneck}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[9px] text-center text-[#52525B] font-mono">
                      纯视觉标红强调 · 全程无声音无震动
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* MODE 2: 5.7 现场作业态（打标计数 + 录音/隐私盖联动 + 收工汇总）  */}
                {/* ------------------------------------------------------------- */}
                {einkMode === 'field' && (
                  <div className="flex flex-col justify-between h-full py-1">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 bg-[#18181B] text-[#F3F2ED] text-[10px] font-extrabold rounded-xs">
                        现场作业模式
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#C82829]">
                        ● 录音存证中
                      </span>
                    </div>

                    {!showShiftSummaryOnScreen ? (
                      <div className="my-auto p-2.5 border-2 border-[#18181B] bg-[#FAF9F5] rounded-lg space-y-2.5">
                        <div>
                          <div className="text-[9px] font-mono text-[#52525B]">当前执行任务：</div>
                          <div className="text-xs font-black text-[#18181B] leading-snug mt-0.5">
                            {fieldTaskName}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="p-2 bg-[#F3F2ED] border border-[#18181B] rounded text-center">
                            <div className="text-lg font-black font-mono text-[#18181B]">
                              {fieldTags.length} 处
                            </div>
                            <div className="text-[9px] font-bold text-[#52525B]">已打标记录</div>
                          </div>
                          <div className="p-2 bg-[#F3F2ED] border border-[#C82829] rounded text-center">
                            <div className="text-lg font-black font-mono text-[#C82829]">
                              {fieldTags.filter(f => f.isImportant).length} 项
                            </div>
                            <div className="text-[9px] font-bold text-[#C82829]">关键问题待跟进</div>
                          </div>
                        </div>

                        {fieldTags[0] && (
                          <div className="text-[10px] font-bold text-[#27272A] border-t border-[#27272A]/20 pt-1.5 truncate">
                            最新打标：{fieldTags[0].summary}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* 收工自动出总结摘要 (5.7 验收标准) */
                      <div className="my-auto p-2.5 border-2 border-[#18181B] bg-[#FAF9F5] rounded-lg space-y-2">
                        <div className="flex items-center justify-between border-b border-[#18181B] pb-1">
                          <span className="text-xs font-black text-[#18181B]">✓ 本次作业收工汇总</span>
                          <span className="text-[9px] font-mono font-bold text-[#C82829]">已同步手机</span>
                        </div>
                        <div className="text-[10px] font-bold text-[#27272A] space-y-1">
                          <div>• 累计打标记录：{fieldTags.length} 处</div>
                          <div className="text-[#C82829]">• 关键待跟进问题：{fieldTags.filter(f => f.isImportant).length} 项</div>
                          <div className="truncate text-[9px] text-[#52525B]">
                            首要跟进：{fieldTags[0]?.summary}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-[9px] text-center text-[#52525B] font-mono">
                      [按 Tag 键即时打标 · 免掏手机]
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* MODE 3: 5.8 SOP / 师傅式提醒（学习态 · 后置 P2）                */}
                {/* ------------------------------------------------------------- */}
                {einkMode === 'learning' && (
                  <div className="flex flex-col justify-between h-full py-1">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 bg-[#18181B] text-[#F3F2ED] text-[10px] font-extrabold rounded-xs">
                        跟师学习态 (P2)
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#18181B]">
                        已学 {currentLearningStep.stepNo}/{currentLearningStep.total} 步
                      </span>
                    </div>

                    <div className="my-auto p-2.5 border-2 border-[#18181B] bg-[#FAF9F5] rounded-lg space-y-2">
                      <div className="text-[10px] font-mono font-bold text-[#52525B]">
                        当前第 {currentLearningStep.stepNo} 步：
                      </div>
                      <div className="text-base font-black text-[#18181B] leading-snug">
                        {currentLearningStep.title}
                      </div>
                      <div className="text-[10px] font-semibold text-[#27272A] leading-relaxed">
                        {currentLearningStep.instruction}
                      </div>

                      {showStuckMentorTip && (
                        <div className="p-2 bg-[#F3F2ED] border-2 border-[#C82829] rounded text-[10px] font-extrabold text-[#C82829] leading-snug">
                          {currentLearningStep.mentorTip}
                        </div>
                      )}
                    </div>

                    <div className="text-[9px] text-center text-[#52525B] font-mono">
                      [单击 Tag 键下一步 · 长按切换师傅提示]
                    </div>
                  </div>
                )}

                    </div>

                    {/* BOTTOM ZONE: Permanent Todo Summary Counter (5.1 & 5.3: 仅数量，不泄密) */}
                    <div className="relative z-10 pt-1.5 border-t border-[#27272A] flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#18181B]">
                        今日 {activeTodos.length} 件事
                      </span>
                      <span className="text-[#C82829] font-extrabold">
                        · {importantActiveCount} 件重要
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right-Side Physical Tag Button Callout on Badge Edge */}
          <div className="flex flex-col items-center gap-2 ml-2.5">
            <button
              type="button"
              id="physical-tag-click-btn"
              onClick={handleTagSingleClick}
              className="px-2.5 py-3 rounded-2xl bg-slate-900 hover:bg-blue-600 active:scale-95 text-white text-[11px] font-bold shadow-md flex flex-col items-center gap-1 cursor-pointer transition-all border border-slate-700"
              title="物理 Tag 键单击：翻页 / 现场打标"
            >
              <Tag className="w-4 h-4 text-cyan-300" />
              <span>Tag 单击</span>
              <span className="text-[9px] font-normal text-slate-300">
                {einkMode === 'office' ? '向下翻页' : einkMode === 'field' ? '现场打标' : '下一步骤'}
              </span>
            </button>

            <button
              type="button"
              id="physical-tag-longpress-btn"
              onClick={handleTagLongPress}
              className="px-2.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-[11px] font-bold shadow-xs flex flex-col items-center gap-0.5 cursor-pointer transition-all border border-slate-300"
              title="物理 Tag 键长按：上翻页 / 语音速记"
            >
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span>Tag 长按</span>
              <span className="text-[9px] font-normal text-slate-400">
                {einkMode === 'office' ? '向上翻页' : '语音速记'}
              </span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. 线下即时记录与事件模拟快捷操控栏 (5.2 先记后理 & 5.6.2 纯视觉提醒)   */}
        {/* ===================================================================== */}
        <div className="w-full mt-4 pt-3 border-t border-slate-300/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span>线下即时记录模拟（先记后理 · ≤2秒零门槛）</span>
            </span>
            <button
              type="button"
              id="trigger-due-popup-btn"
              onClick={handleTriggerDuePopup}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <VolumeX className="w-3 h-3" />
              <span>模拟到期标红弹出(无声)</span>
            </button>
          </div>

          {/* Preset 1-click offline voice / tag scenarios */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              id="preset-voice-boss-btn"
              onClick={() => handleQuickVoiceRecord('王总交代下午四点前发冷链报价方案', '语音口述')}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
            >
              🎙️ 记老板口述：“王总交代下午四点前发冷链报价”
            </button>
            <button
              type="button"
              id="preset-field-tag-btn"
              onClick={() => handleAddFieldTag('冷库2号门封条漏冷需申领备件', true)}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
            >
              🏷️ 现场Tag打标：“冷库2号门封条漏冷”
            </button>
            {einkMode === 'field' && (
              <button
                type="button"
                id="finish-field-shift-btn"
                onClick={() => {
                  setShowShiftSummaryOnScreen(true);
                  setCompanionTab('field_summary');
                  resetFallbackTimer('局部刷新');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold cursor-pointer shadow-2xs"
              >
                📋 收工自动生成问题点汇总
              </button>
            )}
          </div>

          {/* Custom 1-sentence voice input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={voiceDraftText}
              onChange={(e) => setVoiceDraftText(e.target.value)}
              placeholder="输入模拟一句话语音口述（如：张总让三点前核对备件库存）..."
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-blue-500 text-xs text-slate-800 outline-none"
            />
            <button
              type="button"
              onClick={() => handleQuickVoiceRecord(voiceDraftText, '语音口述')}
              disabled={!voiceDraftText.trim()}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              语音记下
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 手机 App 协同闭环管理面板（墨水屏看结论，完整详情与闭环回手机 App）        */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">手机 App 协同管理与闭环中心</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              墨水屏仅展示前 5 条结论，全量待办闭环、困难点补全与身份配置在手机端完成
            </p>
          </div>
        </div>

        {/* Companion Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setCompanionTab('todos')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              companionTab === 'todos' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            全量待办 ({activeTodos.length})
          </button>
          <button
            type="button"
            onClick={() => setCompanionTab('field_summary')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              companionTab === 'field_summary' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            收工问题汇总 ({fieldTags.length})
          </button>
          <button
            type="button"
            onClick={() => setCompanionTab('identity_config')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              companionTab === 'identity_config' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            工牌身份配置
          </button>
        </div>

        {/* TAB 1: 全量待办列表 + Q2 前5条递补演示 + Q5 对话分析SOP重要度规则 */}
        {companionTab === 'todos' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 leading-relaxed">
              <span className="font-bold">💡 墨水屏 5 条上限与递补规则（Q2 & Q5）：</span>
              墨水屏不分 Tab，固定按重要度显示前 5 条；勾选完成下方任意一条前 5 待办后，第 6 条待办将<strong>自动递补上屏</strong>。重要度由后台「对话分析 SOP 规则」自动产出。
            </div>

            <div className="space-y-2">
              {todos.map((todo) => {
                const activeRank = activeTodos.findIndex(t => t.id === todo.id);
                const isOnEInkScreen = activeRank >= 0 && activeRank < 5;

                return (
                  <div
                    key={todo.id}
                    className={`p-3 rounded-xl border transition-all ${
                      todo.status === 'completed'
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : isOnEInkScreen
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-50/70 border-dashed border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleTodoComplete(todo.id)}
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 cursor-pointer ${
                            todo.status === 'completed'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300 hover:border-blue-500'
                          }`}
                          title="勾选完成待办（触发墨水屏Top 5自动递补）"
                        >
                          {todo.status === 'completed' && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center flex-wrap gap-1.5">
                            {todo.isImportant && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[10px] font-bold">
                                重要
                              </span>
                            )}
                            <span className={`text-xs font-bold ${
                              todo.status === 'completed'
                                ? 'line-through text-slate-400'
                                : todo.isImportant
                                ? 'text-rose-700'
                                : 'text-slate-800'
                            }`}>
                              {todo.title}
                            </span>
                            {isOnEInkScreen ? (
                              <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white text-[9px] font-mono font-bold">
                                墨水屏 #{activeRank + 1}
                              </span>
                            ) : todo.status !== 'completed' ? (
                              <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 text-[9px] font-mono font-semibold">
                                第 {activeRank + 1} 位 · 待递补上屏
                              </span>
                            ) : null}
                          </div>

                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                            {todo.speakerContext}
                          </p>

                          {/* Bottleneck / 卡点 display & inline edit */}
                          <div className="mt-1.5 flex items-center justify-between gap-2 bg-rose-50/70 border border-rose-200/70 rounded-lg px-2.5 py-1 text-[11px] text-rose-800">
                            <span className="truncate">
                              <strong>困难点/卡点：</strong>{todo.bottleneck}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBottleneckId(todo.id);
                                setBottleneckDraft(todo.bottleneck);
                              }}
                              className="text-[10px] text-blue-600 font-bold whitespace-nowrap cursor-pointer hover:underline"
                            >
                              补全卡点
                            </button>
                          </div>

                          {editingBottleneckId === todo.id && (
                            <div className="mt-2 flex items-center gap-1.5">
                              <input
                                type="text"
                                value={bottleneckDraft}
                                onChange={(e) => setBottleneckDraft(e.target.value)}
                                className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-blue-300 text-xs outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setTodos(prev =>
                                    prev.map(t => t.id === todo.id ? { ...t, bottleneck: bottleneckDraft } : t)
                                  );
                                  setEditingBottleneckId(null);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold cursor-pointer"
                              >
                                保存
                              </button>
                            </div>
                          )}

                          {/* Q5: SOP Rule Attribution */}
                          {todo.sopRuleMatched && (
                            <div className="mt-1 text-[10px] font-mono text-slate-400">
                              ⚙️ {todo.sopRuleMatched}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold whitespace-nowrap ${
                        todo.isOverdue ? 'text-rose-600' : 'text-slate-500'
                      }`}>
                        {todo.dueLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: 现场收工自动总结与打标明细 (5.7) */}
        {companionTab === 'field_summary' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">{fieldTaskName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  共打标 {fieldTags.length} 处 · 其中 {fieldTags.filter(f => f.isImportant).length} 项高优问题需跟进
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEinkMode('field');
                  setShowShiftSummaryOnScreen(true);
                  resetFallbackTimer('全屏刷新');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold cursor-pointer"
              >
                投射汇总到墨水屏
              </button>
            </div>

            <div className="space-y-2">
              {fieldTags.map((tag) => (
                <div key={tag.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white text-[10px] font-mono font-bold">
                        打标 #{tag.index}
                      </span>
                      {tag.isImportant && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[10px] font-bold">
                          重点跟进
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400">{tag.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{tag.summary}</p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-rose-600 whitespace-nowrap">
                    {tag.followUpCycle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 工牌对外身份信息配置 & 480×720 PNG 生成器 */}
        {companionTab === 'identity_config' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>工牌身份名片生成器</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-600 text-[9px] font-mono">
                    480×720 PNG
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                  设置公司名称+Logo、姓名、主副岗位、网址与个人图片并导出 PNG
                </p>
              </div>
              <button
                type="button"
                id="eink-open-card-generator-btn"
                onClick={() => setIsCardGeneratorOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                生成 480×720 PNG
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">员工姓名</label>
                <input
                  type="text"
                  value={cardConfig.name}
                  onChange={(e) => {
                    const next = { ...cardConfig, name: e.target.value, generatedPngDataUrl: undefined };
                    setCardConfig(next);
                    onUpdateBadgeCardConfig?.(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">主岗位</label>
                <input
                  type="text"
                  value={cardConfig.primaryRole}
                  onChange={(e) => {
                    const next = { ...cardConfig, primaryRole: e.target.value, generatedPngDataUrl: undefined };
                    setCardConfig(next);
                    onUpdateBadgeCardConfig?.(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">副职级 (选填)</label>
                <input
                  type="text"
                  value={cardConfig.secondaryRole}
                  onChange={(e) => {
                    const next = { ...cardConfig, secondaryRole: e.target.value, generatedPngDataUrl: undefined };
                    setCardConfig(next);
                    onUpdateBadgeCardConfig?.(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">公司名称</label>
                <input
                  type="text"
                  value={cardConfig.companyName}
                  onChange={(e) => {
                    const next = { ...cardConfig, companyName: e.target.value, generatedPngDataUrl: undefined };
                    setCardConfig(next);
                    onUpdateBadgeCardConfig?.(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
