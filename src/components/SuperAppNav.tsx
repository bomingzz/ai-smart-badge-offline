import React from 'react';
import { Home, User } from 'lucide-react';
import { SuperAppTab } from '../types';

interface SuperAppNavProps {
  currentTab: SuperAppTab;
  onChangeTab: (tab: SuperAppTab) => void;
}

export function SuperAppNav({ currentTab, onChangeTab }: SuperAppNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe">
      <div className="bg-white/98 backdrop-blur-md border-t border-slate-200/90 w-full max-w-md mx-auto px-6 py-2 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        
        {/* 1. 首页 */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center gap-1 min-w-[56px] py-1 cursor-pointer transition-colors ${
            currentTab === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[11px] ${currentTab === 'home' ? 'font-semibold' : 'font-normal'}`}>
            首页
          </span>
        </button>

        {/* 2. 工作台 */}
        <button
          onClick={() => onChangeTab('workbench')}
          className={`flex flex-col items-center gap-1 min-w-[56px] py-1 cursor-pointer transition-colors ${
            currentTab === 'workbench' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {/* 4 squares icon matching the screenshot */}
          <div className="w-5 h-5 grid grid-cols-2 gap-0.5 p-0.5">
            <div className={`rounded-xs ${currentTab === 'workbench' ? 'bg-blue-600' : 'bg-slate-500'}`} />
            <div className={`rounded-xs ${currentTab === 'workbench' ? 'bg-blue-600' : 'bg-slate-500'}`} />
            <div className={`rounded-xs ${currentTab === 'workbench' ? 'bg-blue-600' : 'bg-slate-500'}`} />
            <div className={`rounded-xs ${currentTab === 'workbench' ? 'bg-blue-600' : 'bg-slate-500'}`} />
          </div>
          <span className={`text-[11px] ${currentTab === 'workbench' ? 'font-semibold' : 'font-normal'}`}>
            工作台
          </span>
        </button>

        {/* 3. 智能场景 */}
        <button
          onClick={() => onChangeTab('smart_scene')}
          className={`flex flex-col items-center gap-1 min-w-[56px] py-1 cursor-pointer transition-colors ${
            currentTab === 'smart_scene' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {/* (AI) circular icon matching the screenshot */}
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold ${
            currentTab === 'smart_scene' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-slate-500 text-slate-500'
          }`}>
            AI
          </div>
          <span className={`text-[11px] ${currentTab === 'smart_scene' ? 'font-semibold' : 'font-normal'}`}>
            智能场景
          </span>
        </button>

        {/* 4. 我的 */}
        <button
          onClick={() => onChangeTab('mine')}
          className={`flex flex-col items-center gap-1 min-w-[56px] py-1 cursor-pointer transition-colors ${
            currentTab === 'mine' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'mine' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[11px] ${currentTab === 'mine' ? 'font-semibold' : 'font-normal'}`}>
            我的
          </span>
        </button>

      </div>
    </div>
  );
}
