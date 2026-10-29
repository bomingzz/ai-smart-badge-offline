import React from 'react';
import { motion } from 'motion/react';
import { Clock, Layers, Film, BrainCircuit } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export function Navigation({ currentView, onChange }: NavigationProps) {
  const navItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: '视频回看', icon: Film },
    { id: 'playback', label: 'SOP监督', icon: BrainCircuit },
    { id: 'history', label: 'AI智搜', icon: Clock },
    { id: 'skills', label: '模型配置', icon: Layers },
  ];

  return (
    <motion.div 
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe"
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 w-full max-w-md mx-auto px-6 py-3.5 rounded-t-3xl shadow-[0_-4px_25px_rgba(0,0,0,0.08)] flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer"
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-blue-50 text-blue-600 shadow-xs scale-105' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[11px] font-medium tracking-wide transition-colors duration-200 ${
                isActive ? 'text-blue-600 font-semibold' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
