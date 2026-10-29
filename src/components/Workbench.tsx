import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Settings as GearIcon, 
  Wrench, X, Sparkles, CheckCircle2, QrCode, Calendar,
  Clock, UserCheck, Shield, MapPin, BarChart3, Users, 
  FileText, PenTool, Monitor, Radio, MessageSquareText,
  Sliders, Video, BrainCircuit, Search, Layers, Play, Smartphone
} from 'lucide-react';
import { ViewState } from '../types';

interface WorkbenchProps {
  onNavigateToBadge: (view: ViewState) => void;
  onNavigateToDeviceList: (mode?: 'list' | 'intro') => void;
  onNavigateToPageFlow?: () => void;
}

export function Workbench({ onNavigateToBadge, onNavigateToDeviceList, onNavigateToPageFlow }: WorkbenchProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Helper custom icon renderers to closely match screenshot style
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f5f9] text-slate-800 pb-20 select-none">
      
      {/* Top Phone Status Bar (Faithful to Screenshot) */}
      <div className="pt-2.5 pb-1 px-4 flex items-center justify-between text-slate-800 text-[13px] font-semibold tracking-tight">
        <div className="flex items-center gap-2">
          <span>20:51</span>
          <div className="flex items-center gap-1 opacity-70">
            {/* Notification / App icons representation */}
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium opacity-80">
          <span>2.60 KB/s</span>
          <span className="px-1 py-0.2 bg-slate-200 rounded text-[9px]">HD1</span>
          <span>5G</span>
          <span>5G</span>
          <div className="flex items-center border border-slate-700 rounded-sm px-1 py-0.2 text-[9px] font-bold">
            51
          </div>
        </div>
      </div>

      {/* Top Navigation Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-[#f4f5f9]/90 backdrop-blur-md z-10">
        <button 
          onClick={() => setActiveModal('back_tip')}
          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">工作台</h1>
        <div className="w-8" />
      </div>

      {/* Main Sections List */}
      <div className="px-3.5 space-y-3.5 mt-1">


        {/* ========================================================================= */}
        {/* 1. 督察官 (ENTRY SECTION) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
          {/* Subtle gradient glow header */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <div 
            onClick={onNavigateToDeviceList}
            className="flex items-center justify-between cursor-pointer group pb-1"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                督察官
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                AI多模态
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* 5 Exposed Submenus */}
          <div className="grid grid-cols-4 gap-y-4 gap-x-1 pt-3.5 pb-1">
            
            {/* 1. 视频回看 */}
            <button
              onClick={() => onNavigateToBadge('dashboard')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] shadow-md shadow-blue-500/25 flex items-center justify-center text-white relative group-hover:shadow-lg transition-shadow">
                <Video className="w-6 h-6 stroke-[2.2]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <span className="text-[12px] font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                视频回看
              </span>
            </button>

            {/* 2. SOP监督 */}
            <button
              onClick={() => onNavigateToBadge('playback')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#0891b2] shadow-md shadow-cyan-500/25 flex items-center justify-center text-white relative group-hover:shadow-lg transition-shadow">
                <BrainCircuit className="w-6 h-6 stroke-[2.2]" />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[8px] font-extrabold px-1 rounded-full border border-white">
                  SOP
                </span>
              </div>
              <span className="text-[12px] font-medium text-slate-800 group-hover:text-cyan-600 transition-colors">
                SOP监督
              </span>
            </button>

            {/* 3. AI智搜 */}
            <button
              onClick={() => onNavigateToBadge('history')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#4338ca] shadow-md shadow-indigo-500/25 flex items-center justify-center text-white relative group-hover:shadow-lg transition-shadow">
                <Search className="w-6 h-6 stroke-[2.2]" />
                <Sparkles className="w-3 h-3 absolute top-1.5 right-1.5 text-amber-300 animate-spin [animation-duration:8s]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                AI智搜
              </span>
            </button>

            {/* 4. 模型配置 */}
            <button
              onClick={() => onNavigateToBadge('skills')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-md shadow-purple-500/25 flex items-center justify-center text-white group-hover:shadow-lg transition-shadow">
                <Layers className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800 group-hover:text-purple-600 transition-colors">
                模型配置
              </span>
            </button>

            {/* 5. 设备中心 */}
            <button
              onClick={() => onNavigateToDeviceList('list')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] shadow-md shadow-sky-500/25 flex items-center justify-center text-white relative group-hover:shadow-lg transition-shadow">
                <Smartphone className="w-6 h-6 stroke-[2.2]" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <span className="text-[12px] font-medium text-slate-800 group-hover:text-sky-600 transition-colors">
                设备中心
              </span>
            </button>

            {/* 6. 设备中心 (无设备空态) */}
            <button
              onClick={() => onNavigateToBadge('devices_empty')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm flex items-center justify-center text-slate-600 relative group-hover:shadow-md transition-shadow">
                <Smartphone className="w-6 h-6 stroke-[2]" />
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                  空态
                </span>
              </div>
              <span className="text-[12px] font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                无设备空态
              </span>
            </button>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. 访客管理 (VISITOR MANAGEMENT - FAITHFUL TO SCREENSHOT) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div 
            onClick={() => setActiveModal('访客管理中心')}
            className="flex items-center justify-between cursor-pointer group pb-1"
          >
            <h2 className="text-[16px] font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
              访客管理
            </h2>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div className="grid grid-cols-4 gap-y-4 gap-x-1 pt-3.5 pb-1">
            
            {/* 访客预约 */}
            <button
              onClick={() => setActiveModal('访客预约')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#00d2d3] to-[#01a3a4] shadow-sm flex items-center justify-center text-white relative">
                {/* Person avatar with badge */}
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center mx-auto mb-0.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="w-7 h-3 rounded-t-full bg-white mx-auto" />
                </div>
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                访客预约
              </span>
            </button>

            {/* 预约记录 */}
            <button
              onClick={() => setActiveModal('预约记录')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#00d2d3] to-[#01a3a4] shadow-sm flex items-center justify-center text-white relative">
                <FileText className="w-6 h-6 stroke-[2]" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-emerald-400 rounded-full flex items-center justify-center border border-white">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                预约记录
              </span>
            </button>

            {/* 来访登记 */}
            <button
              onClick={() => setActiveModal('来访登记')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#00d2d3] to-[#01a3a4] shadow-sm flex items-center justify-center text-white">
                <PenTool className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                来访登记
              </span>
            </button>

            {/* 访客设置 */}
            <button
              onClick={() => setActiveModal('访客设置')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#00d2d3] to-[#01a3a4] shadow-sm flex items-center justify-center text-white relative">
                <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <GearIcon className="w-3.5 h-3.5 absolute bottom-2 right-2 text-white" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                访客设置
              </span>
            </button>

            {/* 访客机 */}
            <button
              onClick={() => setActiveModal('访客机')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#00d2d3] to-[#01a3a4] shadow-sm flex items-center justify-center text-white">
                <Monitor className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                访客机
              </span>
            </button>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. 考勤管理 (ATTENDANCE MANAGEMENT - FAITHFUL TO SCREENSHOT) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div 
            onClick={() => setActiveModal('考勤管理中心')}
            className="flex items-center justify-between cursor-pointer group pb-1"
          >
            <h2 className="text-[16px] font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              考勤管理
            </h2>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div className="grid grid-cols-4 gap-y-4 gap-x-1 pt-3.5 pb-1">
            
            {/* 考勤打卡 */}
            <button
              onClick={() => setActiveModal('考勤打卡')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-sm flex items-center justify-center text-white">
                <MapPin className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                考勤打卡
              </span>
            </button>

            {/* 考勤统计 */}
            <button
              onClick={() => setActiveModal('考勤统计')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-sm flex items-center justify-center text-white">
                <BarChart3 className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                考勤统计
              </span>
            </button>

            {/* 考勤设置 */}
            <button
              onClick={() => setActiveModal('考勤设置')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-sm flex items-center justify-center text-white relative">
                <Sliders className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                考勤设置
              </span>
            </button>

            {/* 考勤人员范围 */}
            <button
              onClick={() => setActiveModal('考勤人员范围')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-sm flex items-center justify-center text-white">
                <UserCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                考勤人员范围
              </span>
            </button>

            {/* 考勤设备 */}
            <button
              onClick={() => setActiveModal('考勤设备')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-sm flex items-center justify-center text-white">
                <Radio className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                考勤设备
              </span>
            </button>

            {/* 考勤排班通行 */}
            <button
              onClick={() => setActiveModal('考勤排班通行')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-sm flex items-center justify-center text-white">
                <Calendar className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                考勤排班通行
              </span>
            </button>

            {/* AI 慧提效 */}
            <button
              onClick={() => setActiveModal('AI 慧提效')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-sm flex items-center justify-center text-white relative">
                <MessageSquareText className="w-6 h-6 stroke-[2]" />
                <Sparkles className="w-3 h-3 absolute top-1.5 right-1.5 text-amber-300" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                AI 慧提效
              </span>
            </button>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. 会议室管理 (MEETING ROOM MANAGEMENT - FAITHFUL TO SCREENSHOT) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div 
            onClick={() => setActiveModal('会议室管理中心')}
            className="flex items-center justify-between cursor-pointer group pb-1"
          >
            <h2 className="text-[16px] font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              会议室管理
            </h2>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div className="grid grid-cols-4 gap-y-4 gap-x-1 pt-3.5 pb-1">
            
            {/* 会议预约 */}
            <button
              onClick={() => setActiveModal('会议预约')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ee5253] shadow-sm flex items-center justify-center text-white">
                <Calendar className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                会议预约
              </span>
            </button>

            {/* 我的会议 */}
            <button
              onClick={() => setActiveModal('我的会议')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ee5253] shadow-sm flex items-center justify-center text-white">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                我的会议
              </span>
            </button>

            {/* 会议室管理 */}
            <button
              onClick={() => setActiveModal('会议室管理')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ee5253] shadow-sm flex items-center justify-center text-white">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                会议室管理
              </span>
            </button>

            {/* 会议水牌 */}
            <button
              onClick={() => setActiveModal('会议水牌')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ee5253] shadow-sm flex items-center justify-center text-white">
                <Monitor className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                会议水牌
              </span>
            </button>

            {/* 个性问候 */}
            <button
              onClick={() => setActiveModal('个性问候')}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ee5253] shadow-sm flex items-center justify-center text-white">
                <MessageSquareText className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[12px] font-medium text-slate-800">
                个性问候
              </span>
            </button>

          </div>
        </section>

      </div>

      {/* Floating Bottom Right Tool Button (from Screenshot) */}
      <button 
        onClick={() => setActiveModal('系统设置与工具箱')}
        className="fixed right-4 bottom-24 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-slate-300/80 shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 active:scale-90 transition-all z-20"
        title="工作台配置"
      >
        <Wrench className="w-5 h-5" />
      </button>

      {/* Interactive Modal Sheet for Non-Badge items */}
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
                  您正在访问智能协同工作台的 <strong className="text-slate-800">{activeModal}</strong> 模块。已接入企业级统一身份与设备调度总线。
                </p>

                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-800 space-y-1.5">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    推荐体验全新栏目「督察官」：
                  </div>
                  <p className="text-blue-700/90 leading-relaxed">
                    提供多模态第一视角音视频实时回看、SOP智能合规监督、AI语义检索与大模型配置等强大安监能力。
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  返回工作台
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
