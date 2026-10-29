import React from 'react';
import { Power, Bookmark, CheckCircle2, Eye, Shield, Sparkles, Wifi } from 'lucide-react';
import { motion } from 'motion/react';
import smartBadgeImg from '../assets/moredian_smart_badge.png';

interface SmartBadgeProductDiagramProps {
  mode: 'power_off' | 'power_on' | 'handshake' | 'welcome';
  isRechecking?: boolean;
  onPowerClick?: () => void;
  onMarkClick?: () => void;
  className?: string;
}

export const SmartBadgeProductDiagram: React.FC<SmartBadgeProductDiagramProps> = ({
  mode,
  isRechecking = false,
  onPowerClick,
  onMarkClick,
  className = ''
}) => {
  const isPowerActive = mode !== 'power_off' || isRechecking;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Outer Stage with subtle lighting and soft shadow */}
      <div className={`relative w-full max-w-[340px] flex items-center justify-center py-1 transition-all ${
        mode === 'power_off' ? 'pl-16 sm:pl-20' : (mode === 'handshake' || mode === 'power_on') ? 'pr-16 sm:pr-20' : ''
      }`}>
        {/* Hardware Photo Canvas */}
        <div className="relative w-[145px] sm:w-[160px] rounded-[28px] overflow-visible shadow-2xl shadow-slate-900/25 transition-transform duration-300">
          {/* Authentic Smart Badge Photo */}
          <img
            src={smartBadgeImg}
            alt="魔点科技智能AI工牌硬件示意图"
            className="w-full h-auto object-contain block drop-shadow-xl"
            draggable={false}
          />

          {/* ======================================================== */}
          {/* HOTSPOT 1: 顶部感应模组 - 蓝色工作指示灯 (Blue Work LED) */}
          {/* Proportional Position: top ~8.7%, left ~78.8% */}
          {/* ======================================================== */}
          <div 
            className="absolute top-[8.7%] left-[78.8%] -translate-x-1/2 -translate-y-1/2 z-20"
            title="前面板工作指示灯 (蓝灯)"
          >
            {isPowerActive ? (
              /* Active: 蓝灯闪烁 / 呼吸发光 */
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-cyan-400 opacity-75" />
                <span className="animate-pulse relative inline-flex rounded-full h-2 w-2 bg-sky-400 shadow-[0_0_10px_#38bdf8,0_0_16px_#0284c7]" />
              </div>
            ) : (
              /* Inactive: 熄灭状态 */
              <div className="relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700/80 border border-slate-600 shadow-inner" />
              </div>
            )}

            {/* LED Status Callout Tag (向右上折线延伸) */}
            <div className="absolute -top-7 -right-2 whitespace-nowrap z-30 pointer-events-none">
              <div className="flex flex-col items-end">
                <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold border shadow-xs backdrop-blur-md transition-all ${
                  isPowerActive 
                    ? 'bg-sky-500/95 text-white border-sky-300 shadow-sky-500/30 animate-pulse' 
                    : 'bg-slate-800/90 text-slate-300 border-slate-700'
                }`}>
                  {isPowerActive ? '● 蓝灯闪烁 (就绪)' : '○ 指示灯：熄灭'}
                </div>
                <div className="w-px h-2 bg-cyan-400/80 mr-2" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* HOTSPOT 2: 顶部防窥滑盖摄像头标注 (Privacy Slider & Camera) */}
          {/* ======================================================== */}
          <div 
            className="absolute top-[8.7%] left-[58%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-80"
            title="1080P FPV 镜头与实体防窥滑盖"
          >
            <div className="w-3.5 h-3.5 rounded-full border border-slate-400/30" />
          </div>

          {/* ======================================================== */}
          {/* HOTSPOT 3: 左侧物理按键 (电源键 - 长按3秒开机) */}
          {/* Proportional Position: top ~17.5%, left ~0% (far left edge) */}
          {/* ======================================================== */}
          {mode === 'power_off' && (
            <div className="absolute top-[17.5%] -left-1 -translate-y-1/2 z-30">
              <div className="relative flex items-center">
                {/* Callout Label Box (向左延伸) */}
                <div className="absolute right-6 whitespace-nowrap z-40">
                  <div className="flex items-center gap-1 flex-row-reverse">
                    <div className="w-2.5 h-px bg-amber-400 shadow-xs" />
                    <button
                      type="button"
                      onClick={onPowerClick}
                      className="px-2 py-0.5 rounded-md bg-slate-900/95 hover:bg-slate-800 text-amber-400 border border-amber-400/60 shadow-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                    >
                      <Power className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                      <span>长按电源键 3秒</span>
                      <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded">左侧键</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Clickable Hotspot on the Left Edge */}
                <button
                  type="button"
                  onClick={onPowerClick}
                  className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
                  title="点击模拟长按左侧电源键开机"
                >
                  {/* Ping Ring */}
                  <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-amber-400 opacity-80" />
                  <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white shadow-md shadow-amber-500/50 group-hover:scale-110 group-active:scale-95 transition-transform">
                    <Power className="w-3 h-3 animate-pulse" />
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HOTSPOT 4: 右侧物理按键 (标记键 / 连接握手键) */}
          {/* Proportional Position: top ~17.5%, right ~0% (far right edge) */}
          {/* ======================================================== */}
          <div className="absolute top-[17.5%] -right-1 -translate-y-1/2 z-30">
            {mode === 'handshake' && (
              /* 握手态：指引轻按右侧【标记】键 */
              <div className="relative flex items-center">
                {/* Interactive Clickable Hotspot */}
                <button
                  type="button"
                  onClick={onMarkClick}
                  className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
                  title="点击模拟轻按右侧标记键"
                >
                  {/* Blue Radar Ripple */}
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-85" />
                  <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/60 group-hover:scale-110 group-active:scale-95 transition-transform">
                    <Bookmark className="w-3.5 h-3.5 animate-bounce" />
                  </span>
                </button>

                {/* Callout Label Box (向右延伸) */}
                <div className="absolute left-7 whitespace-nowrap z-40">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-px bg-blue-500 shadow-xs" />
                    <button
                      type="button"
                      onClick={onMarkClick}
                      className="px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/80 shadow-xl shadow-blue-600/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 animate-pulse"
                    >
                      <Bookmark className="w-2.5 h-2.5 text-amber-300" />
                      <span>轻按右侧【标记】键</span>
                      <span className="text-[8px] bg-white/20 text-white px-1 py-0.2 rounded">右侧键</span>
                    </button>
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* ======================================================== */}
          {/* Card Screen Status Overlay */}
          {/* ======================================================== */}
          {mode === 'welcome' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-[18%_8%_12%_8%] rounded-2xl bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-3 z-30 border border-emerald-500/40 shadow-2xl"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-1.5 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                ACTIVATED
              </span>
              <span className="text-xs font-bold text-white mt-0.5">
                设备绑定激活成功
              </span>
              <span className="text-[9px] text-slate-400 mt-1">
                魔点 AI 智能工牌已就绪
              </span>
            </motion.div>
          )}

          {/* Bottom Ground Shadow */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-slate-900/30 rounded-full blur-md -z-10" />
        </div>
      </div>

      {/* Subtext Prompt */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        <span>硬件交互示意图：支持直接点击机身侧键进行模拟操作</span>
      </div>
    </div>
  );
};
