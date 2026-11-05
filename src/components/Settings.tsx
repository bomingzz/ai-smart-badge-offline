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
  ChevronLeft,
  BookOpen,
  Unlink,
  AlertTriangle
} from 'lucide-react';
import { Device } from '../types';

interface SettingsProps {
  device: Device;
  onBackToDevices?: () => void;
  onUnbindDevice?: () => void;
}

export function Settings({ device, onBackToDevices, onUnbindDevice }: SettingsProps) {
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

  const [isUnbindModalOpen, setIsUnbindModalOpen] = useState<boolean>(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-3.5 pb-20 text-slate-800"
    >
      {/* Top Sub-Navigation Bar: Back to Device List */}
      {onBackToDevices && (
        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            id="back-to-device-list-btn"
            onClick={onBackToDevices}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>返回设备列表</span>
          </button>
          <span className="text-xs font-semibold text-slate-400">设备信息与设置</span>
        </div>
      )}

      {/* Device Hero Visual Section (Compact Horizontal Layout) */}
      <div className="relative rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-white p-4 border border-slate-200 shadow-xs overflow-hidden flex items-center gap-4">
        {/* Subtle Blue Background glow */}
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Left: Compact Hardware Showcase Container */}
        <div className="relative w-20 h-24 rounded-xl bg-gradient-to-b from-blue-50/80 to-slate-50/90 border border-blue-100/90 flex items-center justify-center flex-shrink-0 shadow-inner">
          <img 
            src="/assets/aistudio/image_75e64ff6.png" 
            alt={device.name} 
            className="h-21 w-auto object-contain drop-shadow-sm transform hover:scale-105 transition-transform relative z-10"
          />
        </div>

        {/* Right: Device Metadata, Status Pills & Quick Unbind Action */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base text-slate-800 truncate">
                {device.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                {device.model} • {device.location}
              </p>
            </div>

            {/* Top-Right Quick Unbind Entry */}
            <button
              type="button"
              id="unbind-device-top-btn"
              onClick={() => setIsUnbindModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
              title="解除当前设备绑定"
            >
              <Unlink className="w-3 h-3" />
              <span>解绑设备</span>
            </button>
          </div>

          {/* Bottom Row: Connection Status, Battery & Firmware Tag */}
          <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
            <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/90 flex items-center gap-2 shadow-2xs">
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span className="text-[10px] font-mono font-bold text-slate-700">
                  {device.status === 'online' ? '在线' : '离线'}
                </span>
              </div>
              <span className="w-px h-2.5 bg-slate-200" />
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-700">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                <span>{device.battery}%</span>
              </div>
            </div>

            <span className="px-2 py-1 rounded-lg bg-blue-50/70 border border-blue-200/70 text-[10px] font-mono font-semibold text-blue-700">
              固件 {firmwareVersion}
            </span>
          </div>
        </div>
      </div>

      {/* Control sliders row (灯光 & 音量大小调整) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Volume adjust card */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex flex-col gap-2.5 shadow-xs">
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
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex flex-col gap-2.5 shadow-xs">
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
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3 shadow-xs">
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
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
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

      {/* Firmware upgrade card (设备固件版本及升级) */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3 shadow-xs">
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

      {/* Unbind Device Section (解除设备绑定入口) */}
      <div className="pt-2">
        <button
          type="button"
          id="unbind-device-bottom-btn"
          onClick={() => setIsUnbindModalOpen(true)}
          className="w-full py-3.5 px-4 bg-white hover:bg-rose-50/80 active:scale-[0.99] border border-rose-200 hover:border-rose-300 rounded-2xl text-rose-600 font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Unlink className="w-4 h-4 stroke-[2.2]" />
          <span>解除设备绑定</span>
        </button>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          解绑后将断开当前终端实时连接，云端已同步的历史视频仍可正常回看
        </p>
      </div>

      {/* Secondary Confirmation Modal for Unbinding Device */}
      <AnimatePresence>
        {isUnbindModalOpen && (
          <div
            className="fixed inset-0 max-w-md mx-auto bg-slate-900/50 backdrop-blur-[2px] z-50 flex items-center justify-center px-5"
            onClick={() => setIsUnbindModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="unbind-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-3.5 shadow-2xs">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h4 id="unbind-modal-title" className="text-base font-bold text-slate-900">
                确认解除设备绑定？
              </h4>

              <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 inline-flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800">{device.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">({device.model})</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mt-3">
                解绑后将断开与该设备的实时连接及新片段录制功能。已归档至云端的历史视频不会丢失，确认后将返回<span className="text-slate-700 font-semibold">首页视频回放</span>。
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <button
                  type="button"
                  id="cancel-unbind-btn"
                  onClick={() => setIsUnbindModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors active:scale-95 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  id="confirm-unbind-btn"
                  onClick={() => {
                    setIsUnbindModalOpen(false);
                    onUnbindDevice?.();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  确认解绑
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
