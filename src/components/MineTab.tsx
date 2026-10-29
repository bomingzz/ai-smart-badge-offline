import React from 'react';
import { 
  User, Shield, Smartphone, QrCode, ChevronRight, 
  Settings, Award, Sparkles, LogOut, CheckCircle2, Lock
} from 'lucide-react';
import { ViewState } from '../types';

interface MineTabProps {
  onNavigateToBadge: (view: ViewState) => void;
  onNavigateToDeviceList: (mode?: 'list' | 'intro') => void;
}

export function MineTab({ onNavigateToBadge, onNavigateToDeviceList }: MineTabProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f5f9] text-slate-800 pb-24 select-none px-4 pt-6">
      
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            张
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">张工 (建国)</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                安全总监
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">工业安监与智能化运营部</p>
            <p className="text-[10px] font-mono text-slate-400 mt-1">ID: EMP-2026-8809</p>
          </div>
        </div>

        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50">
          <QrCode className="w-6 h-6" />
        </button>
      </div>

      {/* 督察官 Digital E-Badge Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-4 shadow-md mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">督察官 • 智能终端卡</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            已绑定 3 台
          </span>
        </div>

        <div className="text-sm font-semibold tracking-tight text-white mb-3">
          当前主佩戴设备：主厨视角设备 (Smart-Glass Pro)
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
          <span className="text-slate-300">电量 84% • 蓝牙/Wi-Fi 在线</span>
          <button 
            onClick={() => onNavigateToDeviceList('list')}
            className="text-blue-300 hover:text-white font-semibold flex items-center gap-1"
          >
            切换终端 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
        
        <button 
          onClick={() => onNavigateToDeviceList('list')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-800">督察官设备管理与绑定</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => onNavigateToDeviceList('intro')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-slate-500" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-800">设备中心 (无设备空态)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                空态
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => onNavigateToBadge('skills')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-800">SOP 技能算法商店</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => onNavigateToBadge('settings')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-800">工牌与边缘网关设置</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-800">企业级安全加密协议</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">TLS 1.3 + 国密SM4</span>
        </div>

      </div>

      {/* Version note */}
      <div className="mt-6 text-center text-xs text-slate-400">
        督察官 VisionOS v3.5.2 • 企业级智能协同工作台
      </div>

    </div>
  );
}
