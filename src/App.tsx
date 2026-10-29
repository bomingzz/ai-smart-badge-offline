import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ViewState, Device, SuperAppTab, AppScreen } from './types';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Skills } from './components/Skills';
import { Playback } from './components/Playback';
import { DeviceList } from './components/DeviceList';
import { Settings as SettingsComponent } from './components/Settings';
import { Workbench } from './components/Workbench';
import { HomeTab } from './components/HomeTab';
import { SmartSceneTab } from './components/SmartSceneTab';
import { MineTab } from './components/MineTab';
import { SuperAppNav } from './components/SuperAppNav';
import { PageFlowView } from './components/PageFlowView';
import { EmptyDeviceShowcase } from './components/EmptyDeviceShowcase';
import { mockDeviceGroups } from './data';
import { 
  ChevronLeft, Settings as GearIcon, Battery, 
  ChevronDown, Cpu, Sparkles, Server, Check, ArrowRight, Compass, Plus
} from 'lucide-react';

export default function App() {
  const [appScreen, setAppScreen] = useState<AppScreen>('super_app');
  const [superAppTab, setSuperAppTab] = useState<SuperAppTab>('workbench');
  
  // Default selected device
  const defaultDevice = mockDeviceGroups[0].devices[0];
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('devices');
  const [initialPlaybackEventId, setInitialPlaybackEventId] = useState<string | null>(null);
  const [initialPlaybackClipId, setInitialPlaybackClipId] = useState<string | null>(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState<string | null>(null);
  const [activationTrigger, setActivationTrigger] = useState(0);
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const [unboundHistoryMode, setUnboundHistoryMode] = useState<'with_history' | 'pure_empty'>('with_history');
  const [isBindingPageOpen, setIsBindingPageOpen] = useState(false);

  // Enter badge application from SuperApp / Workbench
  const handleNavigateToBadge = (view: ViewState) => {
    setInitialPlaybackClipId(null);
    if (view === 'devices_empty') {
      setSelectedDevice(null);
      setUnboundHistoryMode('with_history');
      setCurrentView('dashboard');
    } else if (view === 'dashboard') {
      if (!selectedDevice) {
        setSelectedDevice(defaultDevice);
      }
      setCurrentView('dashboard');
    } else {
      if (!selectedDevice && (view === 'playback' || view === 'settings')) {
        setSelectedDevice(defaultDevice);
      }
      setCurrentView(view);
    }
    setAppScreen('badge_app');
  };

  const handleNavigateToDeviceList = (mode?: 'list' | 'intro') => {
    if (mode === 'intro') {
      setSelectedDevice(null);
      setCurrentView('dashboard');
    } else {
      setCurrentView('devices');
    }
    setAppScreen('badge_app');
  };

  const handleBackToWorkbench = () => {
    setIsBindingPageOpen(false);
    setAppScreen('super_app');
    setSuperAppTab('workbench');
  };

  const handleNavigateToSearch = (searchQuery: string) => {
    setInitialSearchQuery(searchQuery);
    setCurrentView('history');
  };

  const handleNavigateFromFlow = (screen: AppScreen, view?: ViewState, superTab?: SuperAppTab) => {
    if (screen === 'super_app') {
      setAppScreen('super_app');
      if (superTab) setSuperAppTab(superTab);
    } else if (screen === 'badge_app') {
      setAppScreen('badge_app');
      if (view) setCurrentView(view);
    }
  };

  // Fullscreen Page Flow Map Canvas mode
  if (appScreen === 'page_flow') {
    return (
      <PageFlowView 
        onNavigateToAppScreen={handleNavigateFromFlow}
        onBackToApp={() => setAppScreen('super_app')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans selection:bg-blue-500/20 text-slate-800 relative">
      
      {/* Global Floating Entry for Page Flow Map */}
      <div className="fixed top-3 right-4 z-50 flex items-center shadow-lg rounded-full">
        <button
          onClick={() => setAppScreen('page_flow')}
          className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-slate-700/50 flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer group"
          title="查看页面流转全景图"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-45 transition-transform" />
          <span>🗺️ 页面流转图</span>
        </button>
      </div>

      <div className="max-w-md mx-auto min-h-screen relative shadow-xl bg-white border-x border-slate-200/70 flex flex-col">
        
        {/* ========================================================================= */}
        {/* SCREEN 1: SUPER APP (WORKBENCH / HOME / SMART SCENE / MINE)               */}
        {/* ========================================================================= */}
        {appScreen === 'super_app' && (
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <AnimatePresence mode="wait">
                {superAppTab === 'workbench' && (
                  <motion.div
                    key="workbench-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Workbench 
                      onNavigateToBadge={handleNavigateToBadge}
                      onNavigateToDeviceList={handleNavigateToDeviceList}
                      onNavigateToPageFlow={() => setAppScreen('page_flow')}
                    />
                  </motion.div>
                )}

                {superAppTab === 'home' && (
                  <motion.div
                    key="home-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <HomeTab 
                      onNavigateToBadge={handleNavigateToBadge}
                      onNavigateToWorkbench={() => setSuperAppTab('workbench')}
                    />
                  </motion.div>
                )}

                {superAppTab === 'smart_scene' && (
                  <motion.div
                    key="smart-scene-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <SmartSceneTab onNavigateToBadge={handleNavigateToBadge} />
                  </motion.div>
                )}

                {superAppTab === 'mine' && (
                  <motion.div
                    key="mine-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <MineTab 
                      onNavigateToBadge={handleNavigateToBadge}
                      onNavigateToDeviceList={handleNavigateToDeviceList}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Bottom Super App Navigation Bar */}
            <SuperAppNav currentTab={superAppTab} onChangeTab={setSuperAppTab} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: 督察官 SUB-APPLICATION                                       */}
        {/* ========================================================================= */}
        {appScreen === 'badge_app' && (
          <div className="flex flex-col min-h-screen">
            
            {/* Top Header inside 督察官 */}
            <header className="px-4 pt-4 pb-3 bg-white/95 backdrop-blur-xl border-b border-slate-200 z-20 sticky top-0 flex items-center justify-between shadow-xs">
              
              {/* Back to SuperApp Workbench button */}
              <button 
                onClick={handleBackToWorkbench}
                className="flex items-center gap-0.5 text-slate-700 hover:text-blue-600 active:scale-95 transition-all text-sm font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                <span>工作台</span>
              </button>

              {/* App Brand & Current Device Label (Interactive Switcher) */}
              <div className="relative">
                <button
                  onClick={() => setIsDeviceMenuOpen(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100/90 active:scale-95 border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs select-none transition-all cursor-pointer group"
                  title="点击切换设备或体验无设备状态"
                >
                  <span className={`w-2 h-2 rounded-full ${currentView !== 'devices_empty' && selectedDevice ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`} />
                  <span className={currentView !== 'devices_empty' && selectedDevice ? 'text-blue-600 font-bold' : 'text-slate-500 font-bold'}>督察官:</span>
                  <span className="max-w-[120px] truncate text-slate-800">
                    {currentView !== 'devices_empty' && selectedDevice ? selectedDevice.name : '未绑定设备'}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform ${isDeviceMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu for Switching Between With-Device and No-Device States */}
                <AnimatePresence>
                  {isDeviceMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setIsDeviceMenuOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-40 text-xs overflow-hidden"
                      >
                        <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>演示状态切换</span>
                          <span className="text-[9px] text-blue-600 font-normal">点击即刻切换</span>
                        </div>

                        {/* Bound Device Option (Screenshot 1) */}
                        <button
                          onClick={() => {
                            setSelectedDevice(defaultDevice);
                            if (currentView === 'devices_empty') {
                              setCurrentView('dashboard');
                            }
                            setIsDeviceMenuOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-blue-50/70 transition-colors cursor-pointer ${
                            selectedDevice?.id === defaultDevice.id && currentView !== 'devices_empty' ? 'bg-blue-50/80 text-blue-700' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse flex-shrink-0" />
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-1">
                                <span>{defaultDevice.name}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold">有设备状态</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">电量 84% · 视频回看与AI分析</div>
                            </div>
                          </div>
                          {selectedDevice?.id === defaultDevice.id && currentView !== 'devices_empty' && (
                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </button>

                        {/* Second Device Option */}
                        {mockDeviceGroups[0].devices[1] && (
                          <button
                            onClick={() => {
                              setSelectedDevice(mockDeviceGroups[0].devices[1]);
                              if (currentView === 'devices_empty') {
                                setCurrentView('dashboard');
                              }
                              setIsDeviceMenuOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                              selectedDevice?.id === mockDeviceGroups[0].devices[1].id && currentView !== 'devices_empty' ? 'bg-blue-50/80 text-blue-700' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-slate-800">{mockDeviceGroups[0].devices[1].name}</div>
                                <div className="text-[10px] text-slate-400">电量 92% · 巡检现场</div>
                              </div>
                            </div>
                            {selectedDevice?.id === mockDeviceGroups[0].devices[1].id && currentView !== 'devices_empty' && (
                              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            )}
                          </button>
                        )}

                        <div className="my-1.5 border-t border-slate-100" />

                        <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>无设备状态演示</span>
                          <span className="text-[9px] text-amber-600 font-normal">多场景体验</span>
                        </div>

                        {/* No Device Option A: With History Records (User's requirement) */}
                        <button
                          onClick={() => {
                            setSelectedDevice(null);
                            setUnboundHistoryMode('with_history');
                            if (currentView === 'devices_empty') {
                              setCurrentView('dashboard');
                            }
                            setIsDeviceMenuOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-amber-50/50 transition-colors cursor-pointer ${
                            !selectedDevice && unboundHistoryMode === 'with_history' && currentView !== 'devices_empty' ? 'bg-amber-50/80 text-amber-900 font-bold' : 'text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-1">
                                <span>未绑定设备</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">含历史记录</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">回看历史录像 · 禁止录制新片段</div>
                            </div>
                          </div>
                          {!selectedDevice && unboundHistoryMode === 'with_history' && currentView !== 'devices_empty' && (
                            <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          )}
                        </button>

                        {/* No Device Option B: Pure Empty State (Screenshot 2) */}
                        <button
                          onClick={() => {
                            setSelectedDevice(null);
                            setUnboundHistoryMode('pure_empty');
                            setCurrentView('dashboard');
                            setIsDeviceMenuOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                            !selectedDevice && (unboundHistoryMode === 'pure_empty' || currentView === 'devices_empty') ? 'bg-slate-100/90 text-slate-900 font-bold' : 'text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-1">
                                <span>未绑定设备</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">无历史纯空态</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">展示扫码激活向导介绍页</div>
                            </div>
                          </div>
                          {!selectedDevice && (unboundHistoryMode === 'pure_empty' || currentView === 'devices_empty') && (
                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </button>

                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Indicator & Settings / Bind Device Button */}
              <div className="flex items-center gap-2">
                {currentView !== 'devices_empty' && selectedDevice ? (
                  <>
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 shadow-xs">
                      <Battery className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{selectedDevice.battery}%</span>
                    </div>

                    <button 
                      onClick={() => setCurrentView(currentView === 'settings' ? 'dashboard' : 'settings')}
                      className={`p-1.5 rounded-lg border transition-all ${
                        currentView === 'settings'
                          ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-slate-300'
                      }`}
                      title="设备信息与设置"
                    >
                      <GearIcon className={`w-4 h-4 ${currentView === 'settings' ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
                    </button>
                  </>
                ) : !isBindingPageOpen ? (
                  <button 
                    onClick={() => {
                      setIsBindingPageOpen(true);
                      setCurrentView('devices_empty');
                      setActivationTrigger(prev => prev + 1);
                    }}
                    className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-colors active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span>绑定设备</span>
                  </button>
                ) : null}
              </div>

            </header>

            {/* Main Content Area inside 督察官 */}
            <main className="px-4 pt-3 flex-1 overflow-y-auto overflow-x-hidden h-full pb-8 relative">
              <AnimatePresence mode="wait">
                {(currentView === 'devices' || currentView === 'devices_empty') && (
                  <motion.div
                    key={`view-${currentView}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <DeviceList 
                      initialMode={currentView === 'devices_empty' ? 'intro' : 'list'}
                      triggerActivation={activationTrigger}
                      onActivationChange={setIsBindingPageOpen}
                      onSelectDevice={(device) => {
                        setIsBindingPageOpen(false);
                        setSelectedDevice(device);
                        setCurrentView('dashboard');
                      }} 
                    />
                  </motion.div>
                )}

                {currentView === 'dashboard' && (
                  <motion.div
                    key={`view-dashboard-${selectedDevice ? selectedDevice.id : (unboundHistoryMode === 'with_history' ? 'unbound-history' : 'empty')}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {!selectedDevice && unboundHistoryMode === 'pure_empty' ? (
                      <EmptyDeviceShowcase 
                        onStartActivation={() => {
                          setIsBindingPageOpen(true);
                          setCurrentView('devices_empty');
                          setActivationTrigger(prev => prev + 1);
                        }} 
                      />
                    ) : (
                      <Dashboard 
                        device={selectedDevice} 
                        onNavigateToSearch={handleNavigateToSearch}
                        onNavigateToPlayback={(eventId: string) => {
                          setCurrentView('playback');
                          setInitialPlaybackEventId(eventId);
                          setInitialPlaybackClipId(null);
                        }}
                        onNavigateToPlaybackClip={(clipId: string) => {
                          setCurrentView('playback');
                          setInitialPlaybackClipId(clipId);
                          setInitialPlaybackEventId(null);
                        }}
                        onStartActivation={() => {
                          setIsBindingPageOpen(true);
                          setCurrentView('devices_empty');
                          setActivationTrigger(prev => prev + 1);
                        }}
                      />
                    )}
                  </motion.div>
                )}

                {currentView === 'playback' && (
                  <motion.div
                    key={`view-playback-${selectedDevice ? selectedDevice.id : 'empty'}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {selectedDevice ? (
                      <Playback 
                        device={selectedDevice} 
                        initialEventId={initialPlaybackEventId}
                        onClearInitialEvent={() => setInitialPlaybackEventId(null)}
                        initialClipId={initialPlaybackClipId}
                        onClearInitialClip={() => setInitialPlaybackClipId(null)}
                        onNavigateToSearch={handleNavigateToSearch}
                        onBackToDashboard={() => setCurrentView('dashboard')}
                      />
                    ) : (
                      <EmptyDeviceShowcase 
                        onStartActivation={() => {
                          setCurrentView('devices_empty');
                          setActivationTrigger(prev => prev + 1);
                        }} 
                      />
                    )}
                  </motion.div>
                )}

                {currentView === 'history' && (
                  <motion.div
                    key="view-history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <History 
                      initialQuery={initialSearchQuery}
                      onClearInitialQuery={() => setInitialSearchQuery(null)}
                      onNavigateToPlayback={(eventId: string) => {
                        setCurrentView('playback');
                        setInitialPlaybackEventId(eventId);
                      }}
                    />
                  </motion.div>
                )}

                {currentView === 'skills' && (
                  <motion.div
                    key="view-skills"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Skills />
                  </motion.div>
                )}

                {currentView === 'settings' && selectedDevice && (
                  <motion.div
                    key="view-settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <SettingsComponent device={selectedDevice} />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        )}

      </div>
    </div>
  );
}
