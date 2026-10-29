import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, User, BrainCircuit, ExternalLink, Play, 
  Clock, ShieldAlert, ArrowRight, Image as ImageIcon, Flame, 
  CheckCircle2, AlertTriangle, HelpCircle, HeartPulse, Mic
} from 'lucide-react';
import { mockTimeline } from '../data';
import { TimelineEvent } from '../types';

interface HistoryProps {
  onNavigateToPlayback: (eventId: string) => void;
  initialQuery?: string | null;
  onClearInitialQuery?: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
  keyframes?: TimelineEvent[];
}

export function History({ onNavigateToPlayback, initialQuery, onClearInitialQuery }: HistoryProps) {
  const [query, setQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const lastHandledQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (isAiMode && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiMode]);

  // Handle initial query passed from Dashboard warning counters (with deduplication ref)
  useEffect(() => {
    if (initialQuery && lastHandledQueryRef.current !== initialQuery) {
      lastHandledQueryRef.current = initialQuery;
      setQuery(initialQuery);
      triggerSearch(initialQuery);
      if (onClearInitialQuery) {
        onClearInitialQuery();
      }
    }
  }, [initialQuery]);

  const triggerSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsAiMode(true);
    setMessages(prev => {
      // Prevent adding duplicate consecutive user messages
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.role === 'user' && lastMsg.content === searchQuery) {
        return prev;
      }
      return [...prev, { role: 'user', content: searchQuery }];
    });
    
    setTimeout(() => {
      let aiResponse = "基于分布式安全巡检数据库，AI Copilot 已为您精确匹配到高度相关的作业抓拍与视频片段：";
      let matchedKeyframes: TimelineEvent[] = [];

      const queryLower = searchQuery.toLowerCase();

      if (queryLower.includes('待处理') || queryLower.includes('未闭环') || queryLower.includes('待处置') || queryLower.includes('全部 sop')) {
        aiResponse = "🚨 **AI 智搜 - SOP 待处理事件归因与责任看板**：\n\n为您智能归因并定位到 **3起** 尚处于【待处理/未闭环】状态的预警事件：\n\n---\n1. 🔴 **【零容忍严重告警】高压配电柜检修未戴绝缘手套与未挂牌**\n• 👤 **责任人**：张建国（B区高压运维工程师 / 工牌 ID: HW-3012）\n• ⏰ **发生时间**：2026-08-12 10:32:05 （高压配电房）\n• 📌 **目前状态**：🔴 **待现场处置**（隐患未闭环，已触发高频广播警报，需补戴手套落锁）\n\n---\n2. 🟡 **【SOP 偏离预警】冷作间冷链生鲜切配处理超时**\n• 👤 **责任人**：李晓梅（A区冷作间切配主管 / 工牌 ID: KC-2045）\n• ⏰ **发生时间**：2026-08-12 08:50:18 （餐饮粗加工区）\n• 📌 **目前状态**：🟡 **待主管签发处置**（累计超时 17 分钟，需现场消毒或签发废弃凭证）\n\n---\n3. 🔵 **【智能优化建议】危险品仓外围夜间巡检暗光隐患**\n• 👤 **责任人**：赵安（园区安保夜巡队长 / 工牌 ID: SEC-1088）\n• ⏰ **发生时间**：2026-08-11 22:15:30 （东门危险品仓库外围）\n• 📌 **目前状态**：🔵 **待远程加载雷达**（光线较暗，推荐加载暗光隐患雷达算法）";
        matchedKeyframes = [mockTimeline[0], mockTimeline[2], mockTimeline[1]].filter(Boolean);
      } else if (queryLower.includes('绝缘手套') || queryLower.includes('严重') || queryLower.includes('高危操作')) {
        aiResponse = "🔴 **AI 智搜 - 【零容忍严重告警】责任归因与事件状态**：\n\n根据边缘 AI 视频流分析，为您精准检索到该起高危违规事件：\n\n• 👤 **责任人**：张建国（B区高压运维工程师 / 工牌 ID: HW-3012）\n• ⏰ **发生时间**：2026-08-12 10:32:05 （高压配电房）\n• 📋 **发生事件**：高压配电柜操作过程中未执行 LOTO 锁扣挂牌，且左手未佩戴高压绝缘手套。\n• 📌 **目前状态**：🔴 **待现场处置 / 违规警告中**（现场音响广播已触发，等待责任人矫正操作并补戴装备）";
        const kf = mockTimeline.find(t => t.id === 't1');
        if (kf) matchedKeyframes.push(kf);
      } else if (queryLower.includes('超时') || queryLower.includes('切配') || queryLower.includes('冷链') || queryLower.includes('偏离')) {
        aiResponse = "🟡 **AI 智搜 - 【SOP 执行偏离】责任归因与事件状态**：\n\n根据冷作间 AR 工牌第一视角流分析，为您精准检索到该起偏离事件：\n\n• 👤 **责任人**：李晓梅（A区冷作间切配主管 / 工牌 ID: KC-2045）\n• ⏰ **发生时间**：2026-08-12 08:50:18 （冷作间冷链切配区）\n• 📋 **发生事件**：冷链生鲜食材在常温区切配停留超过 32 分钟（SOP 红线 15 分钟）。\n• 📌 **目前状态**：🟡 **待主管签发核销**（系统已锁定该批次生鲜，需责任主管签发报废或二次消毒凭证）";
        const kf = mockTimeline.find(t => t.id === 't2');
        if (kf) matchedKeyframes.push(kf);
      } else if (queryLower.includes('夜间') || queryLower.includes('建议') || queryLower.includes('隐患排查')) {
        aiResponse = "🔵 **AI 智搜 - 【智能优化建议】责任归因与事件状态**：\n\n根据夜间安保巡检终端数据，为您精准检索到该起优化建议：\n\n• 👤 **责任人**：赵安（园区安保夜巡队长 / 工牌 ID: SEC-1088）\n• ⏰ **发生时间**：2026-08-11 22:15:30 （东门危险品仓库外围）\n• 📋 **发生事件**：夜间巡检光线不足，影响异常热源与化学品微量渗漏的及时识别。\n• 📌 **目前状态**：🔵 **待下发雷达模块**（已推荐远程推流“夜间排查雷达”到责任人记录仪）";
        const kf = mockTimeline.find(t => t.id === 't3');
        if (kf) matchedKeyframes.push(kf);
      } else if (queryLower.includes('消防') || queryLower.includes('通道') || queryLower.includes('整改') || queryLower.includes('占用')) {
        aiResponse = "🔍 **检索结果 - 消防安全专项巡检**：\n为您匹配到 **1起** 【消防通道违规占用】闭环记录。\n\n**核验详情**：2026-07-07 上午 07:15，系统监测到二楼消防通道堆放了装卸货物，边缘AI自动抓拍报警。目前该隐患已自动派单通知物业保洁，现场货物已被彻底清理，工单已完成整改闭环。";
        const kf = mockTimeline.find(t => t.id === 't3');
        if (kf) matchedKeyframes.push(kf);
      } else if (queryLower.includes('电') || queryLower.includes('配电') || queryLower.includes('定检') || queryLower.includes('任务') || queryLower.includes('作业')) {
        aiResponse = "⚡ **检索结果 - 高危电气作业定检**：\n为您匹配到 **1起** 【电气电箱定检任务】核验记录。\n\n**核验详情**：2026-07-07 上午 10:30，操作员严格按照 SOP 要求进行了锁扣挂牌（LOTO）程序断电检修。红外与视觉流分析未见异常，系统评分 100 分。";
        const kf = mockTimeline.find(t => t.id === 't1');
        if (kf) matchedKeyframes.push(kf);
      } else if (queryLower.includes('后厨') || queryLower.includes('备菜') || queryLower.includes('食材') || queryLower.includes('主厨') || queryLower.includes('日检')) {
        aiResponse = "🍳 **检索结果 - 食安日常自查**：\n为您匹配到 **1起** 【后厨晨间备菜日检】的多模态音频记录。\n\n**核验详情**：2026-07-07 上午 08:45，主厨通过第一视角AR眼镜口述上报了冰箱温度与砧板清洗情况。语音合成与情感匹配指标正常，食安监督核验通过。";
        const kf = mockTimeline.find(t => t.id === 't2');
        if (kf) matchedKeyframes.push(kf);
      } else {
        aiResponse = `基于您搜索的内容 "${searchQuery}"，AI 为您检索到以下待处理事项与抓拍关键帧：`;
        matchedKeyframes = [mockTimeline[0], mockTimeline[2]].filter(Boolean);
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: aiResponse,
        keyframes: matchedKeyframes
      }]);
    }, 1200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const currentQuery = query.trim();
    setQuery('');
    triggerSearch(currentQuery);
  };

  const quickQuestions = [
    { text: '消防通道违规整改了吗？', icon: <Flame className="w-4 h-4 text-amber-400" />, query: '上周的消防通道违规整改了吗？' },
    { text: '配电房安全定检记录', icon: <ShieldAlert className="w-4 h-4 text-indigo-400" />, query: '电气配电房本周的安全定检记录' },
    { text: 'A区后厨食材备菜核验', icon: <HeartPulse className="w-4 h-4 text-emerald-400" />, query: 'A区后厨今天的食材备菜核验' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 pb-24"
    >
      {/* Sticky Header with Search bar */}
      <div className="sticky top-0 z-10 pt-4 pb-2 bg-white/95 backdrop-blur-xl border-b border-slate-100">
        <h2 className="font-display font-bold text-2xl tracking-tight mb-4 flex items-center gap-2 text-slate-800">
          <BrainCircuit className="w-6 h-6 text-blue-600" />
          AI智搜
        </h2>
        
        <div className="relative">
          <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-blue-600 animate-pulse" />
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="向 Copilot 提问历史记录（例：消防通道占用...）..." 
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl py-3.5 pl-10.5 pr-12 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 shadow-inner focus:ring-2 focus:ring-blue-500/20"
            />
            <button 
              type="submit" 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Suggested Quick Queries (Shown when chat hasn't started) */}
      {!isAiMode && (
        <div className="flex flex-col gap-3 animate-fade-in mt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            推荐智能查询
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => triggerSearch(q.query)}
                className="w-full flex items-center justify-between text-left p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    {q.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                    {q.text}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-center">
            <HelpCircle className="w-8 h-8 text-blue-400/60 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">什么是多模态智搜？</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto leading-normal">
              智能检索融合了第一视角 AR 图像、现场语音音频及设备工单指标。支持按时间、操作员或特定合规条款执行图文模糊搜索。
            </p>
          </div>
        </div>
      )}

      {/* Active AI Chat view with matched keyframes */}
      <AnimatePresence>
        {isAiMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg"
          >
            {/* Box Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <BrainCircuit className="w-4 h-4 text-blue-600 animate-pulse" />
                 <span className="text-xs font-bold text-slate-800">AR多模态知识图谱</span>
              </div>
              <button 
                onClick={() => { setIsAiMode(false); setMessages([]); }} 
                className="text-[11px] text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                重置搜索
              </button>
            </div>
            
            {/* Conversation Log */}
            <div className="p-4 flex flex-col gap-6 max-h-[500px] overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center border ${
                     msg.role === 'user' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-blue-50 border-blue-200 text-blue-600'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-blue-600" />}
                  </div>
                  
                  <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">
                      {msg.role === 'user' ? '现场督导' : '安全 Copilot'}
                    </span>
                    
                    <div className={`p-4 text-xs leading-relaxed whitespace-pre-wrap shadow-xs ${
                       msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm font-medium' 
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm'
                    }`}>
                      {msg.content}
                      
                      {/* MATCHER KEYFRAMES RENDERING */}
                      {msg.role === 'ai' && msg.keyframes && msg.keyframes.length > 0 && (
                        <div className="mt-4 flex flex-col gap-3">
                          <div className="text-[10px] text-blue-700 font-bold tracking-wider uppercase border-b border-blue-100 pb-1.5 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            匹配到以下合规关键帧 (点击跳转视频)
                          </div>
                          
                          {msg.keyframes.map((kf) => (
                            <div 
                              key={kf.id}
                              className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5 hover:border-blue-300 transition-all group/kf relative overflow-hidden shadow-xs"
                            >
                              {/* Combined Image Banner */}
                              {kf.imageUrl ? (
                                <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-200">
                                  <img 
                                    src={kf.imageUrl} 
                                    alt={kf.summary} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover/kf:scale-103 transition-transform duration-300"
                                  />
                                  <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-blue-300 border border-white/10 flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3" />
                                    现场图像抓拍
                                  </div>
                                  <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-slate-200">
                                    {kf.timeLabel}
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                                    <Mic className="w-5 h-5 animate-pulse" />
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-mono text-emerald-600 font-semibold block">语音备忘留档</span>
                                    <span className="text-[10px] text-slate-500 font-mono">时长: {kf.audioDuration || "00:00"}</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Event Meta Text */}
                              <div>
                                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                  {kf.summary}
                                </h5>
                                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                                  {kf.detail}
                                </p>
                              </div>
                              
                              {/* ONE-CLICK JUMP TO PLAYBACK */}
                              <button
                                onClick={() => onNavigateToPlayback(kf.id)}
                                className="w-full mt-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-98 cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                一键跳转SOP监督并播放录像
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Dynamic Loader Bubble */}
              {messages.length > 0 && messages.length % 2 !== 0 && (
                 <div className="flex gap-3">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="ml-1">正在调阅网关抓拍并推理匹配关键帧...</span>
                  </div>
                 </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
