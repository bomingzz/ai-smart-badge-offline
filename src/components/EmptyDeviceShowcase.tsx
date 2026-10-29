import React from 'react';
import { Scan, Smartphone, Info } from 'lucide-react';

interface EmptyDeviceShowcaseProps {
  onStartActivation: () => void;
}

export const EmptyDeviceShowcase: React.FC<EmptyDeviceShowcaseProps> = ({
  onStartActivation
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 py-8 text-center animate-fade-in select-none">
      
      {/* ========================================================================= */}
      {/* 1. ELEGANT EMPTY STATE ILLUSTRATION                                      */}
      {/* ========================================================================= */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft background pulse rings */}
        <div className="w-40 h-40 rounded-full bg-blue-50/80 animate-ping absolute opacity-60 pointer-events-none" />
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 border border-blue-200/60 flex items-center justify-center relative shadow-sm">
          
          {/* Hardware Silhouette Stylized Icon */}
          <div className="relative flex flex-col items-center">
            {/* Badge top lanyard connector */}
            <div className="w-6 h-2 rounded-t-sm bg-slate-300 border border-slate-400/50 mb-0.5" />
            
            {/* Badge Body */}
            <div className="w-14 h-20 rounded-xl bg-white border-2 border-slate-300 shadow-md flex flex-col items-center justify-between p-1.5 relative overflow-hidden">
              {/* Camera & Status dot */}
              <div className="w-full flex items-center justify-between px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="w-2 h-2 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>

              {/* Center empty dashed box */}
              <div className="w-9 h-9 rounded-lg border border-dashed border-blue-300 bg-blue-50/50 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-500/70" />
              </div>

              {/* Bottom logo line */}
              <div className="w-5 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Floating Plus/Scan badge */}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white">
              <Scan className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TEXT INFO (TITLE & DESCRIPTION)                                       */}
      {/* ========================================================================= */}
      <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
        暂未绑定智能工牌设备
      </h2>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
        当前账号尚未绑定任何第一视角穿戴终端设备。绑定后即可进行现场录像回放、SOP 实时合规审计与 AI 智搜。
      </p>

      {/* ========================================================================= */}
      {/* 3. PRIMARY CALL TO ACTION (BINDING ENTRANCE)                             */}
      {/* ========================================================================= */}
      <div className="w-full max-w-xs mb-8">
        <button
          onClick={onStartActivation}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Scan className="w-4 h-4 stroke-[2.5]" />
          <span>钉钉扫码激活工牌</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. SIMPLE 3-STEP QUICK GUIDE CARD                                         */}
      {/* ========================================================================= */}
      <div className="w-full max-w-xs bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-left shadow-xs">
        <div className="flex items-center gap-1.5 mb-2.5 text-slate-700 text-xs font-bold">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>工牌极简绑定步骤：</span>
        </div>
        
        <ul className="space-y-2 text-[11px] text-slate-500 leading-normal">
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <span>长按工牌右侧电源键 3 秒，前面板指示灯蓝灯亮起。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </span>
            <span>点击上方「钉钉扫码激活」，扫描工牌背面激光镭雕二维码。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </span>
            <span>听到「请按标记键连接」后，按压右侧标记键完成近场握手。</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
