import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Radio, Battery, Volume2, VolumeX, Square, X, 
  Sparkles, CheckCircle2, XCircle, Clock, Image as ImageIcon, 
  ShieldAlert, Layers, RefreshCw, AlertCircle
} from 'lucide-react';
import { Device, TraditionalClip } from '../types';
import { SOPAnalysisTemplate } from '../utils/sopSelection';

interface LiveRecordingOverlayProps {
  device: Device;
  isOpen: boolean;
  onClose: () => void;
  onStopAndSave: (durationSecs: number) => void;
  sopTemplate?: SOPAnalysisTemplate;
}

export function LiveRecordingOverlay({ 
  device, 
  isOpen, 
  onClose, 
  onStopAndSave,
  sopTemplate
}: LiveRecordingOverlayProps) {
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const rtcVideoRef = useRef<HTMLVideoElement>(null);

  // Auto increment duration when open
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setDuration(0);
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-0 max-w-md mx-auto z-50 bg-[#f8fafc] flex flex-col shadow-2xl overflow-hidden select-none"
    >
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER                                                             */}
      {/* ========================================================================= */}
      <header className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between z-20 shrink-0 border-b border-slate-800">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-slate-300 hover:text-white active:scale-95 transition-all text-xs font-medium cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>退出</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-white tracking-tight">
            第一视角实时录制 & 在线质检
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700">
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
          <span>{device.battery}%</span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. TOP SECTION: WEBRTC REAL-TIME PLAYER BOX (RTC 播放框)                   */}
      {/* ========================================================================= */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden shrink-0 border-b border-slate-200">
        <video
          ref={rtcVideoRef}
          src={
            device.id === 'd1'
              ? 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-40262-large.mp4'
              : device.id === 'd3'
              ? 'https://assets.mixkit.co/videos/preview/mixkit-construction-worker-working-with-wires-41619-large.mp4'
              : 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-technician-working-on-a-motherboard-42218-large.mp4'
          }
          poster="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60 pointer-events-none" />

        {/* Top Left: Blinking REC Badge & Duration */}
        <div className="absolute top-3 left-3 bg-rose-950/90 backdrop-blur-md border border-rose-500/60 px-3 py-1 rounded-full text-[11px] font-mono text-rose-200 flex items-center gap-2 z-10 shadow-lg shadow-rose-950/50">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <span className="font-bold tracking-wider text-rose-300">REC</span>
          <span className="font-bold text-white tracking-widest">{formatTime(duration)}</span>
        </div>

        {/* Top Right: WebRTC Telemetry Badge */}
        <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 z-10 shadow-md">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>WebRTC 1080P | 24ms</span>
        </div>

        {/* Center Camera Crosshair / Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="w-16 h-16 border border-white/50 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
          </div>
        </div>

        {/* Bottom Bar overlay: Live Audio & Stop Button */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 text-[10px] text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-mono">
            <span>DEVICE: {device.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg backdrop-blur-md border border-slate-800 transition-colors cursor-pointer"
              title={isMuted ? '取消静音' : '静音'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <button
              onClick={() => onStopAndSave(duration)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-600/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <Square className="w-3 h-3 fill-white" />
              <span>结束录制</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM SECTION: REAL-TIME SOP ANALYSIS TIMELINE (SOP 实时分析过程)      */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-[#f8fafc] relative">
        
        {/* Top SOP Title Chip */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{sopTemplate ? sopTemplate.name : '园区消防通道 SOP'}</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            共 {sopTemplate ? sopTemplate.stepsCount : 3} 个规程核验步
          </span>
        </div>

        {/* Continuous Vertical Timeline Container */}
        <div className="relative pl-6 space-y-6 pt-1">
          
          {/* Vertical continuous blue line down the left (Screenshot style) */}
          <div className="absolute top-2 bottom-8 left-[11px] w-0.5 bg-blue-500" />

          {/* ===================================================================== */}
          {/* STEP 1: 消防通道 2.4 米净空巡检规程 (不合规 - 完美契合截图)              */}
          {/* ===================================================================== */}
          <div className="relative space-y-2">
            
            {/* Step 1 Milestone Circle on Timeline (- red icon) */}
            <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center shadow-xs ring-4 ring-[#f8fafc] z-10">
              <span className="leading-none mb-0.5">-</span>
            </div>

            {/* Step 1 Title Pill (Capsule) */}
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-bold shadow-xs">
                <Sparkles className="w-3 h-3 text-rose-200" />
                <span>步骤一：消防通道 2.4 米净空巡检规程</span>
              </div>
            </div>

            {/* Time Interval Stamp */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 pl-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>07:15:00 - 07:15:10 (10s)</span>
            </div>

            {/* Step 1 Detail Card Container (Rose border & soft pink bg) */}
            <div className="bg-white rounded-2xl p-3.5 border border-rose-200/90 shadow-sm space-y-2.5 relative overflow-hidden">
              
              {/* Status Badge: SOP 校验不合规 */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">
                <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>SOP 校验不合规</span>
              </div>

              {/* Standard specification text */}
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-500 font-medium">规程标准：</span>
                消防主通道全天候严禁堆放任何纸箱、托盘、装卸货物或违停设备。
              </p>

              {/* AI Real-time Inspection Result Box (Soft Pink) */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1.5">
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI 现场核验识别结果：</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  视觉模型识别到 <span className="font-bold text-rose-600">3 堆木质托盘与装卸纸箱占用通道</span>，实际剩余通行宽度 <span className="font-bold text-rose-600">1.1 米</span>（标准≥2.4米），判定为隐患占用。
                </p>
              </div>

              {/* Step Keyframe Snapshot Photo */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop" 
                  alt="消防通道隐患抓拍"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-blue-300" />
                  <span>步骤现场关键帧抓拍</span>
                </div>
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* STEP 2: 边缘 AI 联动告警与工单自动下发 (通过 - 契合截图)                 */}
          {/* ===================================================================== */}
          <div className="relative space-y-2">
            
            {/* Step 2 Milestone Circle on Timeline (= green icon) */}
            <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs ring-4 ring-[#f8fafc] z-10">
              <span className="leading-none mb-0.5">=</span>
            </div>

            {/* Step 2 Title Pill (Blue/Indigo Capsule) */}
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs">
                <Sparkles className="w-3 h-3 text-blue-200" />
                <span>步骤二：边缘 AI 联动告警与工单自动下发</span>
              </div>
            </div>

            {/* Time Interval Stamp */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 pl-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>07:15:11 - 07:15:20 (9s)</span>
            </div>

            {/* Step 2 Detail Card Container (Light Blue border) */}
            <div className="bg-white rounded-2xl p-3.5 border border-blue-200/90 shadow-sm space-y-2.5 relative overflow-hidden">
              
              {/* Status Badge: SOP 校验通过 (100%) */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>SOP 校验通过 (100%)</span>
              </div>

              {/* Standard specification text */}
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-500 font-medium">规程标准：</span>
                检测到占用超 5 分钟，边缘网关须向园区安保中心与保洁主管发送实时告警。
              </p>

              {/* AI Real-time Inspection Result Box (Soft Blue) */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI 现场核验识别结果：</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  系统于 07:15:12 生成整改工单 <span className="font-mono font-bold text-blue-700">#WO-8821</span>，喇叭播放“消防通道严禁堆物”提示音，保洁人员开始响应。
                </p>
              </div>

              {/* Step Keyframe Snapshot Photo */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" 
                  alt="现场工单响应抓拍"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-blue-300" />
                  <span>步骤现场关键帧抓拍</span>
                </div>
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* STEP 3: 现场隐患复验与通道闭环恢复 (实时动态进行中)                       */}
          {/* ===================================================================== */}
          <div className="relative space-y-2">
            
            {/* Step 3 Milestone Circle on Timeline (Pulsing Amber) */}
            <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-xs ring-4 ring-[#f8fafc] z-10 animate-pulse">
              <span className="leading-none mb-0.5">三</span>
            </div>

            {/* Step 3 Title Pill (Amber Capsule) */}
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-200 animate-spin [animation-duration:6s]" />
                <span>步骤三：现场隐患复验与通道闭环恢复</span>
              </div>
            </div>

            {/* Dynamic Time Stamp */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-600 pl-1 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>07:15:21 - 正在流式核验中 ({formatTime(duration)})</span>
            </div>

            {/* Step 3 Card: Real-time Analysis State */}
            <div className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-sm space-y-2.5 relative overflow-hidden">
              
              {/* Status Badge: 实时分析中 */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span>正在实时抽帧与多模态声纹审计...</span>
              </div>

              {/* Standard text */}
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-500 font-medium">规程标准：</span>
                保洁作业员就位后必须于 3 分钟内清空阻碍物，通行宽度恢复 ≥2.4 米并拍照闭环。
              </p>

              {/* Real-time Streaming Pulse Box */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    端云多模态协同推理中
                  </span>
                  <span className="font-mono text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                    延迟 24ms
                  </span>
                </div>

                {/* Progress bar animation */}
                <div className="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed">
                  当前第一视角视频正在持续传入云端行业大模型，检测到保洁人员正在搬移托盘...
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM ACTION CONTROL BAR                                              */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 text-xs font-bold transition-all cursor-pointer"
        >
          放弃录制
        </button>

        <button
          onClick={() => onStopAndSave(duration)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all cursor-pointer"
        >
          <Square className="w-3.5 h-3.5 fill-white" />
          <span>结束录制并完成质检 ({formatTime(duration)})</span>
        </button>
      </div>

    </motion.div>
  );
}
