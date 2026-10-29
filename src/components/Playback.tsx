import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Download, ChevronLeft, ChevronRight,
  Mic, Video, Navigation as NavigationIcon, Image as ImageIcon, 
  Sparkles, BrainCircuit, Clock, CheckCircle2, AlertTriangle, 
  XCircle, ChevronDown, ChevronUp, ShieldCheck, FileCheck, 
  ListChecks, ArrowRight, Layers, Check, ArrowLeft, Eye,
  AlertCircle, Filter, RotateCcw
} from 'lucide-react';
import { Device, TimelineEvent, SOPStepItem } from '../types';
import { mockTimeline } from '../data';
import { SOPReportModal } from './SOPReportModal';

interface PlaybackProps {
  device: Device;
  initialEventId?: string | null;
  onClearInitialEvent?: () => void;
  initialClipId?: string | null;
  onClearInitialClip?: () => void;
  onNavigateToSearch?: (query: string) => void;
  onBackToDashboard?: () => void;
}

interface GroupedSopClip {
  clipId: string;
  timeLabel: string;
  hour: string;
  duration: string;
  location: string;
  imageUrl: string;
  events: TimelineEvent[];
}

const STEP_NO_ZH = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

export function Playback({ 
  device, 
  initialEventId, 
  onClearInitialEvent, 
  initialClipId, 
  onClearInitialClip, 
  onNavigateToSearch,
  onBackToDashboard 
}: PlaybackProps) {
  // selectedEventId === null indicates the SOP Results Overview List, while a string indicates the detail timeline
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId || null);
  const [filterClipId, setFilterClipId] = useState<string | null>(initialClipId || null);
  const [sopReportModalOpen, setSopReportModalOpen] = useState<boolean>(false);
  const [sopInitialTaskId, setSopInitialTaskId] = useState<string>('ee');
  const [currentDay, setCurrentDay] = useState<string>('今日');
  const [showDayDropdown, setShowDayDropdown] = useState<boolean>(false);

  const handleGoToAiSearch = (searchQuery: string) => {
    if (onNavigateToSearch) {
      onNavigateToSearch(searchQuery);
    }
  };

  // Auto handle initial event navigation from AI search
  useEffect(() => {
    if (initialEventId) {
      setSelectedEventId(initialEventId);
      if (onClearInitialEvent) {
        onClearInitialEvent();
      }
    }
  }, [initialEventId, onClearInitialEvent]);

  // Sync initialClipId from parent
  useEffect(() => {
    if (initialClipId !== undefined) {
      setFilterClipId(initialClipId);
    }
  }, [initialClipId]);

  const activeEvent = selectedEventId 
    ? (mockTimeline.find(e => e.id === selectedEventId) || mockTimeline[0])
    : null;

  // 方案二：按“视频片段”聚合展示多次 SOP 分析结果
  const groupedSopClips: GroupedSopClip[] = [
    {
      clipId: 'tc3',
      timeLabel: '14:19:00',
      hour: '14:00',
      duration: "0'34\"",
      location: 'A区配电房 · 高压巡检录像',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=600&auto=format&fit=crop',
      events: mockTimeline.filter(e => e.id === 't1' || e.id === 't3')
    },
    {
      clipId: 'tc1',
      timeLabel: '14:20:20',
      hour: '14:00',
      duration: "0'34\"",
      location: 'B区后厨 · 主厨备餐第一视角',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',
      events: mockTimeline.filter(e => e.id === 't2')
    },
    {
      clipId: 'tc7',
      timeLabel: '14:16:16',
      hour: '14:00',
      duration: "0'14\"",
      location: 'C区装配车间 · 精密工序流水线',
      imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
      events: mockTimeline.filter(e => e.id === 't4')
    }
  ];

  const isClipMatch = (groupClipId: string, filterId: string | null) => {
    if (!filterId) return true;
    if (groupClipId === filterId) return true;
    if ((filterId === 'tc6' || filterId === 'tc5') && groupClipId === 'tc7') return true;
    if (filterId === 'tc2' && groupClipId === 'tc1') return true;
    if (filterId === 'tc4' && groupClipId === 'tc3') return true;
    return false;
  };

  const displayedSopClips = filterClipId 
    ? (groupedSopClips.filter(g => isClipMatch(g.clipId, filterClipId)).length > 0
        ? groupedSopClips.filter(g => isClipMatch(g.clipId, filterClipId))
        : groupedSopClips)
    : groupedSopClips;

  const isFiltered = Boolean(filterClipId && groupedSopClips.filter(g => isClipMatch(g.clipId, filterClipId)).length > 0);

  // 动态统计指标（若当前有筛选则展示当前切片的数据，否则展示全天）
  const stats = isFiltered
    ? (filterClipId === 'tc3' || filterClipId === 'tc4'
        ? { total: 2, critical: 1, medium: 0, notice: 1 }
        : filterClipId === 'tc1' || filterClipId === 'tc2'
        ? { total: 1, critical: 0, medium: 1, notice: 0 }
        : { total: 0, critical: 0, medium: 0, notice: 0 })
    : { total: 3, critical: 1, medium: 1, notice: 1 };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-40262-large.mp4';
    a.download = `SOP-Memory-${activeEvent?.id || 'all'}.mp4`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col pb-28 relative"
    >
      {/* ========================================================================= */}
      {/* 视图一：SOP 分析结果列表 (按视频片段聚合多次 SOP 分析) */}
      {/* ========================================================================= */}
      {!selectedEventId && (
        <motion.div
          key="sop-list-view"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="flex flex-col pt-1"
        >
          {/* 顶部 SOP 待处理预警事件统计看板 */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs mb-3.5">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <h4 className="text-xs font-bold text-slate-800 tracking-wide">SOP 待处理预警事件统计</h4>
              </div>
              <span className="text-[10px] font-mono text-blue-600 font-semibold flex items-center gap-1">
                <span>点击数值跳转排查</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* Total Pending */}
              <div
                onClick={() => handleGoToAiSearch('查询全部待处理 SOP 预警与未闭环事件')}
                className="p-2 rounded-xl bg-rose-50 border border-rose-200 hover:border-rose-300 transition-all cursor-pointer flex flex-col items-center justify-center text-center group active:scale-95 shadow-xs"
                title="点击跳转 AI 智搜排查全部待处理事件"
              >
                <span className="text-[10px] text-rose-700 font-medium">待处理总数</span>
                <span className="text-lg font-bold font-mono text-rose-600 group-hover:scale-110 transition-transform mt-0.5">
                  {stats.total} <span className="text-[10px] font-sans font-normal text-rose-500">项</span>
                </span>
              </div>

              {/* Critical Alert */}
              <div
                onClick={() => handleGoToAiSearch('查询高危操作严重告警: 未戴绝缘手套与未挂牌LOTO')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all cursor-pointer flex flex-col items-center justify-center text-center group active:scale-95"
                title="点击跳转 AI 智搜排查🔴零容忍严重告警"
              >
                <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1">
                  🔴 严重
                </span>
                <span className="text-lg font-bold font-mono text-rose-600 group-hover:scale-110 transition-transform mt-0.5">
                  {stats.critical} <span className="text-[10px] font-sans font-normal text-slate-400">项</span>
                </span>
              </div>

              {/* Medium Warning */}
              <div
                onClick={() => handleGoToAiSearch('查询后厨冷链生鲜切配处理超时 SOP 执行偏离记录')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer flex flex-col items-center justify-center text-center group active:scale-95"
                title="点击跳转 AI 智搜排查🟡中度 SOP 偏离"
              >
                <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1">
                  🟡 偏离
                </span>
                <span className="text-lg font-bold font-mono text-amber-600 group-hover:scale-110 transition-transform mt-0.5">
                  {stats.medium} <span className="text-[10px] font-sans font-normal text-slate-400">项</span>
                </span>
              </div>

              {/* Low Notice */}
              <div
                onClick={() => handleGoToAiSearch('查询园区夜间安全巡检与隐患排查建议')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex flex-col items-center justify-center text-center group active:scale-95"
                title="点击跳转 AI 智搜查看🔵智能优化建议"
              >
                <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1">
                  🔵 建议
                </span>
                <span className="text-lg font-bold font-mono text-blue-600 group-hover:scale-110 transition-transform mt-0.5">
                  {stats.notice} <span className="text-[10px] font-sans font-normal text-slate-400">项</span>
                </span>
              </div>
            </div>
          </div>

          {/* Control Bar: Date Selector & Standalone SOP Report Download Button */}
          <div className="flex items-center justify-between gap-2 mb-3.5">
            {/* Date Select Button Pill */}
            <div className="relative">
              <button 
                onClick={() => setShowDayDropdown(!showDayDropdown)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 select-none shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentDay} ▽</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDayDropdown && (
                <div className="absolute top-10 left-0 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-20 min-w-[120px]">
                  {['今日', '昨日', '2026-07-07'].map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        setCurrentDay(day);
                        setShowDayDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-semibold cursor-pointer"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Standalone SOP Task Report Download Button */}
            <button
              onClick={() => {
                setSopInitialTaskId('ee');
                setSopReportModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-sm shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
              title="下载 SOP 质检报告"
            >
              <Download className="w-3.5 h-3.5 text-blue-100" />
              <span>下载质检报告</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                全部SOP
              </span>
            </button>
          </div>

          {/* Filter Indicator Banner */}
          {isFiltered && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/90 border border-blue-200 text-xs mb-3 shadow-2xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Filter className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="text-slate-600 font-medium">当前已过滤：</span>
                <span className="font-bold text-blue-800 truncate">
                  {displayedSopClips[0]?.timeLabel} {displayedSopClips[0]?.location?.split('·')[0]}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {onBackToDashboard && (
                  <button
                    onClick={onBackToDashboard}
                    className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>回视频</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setFilterClipId(null);
                    if (onClearInitialClip) onClearInitialClip();
                  }}
                  className="px-2 py-1 rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>查看全部视频</span>
                </button>
              </div>
            </div>
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between px-1 mb-2.5">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800">
                {isFiltered ? '当前视频片段 SOP 分析记录' : '今日视频片段 SOP 分析总览'}
              </h3>
            </div>
            {isFiltered && (
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-semibold">
                已过滤展示 {displayedSopClips.length} 个片段
              </span>
            )}
          </div>

          {/* 按视频片段聚合展示卡片列表 */}
          <div className="flex flex-col gap-3">
            {displayedSopClips.map((group, gIdx) => (
              <motion.div
                key={group.clipId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gIdx * 0.04 }}
                className="p-3.5 rounded-2xl bg-white hover:border-blue-300 border border-slate-200 shadow-xs flex flex-col gap-3 transition-all"
              >
                {/* Video Clip Header Row */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 text-xs">{group.timeLabel}</span>
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                      {group.hour}分卷
                    </span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[140px]" title={group.location}>
                      {group.location}
                    </span>
                  </div>

                  <span className="text-[10px] text-blue-700 font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                    已分析 {group.events.length} 项 SOP
                  </span>
                </div>

                {/* Video Clip Body */}
                <div className="flex items-center gap-3">
                  {/* Left: Video Thumbnail */}
                  <div className="w-24 h-18 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 relative shadow-xs self-center">
                    <img 
                      src={group.imageUrl} 
                      referrerPolicy="no-referrer"
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-1 right-1 bg-slate-950/70 px-1.5 py-0.2 rounded text-[8.5px] font-mono text-white">
                      {group.duration}
                    </div>
                  </div>

                  {/* Right: Aggregated SOP Analysis Rows for this Video */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    {group.events.map((event) => {
                      const steps = event.steps || [];
                      const passedStepsCount = steps.filter(s => s.status === 'passed').length;
                      const totalStepsCount = steps.length;

                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEventId(event.id)}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group flex items-center justify-between gap-2 active:scale-[0.99]"
                        >
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-1 shadow-xs">
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              <span>{event.sopName || 'SOP 规程'}</span>
                            </span>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-semibold text-blue-700 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">
                                {passedStepsCount}/{totalStepsCount} 项合规
                              </span>
                              <div className="flex items-center gap-0.5">
                                {steps.map((st) => (
                                  <span
                                    key={st.id}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      st.status === 'passed'
                                        ? 'bg-emerald-500'
                                        : st.status === 'failed'
                                        ? 'bg-rose-500 animate-pulse'
                                        : 'bg-amber-500'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors flex-shrink-0">
                            <span>查看详情</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 视图二：SOP 详情与逐步骤时间轴 (SOP Detail & Step-by-Step Timeline) */}
      {/* ========================================================================= */}
      {selectedEventId && activeEvent && (
        <motion.div
          key="sop-detail-view"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex flex-col gap-4"
        >
          {/* Top Back Header Bar */}
          <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-200">
            <button
              onClick={() => setSelectedEventId(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-blue-600" />
              <span>返回</span>
            </button>

            <button
              onClick={() => {
                setSopInitialTaskId(activeEvent.sopId || 'ee');
                setSopReportModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>任务质检报告</span>
            </button>
          </div>

          {/* Standalone SOP Badge Row */}
          <div className="flex items-center justify-between px-0.5">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeEvent.sopName || 'SOP 规程'}</span>
            </span>

            <span className="text-[11px] font-mono text-slate-500">
              共 {(activeEvent.steps || []).length} 个规程核验步
            </span>
          </div>

          {/* 逐步骤垂直时间轴 (Vertical Step Timeline for this SOP) */}
          <div className="relative border-l-2 border-blue-400 ml-6 md:ml-8 pl-5 md:pl-7 py-2 flex flex-col gap-6">
            {(activeEvent.steps || []).map((step, sIdx) => {
              const isStepPassed = step.status === 'passed';
              const isStepFailed = step.status === 'failed';
              const isStepWarning = step.status === 'warning';
              const stepZhNum = STEP_NO_ZH[step.stepNo - 1] || step.stepNo;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sIdx * 0.04 }}
                  className="relative flex flex-col gap-2 group/step"
                >
                  {/* Floating Milestone Badge on Timeline */}
                  <div className="flex items-center gap-2 -ml-[31px] md:-ml-[39px] z-20 flex-wrap">
                    {/* Circle Milestone Number */}
                    <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ring-4 ring-white flex-shrink-0 ${
                      isStepPassed 
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : isStepFailed
                        ? 'bg-rose-600 text-white shadow-rose-500/20'
                        : 'bg-amber-600 text-white shadow-amber-500/20'
                    }`}>
                      {stepZhNum}
                    </div>

                    {/* Step Title Pill */}
                    <div className={`px-3 py-1 rounded-full text-white text-[11px] font-bold shadow-sm flex items-center gap-1.5 whitespace-nowrap border ${
                      isStepFailed
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 border-rose-400'
                        : isStepWarning
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400'
                    }`}>
                      <Sparkles className="w-3 h-3 text-white/90" />
                      <span>步骤{stepZhNum}：{step.title}</span>
                    </div>

                    {/* Step Time Range */}
                    {step.timeRange && (
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.timeRange}
                      </span>
                    )}
                  </div>

                  {/* Step Detail Card */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    isStepFailed
                      ? 'bg-rose-50/50 border-rose-200'
                      : isStepWarning
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    {/* Verification Result Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5 pb-2 border-b border-slate-100">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        isStepPassed
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isStepFailed
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {isStepPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isStepFailed && <XCircle className="w-3 h-3 text-rose-600" />}
                        {isStepWarning && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        <span>
                          {isStepPassed ? `SOP 校验通过${step.confidence ? ` (${step.confidence}%)` : ''}` : isStepFailed ? 'SOP 校验不合规' : 'SOP 校验预警'}
                        </span>
                      </span>

                      {step.sopStandard && (
                        <span className="text-[9px] text-slate-500 font-mono truncate max-w-xs" title={step.sopStandard}>
                          规程标准: {step.sopStandard}
                        </span>
                      )}
                    </div>

                    {/* AI Verification Evidence */}
                    <div className={`p-2.5 rounded-xl border ${
                      isStepFailed
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : isStepWarning
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-blue-50/80 border-blue-200 text-blue-950'
                    }`}>
                      <div className="text-[9px] uppercase tracking-wider font-semibold flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-700 font-bold">AI 现场核验识别结果:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed break-words">
                        {step.aiEvidence}
                      </p>
                    </div>

                    {/* Step Snapshot Image */}
                    {step.snapshotUrl && (
                      <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 w-full shadow-xs">
                        <img 
                          src={step.snapshotUrl} 
                          referrerPolicy="no-referrer"
                          alt={step.title} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop';
                          }}
                          className="w-full h-32 object-cover opacity-95 transition-all duration-350" 
                        />
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-white border border-white/10">
                          <ImageIcon className="w-3 h-3 text-blue-400" />
                          步骤现场关键帧抓拍
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Back Button */}
          <div className="pt-3 pb-6 flex justify-center">
            <button
              onClick={() => setSelectedEventId(null)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span>返回全部 SOP 分析结果列表</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Standalone Major Task SOP Analysis Report Modal */}
      <SOPReportModal 
        isOpen={sopReportModalOpen} 
        initialTaskId={sopInitialTaskId}
        currentEvent={activeEvent}
        singleTaskOnly={Boolean(selectedEventId)}
        onClose={() => setSopReportModalOpen(false)} 
      />
    </motion.div>
  );
}
