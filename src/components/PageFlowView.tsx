import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, ZoomIn, ZoomOut, RotateCcw,
  Sparkles, ExternalLink, Video, BrainCircuit, Search, Layers, Smartphone, 
  Settings as GearIcon, CheckCircle2, Radio, Shield, 
  Battery, ArrowRight, Compass, Info, Play, UserCheck, Building2, 
  Zap, AlertTriangle, FileText, Sliders, Users, Flame, Check, Wifi, UploadCloud
} from 'lucide-react';
import { ViewState, SuperAppTab, AppScreen } from '../types';

interface PageFlowViewProps {
  onNavigateToAppScreen: (screen: AppScreen, view?: ViewState, superTab?: SuperAppTab) => void;
  onBackToApp: () => void;
}

export type RoleTab = 'worker' | 'team_admin' | 'org_admin' | 'overview';

interface RoleMeta {
  id: RoleTab;
  tabLabel: string;
  badge: string;
  roleName: string;
  typicalPost: string;
  coreDuty: string;
  permissionScope: string;
  shortcutNote?: string;
  tagColor: string;
}

const ROLE_METAS: Record<RoleTab, RoleMeta> = {
  worker: {
    id: 'worker',
    tabLabel: '👷 普通用户 / 巡检员路径',
    badge: '免分组·激活直达',
    roleName: '巡检员 (现场第一视角作业执行者)',
    typicalPost: '高压电工 / 后厨操作员 / 巡检安保 / 产线装配工',
    coreDuty: '佩戴轻量微型终端进行现场巡检与标准化作业，执行工牌按键唤醒/录制、接收工牌震动/语音违规提示、查看个人工单与任务指南，SOP 质检报告下载与日报审查。',
    permissionScope: '个人级受限权限：仅限本人佩戴设备、本人任务与教程指南；【免设备分组】激活后直接进入本人的回放、SOP、记忆/智搜。',
    shortcutNote: '★ 架构核心亮点：普通用户无设备分组列表，由钉钉一物一码扫码绑定即直通专属个人作业工作台。',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  team_admin: {
    id: 'team_admin',
    tabLabel: '🛡️ 班组管理员路径',
    badge: '本班组调度与监督',
    roleName: '班组管理员 (现场作业监督与调度处置者)',
    typicalPost: '巡检班长 / 车间安全员 / 厨师长 / 现场工段长',
    coreDuty: '负责本班组设备领用分配、现场 WebRTC 实时流抽查与远程录制发起、SOP 违规事件闭环确认与复核、本班组 SOP 质检报告下载与日报审查。',
    permissionScope: '班组级管理权限：限本班组管辖设备与人员，具备运行、指派与复核权；SOP 规则向导允许编排与仿真试运行，限绑定本组终端。',
    shortcutNote: '限本班组管辖设备与人员，具备现场抽查、录像导出、SOP质检复核与本组规则向导下发权限。',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  org_admin: {
    id: 'org_admin',
    tabLabel: '👑 组织管理员路径',
    badge: '全域资产管控与标准制定',
    roleName: '组织管理员 (全局资产管控与标准制定者)',
    typicalPost: '企业安全总监 / IT与设备部主管 / 安全合规总监',
    coreDuty: '负责全公司/全厂区设备资产管理、企业级 SOP 标准规程库审核与发布、AI 额度充值分配、全局模型算法库维护及跨部门审计报告归档。',
    permissionScope: '全局最高权限：全厂区跨班组可见、全局配置可写；全域资产跨部门划拨、模型包全局 Toggle、特种物品标注审批发布、全局 OTA 升级与额度充值。',
    shortcutNote: '企业级顶层权限：跨车间分组资产总览、行业大模型全网下发、AI安全核验额度月度分配与全厂审计报告归档。',
    tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  overview: {
    id: 'overview',
    tabLabel: '🌐 双轨架构全景总览',
    badge: '双轨流转对比',
    roleName: '全局双轨交互架构总览',
    typicalPost: '企业管理层 / 架构师 / 全员通用',
    coreDuty: '直观对比管理员长路径（资产大盘->班组中心->多终端调度）与普通用户短路径（免分组直达->个人回放/SOP/记忆）的双轨交互拓扑。',
    permissionScope: '全景视角对照：清晰呈现 3 级 RBAC 角色在 7 大功能模块间的流转分支与中央推流质检中枢。',
    shortcutNote: '双轨并行拓扑：直观展示管理层级逐级下发与基层作业员轻量化直通的操作流转对比。',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
};

export function PageFlowView({ onNavigateToAppScreen, onBackToApp }: PageFlowViewProps) {
  const [activeTab, setActiveTab] = useState<RoleTab>('worker');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentRole = ROLE_METAS[activeTab];

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.45), 1.5));
  };

  const resetZoom = () => {
    setZoomLevel(0.85);
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f6fb] text-slate-800 flex flex-col font-sans select-none overflow-hidden relative">
      
      {/* ========================================================================= */}
      {/* TOP FLOATING / STICKY CONTROL TOOLBAR                                    */}
      {/* ========================================================================= */}
      <header className="px-6 py-2.5 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs z-30 flex items-center justify-between gap-4 flex-wrap">
        
        {/* Left: Brand & Return to App */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>返回 App 交互演示</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  AuraVision OS · 页面流转架构图
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  RBAC 双轨拓扑 v3.6
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Role Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-1 overflow-x-auto max-w-full">
          {(['worker', 'team_admin', 'org_admin', 'overview'] as RoleTab[]).map(tabKey => {
            const meta = ROLE_METAS[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{meta.tabLabel}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-200/80 text-slate-500'
                }`}>
                  {meta.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Zoom & Canvas Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-medium text-slate-700">
            <button 
              onClick={() => handleZoom(-0.1)} 
              className="p-1.5 hover:bg-white rounded active:scale-95 transition-all text-slate-600 cursor-pointer"
              title="缩小 (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={resetZoom}
              className="px-2 py-0.5 hover:bg-white rounded active:scale-95 transition-all font-mono text-[11px] cursor-pointer"
              title="重置缩放"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button 
              onClick={() => handleZoom(0.1)} 
              className="p-1.5 hover:bg-white rounded active:scale-95 transition-all text-slate-600 cursor-pointer"
              title="放大 (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={resetZoom}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 active:scale-95 text-xs flex items-center gap-1 cursor-pointer"
            title="自适应全景视图"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px] font-medium">重置</span>
          </button>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* ROLE INFO & PERMISSION BOUNDARY BANNER                                    */}
      {/* ========================================================================= */}
      <div className="bg-white px-6 py-2 border-b border-slate-200/90 shadow-2xs flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              当前角色定位:
            </span>
            <span className={`px-2 py-0.5 rounded font-bold ${currentRole.tagColor}`}>
              {currentRole.roleName}
            </span>
          </div>
          <div className="text-slate-500 flex items-center gap-1.5">
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-slate-700">典型岗位:</span>
            <span>{currentRole.typicalPost}</span>
          </div>
          <div className="text-slate-600 hidden lg:flex items-center gap-1.5">
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-slate-700">权限范围:</span>
            <span className="truncate max-w-xl text-slate-600">{currentRole.permissionScope}</span>
          </div>
        </div>

        {currentRole.shortcutNote && (
          <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 hidden md:block">
            {currentRole.shortcutNote}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FLOW MAP CANVAS VIEWPORT                                                 */}
      {/* ========================================================================= */}
      <div 
        ref={canvasRef}
        className="flex-1 overflow-auto bg-[#f4f6fb] relative p-8 md:p-12 cursor-default"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px'
        }}
      >
        
        {/* Scale transformation wrapper */}
        <div 
          className="transition-transform duration-200 origin-top-left flex flex-col items-start min-w-[3400px] min-h-[1600px] relative pb-32"
          style={{ transform: `scale(${zoomLevel})` }}
        >

          {/* Render Tab Specific Flow Canvas */}
          {activeTab === 'worker' && (
            <WorkerFlowCanvas onNavigateToAppScreen={onNavigateToAppScreen} />
          )}

          {activeTab === 'team_admin' && (
            <TeamAdminFlowCanvas onNavigateToAppScreen={onNavigateToAppScreen} />
          )}

          {activeTab === 'org_admin' && (
            <OrgAdminFlowCanvas onNavigateToAppScreen={onNavigateToAppScreen} />
          )}

          {activeTab === 'overview' && (
            <DualTrackOverviewCanvas onNavigateToAppScreen={onNavigateToAppScreen} />
          )}

          {/* ===================================================================== */}
          {/* FLOW LEGEND AND STATS BAR (BOTTOM)                                    */}
          {/* ===================================================================== */}
          <div className="mt-16 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-md flex items-center justify-between gap-8 max-w-4xl">
            <div className="flex items-center gap-6 text-xs text-slate-700 flex-wrap">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                图例与业务规范说明:
              </span>
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 bg-blue-600 inline-block" />
                <span>正交折线 (页面流转关系)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-blue-600 transform rotate-45 inline-block" />
                <span>判定菱形 (业务分支)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  免分组直通
                </span>
                <span>巡检员专属捷径</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                  全屏推流+实时SOP
                </span>
                <span>LiveRecordingOverlay</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
              3大角色视图 · 7大功能模块 · 全屏实时推流与SOP解析闭环
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

{/* ============================================================================= */}
{/* 1. WORKER FLOW CANVAS: 普通用户 / 巡检员路径 (免分组·激活直达)                   */}
{/* ============================================================================= */}
function WorkerFlowCanvas({ onNavigateToAppScreen }: { onNavigateToAppScreen: PageFlowViewProps['onNavigateToAppScreen'] }) {
  return (
    <div className="relative">
      
      {/* SVG Connecting Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <marker id="blue-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#2563eb" />
          </marker>
          <marker id="green-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#059669" />
          </marker>
        </defs>

        {/* Step 1 -> Bypass Card */}
        <path d="M 370 320 L 440 320" fill="none" stroke="#059669" strokeWidth="2.5" markerEnd="url(#green-arrow)" />

        {/* Bypass Card -> Step 2 (巡检员个人工作台) */}
        <path d="M 720 320 L 780 320" fill="none" stroke="#059669" strokeWidth="2.5" markerEnd="url(#green-arrow)" />

        {/* Step 2 -> Step 3 (Dashboard 视频回看) */}
        <path d="M 1140 280 L 1220 280" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow)" />

        {/* Step 3 (FAB 录制新片段) -> Step 4 (LiveRecordingOverlay 全屏推流+实时SOP解析) */}
        <path d="M 1580 680 L 1660 680 L 1660 320 L 1700 320" fill="none" stroke="#dc2626" strokeWidth="3" markerEnd="url(#blue-arrow)" />

        {/* Step 4 (结束录制入库) -> Step 5 (SOP 监督) */}
        <path d="M 2100 320 L 2180 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow)" />

        {/* Step 5 (预警穿透) -> Step 6 (AI智搜与记忆) */}
        <path d="M 2540 240 L 2620 240 L 2620 320 L 2660 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow)" />

        {/* Step 6 (一键联动SOP) -> Step 5 */}
        <path d="M 2660 520 L 2580 520 L 2580 460 L 2540 460" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5,4" markerEnd="url(#blue-arrow)" />

        {/* Step 2 (个人设置) -> Step 7 (设备音量与指南) */}
        <path d="M 1140 180 L 1180 180 L 1180 100 L 3060 100 L 3060 320 L 3100 320" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#blue-arrow)" />
      </svg>

      {/* Nodes Row */}
      <div className="flex items-start gap-12 relative z-20 pt-6">

        {/* Node 1: 应用启动 / 佩戴开机 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-emerald-600 tracking-wide uppercase">Stage 01 · 现场佩戴</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>终端开机与应用启动</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">无屏终端</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">高压电工/后厨作业员佩戴微型终端开机，指示灯常绿就绪</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">AuraVision 微型工牌</div>
                  <div className="text-[10px] text-emerald-600 font-mono">POWER ON · READY</div>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">&lt;50g 无屏设计</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/80">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>作业员物理终端状态</span>
                <span className="text-emerald-600 font-mono">88% 电量</span>
              </div>
              <div className="text-[11px] text-slate-500 space-y-1">
                <p>• 本地按键：长按 2s 唤醒 / 双击启动现场录制</p>
                <p>• 提示方式：机身震动 + 违规双蜂鸣播报</p>
                <p>• 通信方式：5G 全时低功耗音视频推流透传</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>近场自动握手广播已就绪，等待 App 免密绑定识别</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 space-y-1">
            <p className="text-emerald-700 font-semibold">注: 作业员无需手动选择车间或班组，工牌出库已与工号绑定。</p>
          </div>
        </div>

        {/* Bypass Indicator: 免设备分组直通卡片 */}
        <div className="w-[280px] pt-40">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-lg space-y-2.5 border border-emerald-400/40 relative">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>免设备分组直通</span>
            </div>
            <div className="text-sm font-bold leading-snug">
              普通用户无设备分组列表，激活后直接进入本人工作台
            </div>
            <p className="text-[11px] text-emerald-100 leading-relaxed">
              根据最新 PRD 架构规范：普通巡检员跳过车间与班组资产管理界面，直接进入与本人绑定的个人视频回放、SOP 质检及记忆库。
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-200 border-t border-emerald-500/50">
              <span>自动识别工号: EP-0841</span>
              <span className="font-mono">BYPASS →</span>
            </div>
          </div>
        </div>

        {/* Node 2: 巡检员专属个人工作台 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">Stage 02 · 个人中枢</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>巡检员个人工作台</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">个人视图</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">仅限本人佩戴设备与本人今日任务指标</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative group hover:border-blue-400 transition-all">
            {/* Header */}
            <div className="bg-[#f8fafc] px-4 pt-3 pb-2.5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    张
                  </div>
                  <span className="font-bold text-sm text-slate-900">张工 (个人工作台)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  电工01号 · 在线
                </span>
              </div>
            </div>

            {/* Quick Actions 4 Core Modules */}
            <div className="p-4 space-y-3 bg-slate-50/50">
              <div className="bg-white rounded-2xl p-3 border-2 border-blue-500 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>个人巡检任务中枢</span>
                  <span className="text-blue-600 text-[10px]">今日 1 项待复核</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center gap-1">
                    <Video className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px] font-bold text-blue-900">视频回看</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 flex flex-col items-center gap-1">
                    <BrainCircuit className="w-5 h-5 text-cyan-600" />
                    <span className="text-[10px] font-bold text-cyan-900">SOP监督</span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 flex flex-col items-center gap-1">
                    <Search className="w-5 h-5 text-purple-600" />
                    <span className="text-[10px] font-bold text-purple-900">AI智搜</span>
                  </div>
                </div>
              </div>

              {/* Task Guideline Card */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 flex justify-between">
                  <span>当前工单: A区高压配电房定检</span>
                  <span className="text-[10px] text-amber-600 font-semibold">执行中</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  必须拉下高压隔离刀闸并挂安全警示锁扣，双手佩戴绝缘手套持高压验电笔验电。
                </p>
              </div>
            </div>

            {/* Floating button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onNavigateToAppScreen('badge_app', 'dashboard')}
                className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-md hover:bg-blue-700 flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>进入页面体验</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">
            <p className="text-blue-600 font-semibold">直达个人控制：点击视频回看或右上角齿轮调节提示音量。</p>
          </div>
        </div>

        {/* Node 3: Dashboard 视频回看 (本人视频与推流) */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">Stage 03 · 现场视口</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>视频回看与远程录制发起</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">双模推流</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">调阅本人第一视角录像，通过 FAB 球唤醒工牌录制新片段</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative group hover:border-blue-400 transition-all">
            {/* Top Bar */}
            <div className="bg-white px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">电工巡检-01号 (本人设备)</span>
              <span className="text-[10px] font-mono text-emerald-600">88% 5G在线</span>
            </div>

            {/* Video Viewport */}
            <div className="relative bg-slate-900 aspect-video flex items-center justify-center text-white overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-mono bg-black/60 px-1.5 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>WebRTC 1080P 60FPS</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/40">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
              <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-300">
                00:15 / 00:34
              </div>
            </div>

            {/* Analysis Strip */}
            <div className="mx-3 my-2 p-2 bg-slate-900 text-white rounded-xl flex items-center justify-between border-2 border-blue-400 shadow-md">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] px-1 py-0.2 rounded bg-blue-600 font-bold">已分析</span>
                <span className="text-[11px] font-bold truncate">⚡ 高压电气配电柜定检</span>
              </div>
              <button className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-extrabold flex items-center gap-0.5 ring-2 ring-blue-300 animate-pulse">
                <span>查看SOP</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Video Clips List */}
            <div className="p-3 space-y-2 bg-white flex-1">
              <div className="text-[10px] font-bold text-slate-500">今日个人录像切片 (3条)</div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span>14:19:00 配电房定检</span>
                <span className="text-[10px] text-rose-600 font-bold">1项违规P0</span>
              </div>
            </div>

            {/* FAB Button Callout */}
            <div className="p-3 bg-red-50 border-t-2 border-red-500 flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-900">触发录制新片段:</span>
              <div className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>🔴 录制新片段</span>
              </div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onNavigateToAppScreen('badge_app', 'dashboard')}
                className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-md hover:bg-blue-700 flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>进入页面体验</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">
            <p className="text-red-600 font-semibold">点击「录制新片段」立即唤起全屏覆盖页：上屏实时推流，下屏实时SOP解析！</p>
          </div>
        </div>

        {/* Node 4: LiveRecordingOverlay (全屏RTC推流 + 实时SOP解析) */}
        <div className="w-[400px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-red-600 tracking-wide uppercase">Stage 04 · 全屏覆盖页</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>WebRTC 实时推流 + 实时 SOP 解析</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold">LiveRecordingOverlay</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">如用户截图红框标注：上屏 WebRTC 播放，下屏展示实时多模态 SOP 核验过程</p>
          </div>

          <div className="w-full bg-slate-950 text-white rounded-3xl shadow-2xl border-2 border-red-500/80 overflow-hidden flex flex-col relative group">
            {/* Top Live Video HUD */}
            <div className="p-3 bg-black/60 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-xs font-bold text-red-400">REC 00:34</span>
                <span className="text-[10px] text-slate-400">| 1080P 60FPS</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-600/80 text-white text-[10px] font-bold">
                实时在线质检中
              </span>
            </div>

            {/* Video Player Box Mock */}
            <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden border-b border-slate-800">
              <div className="absolute inset-4 border border-white/20 rounded flex items-center justify-center">
                <div className="w-8 h-8 border border-red-500/60 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-[9px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-emerald-400">
                AI边缘推流低延迟: 24ms
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] bg-black/70 px-2 py-0.5 rounded text-white font-mono">
                5G 满格
              </div>
            </div>

            {/* Lower Section: Real-Time SOP Multimodal Analysis Timeline (Matching Screenshot) */}
            <div className="p-3.5 space-y-2.5 bg-slate-900/90 flex-1">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  园区消防通道定检 SOP 实时解析
                </span>
                <span className="text-[9px] font-mono text-cyan-400 animate-pulse">STREAMING...</span>
              </div>

              {/* Step 1: Failed with Photo thumbnail (Red Pill) */}
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                    <span className="text-xs font-bold text-rose-200">消防通道净空判定</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500 text-white">不合规 P0</span>
                </div>
                <div className="flex gap-2 items-center bg-black/40 p-1.5 rounded-lg text-[10px] text-rose-300">
                  <div className="w-10 h-8 rounded bg-slate-800 border border-rose-400/40 shrink-0 flex items-center justify-center text-[7px] text-slate-400">
                    抓拍图
                  </div>
                  <span className="leading-tight">视觉检测：高位托盘货物违规堆叠，侵占通道净宽达 45cm</span>
                </div>
              </div>

              {/* Step 2: Edge Workorder dispatched (Blue Pill) */}
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/50 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
                    <span className="text-xs font-bold text-blue-200">边缘AI工单实时下发</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500 text-white">通过</span>
                </div>
                <div className="text-[10px] text-slate-300">工单通知已秒级下发至现场责任人</div>
              </div>

              {/* Step 3: In Progress Stream */}
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 font-bold text-[10px] flex items-center justify-center">3</span>
                  <span>现场声光复验与通道恢复</span>
                </div>
                <span className="text-[10px] text-cyan-400 animate-pulse font-mono">核验中...</span>
              </div>
            </div>

            {/* Bottom Button to Stop & Save */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">生成分卷并流式上传:</span>
              <button 
                onClick={() => onNavigateToAppScreen('badge_app', 'playback')}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md active:scale-95 cursor-pointer"
              >
                结束录制并完成质检
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">
            <p className="text-red-600 font-semibold">
              流转动作: 点击「结束录制」生成新切片置顶，流式上传 (18%→100%)，质检结果自动归档至 SOP 监督页！
            </p>
          </div>
        </div>

        {/* Node 5: SOP 监督与核验链 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-cyan-600 tracking-wide uppercase">Stage 05 · 个人质检报告</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>SOP 监督与逐步骤核验</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-semibold">多模态证据</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">中文序号里程碑 (`一`~`四`)、标准规范与现场抓拍秒级快跳</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative group hover:border-blue-400 transition-all">
            <div className="bg-white px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">个人质检核验</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                下载质检报告
              </span>
            </div>

            {/* Bento Alert */}
            <div className="p-3 bg-slate-900 text-white space-y-2">
              <div className="text-[10px] font-bold text-slate-300 flex justify-between">
                <span>本人待闭环预警</span>
                <span className="text-rose-400 font-mono">1项严重违规</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-between">
                <span className="text-xs font-bold">高压验电未戴绝缘手套</span>
                <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">P0</span>
              </div>
            </div>

            {/* Steps Timeline (一、二、三) */}
            <div className="p-3 space-y-2.5 bg-slate-50/60 flex-1">
              <div className="p-2 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">步骤一：断电隔离挂牌</span>
                  <span className="text-emerald-600 text-[10px]">合规 ✓</span>
                </div>
                <span className="text-[9px] text-slate-500">检测到 LOTO 挂牌动作，安全锁扣就位</span>
              </div>

              <div className="p-2 bg-white rounded-xl border-2 border-rose-500 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-700">步骤二：验电笔验电</span>
                  <span className="text-rose-600 text-[10px]">不合规 P0</span>
                </div>
                <div className="text-[9px] text-rose-700 bg-rose-50 p-1 rounded font-mono">
                  双手未检测到绝缘手套直接持笔
                </div>
              </div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onNavigateToAppScreen('badge_app', 'playback')}
                className="px-2.5 py-1 rounded-full bg-cyan-600 text-white text-[11px] font-bold shadow-md hover:bg-cyan-700 flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>进入页面体验</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">
            <p className="text-cyan-700 font-semibold">点击右上角可一键下载个人质检报告与违规抓拍证据卡。</p>
          </div>
        </div>

        {/* Node 6: AI 智搜与作业指南记忆 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-purple-600 tracking-wide uppercase">Stage 06 · 智能问答</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>AI 智搜与规范指南检索</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">语义反查</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">自然语言/语音提问作业规范，召回本人历史抓拍并一键直达</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative group hover:border-blue-400 transition-all">
            <div className="bg-white p-3 border-b border-slate-200">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                <Search className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-slate-800">配电房接地线是否挂牌？</span>
              </div>
            </div>

            <div className="p-3 space-y-2 bg-slate-50/50 flex-1">
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="text-[10px] font-bold text-purple-900 block">AI 作业指南建议</span>
                <p className="text-[10px] text-purple-800 leading-tight">
                  依据国家电网《高压配电检修规范》第 4.2 条：挂设地线必须先验电、确认无电压后立即挂接并悬挂标识牌。
                </p>
              </div>

              <div className="bg-white rounded-xl p-2 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-700">本人历史抓拍关键帧</span>
                <div className="aspect-video bg-slate-800 rounded flex items-center justify-center text-xs text-slate-400">
                  关键帧证据 14:19:15
                </div>
                <button 
                  onClick={() => onNavigateToAppScreen('badge_app', 'playback')}
                  className="w-full py-1 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>一键跳转SOP监督时间轴定位</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onNavigateToAppScreen('badge_app', 'history')}
                className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[11px] font-bold shadow-md hover:bg-purple-700 flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>进入页面体验</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">
            <p className="text-purple-700 font-semibold">闭环流转：支持随时语音提问现场规程，并反查历史巡检抓拍。</p>
          </div>
        </div>

        {/* Node 7: 设备主控与使用指南 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Stage 07 · 个人设置</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>设备音量调节与操作指南</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">硬件设置</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">调节终端播报音量，阅读《第一视角对焦指南》</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative group hover:border-blue-400 transition-all">
            <div className="bg-slate-900 text-white p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">工牌提示音量调节</span>
                <span className="font-mono text-emerald-400">75%</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="p-3 space-y-2 bg-slate-50/50 flex-1">
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10px] space-y-1">
                <span className="font-bold text-slate-800 block">📚 第一视角对焦指南</span>
                <p className="text-slate-500 leading-tight">工牌佩戴于胸前正中位置，确保镜头与视线平齐，俯角约 15° 为最佳动作抓拍视野。</p>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10px] space-y-1">
                <span className="font-bold text-slate-800 block">💡 指示灯交互说明</span>
                <p className="text-slate-500 leading-tight">常绿：待机正常；红灯闪烁：正在录制；黄灯长鸣：SOP 动作不合规预警。</p>
              </div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onNavigateToAppScreen('badge_app', 'settings')}
                className="px-2.5 py-1 rounded-full bg-slate-800 text-white text-[11px] font-bold shadow-md hover:bg-slate-900 flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>进入页面体验</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">
            <p className="text-slate-600 font-semibold">注: 普通用户仅具备个人设备参数调节权，无全局配额与跨部门分发权。</p>
          </div>
        </div>

      </div>

    </div>
  );
}

{/* ============================================================================= */}
{/* 2. TEAM ADMIN FLOW CANVAS: 班组管理员路径 (班组调度与现场监督)                 */}
{/* ============================================================================= */}
function TeamAdminFlowCanvas({ onNavigateToAppScreen }: { onNavigateToAppScreen: PageFlowViewProps['onNavigateToAppScreen'] }) {
  return (
    <div className="relative">
      
      {/* SVG Connecting Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <marker id="blue-arrow-2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#2563eb" />
          </marker>
        </defs>

        {/* Step 1 -> Step 2 */}
        <path d="M 370 320 L 440 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-2)" />

        {/* Step 2 -> Diamond */}
        <path d="M 800 320 L 880 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-2)" />

        {/* Diamond -> Step 3 (选中设备进入回放抽查) */}
        <path d="M 1000 320 L 1080 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-2)" />

        {/* Step 3 -> Step 4 (远程录制中枢) */}
        <path d="M 1440 320 L 1520 320" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#blue-arrow-2)" />

        {/* Step 4 -> Step 5 (班组SOP质检大盘) */}
        <path d="M 1920 320 L 2000 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-2)" />

        {/* Step 5 -> Step 6 (AI智搜归因) */}
        <path d="M 2360 320 L 2440 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-2)" />

        {/* Step 6 -> Step 7 (SOP向导与仿真调试) */}
        <path d="M 2800 320 L 2880 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-2)" />

        {/* Step 7 -> Step 8 (班组运维设置) */}
        <path d="M 3240 320 L 3320 320" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-2)" />
      </svg>

      <div className="flex items-start gap-12 relative z-20 pt-6">

        {/* Step 1: 班长登录 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">Stage 01 · 班组入口</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>巡检班长 / 安全员登录</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">班长权限</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">进入 SuperApp 工作台，点击「督察官」进入本班组设备中心</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-sm text-slate-900">电力运检一班 · 调度中心</span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold">班长: 李班长</span>
            </div>
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1.5">
              <span className="text-xs font-bold text-blue-900">本班组管辖概览</span>
              <p className="text-[11px] text-blue-800">• 管辖工牌: 3 台全部在线</p>
              <p className="text-[11px] text-blue-800">• 现场作业员: 张工、王工、李工</p>
              <p className="text-[11px] text-blue-800">• 待办事项: 1 项高压定检违规待复核确认</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigateToAppScreen('badge_app', 'devices')}
                className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 active:scale-95 cursor-pointer"
              >
                设备管理中心 →
              </button>
              <button 
                onClick={() => onNavigateToAppScreen('badge_app', 'devices_empty')}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                title="查看无设备空页面"
              >
                无设备空态
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: 本班组设备中心 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-sky-600 tracking-wide uppercase">Stage 02 · 班组资产</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>本班组设备中心 (限本组)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">DeviceList</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">仅限管辖范围设备，支持 BLE 近场扫描配对新机</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">电力运检一班 (3台)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">全员在线</span>
            </div>

            {/* Device 1 */}
            <div className="p-2.5 bg-blue-50/60 rounded-xl border-2 border-blue-500 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">电工巡检-01号 (张工)</div>
                <span className="text-[10px] text-slate-500">220kV西郊变电站 · A区 (88%)</span>
              </div>
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">抽查</span>
            </div>

            {/* Device 2 */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between opacity-80">
              <div>
                <div className="text-xs font-bold text-slate-800">电工巡检-02号 (王工)</div>
                <span className="text-[10px] text-slate-500">西郊主控室 · B区 (92%)</span>
              </div>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold">查看</span>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-sky-700 bg-sky-50 p-2 rounded-lg border border-sky-200">
              <span>+ 钉钉扫码激活新工牌</span>
              <span className="font-bold">4阶段向导 ›</span>
            </div>
          </div>
        </div>

        {/* Decision Diamond: 选择在网终端 */}
        <div className="flex flex-col items-center justify-center pt-52 relative">
          <div className="w-28 h-28 bg-white border-2 border-blue-600 shadow-md transform rotate-45 flex items-center justify-center">
            <div className="transform -rotate-45 text-center px-1">
              <span className="text-[11px] font-bold text-slate-900 block leading-tight">
                选择终端<br/>或配对新机
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: 现场实时抽查与视频回看 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">Stage 03 · 实时抽查</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>现场抽查与视频回放</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">1080P推流</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">抽查作业员第一视角实时流，远程发起录制，导出原始分卷</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="aspect-video bg-slate-900 rounded-xl relative flex items-center justify-center text-white">
              <span className="text-[10px] font-mono text-emerald-400 absolute top-2 left-2">抽查: 张工第一视角</span>
              <Play className="w-6 h-6 fill-white" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">14:00 小时分卷录像</span>
              <span className="text-blue-600 font-bold text-[10px] cursor-pointer">导出原始MP4 ↓</span>
            </div>
            <div className="p-2 bg-red-50 rounded-xl border border-red-200 flex justify-between items-center text-xs">
              <span className="font-bold text-red-900">远程指令控制:</span>
              <span className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold text-[10px]">🔴 远程下发录制</span>
            </div>
          </div>
        </div>

        {/* Step 4: LiveRecordingOverlay 远程推流与在线质检 */}
        <div className="w-[380px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-red-600 tracking-wide uppercase">Stage 04 · 在线核验</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>远程录制推流与在线SOP</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold">全屏覆盖</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">班长端同步接收实时推流画面与逐步骤 AI 质检研判结果</p>
          </div>

          <div className="w-full bg-slate-950 text-white rounded-3xl shadow-xl border-2 border-red-500 p-4 space-y-3">
            <div className="aspect-video bg-slate-900 rounded-lg relative flex items-center justify-center text-white">
              <span className="text-[9px] font-mono text-red-400 absolute top-2 left-2">🔴 REC 00:34 | 实时推流</span>
              <span className="text-xs text-slate-400">现场第一视角画面传输中...</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl space-y-1.5 border border-slate-800">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-cyan-400">SOP 实时打标进展</span>
                <span className="text-rose-400">步骤一已触发告警</span>
              </div>
              <p className="text-[10px] text-slate-400">通道占用 45cm，系统已向现场作业员工牌下发高频震动提示</p>
            </div>
          </div>
        </div>

        {/* Step 5: 班组 SOP 质检大盘 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-cyan-600 tracking-wide uppercase">Stage 05 · 质检复核</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>班组 SOP 质检与闭环复核</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-semibold">质检大盘</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">班组待处理预警看板 (P0/P1/P2)、多SOP聚合与报告下载</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2">
              <div className="text-[10px] font-bold text-slate-300">本班组预警看板 (共 3 项)</div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1.5 bg-rose-500/30 rounded-lg text-rose-300 text-[10px] font-bold">1 严重违规</div>
                <div className="p-1.5 bg-amber-500/30 rounded-lg text-amber-300 text-[10px] font-bold">1 中度偏离</div>
                <div className="p-1.5 bg-blue-500/30 rounded-lg text-blue-300 text-[10px] font-bold">1 建议</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>张工 · 高压配电定检</span>
                <span className="text-rose-600 text-[10px]">待班长确认</span>
              </div>
              <span className="text-[10px] text-slate-500">验电笔未戴手套，已出具逐步骤证据截图</span>
            </div>

            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'playback')}
              className="w-full py-1.5 bg-cyan-600 text-white rounded-xl text-xs font-bold"
            >
              下载本班组 SOP 质检周报
            </button>
          </div>
        </div>

        {/* Step 6: 班组 AI 智搜归因 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-purple-600 tracking-wide uppercase">Stage 06 · 归因反查</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>班组违规事件 AI 智搜归因</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">责任看板</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">语义反查本班组作业异常，精准穿透责任人与关键帧</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="p-2 bg-slate-100 rounded-xl flex items-center gap-2 text-xs">
              <Search className="w-4 h-4 text-purple-600" />
              <span>查询: 本周未戴手套作业记录</span>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
              <span className="text-xs font-bold text-purple-900">责任归因：张工 (EP-0841)</span>
              <p className="text-[10px] text-purple-700">发生于 220kV 西郊站 A 区，匹配 1 张关键帧违规证据</p>
            </div>
            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'history')}
              className="w-full py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold"
            >
              一键联动 SOP 监督时间轴
            </button>
          </div>
        </div>

        {/* Step 7: 4阶段 SOP 向导与仿真调试 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-violet-600 tracking-wide uppercase">Stage 07 · 规程编排</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>SOP 向导与仿真调试</span>
              <span className="text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-800 font-semibold">限本组终端</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">编排班组规程，上传示范视频在线调试，仅限绑定本组工牌</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-2.5">
            <div className="p-2 bg-violet-900 text-white rounded-xl text-xs font-bold flex justify-between">
              <span>CreateSOPWizard 向导</span>
              <span className="text-[10px] text-violet-300">阶段 3/4</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-600">
              <p>• 阶段 1: 规程基础参数 (上限 40s)</p>
              <p>• 阶段 2: 强顺序步骤链编排 (P0/P1)</p>
              <p className="text-amber-600 font-bold">• 阶段 3: 本地视频在线调试试运行</p>
              <p className="text-slate-400">• 阶段 4: 设备绑定 (仅限本组 3 台)</p>
            </div>
            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'skills')}
              className="w-full py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold"
            >
              启动向导编排体验
            </button>
          </div>
        </div>

        {/* Step 8: 班组设备运维 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Stage 08 · 班组运维</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>班组设备主控与OTA</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">固件升级</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">调节终端参数，查看 AI 配额余量，下发本班组 OTA 升级</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">本班组 OTA 远程升级</span>
              <span className="text-blue-600 font-mono text-[10px]">v2.4.1 就绪</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-1">
              <p>• 3台工牌处于 Wi-Fi 充电桩状态</p>
              <p>• 支持 A/B 双分区无感热刷入</p>
            </div>
            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'settings')}
              className="w-full py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              进入班组设置主控
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

{/* ============================================================================= */}
{/* 3. ORG ADMIN FLOW CANVAS: 组织管理员路径 (全域资产管控与算法发布)               */}
{/* ============================================================================= */}
function OrgAdminFlowCanvas({ onNavigateToAppScreen }: { onNavigateToAppScreen: PageFlowViewProps['onNavigateToAppScreen'] }) {
  return (
    <div className="relative">
      
      {/* SVG Connecting Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <marker id="purple-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#7c3aed" />
          </marker>
        </defs>

        {/* Step 1 -> Step 2 */}
        <path d="M 370 320 L 440 320" fill="none" stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#purple-arrow)" />

        {/* Step 2 -> Diamond */}
        <path d="M 800 320 L 880 320" fill="none" stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#purple-arrow)" />

        {/* Diamond -> Step 3 */}
        <path d="M 1000 320 L 1080 320" fill="none" stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#purple-arrow)" />

        {/* Step 3 -> Step 4 */}
        <path d="M 1440 320 L 1520 320" fill="none" stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#purple-arrow)" />

        {/* Step 4 -> Step 5 */}
        <path d="M 1920 320 L 2000 320" fill="none" stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#purple-arrow)" />

        {/* Step 5 -> Step 6 */}
        <path d="M 2360 320 L 2440 320" fill="none" stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#purple-arrow)" />

        {/* Step 6 -> Step 7 */}
        <path d="M 2800 320 L 2880 320" fill="none" stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#purple-arrow)" />

        {/* Step 7 -> Step 8 */}
        <path d="M 3240 320 L 3320 320" fill="none" stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#purple-arrow)" />
      </svg>

      <div className="flex items-start gap-12 relative z-20 pt-6">

        {/* Step 1: 企业安全总监登录 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-purple-600 tracking-wide uppercase">Stage 01 · 最高权限入口</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>安全总监 / IT设备部主管</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">全局最高权限</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">全厂区跨班组可见、全局配置可写、大模型额度调度分配</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-sm text-slate-900">企业全域安监治理中枢</span>
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">总监视角</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1.5 text-[11px] text-purple-900">
              <p>• 在网工牌: 全厂 84 台 (在线 79 台)</p>
              <p>• 车间/班组: 6 个车间 · 14 个巡检班组</p>
              <p>• 大模型调用: 本月剩余 42,800 次 (可充值分配)</p>
            </div>
            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'devices')}
              className="w-full py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-purple-700 active:scale-95 cursor-pointer"
            >
              进入全厂资产大盘与分组管控 →
            </button>
          </div>
        </div>

        {/* Step 2: 全厂区资产大盘与分组中心 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase">Stage 02 · 全域资产大盘</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>全厂区设备资产与分组划拨</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">完全控制</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">跨区域设备模糊检索、新建/编辑分组、跨部门批量调整归属</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>全厂区设备分组列表</span>
              <span className="text-blue-600 cursor-pointer">+ 新建车间分组</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="font-semibold">⚡ 电力运检一班</span>
                <span className="text-slate-500">3台在线</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="font-semibold">🍳 餐饮后厨加工组</span>
                <span className="text-slate-500">5台在线</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="font-semibold">🏭 总装车间二段</span>
                <span className="text-slate-500">12台在线</span>
              </div>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200 text-[10px] text-indigo-800">
              支持跨部门批量划拨工牌、绑定工号与佩戴责任人
            </div>
          </div>
        </div>

        {/* Decision Diamond: 跨组调度与任意切换 */}
        <div className="flex flex-col items-center justify-center pt-52 relative">
          <div className="w-28 h-28 bg-white border-2 border-purple-600 shadow-md transform rotate-45 flex items-center justify-center">
            <div className="transform -rotate-45 text-center px-1">
              <span className="text-[11px] font-bold text-slate-900 block leading-tight">
                全厂设备<br/>任意切换
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: 全域视频监控与切片调阅 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">Stage 03 · 全局调阅</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>全厂跨区域视频调阅与导出</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">任意抽查</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">调阅全厂任意工牌第一视角，全部小时分卷浏览与原始视频导出</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="aspect-video bg-slate-900 rounded-xl relative flex items-center justify-center text-white">
              <span className="text-[9px] font-mono text-purple-400 absolute top-2 left-2">全局巡检矩阵监控</span>
              <Play className="w-6 h-6 fill-white" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">全量 MP4 分卷导出</span>
              <span className="text-blue-600 font-bold text-[10px] cursor-pointer">一键批量导出</span>
            </div>
          </div>
        </div>

        {/* Step 4: 实时推流与在线质检中枢 */}
        <div className="w-[380px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-red-600 tracking-wide uppercase">Stage 04 · 推流中枢</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>WebRTC 实时推流与在线SOP</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold">全局录制</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">全屏推流覆盖页，全流程实时多模态核验进度与违规阻断</p>
          </div>

          <div className="w-full bg-slate-950 text-white rounded-3xl shadow-xl border-2 border-red-500 p-4 space-y-2.5">
            <div className="aspect-video bg-slate-900 rounded-lg relative flex items-center justify-center text-white">
              <span className="text-[9px] font-mono text-red-400 absolute top-2 left-2">🔴 REC 00:34 实时推流</span>
              <span className="text-xs text-slate-400">大模型多模态流式抽帧分析</span>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-300">
              消防通道侵占 P0 告警已自动同步至安委会风险总览看板
            </div>
          </div>
        </div>

        {/* Step 5: 企业级 SOP 质检与审计归档 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-cyan-600 tracking-wide uppercase">Stage 05 · 审计归档</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>全局 SOP 质检与大任务归档</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-semibold">全局大盘</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">跨部门待处理预警看板、全厂质检报告中心归档与合规打标</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-slate-300">全厂安全大盘 (Bento)</span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                <div className="p-1 bg-rose-500/30 rounded text-rose-300">3 P0违规</div>
                <div className="p-1 bg-amber-500/30 rounded text-amber-300">8 P1偏离</div>
                <div className="p-1 bg-blue-500/30 rounded text-blue-300">15 建议</div>
              </div>
            </div>
            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'playback')}
              className="w-full py-1.5 bg-cyan-600 text-white rounded-xl text-xs font-bold"
            >
              导出全厂安全合规审计报告 (PDF/Excel)
            </button>
          </div>
        </div>

        {/* Step 6: 全域 AI 智搜穿透归因 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-purple-600 tracking-wide uppercase">Stage 06 · 全域检索</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>全域 AI 多模态智搜归因</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">全厂追溯</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">跨部门自然语言查询任意隐患事件，秒级召回关键帧证据</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="p-2 bg-slate-100 rounded-xl flex items-center gap-2 text-xs">
              <Search className="w-4 h-4 text-purple-600" />
              <span>全厂检索: 任意未挂地线操作记录</span>
            </div>
            <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 text-[10px] text-purple-800 space-y-1">
              <p className="font-bold">跨部门召回 3 处隐患点</p>
              <p>1. 西郊站 A区 (电工班 · 张工)</p>
              <p>2. 南区开闭所 (电工二班 · 李工)</p>
            </div>
            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'history')}
              className="w-full py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold"
            >
              一键联动时间轴回溯
            </button>
          </div>
        </div>

        {/* Step 7: 模型算法中心与企业规程发布 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-violet-600 tracking-wide uppercase">Stage 07 · 算法中枢</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>模型中心与规则审批发布</span>
              <span className="text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-800 font-semibold">审批发布</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">行业算法库分类、硬件包Toggle全局开关、特殊物品标注审批发布</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>行业专属视觉推理大模型</span>
              <span className="text-emerald-600 text-[10px]">全部已激活</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span>电力安监专属视觉模型 v4.2</span>
                <span className="text-blue-600 font-bold">全局Toggle开</span>
              </div>
              <div className="flex justify-between">
                <span>特种耐压绝缘线钳标注库</span>
                <span className="text-emerald-600 font-bold">已审批发布</span>
              </div>
            </div>
            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'skills')}
              className="w-full py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold"
            >
              新增 SOP 规则并向全网终端下发
            </button>
          </div>
        </div>

        {/* Step 8: 系统运维主控与AI额度大盘 */}
        <div className="w-[360px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Stage 08 · 资产主控</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>AI 额度充值分配与全局 OTA</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">运维主控</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">月度 AI 核验额度大盘充值与跨部门分配、全局固件远程 OTA 推送</p>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="p-3 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-xl space-y-1">
              <div className="flex justify-between text-xs">
                <span>月度 AI 安全核验额度大盘</span>
                <span className="text-emerald-400 font-bold">充值与分配</span>
              </div>
              <div className="text-sm font-extrabold font-mono text-cyan-300">42,800 / 50,000 次</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600">
              全局 OTA: 一键向全厂 84 台终端下发最新安全固件
            </div>
            <button 
              onClick={() => onNavigateToAppScreen('badge_app', 'settings')}
              className="w-full py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              进入全局运维主控中心
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

{/* ============================================================================= */}
{/* 4. DUAL-TRACK OVERVIEW CANVAS: 双轨拓扑全景总览 (长短路径对照)                 */}
{/* ============================================================================= */}
function DualTrackOverviewCanvas({ onNavigateToAppScreen }: { onNavigateToAppScreen: PageFlowViewProps['onNavigateToAppScreen'] }) {
  return (
    <div className="relative">
      
      {/* SVG Connecting Paths for Dual Track */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <marker id="blue-arrow-dual" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#2563eb" />
          </marker>
          <marker id="green-arrow-dual" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#059669" />
          </marker>
          <marker id="red-arrow-dual" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#dc2626" />
          </marker>
        </defs>

        {/* Track 1: App Start -> DeviceList */}
        <path d="M 370 260 L 450 260" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-dual)" />

        {/* Track 1: DeviceList -> Admin Workbench */}
        <path d="M 810 260 L 890 260" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-dual)" />

        {/* Track 1: Workbench -> Dashboard */}
        <path d="M 1250 260 L 1330 260" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#blue-arrow-dual)" />

        {/* Track 2: App Start -> Bypass Badge -> Worker Workbench */}
        <path d="M 370 820 L 450 820" fill="none" stroke="#059669" strokeWidth="3" markerEnd="url(#green-arrow-dual)" />
        <path d="M 810 820 L 890 820" fill="none" stroke="#059669" strokeWidth="3" markerEnd="url(#green-arrow-dual)" />
        <path d="M 1250 820 L 1330 820" fill="none" stroke="#059669" strokeWidth="3" markerEnd="url(#green-arrow-dual)" />

        {/* Live Recording Overlay Connections (from both dashboards) */}
        <path d="M 1690 320 L 1800 320 L 1800 520 L 1860 520" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#red-arrow-dual)" />
        <path d="M 1690 760 L 1800 760 L 1800 560 L 1860 560" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#red-arrow-dual)" />

        {/* Overlay -> SOP Supervision */}
        <path d="M 2260 540 L 2360 540 L 2360 260 L 2440 260" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#blue-arrow-dual)" />
        <path d="M 2260 540 L 2360 540 L 2360 820 L 2440 820" fill="none" stroke="#059669" strokeWidth="2" markerEnd="url(#green-arrow-dual)" />
      </svg>

      <div className="space-y-16 pt-4">

        {/* TRACK 1: 管理员 / 班组长长路径 (设备分组与多终端总览) */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold tracking-wide uppercase shadow-sm">
              路径一 · 管理员 / 班组长长路径
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              全域资产管控与调度（设备分组中心 → 选中终端 → 完整业务工作台）
            </h2>
          </div>

          <div className="flex items-start gap-12 relative z-20">
            {/* T1-N1 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border border-slate-200 p-4 space-y-2">
              <span className="text-xs font-bold text-blue-600">统一入口</span>
              <div className="font-bold text-sm text-slate-900">SuperApp 统一工作台</div>
              <p className="text-[11px] text-slate-500">管理员登录后，点击「督察官」进入设备分组总览</p>
            </div>

            {/* T1-N2 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border-2 border-blue-500 p-4 space-y-2">
              <span className="text-xs font-bold text-blue-600">资产大盘</span>
              <div className="font-bold text-sm text-slate-900">DeviceList: 设备分组与多终端中心</div>
              <p className="text-[11px] text-slate-500">新建/编辑分组、跨部门划拨、钉钉一物一码激活新机</p>
            </div>

            {/* T1-N3 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border border-slate-200 p-4 space-y-2">
              <span className="text-xs font-bold text-blue-600">调度工作台</span>
              <div className="font-bold text-sm text-slate-900">已选设备工作台 (管理视角)</div>
              <p className="text-[11px] text-slate-500">支持任意切换设备，调阅视频回放、SOP监督、AI智搜、模型配置</p>
            </div>

            {/* T1-N4 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border border-slate-200 p-4 space-y-2">
              <span className="text-xs font-bold text-blue-600">现场抽查</span>
              <div className="font-bold text-sm text-slate-900">Dashboard: 现场推流抽查与录像</div>
              <p className="text-[11px] text-slate-500">抽查任意第一视角画面，导出原始MP4，远程唤醒录制</p>
            </div>

            {/* T1-N5 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border border-slate-200 p-4 space-y-2 ml-48">
              <span className="text-xs font-bold text-cyan-600">大盘审计</span>
              <div className="font-bold text-sm text-slate-900">Playback: 班组/全厂 SOP 质检大盘</div>
              <p className="text-[11px] text-slate-500">Bento 待处理预警看板 (P0/P1/P2)、多SOP聚合、质检周报下载</p>
            </div>
          </div>
        </div>

        {/* CENTRAL CONNECTING HUB: 全屏实时推流与在线质检解析 (LiveRecordingOverlay) */}
        <div className="ml-[1860px] w-[400px] -my-6 relative z-30">
          <div className="bg-slate-950 text-white rounded-3xl shadow-2xl border-2 border-red-500 p-4 space-y-2.5 ring-8 ring-red-500/10">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="text-xs font-extrabold text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                【中央推流质检中枢】LiveRecordingOverlay
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-red-600 font-bold">全屏覆盖</span>
            </div>
            <div className="aspect-video bg-slate-900 rounded-lg relative flex items-center justify-center text-xs">
              <span className="text-emerald-400 font-mono text-[10px] absolute top-2 left-2">上屏: WebRTC 1080P 实时推流</span>
              <span>现场实时视频流</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-cyan-400">下屏: 实时 SOP 逐步骤多模态核验</span>
              <p className="text-[10px] text-slate-400">• 步骤一: 消防通道净空 (不合规P0 · 抓拍存证)</p>
              <p className="text-[10px] text-slate-400">• 步骤二: 边缘AI工单下发 (通过)</p>
              <p className="text-[10px] text-slate-400">• 步骤三: 现场声光复验 (流式推理中)</p>
            </div>
            <div className="text-[10px] text-amber-300 font-bold text-right pt-1">
              结束录制即时切片置顶 + 流式上传 + 自动归档
            </div>
          </div>
        </div>

        {/* TRACK 2: 普通用户 / 巡检员短路径 (免分组·激活直达) */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold tracking-wide uppercase shadow-sm">
              路径二 · 普通用户 / 巡检员短路径
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              个人作业闭环（免设备分组 · 激活直接进入本人的回放、SOP、记忆/智搜）
            </h2>
          </div>

          <div className="flex items-start gap-12 relative z-20">
            {/* T2-N1 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border border-slate-200 p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-600">现场开机</span>
              <div className="font-bold text-sm text-slate-900">微型终端佩戴与 App 启动</div>
              <p className="text-[11px] text-slate-500">&lt;50g 无屏工牌，开机常绿，近场广播就绪</p>
            </div>

            {/* T2-N2: Bypass */}
            <div className="w-[360px] bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl shadow-xl p-4 space-y-2 border border-emerald-400/40">
              <span className="text-xs font-bold text-amber-300">【免设备分组直通捷径】</span>
              <div className="font-bold text-sm">跳过设备分组列表，钉钉扫码激活直通本人终端</div>
              <p className="text-[11px] text-emerald-100">自动匹配登录工号，省去车间与设备分组选择，直接进入个人主页</p>
            </div>

            {/* T2-N3 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border-2 border-emerald-500 p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-600">个人主页</span>
              <div className="font-bold text-sm text-slate-900">巡检员专属工作台 (本人视图)</div>
              <p className="text-[11px] text-slate-500">展示张工个人设备状态、今日定检任务与 4 大快捷入口</p>
            </div>

            {/* T2-N4 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border border-slate-200 p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-600">本人视频</span>
              <div className="font-bold text-sm text-slate-900">Dashboard: 本人录像与录制发起</div>
              <p className="text-[11px] text-slate-500">点击 FAB「🔴 录制新片段」唤起全屏推流与实时SOP解析</p>
            </div>

            {/* T2-N5 */}
            <div className="w-[360px] bg-white rounded-3xl shadow-lg border border-slate-200 p-4 space-y-2 ml-48">
              <span className="text-xs font-bold text-emerald-600">个人质检</span>
              <div className="font-bold text-sm text-slate-900">Playback: 本人 SOP 质检报告与核验</div>
              <p className="text-[11px] text-slate-500">逐步骤一~四核验详情、现场抓拍秒级快跳、下载个人报告</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
