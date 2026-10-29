import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Battery, BatteryMedium, BatteryWarning, Cpu, ChevronRight, Search, Server, ShieldAlert, 
  Plus, X, Bluetooth, Radio, Check, CheckCircle2, Loader2, Sparkles, Eye,
  QrCode, Scan, Power, Building2, UserCheck, RotateCcw, Clock, AlertTriangle, ArrowRight,
  Bookmark, Tag, Smartphone, CheckCheck
} from 'lucide-react';
import { mockDeviceGroups } from '../data';
import { Device, DeviceGroup } from '../types';
import { SmartBadgeProductDiagram } from './SmartBadgeProductDiagram';
import { EmptyDeviceShowcase } from './EmptyDeviceShowcase';

interface DeviceListProps {
  key?: React.Key;
  initialMode?: 'list' | 'intro';
  onSelectDevice: (device: Device) => void;
  triggerActivation?: number;
  onActivationChange?: (isOpen: boolean) => void;
}

export function DeviceList({ initialMode = 'list', onSelectDevice, triggerActivation, onActivationChange }: DeviceListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'intro'>(initialMode);

  useEffect(() => {
    if (initialMode) {
      setViewMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    if (triggerActivation && triggerActivation > 0) {
      handleStartActivation();
    }
  }, [triggerActivation]);

  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<DeviceGroup[]>(mockDeviceGroups);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<Set<string>>(new Set());

  // 智能工牌激活状态体系 (Smart Badge Activation State Machine)
  const [isActivationOpen, setIsActivationOpen] = useState(false);

  useEffect(() => {
    onActivationChange?.(isActivationOpen);
  }, [isActivationOpen, onActivationChange]);
  const [activationPhase, setActivationPhase] = useState<'scan' | 'power_check' | 'handshake' | 'welcome'>('scan');

  // 阶段 1: 开机检测与组织确认
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isRecheckingPower, setIsRecheckingPower] = useState(false);
  const [currentOrg, setCurrentOrg] = useState('国家电网XX供电实业有限公司');
  const [currentDept, setCurrentDept] = useState('输变电巡检一组');
  const [currentUserName, setCurrentUserName] = useState('张伟 (工号 #EE-9041)');
  const [isSwitchingOrg, setIsSwitchingOrg] = useState(false);

  // 阶段 2: 物理按键连接与 60s 倒计时
  const [countdown, setCountdown] = useState(60);
  const [isHandshakeTimeout, setIsHandshakeTimeout] = useState(false);
  const [isConnectingHandshake, setIsConnectingHandshake] = useState(false);

  // 拟激活设备信息 (魔点科技智能AI工牌)
  const activatingDevice = {
    id: 'd_active_av9041',
    name: '魔点 AI 智能工牌 (沈知予 专属终端)',
    sn: 'AV2026-9041',
    model: 'MoreDian SmartBadge Pro (1080P FPV 录音录像)',
    battery: 85,
    location: '魔点设计中心 / 巡检班组',
    imageUrl: '/moredian_smart_badge.png'
  };

  // 阶段 2: 60 秒倒计时定时器
  useEffect(() => {
    let interval: any = null;
    if (isActivationOpen && activationPhase === 'handshake' && !isHandshakeTimeout && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsHandshakeTimeout(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActivationOpen, activationPhase, isHandshakeTimeout, countdown]);

  const handleStartActivation = () => {
    setIsActivationOpen(true);
    setActivationPhase('scan');
    setIsPowerOn(false); // 默认展示“未开机”引导，便于体验开机检测
    setIsRecheckingPower(false);
    setIsHandshakeTimeout(false);
    setCountdown(60);
    setIsConnectingHandshake(false);
    setIsSwitchingOrg(false);
  };

  const handlePowerRecheck = () => {
    setIsRecheckingPower(true);
    setTimeout(() => {
      setIsRecheckingPower(false);
      setIsPowerOn(true);
    }, 700);
  };

  const handleConfirmOrgAndProceed = () => {
    setActivationPhase('handshake');
    setIsPowerOn(false);
    setCountdown(60);
    setIsHandshakeTimeout(false);
    setIsConnectingHandshake(false);
  };

  const handleTriggerMarkButton = () => {
    setIsConnectingHandshake(true);
    setTimeout(() => {
      setIsConnectingHandshake(false);
      setActivationPhase('welcome');
    }, 700);
  };

  // 超时原地重新连接，无需重返第一步
  const handleReconnect = () => {
    setIsHandshakeTimeout(false);
    setCountdown(60);
  };

  // 欢迎页完成并直通工作台
  const handleFinishWelcomeAndEnter = () => {
    const newDevice: Device = {
      id: activatingDevice.id,
      name: activatingDevice.name,
      status: 'online',
      battery: activatingDevice.battery,
      model: activatingDevice.model,
      location: activatingDevice.location,
      imageUrl: activatingDevice.imageUrl
    };

    setGroups(prevGroups => {
      if (prevGroups.some(g => g.devices.some(d => d.id === newDevice.id))) {
        return prevGroups;
      }
      return prevGroups.map((g, idx) => {
        if (idx === 0) {
          return {
            ...g,
            devices: [newDevice, ...g.devices]
          };
        }
        return g;
      });
    });

    setIsActivationOpen(false);
    onSelectDevice(newDevice);
  };


  // Extract all unique devices from the existing groups to allow binding
  const allDevices = React.useMemo(() => {
    const devicesMap = new Map<string, Device>();
    groups.forEach(g => g.devices.forEach(d => devicesMap.set(d.id, d)));
    return Array.from(devicesMap.values());
  }, [groups]);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    const selectedDevicesList = allDevices.filter(d => selectedDeviceIds.has(d.id));
    
    const newGroup: DeviceGroup = {
      id: `g${Date.now()}`,
      name: newGroupName.trim(),
      devices: selectedDevicesList
    };
    setGroups([newGroup, ...groups]);
    setNewGroupName('');
    setSelectedDeviceIds(new Set());
    setIsAddingGroup(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 pb-24 h-full relative"
    >
      {viewMode === 'intro' ? (
        <EmptyDeviceShowcase
          onStartActivation={handleStartActivation}
        />
      ) : (
        <>
          <div className="sticky top-0 z-10 pt-4 pb-2 bg-white/95 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-base tracking-tight text-slate-800">设备分组与多终端中心</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAddingGroup(true)}
                  className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-slate-200 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  新建分组
                </button>
                <button 
                  onClick={handleStartActivation}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-blue-600/20 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  绑定设备
                </button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索设备名称、型号或位置..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 shadow-inner"
              />
            </div>
          </div>
          <AnimatePresence>
            {isAddingGroup && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleAddGroup} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      autoFocus
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="输入分组名称 (例如: C区仓库)"
                      className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                      保存
                    </button>
                    <button type="button" onClick={() => setIsAddingGroup(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {allDevices.length > 0 && (
                    <div className="border-t border-slate-100 pt-3 mt-1">
                      <p className="text-xs font-semibold text-slate-600 mb-2">选择要绑定的设备</p>
                      <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
                        {allDevices.map(device => (
                          <label key={device.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group">
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={selectedDeviceIds.has(device.id)}
                              onChange={(e) => {
                                const newSet = new Set(selectedDeviceIds);
                                if (e.target.checked) newSet.add(device.id);
                                else newSet.delete(device.id);
                                setSelectedDeviceIds(newSet);
                              }}
                            />
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedDeviceIds.has(device.id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                              {selectedDeviceIds.has(device.id) && <svg className="w-3 h-3 text-white" viewBox="0 0 14 14" fill="none"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-xs flex-shrink-0 ${
                                device.status === 'online' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                                device.status === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                'bg-slate-100 border-slate-200 text-slate-400'
                              }`}>
                                <Cpu className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800">{device.name}</span>
                                <span className="text-[10px] text-slate-500">{device.location}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-6">
            {groups.map(group => {
              const filteredDevices = group.devices.filter(d => 
                d.name.includes(searchQuery) || d.location.includes(searchQuery) || d.model.includes(searchQuery)
              );
              
              if (filteredDevices.length === 0 && !searchQuery && group.devices.length === 0) {
                return (
                  <section key={group.id}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-blue-600" /> {group.name}
                    </h3>
                    <div className="text-center p-6 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm bg-slate-50/50">
                      暂无设备
                    </div>
                  </section>
                );
              } else if (filteredDevices.length === 0) {
                return null;
              }

              return (
                <section key={group.id}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-blue-600" /> {group.name}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {filteredDevices.map(device => (
                      <button 
                        key={device.id} 
                        onClick={() => onSelectDevice(device)}
                        className="flex flex-col p-4 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl transition-all group text-left relative overflow-hidden gap-3 shadow-xs hover:shadow-md cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        {/* Top Row: Device Info */}
                        <div className="flex items-start justify-between w-full relative z-10">
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs flex-shrink-0 ${
                                device.status === 'online' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                                device.status === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                'bg-slate-100 border-slate-200 text-slate-400'
                              }`}>
                                {device.status === 'warning' ? <ShieldAlert className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{device.name}</h4>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                                    device.status === 'online' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    device.status === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                    'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}>
                                    {device.status === 'online' ? '在线' : device.status === 'warning' ? '告警' : '离线'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                  <span>{device.model}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span className="truncate">{device.location}</span>
                                </div>
                              </div>
                           </div>
                           
                           <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
                             {device.status !== 'offline' && (
                               <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                                 {device.battery > 50 ? <Battery className="w-3.5 h-3.5 text-emerald-600" /> : 
                                  device.battery > 20 ? <BatteryMedium className="w-3.5 h-3.5 text-amber-600" /> : 
                                  <BatteryWarning className="w-3.5 h-3.5 text-rose-600 animate-pulse" />}
                                 {device.battery}%
                               </div>
                             )}
                             <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors hidden sm:block" />
                           </div>
                        </div>

                        {/* Preview Image Row */}
                        {device.imageUrl && device.status !== 'offline' && (
                           <div className="w-full h-40 sm:h-48 mt-1 rounded-xl overflow-hidden border border-slate-200 relative z-10 group-hover:border-blue-300 transition-colors shadow-xs">
                             <img src={device.imageUrl} referrerPolicy="no-referrer" alt={device.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                             {device.status === 'warning' && (
                               <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                                 <ShieldAlert className="w-3 h-3" />
                                 告警中
                               </div>
                             )}
                             <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                               <span className="flex h-2 w-2 relative">
                                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${device.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                                 <span className={`relative inline-flex rounded-full h-2 w-2 ${device.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                               </span>
                               <span className="text-[11px] text-white font-medium tracking-wide drop-shadow-md">实时画面</span>
                             </div>
                           </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      {/* 智能工牌激活全流程 (Smart Badge Activation Modal) */}
      <AnimatePresence>
        {isActivationOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute inset-0 bg-white z-50 overflow-y-auto px-5 pt-5 pb-10 flex flex-col"
          >
            {/* Minimal Clean Modal Header with Close Button */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-800">
                  {activationPhase === 'scan' ? '钉钉扫码激活' :
                   activationPhase === 'power_check' ? '智能工牌组织绑定' :
                   activationPhase === 'handshake' ? '工牌按键近场握手连接' : '工牌激活绑定完成'}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">SN: {activatingDevice.sn}</span>
              </div>
              <button 
                onClick={() => setIsActivationOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="关闭向导"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ======================================================== */}
            {/* 阶段 1: 极简扫码页 (钉钉一物一码扫描) */}
            {/* ======================================================== */}
            {activationPhase === 'scan' && (
              <div className="flex flex-col py-1 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                  {/* Clean Minimal Viewfinder */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-3 rounded-3xl bg-slate-950/95 border border-slate-800 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                    {/* Viewfinder Corner Accents */}
                    <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
                    <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
                    <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
                    <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scan-line pointer-events-none" />

                    {/* Central QR Silhouette */}
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2.5">
                        <QrCode className="w-10 h-10 text-cyan-400/90 animate-pulse" />
                      </div>
                      <span className="text-[11px] text-slate-300 font-mono tracking-wider">
                        对准工牌背面激光二维码...
                      </span>
                    </div>

                    {/* SN Tag */}
                    <div className="absolute bottom-3 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] text-slate-300 font-mono">SN: {activatingDevice.sn}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-2">
                    <Scan className="w-3.5 h-3.5" />
                    钉钉扫码 · 一物一码
                  </div>

                  <h4 className="font-display font-bold text-slate-800 text-base mb-1">
                    请扫描工牌背面二维码
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    将取景框对准魔点 AI 智能工牌背面激光雕刻二维码，系统将自动识别设备序列号并进入激活。
                  </p>
                </div>

                <div className="pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => setActivationPhase('power_check')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>模拟扫码识别成功 (进入激活)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsActivationOpen(false);
                      onSelectDevice(mockDeviceGroups[0].devices[0]);
                    }}
                    className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold border border-blue-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>演示快捷通道：一键绑定主厨视角设备</span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 阶段 2: 激活页判断开机状态，没开机提醒；开机显示机构询问激活 */}
            {/* ======================================================== */}
                        {activationPhase === 'power_check' && (
              <div className="flex flex-col gap-3 animate-fade-in">
                  <div className="flex flex-col py-1">
                    <div className="flex flex-col gap-3">
                      {/* Product Hardware Diagram in Online State */}
                      <SmartBadgeProductDiagram 
                        mode="power_off"
                        className="mb-1"
                      />

                      {/* Current Organization & User Info Box */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
                        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200/80">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-slate-800">当前所在企业机构与身份</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsSwitchingOrg(!isSwitchingOrg)}
                            className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                          >
                            {isSwitchingOrg ? '收起切换' : '切换组织'}
                          </button>
                        </div>

                        {/* Org Switching Options Dropdown */}
                        {isSwitchingOrg && (
                          <div className="mb-3 p-2 bg-white rounded-xl border border-blue-200 shadow-xs space-y-1">
                            <span className="text-[10px] text-slate-400 block px-1">请选择拟激活的目标企业：</span>
                            {[
                              { org: '国家电网XX供电实业有限公司', dept: '输变电巡检一组' },
                              { org: '深能电力运维检修中心', dept: '主网巡视二班' },
                              { org: '高新技术示范产线数字化事业部', dept: '智能后厨与食安组' }
                            ].map((item, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setCurrentOrg(item.org);
                                  setCurrentDept(item.dept);
                                  setIsSwitchingOrg(false);
                                }}
                                className={`w-full text-left p-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                                  currentOrg === item.org ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <span className="truncate">{item.org}</span>
                                <span className="text-[10px] font-normal text-slate-400">{item.dept}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-[11px]">所属企业:</span>
                            <span className="font-bold text-slate-800">{currentOrg}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-[11px]">归属部门:</span>
                            <span className="font-semibold text-slate-700">{currentDept}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-[11px]">绑定账号:</span>
                            <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              {currentUserName}
                            </span>
                          </div>
                        </div>

                        {/* Confirmation Prompt */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center gap-1.5 text-slate-700">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <p className="text-[11px] font-medium leading-tight">
                            确认将当前工牌激活绑定至该组织及个人账号？
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActivationPhase('scan')}
                        className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        返回上一步
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmOrgAndProceed}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <span>确认激活并连接设备</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 阶段 3: 提醒点击右侧”标记“按钮连接设备（60秒超时，超时可重新连接不用重返第一步） */}
            {/* ======================================================== */}
{activationPhase === 'handshake' && (
              <div className="flex flex-col py-1 animate-fade-in">
                {!isPowerOn ? (
/* 分支 A：未开机状态 -> 展示真实工牌交互示意图 + 提醒开机，提供【我已开机，重新检测】 */
                  <div className="flex flex-col py-1">
                    <div className="flex flex-col items-center text-center">
                      {/* Product Hardware Interactive Diagram */}
                      <SmartBadgeProductDiagram 
                        mode="power_off"
                        onPowerClick={() => setIsPowerOn(true)}
                        className="mb-2"
                      />

                      <h4 className="font-display font-bold text-slate-800 text-base mb-1">
                        请长按工牌电源键开机
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-3">
                        连接前，请确保工牌电量充足并执行开机动作。
                      </p>

                      {/* Device Power Button Visual Guide with 3 exact steps */}
                      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left mb-2 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">开机指引操作步骤：</span>
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono font-semibold border border-amber-200">
                            待开机
                          </span>
                        </div>
                        <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                          <li className="flex items-start gap-2.5">
                            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                            <span>找到工牌<strong>左侧电源键</strong>，长按 <strong>3 秒</strong> 开机；</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                            <span>观察前面板工作指示灯，由熄灭转为<strong>蓝灯闪烁</strong>；</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                            <span>指示灯就绪后，点击下方<strong>【我已开机，下一步】</strong>按钮继续。</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsPowerOn(true)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>我已开机，下一步</span>
                      </button>
                    </div>
                  </div>
                ) : !isHandshakeTimeout ? (
                  <>
                    <div className="flex flex-col items-center text-center">
                      {/* Top Guide Prompt */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl w-full text-left mb-4 shadow-xs">
                        <div className="flex items-center gap-1.5 mb-1 text-blue-900 font-bold text-xs">
                          <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                          <span>请按压工牌右侧【标记】按钮连接设备</span>
                        </div>
                        <p className="text-[11px] text-blue-800/80 leading-relaxed">
                          【近场防误连鉴权】：在多人领机现场，必须物理轻按工牌右侧“标记”键，端侧方可发送防串号安全握手信号。
                        </p>
                      </div>

                      {/* 60s SVG Countdown Circle & Pulse */}
                      <div className="relative flex items-center justify-center w-36 h-36 my-2">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-slate-100"
                          />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * countdown) / 60}
                          className="text-blue-600 transition-all duration-1000 ease-linear"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-mono font-bold text-slate-800 tracking-tight">
                          {countdown}s
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                          连接倒计时
                        </span>
                      </div>
                    </div>

                    {/* Authentic Badge Hardware Interactive Diagram with Right-Side Mark Button */}
                    <SmartBadgeProductDiagram 
                      mode="handshake"
                      onMarkClick={handleTriggerMarkButton}
                      className="my-2"
                    />

                    {/* Connection Helper Link & Test Timeout Trigger */}
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => setIsHandshakeTimeout(true)}
                        className="text-[11px] text-slate-400 hover:text-amber-600 underline transition-colors cursor-pointer"
                      >
                        [快速测试 60秒超时逻辑]
                      </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* 状态 B: 超时提示与原地重连 (无需重返第一步) */
                  <div className="flex-1 flex flex-col justify-between py-2 animate-fade-in">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-xs relative">
                        <Clock className="w-8 h-8 text-amber-600 animate-bounce" />
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        连接超时 (未在 60 秒内检测到按键)
                      </div>

                      <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">
                        未检测到工牌右侧按键触发
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
                        可能是由于按压时间过短、设备休眠或按错按键。您可以直接在当前页重新连接，<strong>无需重返第一步重新扫码</strong>。
                      </p>

                      {/* Troubleshooting Checklist */}
                      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-4 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">排查小贴士：</span>
                        <ul className="text-xs text-slate-600 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>请核对按键位置为工牌<strong>右侧边框的【标记】按键</strong>，而非顶部电源键；</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>确认工牌前面板工作指示灯持续处于<strong>蓝灯闪烁</strong>在线就绪状态。</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleReconnect}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>重新连接 (重置 60 秒倒计时)</span>
                      </button>
                      <p className="text-[10px] text-center text-slate-400">
                        ★ 原地重置倒计时并继续监听，不用重返第一步
                      </p>
                    </div>
                  </div>
                )}
                
                {isPowerOn && !isHandshakeTimeout && (
                  <div className="pt-3 border-t border-slate-100 flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsPowerOn(false)}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      返回上一步
                    </button>
                    <button
                      type="button"
                      onClick={handleTriggerMarkButton}
                      disabled={isConnectingHandshake}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {isConnectingHandshake ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>正在握手鉴权绑定中...</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>模拟按压右侧“标记”键</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* 阶段 4: 激活成功结果页与新手产品引导 (Success & Product Guide) */}
            {/* ======================================================== */}
            {activationPhase === 'welcome' && (
              <div className="flex flex-col py-1 animate-fade-in space-y-4">
                {/* 1. 激活成功反馈卡片 (Success Feedback Card) */}
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-emerald-400/10 to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-start gap-3.5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-extrabold text-emerald-800">
                          🎉 激活绑定成功！
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          已接入数字督察网络
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        工牌已完成近场防串号安全握手，正式绑定至【{currentOrg}】责任人 <span className="font-bold text-slate-800">{currentUserName}</span>。
                      </p>
                    </div>
                  </div>


                </div>

                {/* 2. 工牌硬件示意透视展示 (Product Holographic View) */}
                <SmartBadgeProductDiagram 
                  mode="welcome"
                  className="my-0.5"
                />

                {/* 3. 核心产品使用引导（Product Onboarding & Operation Guide） */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                        智能工牌产品操作与作业引导
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      新手必读 · 4项核心规范
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* 指南 1: 穿戴与视场 */}
                    <div className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 rounded-2xl transition-all shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">1. 规范穿戴与隐私保护</span>
                          <span className="text-[10px] text-blue-600 font-medium">胸前正中 · 120°广角最佳视角</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        使用磁吸胸夹固定于胸前正中衣物，保持摄像头水平朝前无遮挡；非作业或私人休息时，可向下滑动顶部物理滑盖遮蔽镜头。
                      </p>
                    </div>

                    {/* 指南 2: 右侧标记键核心交互 */}
                    <div className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 rounded-2xl transition-all shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                          <Bookmark className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">2. 右侧【标记】键核心功能</span>
                          <span className="text-[10px] text-indigo-600 font-medium">短按快照标记 · 长按紧急呼叫</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        作业中遇到隐患违规或关键工序，物理轻按右侧标记键，端侧即刻对焦抓拍并标记；长按 2 秒触发紧急上报直通中控台。
                      </p>
                    </div>

                    {/* 指南 3: 指示灯与智能震动语音反馈 */}
                    <div className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 rounded-2xl transition-all shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                          <Radio className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">3. 指示灯与智能声光震动</span>
                          <span className="text-[10px] text-amber-600 font-medium">蓝灯就绪 · 绿灯录制 · 震动预警</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        工作时蓝灯闪烁代表就绪，录制时绿灯常亮。若触发 SOP 动作偏离（如未戴手套），工牌将短促微震并在蓝牙耳机中语音纠偏。
                      </p>
                    </div>

                    {/* 指南 4: 实时大模型质检与无感存储释放 */}
                    <div className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 rounded-2xl transition-all shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">4. 端云自动化质检与存储循环</span>
                          <span className="text-[10px] text-emerald-600 font-medium">1080P 云端校验 · 免手动格式化</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        第一视角录像自动推流云端大模型质检并存证；云端核验完成后，本地空间自动循环覆盖释放，无需每日连接电脑清卡。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. 底部行动主按钮 (Action Button) */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleFinishWelcomeAndEnter}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>我已了解，立即进入个人工作台</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-1.5">
                    点击直接进入本人第一视角视频回看、SOP监督审核与AI安监记忆
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
