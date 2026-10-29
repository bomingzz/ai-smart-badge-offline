import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Download, ChevronLeft, ChevronRight, ChevronDown,
  Volume2, VolumeX, Maximize2, MoreHorizontal, 
  ArrowRight, User, List, Activity, Sparkles, CheckCircle2, 
  RotateCw, Zap, Utensils, Wrench, Flame, Check,
  Radio, Disc, Square, Video, Wifi, Cloud, Loader2,
  Lock, Info, AlertCircle, Layers, History as HistoryIcon, ExternalLink, ArrowLeftRight
} from 'lucide-react';
import { Device, TraditionalClip } from '../types';
import { traditionalClips } from '../data';
import { LiveRecordingOverlay } from './LiveRecordingOverlay';
import {
  SOPAnalysisTemplate,
  AVAILABLE_SOP_TEMPLATES,
  ClipSOPRecord,
  getDefaultSopTemplateForClip as getDefaultSopTemplateHelper,
  resolveCurrentExecutingSopId,
  resolveSopTemplateById,
  applySingleSopSelection
} from '../utils/sopSelection';

export type { SOPAnalysisTemplate, ClipSOPRecord };
export { AVAILABLE_SOP_TEMPLATES };

interface DashboardProps {
  device?: Device | null;
  onNavigateToSearch?: (query: string) => void;
  onNavigateToPlayback?: (eventId: string) => void;
  onNavigateToPlaybackClip?: (clipId: string) => void;
  onStartActivation?: () => void;
}

export interface ClipUploadStatus {
  status: 'uploading' | 'completed';
  progress: number;
}

export interface SOPExecutionRecord {
  id: string;
  sopTaskId: 'ck' | 'ee' | 'sf' | 'mf';
  sopShortName: string;
  sopFullName: string;
  icon: string;
  timelineEventId: string;
  analyzedAt: string;
  executionIndex: number;
  status?: 'passed' | 'warning' | 'failed';
  score?: number;
}

// Initial mock state: support multiple SOP analysis records per clip
const initialClipSopRecords: Record<string, ClipSOPRecord[]> = {
  tc1: [
    {
      sopTaskId: 'ck',
      sopShortName: '餐饮后厨SOP',
      sopFullName: '餐饮后厨冷链生鲜与切配卫生 SOP',
      icon: '🍳',
      timelineEventId: 't2',
      analyzedAt: '2026-07-07 14:20:20'
    }
  ],
  tc3: [
    {
      sopTaskId: 'ee',
      sopShortName: '高压电工SOP',
      sopFullName: '高压电气配电柜定检及 LOTO 规程',
      icon: '⚡',
      timelineEventId: 't1',
      analyzedAt: '2026-07-07 14:19:19'
    },
    {
      sopTaskId: 'sf',
      sopShortName: '消防巡检SOP',
      sopFullName: '园区消防通道与周界巡检 SOP',
      icon: '🚨',
      timelineEventId: 't3',
      analyzedAt: '2026-07-07 14:19:35'
    }
  ],
  tc6: [
    {
      sopTaskId: 'mf',
      sopShortName: '精密装配SOP',
      sopFullName: '离散制造精密组装与力矩紧固 SOP',
      icon: '⚙️',
      timelineEventId: 't4',
      analyzedAt: '2026-07-07 13:59:59'
    }
  ]
};

// Initial mock state: each clip's historical SOP executions
const initialClipExecutionHistory: Record<string, SOPExecutionRecord[]> = {
  tc1: [
    {
      id: 'exec_tc1_1',
      sopTaskId: 'ck',
      sopShortName: '餐饮后厨SOP',
      sopFullName: '餐饮后厨冷链生鲜与切配卫生 SOP',
      icon: '🍳',
      timelineEventId: 't2',
      analyzedAt: '2026-07-07 14:20:20',
      executionIndex: 1,
      status: 'warning',
      score: 85
    }
  ],
  tc3: [
    {
      id: 'exec_tc3_2',
      sopTaskId: 'sf',
      sopShortName: '消防巡检SOP',
      sopFullName: '园区消防通道与周界巡检 SOP',
      icon: '🚨',
      timelineEventId: 't3',
      analyzedAt: '2026-07-07 14:19:35',
      executionIndex: 2,
      status: 'passed',
      score: 98
    },
    {
      id: 'exec_tc3_1',
      sopTaskId: 'ee',
      sopShortName: '高压电工SOP',
      sopFullName: '高压电气配电柜定检及 LOTO 规程',
      icon: '⚡',
      timelineEventId: 't1',
      analyzedAt: '2026-07-07 14:19:19',
      executionIndex: 1,
      status: 'failed',
      score: 78
    }
  ],
  tc6: [
    {
      id: 'exec_tc6_1',
      sopTaskId: 'mf',
      sopShortName: '精密装配SOP',
      sopFullName: '离散制造精密组装与力矩紧固 SOP',
      icon: '⚙️',
      timelineEventId: 't4',
      analyzedAt: '2026-07-07 13:59:59',
      executionIndex: 1,
      status: 'passed',
      score: 96
    }
  ]
};

