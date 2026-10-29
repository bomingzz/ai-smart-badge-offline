import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Sparkles, Video, BrainCircuit, 
  Search, Layers, Smartphone, AlertTriangle, ShieldCheck, 
  Zap, Wrench, X, Play, Eye, Users, Cpu, Database, CheckCircle2
} from 'lucide-react';
import { ViewState } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HomeTabProps {
  onNavigateToBadge: (view: ViewState) => void;
  onNavigateToWorkbench: () => void;
}

interface SopTemplateStat {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  count: number;
  sharePercent: number;
  complianceRate: number;
  alarmCount: number;
  color: string;
  barGradient: string;
}

export function HomeTab({ onNavigateToBadge, onNavigateToWorkbench }: HomeTabProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeDonutSlice, setActiveDonutSlice] = useState<string>('门禁机 41');
  const [activeSopFilter, setActiveSopFilter] = useState<'all' | 'count' | 'rate'>('all');

  // SOP Template Statistics Data (Analysis Count + Compliance Rate)
  const sopTemplatesData: SopTemplateStat[] = [
    {
      id: 'ck',
      name: '餐饮后厨生鲜与切配 SOP',
      shortName: '餐饮后厨SOP',
      icon: '🍳',
      count: 86,
      sharePercent: 46.2,
      complianceRate: 98.8,
      alarmCount: 0,
      color: '#3b82f6',
      barGradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'ee',
      name: '高压电气配电柜定检与LOTO',
      shortName: '高压电工SOP',
      icon: '⚡',
      count: 52,
      sharePercent: 28.0,
      complianceRate: 96.2,
      alarmCount: 1,
      color: '#f59e0b',
      barGradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 'sf',
      name: '园区消防通道与周界巡检',
      shortName: '消防巡检SOP',
      icon: '🚨',
      count: 34,
      sharePercent: 18.3,
      complianceRate: 100,
      alarmCount: 0,
      color: '#10b981',
      barGradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'mf',
      name: '制造流水线工序防呆复核',
      shortName: '制造装配SOP',
      icon: '⚙️',
      count: 14,
      sharePercent: 7.5,
      complianceRate: 100,
      alarmCount: 0,
      color: '#8b5cf6',
      barGradient: 'from-purple-500 to-violet-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f2f4fb] text-slate-800 pb-20 select-none">
      
      {/* Top Phone Status Bar (Faithful to Screenshot) */}
      <div className="pt-2.5 pb-1 px-4 flex items-center justify-between text-slate-800 text-[13px] font-semibold tracking-tight">
        <div className="flex items-center gap-2">
          <span>10:40</span>
          <div className="flex items-center gap-1 opacity-70">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium opacity-80">
          <span>1.57 MB/s</span>
          <span className="px-1 py-0.2 bg-slate-200 rounded text-[9px]">HD</span>
          <span className="px-1 py-0.2 bg-slate-200 rounded text-[9px]">HD</span>
          <span>5G</span>
          <div className="flex items-center border border-slate-700 rounded-sm px-1 py-0.2 text-[9px] font-bold">
            58
          </div>
        </div>
      </div>

      {/* Top Navigation Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-[#f2f4fb]/90 backdrop-blur-md z-10">
        <button 
          onClick={onNavigateToWorkbench}
          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">首页</h1>
        <div className="w-8" />
      </div>

      {/* Main Content Body */}
      <div className="px-3.5 space-y-3.5 mt-1">

        {/* ========================================================================= */}
        {/* CARD 1: 督察官 • 智能安监与 SOP 统计看板                                */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
          {/* Top subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />

          {/* Header */}
          <div 
            onClick={() => onNavigateToBadge('dashboard')}
            className="flex items-center justify-between cursor-pointer group pb-3 border-b border-slate-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="text-[16px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                督察官
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
                AI多模态安监
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
              <span className="text-xs text-slate-400 group-hover:text-blue-600 font-medium">进入工牌</span>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3 Core ZhiJian Badge Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 pb-3">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">今日核验(次)</span>
              <span className="text-[26px] font-extrabold text-slate-900 tracking-tight mt-0.5 font-sans">
                186
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">SOP合规率</span>
              <span className="text-[26px] font-extrabold text-emerald-600 tracking-tight mt-0.5 font-sans">
                98.5%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">违规告警</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[26px] font-extrabold text-amber-600 tracking-tight font-sans">
                  1
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                  待复核
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* NEW SECTION: SOP 分析模板的分析次数与合规率统计图                         */}
          {/* ========================================================================= */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-900">SOP 模板分析与合规率分布</h3>
                <span className="text-[10px] text-slate-400 font-mono">今日</span>
              </div>
              <div className="flex items-center text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                <span>共 4 项分析模版</span>
              </div>
            </div>

            {/* SOP Templates Analysis & Compliance Statistics List/Bars */}
            <div className="space-y-2.5">
              {sopTemplatesData.map((sop) => (
                <div 
                  key={sop.id}
                  onClick={() => onNavigateToBadge('playback')}
                  className="p-2.5 bg-slate-50/70 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition-all cursor-pointer group"
                >
                  {/* Row 1: Name, Count and Compliance Rate */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-sm">{sop.icon}</span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {sop.shortName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Analysis Count */}
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {sop.count} <span className="text-[10px] font-normal text-slate-400">次 ({sop.sharePercent}%)</span>
                      </span>

                      {/* Compliance Rate Badge */}
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                        sop.complianceRate === 100 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : sop.complianceRate >= 98
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        合规 {sop.complianceRate}%
                      </span>

                      {/* Alarm tag if any */}
                      {sop.alarmCount > 0 && (
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                          {sop.alarmCount} 告警
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Visual Progress Volume Bar */}
                  <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${sop.barGradient} transition-all duration-500`}
                      style={{ width: `${(sop.count / 86) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom summary link */}
            <div 
              onClick={() => onNavigateToBadge('playback')}
              className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              <span>查看多模态 SOP 视频核验与诊断报告</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CARD 2: 人员管理 (PERSONNEL MANAGEMENT - EXACT AS SCREENSHOT)             */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          {/* Header */}
          <div 
            onClick={() => setActiveModal('人员管理中心')}
            className="flex items-center justify-between cursor-pointer group pb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-200/60">
                {/* Face scan icon */}
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full border-2 border-emerald-500" />
                </div>
              </div>
              <h2 className="text-[16px] font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                人员管理
              </h2>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* 3 Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">总人数</span>
              <span className="text-[28px] font-extrabold text-slate-900 tracking-tight mt-0.5 font-sans">
                669
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">已录脸</span>
              <span className="text-[28px] font-extrabold text-slate-900 tracking-tight mt-0.5 font-sans">
                142
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">未录脸</span>
              <span className="text-[28px] font-extrabold text-slate-900 tracking-tight mt-0.5 font-sans">
                527
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CARD 3: 设备管理 (DEVICE MANAGEMENT - EXACT AS SCREENSHOT)               */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          {/* Header */}
          <div 
            onClick={() => setActiveModal('设备管理中心')}
            className="flex items-center justify-between cursor-pointer group pb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200/60">
                <Cpu className="w-4 h-4" />
              </div>
              <h2 className="text-[16px] font-bold text-teal-600 group-hover:text-teal-700 transition-colors">
                设备管理
              </h2>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* 3 Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-1 pb-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">设备总数</span>
              <span className="text-[28px] font-extrabold text-slate-900 tracking-tight mt-0.5 font-sans">
                74
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">在线</span>
              <span className="text-[28px] font-extrabold text-slate-900 tracking-tight mt-0.5 font-sans">
                3
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">离线</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[28px] font-extrabold text-[#f97316] tracking-tight font-sans">
                  71
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium flex items-center gap-0.5 whitespace-nowrap">
                  <span>⚠️</span> 影响使用
                </span>
              </div>
            </div>
          </div>

          {/* Sub-section: 设备类型分布 */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 mb-3">设备类型分布</h3>

            <div className="flex items-center justify-between">
              {/* Left Legend */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs font-medium text-slate-700">
                <div 
                  onClick={() => setActiveDonutSlice('门禁机 41')}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600"
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#3b82f6] flex-shrink-0" />
                  <span>门禁机 41</span>
                </div>
                <div 
                  onClick={() => setActiveDonutSlice('其他 7')}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-pink-600"
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#ec4899] flex-shrink-0" />
                  <span>其他 11</span>
                </div>
                <div 
                  onClick={() => setActiveDonutSlice('门锁 1')}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-sky-600"
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#38bdf8] flex-shrink-0" />
                  <span>门锁 1</span>
                </div>
                <div 
                  onClick={() => setActiveDonutSlice('督察官 4')}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-600"
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#06b6d4] flex-shrink-0" />
                  <span>督察官 4</span>
                </div>
                <div 
                  onClick={() => setActiveDonutSlice('考勤机 20')}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-amber-600"
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#f59e0b] flex-shrink-0" />
                  <span>考勤机 20</span>
                </div>
                <div 
                  onClick={() => setActiveDonutSlice('核验机 1')}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-purple-600"
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#8b5cf6] flex-shrink-0" />
                  <span>核验机 1</span>
                </div>
              </div>

              {/* Right Donut Ring Chart */}
              <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                  
                  {/* Segment 1: 门禁机 (41/74 = 55.4%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="18"
                    strokeDasharray="132 238"
                    strokeDashoffset="0"
                    className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  />
                  
                  {/* Segment 2: 考勤机 (20/74 = 27%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    strokeDasharray="64 238"
                    strokeDashoffset="-132"
                    className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  />

                  {/* Segment 3: 其他/工牌/门锁 (13/74 = 17.6%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="18"
                    strokeDasharray="42 238"
                    strokeDashoffset="-196"
                    className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[11px] text-slate-500 font-medium leading-none">智能设备</span>
                  <span className="text-[20px] font-extrabold text-slate-900 font-sans leading-tight">74</span>
                </div>

                {/* Floating active slice tooltip (From Screenshot) */}
                <div className="absolute -bottom-1 left-2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                  {activeDonutSlice}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CARD 4: 数据权益 (DATA USAGE - EXACT AS SCREENSHOT)                       */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          {/* Header */}
          <div 
            onClick={() => setActiveModal('数据存储权益与用量')}
            className="flex items-center justify-between cursor-pointer group pb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200/60">
                {/* Diamond icon representation */}
                <span className="text-sm">💎</span>
              </div>
              <h2 className="text-[16px] font-bold text-teal-600 group-hover:text-teal-700 transition-colors">
                数据权益
              </h2>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Key Metric: 数据存储总量 */}
          <div className="flex flex-col pt-1 pb-4">
            <span className="text-xs text-slate-500 font-medium">数据存储总量</span>
            <span className="text-[28px] font-extrabold text-slate-900 tracking-tight mt-0.5 font-sans">
              364015
            </span>
          </div>

          {/* Sub-section: 月度数据存储用量统计 */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">月度数据存储用量统计</h3>
              <span className="text-[11px] text-slate-400">单位（条）</span>
            </div>

            {/* Monthly Bar Chart */}
            <div className="pt-2 pb-1">
              <div className="relative h-28 w-full">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>350,000</span>
                    <div className="flex-1 border-b border-dashed border-slate-200 ml-2" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>300,000</span>
                    <div className="flex-1 border-b border-dashed border-slate-200 ml-2" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>0</span>
                    <div className="flex-1 border-b border-slate-200 ml-2" />
                  </div>
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-end pr-8">
                  {/* August Bar */}
                  <div className="flex flex-col items-center gap-1 group">
                    <span className="text-[11px] font-bold text-blue-700 font-mono">
                      31.49万
                    </span>
                    <div className="w-5 h-20 bg-[#3b82f6] rounded-t-sm group-hover:bg-blue-700 transition-colors" />
                    <span className="text-[10px] text-slate-500 font-medium">8月</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>包含督察官第一视角录像与多模态 SOP 质检留档</span>
                <span className="text-emerald-600 font-semibold">存储健康 99.9%</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Floating Bottom Right Tool Button (from Screenshot) */}
      <button 
        onClick={() => setActiveModal('系统设置与工具箱')}
        className="fixed right-4 bottom-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-slate-300/80 shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 active:scale-90 transition-all z-20"
        title="系统工具"
      >
        <Wrench className="w-5 h-5" />
      </button>

      {/* Interactive Modal Sheet */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 relative z-10 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{activeModal}</h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3 text-slate-600 text-sm space-y-3">
                <p className="leading-relaxed">
                  您正在查看 <strong className="text-slate-800">{activeModal}</strong> 数据看板。数据已与企业物联中台及「督察官」端侧同步。
                </p>

                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-800 space-y-1.5">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    督察官实时安监：
                  </div>
                  <p className="text-blue-700/90 leading-relaxed">
                    工牌所采集的第一视角高清音视频、SOP 流程合规打标及告警工单均已纳入统一大数据存储与索引池。
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    onNavigateToBadge('dashboard');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-95 shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  进入督察官
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
