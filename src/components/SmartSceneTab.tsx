import React from 'react';
import { 
  Sparkles, ShieldCheck, Flame, Utensils, Zap, 
  ChevronRight, ArrowRight, Video, BrainCircuit 
} from 'lucide-react';
import { ViewState } from '../types';

interface SmartSceneTabProps {
  onNavigateToBadge: (view: ViewState) => void;
}

export function SmartSceneTab({ onNavigateToBadge }: SmartSceneTabProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f5f9] text-slate-800 pb-24 select-none px-4 pt-6">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            AI
          </div>
          <h1 className="text-lg font-bold text-slate-900">智能场景中心</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          基于多模态大模型与端边协同的产业级 AI 场景矩阵
        </p>
      </div>

      <div className="space-y-3.5">
        
        {/* 场景 1: 督察官 - 高危作业安全 */}
        <div 
          onClick={() => onNavigateToBadge('playback')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:border-blue-400 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> 高危电力场景
            </span>
            <span className="text-xs text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
              立即监督 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
            督察官 • 高压配电定检与 LOTO 锁闭审计
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            佩戴工牌以第一视角实时识别高压绝缘手套、安全帽穿戴及三相验电操作合规性，毫秒级拦截零容忍安全隐患。
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> AI 模型算法 v4.0 运行中
            </span>
            <span className="font-mono text-slate-400">实时延迟 &lt; 200ms</span>
          </div>
        </div>

        {/* 场景 2: 督察官 - 餐饮后厨食安 */}
        <div 
          onClick={() => onNavigateToBadge('playback')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:border-blue-400 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-cyan-500" /> 餐饮食安场景
            </span>
            <span className="text-xs text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
              立即监督 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
            督察官 • 明厨亮灶与生熟切配 SOP 校验
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            自动捕捉生熟刀具交叉污染、冷作间超时操作、口罩帽子卫生防护及燃气明火状态，保障食品安全全流程闭环。
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 食安合规引擎已部署
            </span>
            <span className="font-mono text-slate-400">抓拍率 99.2%</span>
          </div>
        </div>

        {/* 场景 3: 园区智能巡检 */}
        <div 
          onClick={() => onNavigateToBadge('dashboard')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:border-blue-400 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Flame className="w-3 h-3 text-purple-500" /> 园区消防安防
            </span>
            <span className="text-xs text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
              查看录像 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
            督察官 • 消防通道净空与周界巡逻雷达
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            巡检人员佩戴智能记录仪快速行进，AI 自动对违停车辆、消防门闭锁及杂物占用进行空间三维测算并生成工单。
          </p>
        </div>

      </div>
    </div>
  );
}