export function Dashboard({ 
  device, 
  onNavigateToSearch, 
  onNavigateToPlayback, 
  onNavigateToPlaybackClip, 
  onStartActivation 
}: DashboardProps) {
  // Video & Playback State
  const videoRef = useRef<HTMLVideoElement>(null);
  const rtcVideoRef = useRef<HTMLVideoElement>(null);
  const [allClips, setAllClips] = useState<TraditionalClip[]>(traditionalClips);
  const [selectedTraditionalClipId, setSelectedTraditionalClipId] = useState<string>('tc1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(34);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [listLayoutMode, setListLayoutMode] = useState<'grid' | 'list'>('grid');
  const [currentDay, setCurrentDay] = useState<string>('今日');
  const [showDayDropdown, setShowDayDropdown] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  const handleTogglePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  // App Remote Control: Terminal Recording & WebRTC Live Stream State
  const [isTerminalRecording, setIsTerminalRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [recordingToast, setRecordingToast] = useState<{ message: string; type: 'start' | 'stop' } | null>(null);
  const [isRecordingOverlayOpen, setIsRecordingOverlayOpen] = useState<boolean>(false);
  
  // Track upload status per clip (e.g. newly recorded clips immediately show uploading)
  const [clipUploadStatuses, setClipUploadStatuses] = useState<Record<string, ClipUploadStatus>>({});

  // SOP Execution records for clips (Array of SOPs per clip)
  const [clipSopRecords, setClipSopRecords] = useState<Record<string, ClipSOPRecord[]>>(initialClipSopRecords);
  const [clipExecutionHistory, setClipExecutionHistory] = useState<Record<string, SOPExecutionRecord[]>>(initialClipExecutionHistory);
  const [showExecutionHistoryModal, setShowExecutionHistoryModal] = useState<boolean>(false);
  const [clipExecutingSopMap, setClipExecutingSopMap] = useState<Record<string, 'ck' | 'ee' | 'sf' | 'mf'>>({});
  const [isSopSelectModalOpen, setIsSopSelectModalOpen] = useState<boolean>(false);
  const [targetClipForAnalysis, setTargetClipForAnalysis] = useState<TraditionalClip | null>(null);
  const [selectedSopTemplateId, setSelectedSopTemplateId] = useState<'ck' | 'ee' | 'sf' | 'mf'>('ck');
  
  // AI Analyzing in-flight state (正在分析的过程状态展示)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisPhaseText, setAnalysisPhaseText] = useState<string>('');
  const [justCompletedSopName, setJustCompletedSopName] = useState<string | null>(null);

  // Helper to determine the default SOP template based on device & clip metadata
  const getDefaultSopTemplateForClip = (clip: TraditionalClip): SOPAnalysisTemplate => {
    return getDefaultSopTemplateHelper(clip, device);
  };

  const activeTraditionalClip = allClips.find(c => c.id === selectedTraditionalClipId) || allClips[0];
  const currentClipRecords = clipSopRecords[selectedTraditionalClipId] || [];
  const currentClipHistory = clipExecutionHistory[selectedTraditionalClipId] || [];
  const currentExecutionCount = currentClipHistory.length > 0 
    ? currentClipHistory.length 
    : (currentClipRecords.length || 0);

  // 当前执行 SOP 计算：优先使用用户为该片段选择的 SOP，其次使用首个已分析的 SOP，最后回退至根据片段特征推荐的 SOP
  const currentExecutingSopId: 'ck' | 'ee' | 'sf' | 'mf' = resolveCurrentExecutingSopId(
    activeTraditionalClip,
    clipExecutingSopMap,
    clipSopRecords,
    device
  );

  const currentExecutingTemplate = resolveSopTemplateById(currentExecutingSopId);

  const matchedRecordForCurrentSop = 
    currentClipRecords.find(r => r.sopTaskId === currentExecutingSopId);

  const groupedClips = allClips.reduce((acc, clip) => {
    if (!acc[clip.hour]) {
      acc[clip.hour] = [];
    }
    acc[clip.hour].push(clip);
    return acc;
  }, {} as Record<string, TraditionalClip[]>);

  // Auto reload when active clip changes (if not in live recording mode)
  useEffect(() => {
    if (videoRef.current && !isTerminalRecording) {
      videoRef.current.load();
      videoRef.current.playbackRate = playbackRate;
      setVideoCurrentTime(0);
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [selectedTraditionalClipId, isTerminalRecording, playbackRate]);

  // Timer for active terminal recording duration
  useEffect(() => {
    let timer: any = null;
    if (isTerminalRecording) {
      timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTerminalRecording]);

  // Reusable core SOP analysis execution function
  const runSopAnalysis = (clip: TraditionalClip, template: SOPAnalysisTemplate) => {
    const clipId = clip.id;
    
    setIsAnalyzing(true);
    setAnalysisProgress(12);
    setAnalysisPhaseText('正在提取视频 60fps 第一视角关键帧与多模态音视频流...');

    // Switch to target clip if not already selected
    if (selectedTraditionalClipId !== clipId) {
      setSelectedTraditionalClipId(clipId);
    }

    setTimeout(() => {
      setAnalysisProgress(48);
      setAnalysisPhaseText(`正在调用 ${template.engineName} 逐帧比对 SOP 规程...`);
    }, 450);

    setTimeout(() => {
      setAnalysisProgress(82);
      setAnalysisPhaseText('正在计算置信度并生成流程合规打标...');
    }, 900);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalysisPhaseText('SOP 视频分析完成！');

      // Update clip SOP execution record (supports multiple SOPs per clip)
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const timelineEventMap: Record<string, string> = {
        ck: 't2',
        ee: 't1',
        sf: 't3',
        mf: 't4'
      };

      const newRecord: ClipSOPRecord = {
        sopTaskId: template.id,
        sopShortName: template.shortName,
        sopFullName: template.name,
        icon: template.icon,
        timelineEventId: timelineEventMap[template.id] || 't1',
        analyzedAt: `2026-07-07 ${timeStr}`
      };

      setClipSopRecords(prev => {
        const existingList = prev[clipId] || [];
        const filtered = existingList.filter(r => r.sopTaskId !== template.id);
        return {
          ...prev,
          [clipId]: [newRecord, ...filtered]
        };
      });

      // Update execution history instance
      setClipExecutionHistory(prev => {
        const existingHistory = prev[clipId] || [];
        const nextExecutionCount = existingHistory.length + 1;
        const newExecRecord: SOPExecutionRecord = {
          id: `exec_${clipId}_${Date.now()}`,
          sopTaskId: template.id,
          sopShortName: template.shortName,
          sopFullName: template.name,
          icon: template.icon,
          timelineEventId: timelineEventMap[template.id] || 't1',
          analyzedAt: `2026-07-07 ${timeStr}`,
          executionIndex: nextExecutionCount,
          status: template.id === 'ee' ? 'failed' : template.id === 'ck' ? 'warning' : 'passed',
          score: template.id === 'ee' ? 78 : template.id === 'ck' ? 85 : 98
        };
        setJustCompletedSopName(`「${template.shortName}」已完成第 ${nextExecutionCount} 次执行分析，打标已同步！`);
        return {
          ...prev,
          [clipId]: [newExecRecord, ...existingHistory]
        };
      });

      setTimeout(() => {
        setJustCompletedSopName(null);
      }, 4000);

      setTimeout(() => {
        setIsAnalyzing(false);
      }, 700);
    }, 1300);
  };

  // App Remote Terminal Recording Trigger (开启/结束录制)
  const handleToggleTerminalRecording = () => {
    if (!device) {
      setRecordingToast({
        message: '当前处于无设备绑定状态，无法录制新片段。请先点击右上角绑定工牌。',
        type: 'stop'
      });
      setTimeout(() => setRecordingToast(null), 3500);
      return;
    }

    if (!isRecordingOverlayOpen && !isTerminalRecording) {
      // START RECORDING & POP UP OVERLAY
      setIsRecordingOverlayOpen(true);
      setIsTerminalRecording(true);
      setRecordingDuration(0);
      setIsPlaying(true);
      setRecordingToast({
        message: `已向终端 [${device.name}] 下发指令：开启第一视角高清录制与实时 WebRTC 推流，正在运行在线多模态质检...`,
        type: 'start'
      });
      setTimeout(() => setRecordingToast(null), 3500);
    } else {
      // STOP RECORDING
      handleStopAndSaveRecording(recordingDuration);
    }
  };

  // Stop recording and save clip with SOP analysis
  const handleStopAndSaveRecording = (durationSecs: number) => {
    setIsRecordingOverlayOpen(false);
    setIsTerminalRecording(false);
    setIsPlaying(false);

    const mins = Math.floor(durationSecs / 60);
    const secs = durationSecs % 60;
    const durationFormatted = `${mins}'${secs.toString().padStart(2, '0')}"`;
    
    const now = new Date();
    const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const seqNo = now.getSeconds().toString().padStart(2, '0');
    const newClipId = `tc_rec_${Date.now()}`;
    
    const newClip: TraditionalClip = {
      id: newClipId,
      hour: `${now.getHours().toString().padStart(2, '0')}:00`,
      timeLabel: timeLabel,
      seqNo: seqNo,
      duration: durationFormatted === `0'00"` ? `0'10"` : durationFormatted,
      hasRedDot: true,
      hasHumanIcon: true,
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-construction-worker-working-with-wires-41619-large.mp4',
      baseSeconds: now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(),
      description: `${device?.location || '现场'} - ${device?.name || '智能工牌'} 消防通道巡检录制片段`
    };
    
    // 1. Immediately insert at the top of the list
    setAllClips(prev => [newClip, ...prev]);
    setSelectedTraditionalClipId(newClipId);

    const defaultTemplate = AVAILABLE_SOP_TEMPLATES.find(t => t.id === 'sf') || getDefaultSopTemplateForClip(newClip);

    // 2. Set initial upload state (18%)
    setClipUploadStatuses(prev => ({
      ...prev,
      [newClipId]: { status: 'uploading', progress: 18 }
    }));

    // 3. Progressive upload animation: 18% -> 52% -> 85% -> 100% (completed) -> Auto SOP Analysis
    setTimeout(() => {
      setClipUploadStatuses(prev => ({
        ...prev,
        [newClipId]: { status: 'uploading', progress: 52 }
      }));
    }, 400);

    setTimeout(() => {
      setClipUploadStatuses(prev => ({
        ...prev,
        [newClipId]: { status: 'uploading', progress: 85 }
      }));
    }, 800);

    setTimeout(() => {
      setClipUploadStatuses(prev => ({
        ...prev,
        [newClipId]: { status: 'completed', progress: 100 }
      }));
      // Auto trigger SOP Analysis using default SOP template once video upload finishes
      runSopAnalysis(newClip, defaultTemplate);
    }, 1200);
    
    setRecordingToast({
      message: `终端已停止录制，已在列表生成片段 [${timeLabel}:${seqNo}]，正在上传并自动归档「${defaultTemplate.shortName}」多模态质检结果`,
      type: 'stop'
    });
    setTimeout(() => setRecordingToast(null), 4000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 34);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setVideoCurrentTime(0);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDynamicTime = (baseSecs: number, currentSecs: number) => {
    const totalSecs = baseSecs + Math.floor(currentSecs);
    const hours = Math.floor(totalSecs / 3600) % 24;
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = activeTraditionalClip.videoUrl;
    a.download = `Raw-Footage-${activeTraditionalClip.id}.mp4`;
    a.click();
  };

  const handleGoToAiSearch = (searchQuery: string) => {
    if (onNavigateToSearch) {
      onNavigateToSearch(searchQuery);
    }
  };

  // Open unified SOP single-select modal for a clip
  const handleOpenSopSelector = (clip?: TraditionalClip) => {
    const target = clip || activeTraditionalClip;
    setTargetClipForAnalysis(target);
    const activeSopId = resolveCurrentExecutingSopId(target, clipExecutingSopMap, clipSopRecords, device);
    setSelectedSopTemplateId(activeSopId);
    setIsSopSelectModalOpen(true);
  };

  // Confirm single-selected SOP from modal, update current executing SOP, and trigger analysis
  const handleStartSopAnalysis = () => {
    if (!targetClipForAnalysis) return;
    const template = resolveSopTemplateById(selectedSopTemplateId);
    setClipExecutingSopMap(prev => applySingleSopSelection(prev, targetClipForAnalysis.id, selectedSopTemplateId));
    setIsSopSelectModalOpen(false);
    runSopAnalysis(targetClipForAnalysis, template);
  };

  return (
    <div className="space-y-4">
      {/* 0. 未绑定设备时的历史回看提示条 */}
      {!device && (
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl flex items-center gap-2 text-xs text-amber-900 shadow-xs animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          <p className="text-[11px] leading-snug">
            <span className="font-bold">云端历史录像模式：</span>
            当前账号未绑定设备，可查看与检索历史片段，<span className="text-amber-800 font-semibold underline">暂无法录制新片段</span>。
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP CARD: 视频播放器视口 (WebRTC / Linear 原始录像) */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3.5">
        
        {/* Video Player: RTC 实时流 / Linear 录像回看播放器 */}
        <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-slate-800 group/player">
          {/* HUD Remote Recording Action Toast Notification inside Video Box */}
          <AnimatePresence>
            {recordingToast && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={`absolute top-11 sm:top-12 left-3 right-3 z-30 p-2.5 sm:p-3 rounded-xl backdrop-blur-xl border text-xs font-semibold flex items-center justify-between shadow-2xl transition-all ${
                  recordingToast.type === 'start'
                    ? 'bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-rose-950/60'
                    : 'bg-emerald-950/90 border-emerald-500/60 text-emerald-100 shadow-emerald-950/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {recordingToast.type === 'start' ? (
                    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  <span className="leading-snug text-[11px] sm:text-xs tracking-wide">{recordingToast.message}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecordingToast(null);
                  }}
                  className="text-white/60 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors text-xs flex-shrink-0 ml-1.5"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {isTerminalRecording ? (
            /* --- WebRTC 实时推流与终端录制画面 --- */
            <div className="relative w-full h-full bg-slate-950">
              <video
                ref={rtcVideoRef}
                src={
                  device?.id === 'd1'
                    ? 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-40262-large.mp4'
                    : device?.id === 'd3'
                    ? 'https://assets.mixkit.co/videos/preview/mixkit-construction-worker-working-with-wires-41619-large.mp4'
                    : 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-technician-working-on-a-motherboard-42218-large.mp4'
                }
                poster={device?.imageUrl || activeTraditionalClip.imageUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />

              {/* Dynamic scanlines and live ambient shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60 pointer-events-none" />

              {/* Floating Top Left: Blinking Live REC Badge + Duration */}
              <div className="absolute top-3 left-3 bg-rose-950/90 backdrop-blur-md border border-rose-500/50 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono text-rose-200 flex items-center gap-2 z-10 shadow-lg shadow-rose-950/60">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="font-bold tracking-wider text-rose-300">REC</span>
                <span className="font-bold text-white tracking-widest">{formatTime(recordingDuration)}</span>
              </div>

              {/* Floating Top Right: WebRTC Telemetry Badge */}
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 z-10 shadow-md">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>WebRTC 1080P | 24ms</span>
              </div>

              {/* Center Screen Crosshair / Focus Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                </div>
              </div>

              {/* Bottom Right Live Audio/Fullscreen Controls */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg backdrop-blur-md border border-slate-800 transition-colors cursor-pointer"
                  title={isMuted ? '取消静音' : '静音'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <button 
                  onClick={() => {
                    if (rtcVideoRef.current) {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        rtcVideoRef.current.requestFullscreen().catch(() => {});
                      }
                    }
                  }}
                  className="p-1.5 bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg backdrop-blur-md border border-slate-800 transition-colors hidden sm:inline cursor-pointer"
                  title="全屏"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* --- Linear 原始录像回看播放器 --- */
            <>
              <video
                ref={videoRef}
                src={activeTraditionalClip.videoUrl}
                poster={activeTraditionalClip.imageUrl}
                className="w-full h-full object-cover"
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                playsInline
              />

              {/* Video shadow gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none"></div>

              {/* Big Center Play Overlay */}
              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px] cursor-pointer z-10 transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-blue-600 transition-all shadow-blue-600/30">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              )}

              {/* Custom Bottom Media Controls */}
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent flex items-center px-4 justify-between z-10 select-none">
                <div className="flex items-center">
                  <button 
                    onClick={togglePlay}
                    className="p-1 text-slate-200 hover:text-white transition-colors cursor-pointer"
                    title={isPlaying ? '暂停' : '播放'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-300 ml-2.5 min-w-[65px]">
                    {formatTime(videoCurrentTime)} / {formatTime(videoDuration || 34)}
                  </span>
                </div>

                {/* Progress Seek Bar */}
                <div className="flex-1 mx-3 sm:mx-4 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={videoDuration || 34}
                    value={videoCurrentTime}
                    onChange={(e) => {
                      const time = parseFloat(e.target.value);
                      if (videoRef.current) {
                        videoRef.current.currentTime = time;
                        setVideoCurrentTime(time);
                      }
                    }}
                    className="w-full h-1 bg-white/20 hover:bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all outline-none"
                    style={{
                      background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((videoCurrentTime / (videoDuration || 34)) * 100)}%, rgba(255, 255, 255, 0.2) ${((videoCurrentTime / (videoDuration || 34)) * 100)}%, rgba(255, 255, 255, 0.2) 100%)`
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? '取消静音' : '静音'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      if (videoRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          videoRef.current.requestFullscreen().catch(() => {});
                        }
                      }
                    }}
                    className="p-1 text-slate-300 hover:text-white transition-colors hidden sm:inline cursor-pointer"
                    title="全屏"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <button 
                    className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="更多"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>


            </>
          )}
        </div>

        {/* Video Control Action Bar */}
        <div className="flex items-center justify-between gap-1.5 pt-0.5 select-none">
          {/* Left: Date Dropdown Pill */}
          <div className="relative flex-shrink-0">
            <button 
              onClick={() => setShowDayDropdown(!showDayDropdown)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all whitespace-nowrap shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3 text-slate-400" />
              <span>{currentDay} ▽</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            {showDayDropdown && (
              <div className="absolute top-10 left-0 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-20 min-w-[120px]">
                {['今日', '昨日', '2026-07-07'].map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      setCurrentDay(day);
                      setShowDayDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-semibold cursor-pointer"
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Middle: Video Playback Rate */}
          <button
            onClick={handleTogglePlaybackRate}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all whitespace-nowrap shadow-xs cursor-pointer flex items-center gap-1"
            title="切换播放倍速 (1.0x / 1.25x / 1.5x / 2.0x)"
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>{playbackRate}X 倍速</span>
          </button>

          {/* Right: Analysis & Tools */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* SOP Analysis Trigger Button -> Opens unified SOP single-select modal */}
            <button
              onClick={() => handleOpenSopSelector(activeTraditionalClip)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
              title="点击弹出 SOP 列表，单选一个 SOP 规程进行切换或重新分析"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{matchedRecordForCurrentSop ? '重新分析' : '启动 SOP 分析'}</span>
            </button>

            {/* Clip Download Button */}
            <button 
              onClick={handleDownload}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all flex-shrink-0 shadow-xs cursor-pointer"
              title="下载当前片段"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Layout Toggle (Card Grid / Compact List) */}
            <button 
              onClick={() => setListLayoutMode(listLayoutMode === 'grid' ? 'list' : 'grid')}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all flex-shrink-0 shadow-xs cursor-pointer"
              title={listLayoutMode === 'grid' ? '切换为单列列表模式' : '切换为双列卡片模式'}
            >
              {listLayoutMode === 'grid' ? (
                <List className="w-4 h-4 text-blue-600" />
              ) : (
                <Activity className="w-4 h-4 text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* 当前执行 SOP 轻量信息与切换栏 (无输入框外边框纯文本 + 轻量切换图标与右箭头按钮) */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs select-none gap-2 min-h-[42px]">
          <span
            className="text-[11px] font-bold text-slate-700 font-mono px-2 py-1 rounded-lg bg-white border border-slate-200 flex-shrink-0 whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>当前执行SOP</span>
          </span>

          {/* 中间无边框纯文本展示 SOP 名称，右侧仅保留轻量切换图标与右箭头 */}
          <button
            type="button"
            id="current-executing-sop-select"
            onClick={() => handleOpenSopSelector(activeTraditionalClip)}
            aria-haspopup="dialog"
            aria-expanded={isSopSelectModalOpen}
            aria-label={`切换当前执行SOP，当前为 ${currentExecutingTemplate.name}`}
            className="flex-1 min-w-0 flex items-center justify-between gap-2 pl-1 pr-0.5 py-1 text-left cursor-pointer group outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-blue-200 transition-colors"
            title="点击切换当前视频关联执行的 SOP 规程"
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="flex-shrink-0 text-xs">{currentExecutingTemplate.icon}</span>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                {currentExecutingTemplate.name}
              </span>
            </div>

            <span className="flex items-center gap-0.5 text-slate-400 group-hover:text-blue-600 active:scale-95 transition-all flex-shrink-0 pl-1">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        {/* 当前视频片段执行状态提醒栏 (纯文字轻量展示 + 数字蓝色高亮 + 仅已执行时展示查看跳转) */}
        <div className="flex items-center justify-between px-1 py-0.5 text-xs select-none min-h-[20px]">
          <div className="flex items-center min-w-0">
            {currentExecutionCount > 0 ? (
              <span className="text-slate-500 text-xs whitespace-nowrap">
                已执行{' '}
                <span className="font-mono font-bold text-blue-600 mx-0.5 tabular-nums">
                  {currentExecutionCount}
                </span>{' '}
                次 SOP 分析
              </span>
            ) : (
              <span className="text-slate-400 text-xs whitespace-nowrap">
                暂未执行 SOP 分析
              </span>
            )}
          </div>

          {currentExecutionCount > 0 && (
            <button
              onClick={() => {
                if (onNavigateToPlaybackClip) {
                  onNavigateToPlaybackClip(activeTraditionalClip.id);
                } else if (onNavigateToPlayback) {
                  onNavigateToPlayback(activeTraditionalClip.id);
                }
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 cursor-pointer hover:underline flex-shrink-0 ml-2"
              title="跳转到该视频的 SOP 分析总览页面"
            >
              <span>查看</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 正在分析的过程状态展示 (In-flight Analysis State) */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              key="in-flight-analyzing-progress"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-1"
            >
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 shadow-xs flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 animate-spin">
                      <RotateCw className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-blue-950">
                      正在进行 SOP 视频多模态深度分析...
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-600 font-bold">
                    {analysisProgress}%
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-blue-200/60 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600 rounded-full"
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate">{analysisPhaseText}</span>
                  <span className="font-mono text-blue-700 font-semibold flex-shrink-0 ml-2">{activeTraditionalClip.timeLabel} 片段</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Toast when analysis completes */}
          {justCompletedSopName && (
            <motion.div
              key="just-completed-sop-toast"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{justCompletedSopName}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ========================================================================= */}
      {/* 2. 录像回放的多个片段列表 */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-4">
        {listLayoutMode === 'grid' ? (
          /* --- Grid List of Clips --- */
          <div className="flex flex-col gap-5">
            {Object.keys(groupedClips).sort((a, b) => b.localeCompare(a)).map((hour) => (
              <div key={hour} className="flex flex-col">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <h3 className="font-sans font-bold text-slate-600 text-sm">
                    {hour}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {groupedClips[hour].length} 个录制片段
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {groupedClips[hour].map((clip) => {
                    const isSelected = selectedTraditionalClipId === clip.id;
                    const clipRecords = clipSopRecords[clip.id] || [];
                    const clipHistory = clipExecutionHistory[clip.id] || [];
                    const clipExecCount = clipHistory.length > 0 ? clipHistory.length : (clipRecords.length || 0);
                    const uploadStatus = clipUploadStatuses[clip.id];
                    const isUploading = uploadStatus && uploadStatus.status === 'uploading';
                    const isUploadCompleted = uploadStatus && uploadStatus.status === 'completed';
                    
                    return (
                      <div
                        key={clip.id}
                        onClick={() => {
                          setSelectedTraditionalClipId(clip.id);
                          setIsPlaying(true);
                        }}
                        className={`cursor-pointer rounded-2xl overflow-hidden aspect-video relative border-2 transition-all duration-300 group shadow-xs ${
                          isSelected 
                            ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md shadow-blue-600/20' 
                            : isUploading
                            ? 'border-sky-400 bg-sky-50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <img 
                          src={clip.imageUrl} 
                          referrerPolicy="no-referrer"
                          alt={clip.description} 
                          className={`w-full h-full object-cover transition-all duration-500 ${
                            isSelected ? 'scale-105 saturate-110' : 'saturate-90 group-hover:saturate-100 group-hover:scale-105'
                          }`}
                        />
                        
                        {/* Dark gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

                        {/* Top Left Label Capsule */}
                        <div className="absolute top-2 left-2 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono text-white border border-white/10 flex items-center gap-1">
                          <span>{clip.timeLabel}</span>
                          {clip.seqNo && <span className="text-blue-300 font-semibold">{clip.seqNo}</span>}
                          <span className="text-slate-300">{clip.duration}</span>
                        </div>

                        {/* Top Right Uploading Mark (only when actively uploading) */}
                        {isUploading && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold shadow-xs backdrop-blur-md bg-sky-950/90 text-sky-300 border border-sky-500/50 flex items-center gap-1 animate-pulse">
                              <Loader2 className="w-2.5 h-2.5 text-sky-400 animate-spin" />
                              <span>上传中 {uploadStatus.progress}%</span>
                            </span>
                          </div>
                        )}

                        {/* Play icon overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />
                          </div>
                        </div>

                        {/* Bottom Left description truncate */}
                        <div className="absolute bottom-2 left-2 right-2 z-10">
                          <p className="text-[10px] text-white truncate font-medium drop-shadow-sm">
                            {clip.description.split('-')[1]?.trim() || clip.description}
                          </p>
                        </div>

                        {/* Upload Progress Bar across card bottom */}
                        {isUploading && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 z-20 overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${uploadStatus.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- Detailed List Mode --- */
          <div className="flex flex-col gap-2.5">
            {allClips.map((clip) => {
              const isSelected = selectedTraditionalClipId === clip.id;
              const clipRecords = clipSopRecords[clip.id] || [];
              const clipHistory = clipExecutionHistory[clip.id] || [];
              const clipExecCount = clipHistory.length > 0 ? clipHistory.length : (clipRecords.length || 0);
              const uploadStatus = clipUploadStatuses[clip.id];
              const isUploading = uploadStatus && uploadStatus.status === 'uploading';
              const isUploadCompleted = uploadStatus && uploadStatus.status === 'completed';
              
              return (
                <div
                  key={clip.id}
                  onClick={() => {
                    setSelectedTraditionalClipId(clip.id);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border min-h-[64px] ${
                    isSelected 
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs' 
                      : isUploading
                      ? 'bg-sky-50 border-sky-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Left Column: Thumbnail + Text Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                    <div className="w-16 h-11 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 relative">
                      <img src={clip.imageUrl} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover" />
                      {isUploading ? (
                        <div className="absolute inset-0 bg-sky-950/60 backdrop-blur-[0.5px] border border-sky-500/50 rounded-lg flex items-center justify-center">
                          <div className="flex flex-col items-center">
                            <Cloud className="w-3.5 h-3.5 text-sky-300 animate-bounce" />
                            <span className="text-[7.5px] font-mono text-sky-200 font-bold">{uploadStatus.progress}%</span>
                          </div>
                        </div>
                      ) : isSelected ? (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">{clip.timeLabel}:{clip.seqNo || '00'}</span>
                        <span className="text-[9px] text-slate-500 px-1 py-0.2 rounded bg-slate-100 border border-slate-200 whitespace-nowrap">
                          {clip.hour}分卷
                        </span>
                        {isUploading && (
                          <span className="text-[9px] font-mono text-sky-600 px-1.5 py-0.2 rounded bg-sky-50 border border-sky-200 flex items-center gap-1 animate-pulse whitespace-nowrap">
                            <Cloud className="w-2.5 h-2.5 text-sky-600" />
                            正在上传 ({uploadStatus.progress}%)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate block" title={clip.description}>{clip.description}</p>
                      
                      {/* Micro Progress bar while uploading */}
                      {isUploading && (
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${uploadStatus.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Upload status + Duration */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    {isUploading && (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center gap-1 animate-pulse whitespace-nowrap">
                        <Loader2 className="w-2.5 h-2.5 text-sky-600 animate-spin flex-shrink-0" />
                        <span>上传中 {uploadStatus.progress}%</span>
                      </span>
                    )}

                    <span className="text-xs font-mono text-slate-500 w-10 text-right flex-shrink-0">{clip.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. 统一 SOP 列表单选弹窗 (移动端尺寸，严格限制在 max-w-md 手机页面范围内) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSopSelectModalOpen && targetClipForAnalysis && (
          <div 
            className="fixed inset-0 max-w-md mx-auto bg-slate-900/45 backdrop-blur-[2px] z-50 flex items-center justify-center px-4 py-4"
            onClick={() => setIsSopSelectModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sop-single-select-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-[380px] p-3.5 shadow-xl flex flex-col gap-2.5 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs flex-shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 id="sop-single-select-modal-title" className="text-xs font-bold text-slate-800 truncate">
                        切换 / 选择执行 SOP 规程
                      </h3>
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200 text-[9px] font-bold text-blue-600 flex-shrink-0">
                        单选
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                      从已有 SOP 列表中单选一个规程进行切换分析
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSopSelectModalOpen(false)}
                  aria-label="关闭 SOP 选择弹窗"
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-[11px] font-bold cursor-pointer flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* SOP Single-Select Radio List */}
              <div 
                role="radiogroup" 
                aria-label="已有 SOP 规程单选列表"
                className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-0.5"
              >
                {AVAILABLE_SOP_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedSopTemplateId === tmpl.id;
                  const targetRecords = clipSopRecords[targetClipForAnalysis.id] || [];
                  const isAlreadyAnalyzed = targetRecords.some(r => r.sopTaskId === tmpl.id);
                  
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      key={tmpl.id}
                      onClick={() => setSelectedSopTemplateId(tmpl.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 active:scale-[0.99] ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500/20 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tmpl.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-[11px] font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                            {tmpl.name}
                          </h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isAlreadyAnalyzed && (
                              <span className="text-[8.5px] font-semibold px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                已分析
                              </span>
                            )}
                            <span className="text-[8.5px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                              {tmpl.stepsCount}步
                            </span>
                          </div>
                        </div>
                        <p className="text-[9.5px] text-slate-500 leading-snug mt-0.5 line-clamp-1">
                          {tmpl.desc}
                        </p>
                      </div>

                      {/* Single-select Radio Circle Indicator */}
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSopSelectModalOpen(false)}
                  className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleStartSopAnalysis}
                  className="w-2/3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>确认选择并分析</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3.5 SOP 历次执行记录明细弹窗 (严格限制在 max-w-md 移动端页面范围内) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showExecutionHistoryModal && (
          <div 
            className="fixed inset-0 max-w-md mx-auto bg-slate-900/45 backdrop-blur-[2px] z-50 flex items-center justify-center px-4 py-4"
            onClick={() => setShowExecutionHistoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-[380px] p-4 shadow-xl flex flex-col gap-3 relative overflow-hidden max-h-[82vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">当前视频片段 SOP 执行记录</h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {activeTraditionalClip.timeLabel}:{activeTraditionalClip.seqNo || '00'} · 累计已执行 {currentExecutionCount} 次 SOP
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowExecutionHistoryModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Target Clip Summary */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 relative">
                  <img src={activeTraditionalClip.imageUrl} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/60 text-[8px] font-mono text-white rounded">
                    {activeTraditionalClip.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {activeTraditionalClip.description.split('-')[1]?.trim() || activeTraditionalClip.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 font-mono">{activeTraditionalClip.hour}分卷</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">
                      共 {currentExecutionCount} 次执行
                    </span>
                  </div>
                </div>
              </div>

              {/* Execution Records List */}
              <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 max-h-[320px]">
                {currentClipHistory.map((rec, index) => {
                  const execNumber = rec.executionIndex || (currentClipHistory.length - index);
                  const isLatest = index === 0;

                  return (
                    <div 
                      key={rec.id}
                      className={`p-3 rounded-2xl border transition-all flex flex-col gap-2 ${
                        isLatest 
                          ? 'bg-blue-50/50 border-blue-200 shadow-2xs' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                            isLatest ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                          }`}>
                            第 {execNumber} 次执行
                          </span>
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            <span>{rec.icon}</span>
                            <span>{rec.sopShortName}</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {rec.analyzedAt}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-tight">
                        {rec.sopFullName}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">核验判定:</span>
                          <span className={`font-semibold flex items-center gap-0.5 ${
                            rec.status === 'failed' 
                              ? 'text-rose-600' 
                              : rec.status === 'warning' 
                              ? 'text-amber-600' 
                              : 'text-emerald-600'
                          }`}>
                            {rec.status === 'failed' ? '检出违规' : rec.status === 'warning' ? '存在偏离' : '合规通过'}
                            {rec.score && ` (${rec.score}分)`}
                          </span>
                        </div>

                        {onNavigateToPlayback && (
                          <button
                            onClick={() => {
                              setShowExecutionHistoryModal(false);
                              onNavigateToPlayback(rec.timelineEventId);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
                          >
                            <span>查看逐步骤核验</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowExecutionHistoryModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setShowExecutionHistoryModal(false);
                    runSopAnalysis(activeTraditionalClip, currentExecutingTemplate);
                  }}
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>再次执行分析</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. 全局悬浮录制中枢 (Global Floating Record Hub / FAB) */}
      {/* ========================================================================= */}
      {/* 4. 悬浮工牌录制新片段控制面板 (FLOATING ACTION BUTTON: 仅有设备绑定时显示)      */}
      {/* ========================================================================= */}
      {device && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none px-4 z-40 flex justify-end">
          <div className="pointer-events-auto">
            <AnimatePresence mode="wait">
              {isTerminalRecording ? (
                /* 录制中展开态 */
                <motion.div
                  key="active-rec-pill"
                  initial={{ scale: 0.85, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, y: 10 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                  className="flex items-center gap-3 p-1.5 pl-3.5 bg-white/95 backdrop-blur-2xl border border-rose-400 rounded-2xl shadow-xl"
                >
                  {/* Live Indicator & Timer */}
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-[10px] font-bold text-rose-600">REC</span>
                        <span className="text-xs font-bold text-slate-800 tracking-wider">{formatTime(recordingDuration)}</span>
                      </div>
                      <span className="text-[9px] font-sans text-slate-500">工牌实时录制中</span>
                    </div>
                  </div>

                  {/* Stop & Save Button */}
                  <button
                    onClick={handleToggleTerminalRecording}
                    className="flex items-center gap-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    title="结束录制并保存切片"
                  >
                    <Square className="w-3 h-3 fill-white" />
                    <span>结束录制</span>
                  </button>
                </motion.div>
              ) : (
                /* 待机态：有设备绑定，可正常唤醒录制 */
                <motion.button
                  key="idle-rec-btn"
                  initial={{ scale: 0.85, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, y: 10 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleTerminalRecording}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 border border-blue-400/40 backdrop-blur-xl group cursor-pointer transition-all"
                  title="向工牌终端下发指令：开启第一视角高清录制并接入 WebRTC 实时画面"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <Disc className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
                  <div className="flex flex-col text-left">
                    <span className="leading-tight tracking-wide">录制新片段</span>
                    <span className="text-[9px] font-normal text-blue-100 leading-tight">唤醒工牌拍摄</span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. 全屏录制新片段与在线SOP多模态质检覆盖页 (LiveRecordingOverlay)             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isRecordingOverlayOpen && device && (
          <LiveRecordingOverlay
            device={device}
            isOpen={isRecordingOverlayOpen}
            onClose={() => {
              setIsRecordingOverlayOpen(false);
              setIsTerminalRecording(false);
            }}
            onStopAndSave={handleStopAndSaveRecording}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
