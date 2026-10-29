import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  HardDrive, 
  Volume2, 
  VolumeX, 
  Sun, 
  Cpu, 
  ShieldCheck, 
  HelpCircle, 
  RefreshCw, 
  Wifi, 
  Check, 
  Loader2, 
  Lock, 
  Unlock, 
  Sparkles, 
  Battery, 
  Cloud,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Device } from '../types';

interface SettingsProps {
  device: Device;
}

export function Settings({ device }: SettingsProps) {
  // Volume & Brightness State (灯光、音量调整)
  const [volume, setVolume] = useState<number>(75);
  const [brightness, setBrightness] = useState<number>(85);
  
  // Storage States (自动上传、无需手动控制，模拟数据与后台自动传输的状态)
  const [storageUsed, setStorageUsed] = useState<number>(3.4);
  const storageTotal = 25.2; // Looki L1 styled: 3.4 GB / 25.2 GB
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'cleared'>('idle');
  const [recentUploadsCount, setRecentUploadsCount] = useState<number>(28);

  // Firmware states (固件版本、升级)
  const [firmwareVersion, setFirmwareVersion] = useState<string>('v2.4.1-stable');
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [upgradeProgress, setUpgradeProgress] = useState<number>(0);
  const [upgradeStep, setUpgradeStep] = useState<'idle' | 'checking' | 'downloading' | 'installing' | 'success'>('idle');

  // AI Quota states (AI分析的额度管理)
  const [aiQuotaUsed, setAiQuotaUsed] = useState<number>(338); // Looki+ Prime style: 338 remaining / limit
  const aiQuotaTotal = 1000;
  const [isRefreshingQuota, setIsRefreshingQuota] = useState<boolean>(false);

  // Auto-sync simulator to show active streaming in background
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncStatus('syncing');
      setTimeout(() => {
        setSyncStatus('idle');
        setRecentUploadsCount(prev => prev + 1);
      }, 3000);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const handleStartUpgrade = () => {
    setUpgradeStep('checking');
    setIsUpgrading(true);
    
    // Check update
    setTimeout(() => {
      setUpgradeStep('downloading');
      let progress = 0;
      const interval = setInterval(() => {
        progress += 8;
        if (progress >= 100) {
          clearInterval(interval);
          setUpgradeStep('installing');
          
          setTimeout(() => {
            setUpgradeStep('success');
            setFirmwareVersion('v2.5.0-stable');
            setTimeout(() => {
              setUpgradeStep('idle');
              setIsUpgrading(false);
            }, 2500);
          }, 2000);
        } else {
          setUpgradeProgress(progress);
        }
      }, 120);
    }, 1500);
  };

  const percentStorage = (storageUsed / storageTotal) * 100;
  const percentAiQuota = (aiQuotaUsed / aiQuotaTotal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 pb-28 text-slate-800"
    >
      {/* Device Hero Visual Section */}
      <div className="relative rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-white p-6 border border-slate-200 shadow-xs overflow-hidden flex flex-col items-center">
        {/* Blue Background glow */}
        <div className="absolute top-[-50px] w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Device Image Mockup Container */}
        <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-blue-500/5 border border-blue-500/15 animate-pulse" />
          {device.imageUrl ? (
            <img 
              src={device.imageUrl} 
              referrerPolicy="no-referrer"
              alt={device.name} 
              className="w-28 h-28 object-cover rounded-2xl shadow-md border border-slate-200 transform hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-inner">
              <Cpu className="w-10 h-10" />
            </div>
          )}
          
          {/* Status and Battery pill beside the device icon */}
          <div className="absolute -bottom-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 flex items-center gap-2.5 shadow-md z-10">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-[10px] font-mono font-bold text-slate-700">
                {device.status === 'online' ? 'CONNECTED' : 'OFFLINE'}
              </span>
            </div>
            <span className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-700">
              <Battery className="w-3.5 h-3.5 text-emerald-600" />
              <span>{device.battery}%</span>
            </div>
          </div>
        </div>

        {/* Device Name and Quick Status */}
        <h3 className="font-display font-bold text-xl text-slate-800">{device.name}</h3>
        <p className="text-xs text-slate-500 font-mono mt-1">{device.model} • 固件 {firmwareVersion}</p>
      </div>

      {/* Control sliders row (灯光 & 音量大小调整) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Volume adjust card */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>设备播报音量</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{volume}%</span>
          </div>
          <div className="flex items-center gap-2">
            <VolumeX className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input 
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <Volume2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          </div>
        </div>

        {/* Brightness/Light adjust card */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>辅助灯光亮度</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{brightness}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input 
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <Sun className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Storage Card (设备内部存储 - 自动上传释放，无手动控制) */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col gap-4 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-200 text-blue-600">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">设备内部存储 (自动释放)</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                已自动归档并上传 {recentUploadsCount} 个第一视角流片段
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold font-mono text-slate-800">{storageUsed.toFixed(1)} GB</span>
            <span className="text-xs text-slate-400 font-mono"> / {storageTotal} GB</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${percentStorage}%` }}
          />
        </div>

        {/* Auto Upload status block */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-700">全时自动同步上传已激活</span>
          </div>
          <div className="flex items-center gap-1">
            {syncStatus === 'syncing' ? (
              <span className="text-[10px] text-blue-600 font-mono flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                正在无感流式上传片段...
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">
                终端即捕获，云端即释放 (零干预)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis Quota Management (AI分析的额度管理) */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-xs">
        
        {/* Left Side: Dial/Circle Meter */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle track */}
            <circle 
              cx="64" 
              cy="64" 
              r="48" 
              className="stroke-slate-100" 
              strokeWidth="7" 
              fill="transparent" 
            />
            {/* Progress circle */}
            <circle 
              cx="64" 
              cy="64" 
              r="48" 
              className="stroke-blue-600 transition-all duration-1000" 
              strokeWidth="7" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - percentAiQuota / 100)}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center text of Circle Meter */}
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-800">{aiQuotaUsed}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">剩余次数</span>
          </div>
        </div>

        {/* Right Side: Description and Refill Button */}
        <div className="flex-1 flex flex-col gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-mono">Looki+ Prime 权益</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">AI安全核验额度管理</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              因终端无载荷设计，SOP大模型推理全部在企业私有云端完成。本周期内可分配核验剩余 <strong>{aiQuotaUsed}</strong> 次。
              自动重置周期：<strong>每月 1 日</strong>。
            </p>
          </div>
          
          <div className="flex gap-2 justify-center sm:justify-start mt-1">
            <button 
              type="button"
              onClick={() => {
                setIsRefreshingQuota(true);
                setTimeout(() => {
                  setIsRefreshingQuota(false);
                }, 1000);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              {isRefreshingQuota ? '正在同步云端...' : '同步云端额度'}
            </button>
            <button 
              type="button"
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              额度充值/扩容
            </button>
          </div>
        </div>
      </div>

      {/* Firmware upgrade card (设备固件版本及升级) */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col gap-4 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-200 text-sky-600">
              <RefreshCw className={`w-4 h-4 ${isUpgrading ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">设备系统与固件版本</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">无屏端微OS: AuraOS v1.4.2</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-600">
            {firmwareVersion}
          </span>
        </div>

        {/* Upgrade status flow */}
        <AnimatePresence mode="wait">
          {isUpgrading ? (
            <motion.div 
              key="upgrading-state"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-600 font-bold">
                    {upgradeStep === 'checking' && '🔍 正在云端服务器获取最新构建版本...'}
                    {upgradeStep === 'downloading' && `📥 正在下载固件镜像包 (${upgradeProgress}%)`}
                    {upgradeStep === 'installing' && '⚙️ 正在向微镜硬件刷入系统固件...'}
                    {upgradeStep === 'success' && '✨ 固件升级成功！设备正在自动热重启...'}
                  </span>
                  {upgradeStep === 'downloading' && (
                    <span className="font-mono text-[10px] text-slate-400">2.1 MB/s</span>
                  )}
                </div>
                {upgradeStep === 'downloading' && (
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-150" style={{ width: `${upgradeProgress}%` }} />
                  </div>
                )}
                {upgradeStep === 'installing' && (
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden relative">
                    <div className="absolute h-full w-1/3 bg-blue-600 rounded-full animate-[shimmer_1.5s_infinite_linear]" style={{ left: '0%' }} />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="idle-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">
                检查到企业云端有安全核验算法重大更新固件 <strong>v2.5.0</strong>，建议升级。
              </div>
              <button
                onClick={handleStartUpgrade}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                检查并升级
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Getting Started & Tutorials (使用教程与指南) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          使用教程与指南
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <a 
            href="#tutorial-pair"
            className="p-3 bg-white hover:bg-blue-50/40 border border-slate-200 rounded-xl transition-all group shadow-xs cursor-pointer"
          >
            <h5 className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">第一视角对焦指南</h5>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">如何调节镜头仰角以达到最佳无屏对焦核验视野</p>
          </a>
          <a 
            href="#tutorial-safe"
            className="p-3 bg-white hover:bg-blue-50/40 border border-slate-200 rounded-xl transition-all group shadow-xs cursor-pointer"
          >
            <h5 className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">指示灯交互说明</h5>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">无屏微型终端呼吸灯闪烁频率与状态对照</p>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
