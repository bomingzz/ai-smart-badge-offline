import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Upload, Check, Sparkles, Image as ImageIcon,
  Building2, User, Globe, RotateCcw, Eye, ShieldCheck,
  Loader2, AlertCircle, X, Radio
} from 'lucide-react';
import { BadgeCardConfig } from '../types';

interface BadgeCardGeneratorModalProps {
  isOpen: boolean;
  mode?: 'employee' | 'admin';
  initialConfig: BadgeCardConfig;
  onClose: () => void;
  onSaveAndSync: (newConfig: BadgeCardConfig, navigateToBadge?: boolean) => void;
}

export const DEFAULT_BADGE_CARD_CONFIG: BadgeCardConfig = {
  theme: 'dark',
  companyName: '',
  logoType: 'moredian',
  name: '沈知予',
  primaryRole: '品牌设计师',
  secondaryRole: '设计总监',
  website: '',
  portraitUrl: '/assets/aistudio/shenzhiyu_clean_bg.png',
  empNo: '012345'
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function drawMoredianLogo(ctx: CanvasRenderingContext2D, x: number, y: number, isDark: boolean) {
  ctx.save();
  ctx.translate(x, y);
  const scale = 1.25;
  ctx.scale(scale, scale);

  // Left M Pillar
  ctx.fillStyle = isDark ? '#FFFFFF' : '#4C6EF5';
  ctx.beginPath();
  ctx.moveTo(2, 4);
  ctx.lineTo(15, 8.5);
  ctx.lineTo(15, 25);
  ctx.lineTo(10.5, 23.5);
  ctx.lineTo(10.5, 11.5);
  ctx.lineTo(6.5, 10);
  ctx.lineTo(6.5, 24.5);
  ctx.lineTo(2, 26);
  ctx.closePath();
  ctx.fill();

  // Right M Pillar
  ctx.fillStyle = isDark ? '#E4E4E7' : '#4263EB';
  ctx.beginPath();
  ctx.moveTo(34, 4);
  ctx.lineTo(21, 8.5);
  ctx.lineTo(21, 25);
  ctx.lineTo(25.5, 23.5);
  ctx.lineTo(25.5, 11.5);
  ctx.lineTo(29.5, 10);
  ctx.lineTo(29.5, 24.5);
  ctx.lineTo(34, 26);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export async function renderBadgeCardToCanvas(
  canvas: HTMLCanvasElement,
  config: BadgeCardConfig
): Promise<string> {
  // Enforce exact 480x720 hardware resolution
  canvas.width = 480;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const isDark = config.theme === 'dark';

  // 1. Background Layer
  if (isDark) {
    const bgGrad = ctx.createLinearGradient(0, 0, 480, 720);
    bgGrad.addColorStop(0, '#020202');
    bgGrad.addColorStop(0.55, '#121212');
    bgGrad.addColorStop(1, '#242424');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 480, 720);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, 480, 720);
    bgGrad.addColorStop(0, '#F6F6F6');
    bgGrad.addColorStop(0.6, '#EBEBEB');
    bgGrad.addColorStop(1, '#DFDFDF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 480, 720);
  }

  // 2. Portrait Layer
  if (config.portraitUrl) {
    try {
      const portraitImg = await loadImage(config.portraitUrl);
      const isFull480x720Backdrop =
        config.portraitUrl.includes('shenzhiyu_clean_bg') && isDark;

      if (isFull480x720Backdrop) {
        ctx.drawImage(portraitImg, 0, 0, 480, 720);
      } else {
        // Draw portrait anchored at bottom-right (x: 130..480, y: 175..720)
        const targetW = 350;
        const targetH = 545;
        const targetX = 480 - targetW;
        const targetY = 720 - targetH;

        const offscreen = document.createElement('canvas');
        offscreen.width = targetW;
        offscreen.height = targetH;
        const offCtx = offscreen.getContext('2d');
        if (offCtx) {
          const imgRatio = portraitImg.width / portraitImg.height;
          const boxRatio = targetW / targetH;
          let drawW = targetW;
          let drawH = targetH;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > boxRatio) {
            drawW = targetH * imgRatio;
            offsetX = (targetW - drawW) / 2;
          } else {
            drawH = targetW / imgRatio;
            offsetY = 0;
          }

          offCtx.drawImage(portraitImg, offsetX, offsetY, drawW, drawH);

          // Soft edge feather on top and left so portrait blends seamlessly
          offCtx.globalCompositeOperation = 'destination-in';
          const maskX = offCtx.createLinearGradient(0, 0, 52, 0);
          maskX.addColorStop(0, 'rgba(0,0,0,0)');
          maskX.addColorStop(1, 'rgba(0,0,0,1)');
          offCtx.fillStyle = maskX;
          offCtx.fillRect(0, 0, targetW, targetH);

          const maskY = offCtx.createLinearGradient(0, 0, 0, 52);
          maskY.addColorStop(0, 'rgba(0,0,0,0)');
          maskY.addColorStop(1, 'rgba(0,0,0,1)');
          offCtx.fillStyle = maskY;
          offCtx.fillRect(0, 0, targetW, targetH);

          ctx.drawImage(offscreen, targetX, targetY);
        }
      }
    } catch {
      // Fallback if custom image fails
    }
  }

  // 3. Company Logo + Company Name (Top-Left)
  let companyTextStartX = 94;
  if (config.logoType === 'custom' && config.customLogoUrl) {
    try {
      const logoImg = await loadImage(config.customLogoUrl);
      const maxH = 34;
      const ratio = logoImg.width / Math.max(1, logoImg.height);
      const drawW = Math.min(72, maxH * ratio);
      ctx.drawImage(logoImg, 38, 48, drawW, maxH);
      companyTextStartX = 38 + drawW + 12;
    } catch {
      drawMoredianLogo(ctx, 36, 46, isDark);
    }
  } else {
    drawMoredianLogo(ctx, 36, 46, isDark);
  }

  ctx.fillStyle = isDark ? '#FFFFFF' : '#232533';
  ctx.font = '600 28px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(config.companyName || '魔点科技', companyTextStartX, 75);

  // 4. Employee Name (Large Display Weight)
  ctx.fillStyle = isDark ? '#FFFFFF' : '#EA8A2A';
  ctx.font = '900 64px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(config.name || '沈知予', 36, 152);

  // 5. Primary Role
  ctx.fillStyle = isDark ? '#F4F4F5' : '#27272A';
  ctx.font = '500 38px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(config.primaryRole || '品牌设计师', 38, 214);

  // 6. Secondary Role with Em-Dash Line (Optional)
  if (config.secondaryRole && config.secondaryRole.trim()) {
    ctx.fillStyle = isDark ? '#FFFFFF' : '#52525B';
    ctx.fillRect(38, 250, 46, 3.5);

    ctx.fillStyle = isDark ? '#E4E4E7' : '#3F3F46';
    ctx.font = '500 26px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(config.secondaryRole.trim(), 96, 260);
  }

  // 7. Bottom-Left Vertical Website (Rotated -90 deg reading bottom-to-top)
  const websiteText = (config.website && config.website.trim()) || 'www.moredian.com';
  ctx.save();
  ctx.translate(58, 650);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = isDark ? '#E4E4E7' : '#3F3F46';
  ctx.font = '400 24px "Inter", "Helvetica Neue", Arial, sans-serif';
  ctx.fillText(websiteText, 0, 0);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

type CommSimulationMode = 'normal' | 'fail_receive' | 'fail_refresh';
type CommStepStatus = 'idle' | 'running' | 'success' | 'error';

export function BadgeCardGeneratorModal({
  isOpen,
  mode = 'employee',
  initialConfig,
  onClose,
  onSaveAndSync
}: BadgeCardGeneratorModalProps) {
  const [draft, setDraft] = useState<BadgeCardConfig>(initialConfig);
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [generatedPngUrl, setGeneratedPngUrl] = useState<string | null>(
    initialConfig.generatedPngDataUrl || null
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPortraitPreviewOpen, setIsPortraitPreviewOpen] = useState<boolean>(false);
  const [adminSaveSuccess, setAdminSaveSuccess] = useState<boolean>(false);

  // Two-stage terminal communication states
  const [simMode, setSimMode] = useState<CommSimulationMode>('normal');
  const [receiveStatus, setReceiveStatus] = useState<CommStepStatus>('idle');
  const [refreshStatus, setRefreshStatus] = useState<CommStepStatus>('idle');

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const portraitInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(initialConfig);
      setGeneratedPngUrl(initialConfig.generatedPngDataUrl || null);
      setStep('form');
      setIsPortraitPreviewOpen(false);
      setAdminSaveSuccess(false);
      setReceiveStatus('idle');
      setRefreshStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const isCommBusy = receiveStatus === 'running' || refreshStatus === 'running';

  const handleUploadCustomLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft(prev => ({
          ...prev,
          logoType: 'custom',
          customLogoUrl: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadCustomPortrait = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft(prev => ({
          ...prev,
          portraitUrl: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmGeneratePng = async () => {
    setIsGenerating(true);
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 480;
    offscreenCanvas.height = 720;
    const pngDataUrl = await renderBadgeCardToCanvas(offscreenCanvas, draft);
    setGeneratedPngUrl(pngDataUrl);
    setIsGenerating(false);
    setReceiveStatus('idle');
    setRefreshStatus('idle');
    setStep('preview');
  };

  // Two-stage communication with terminal E-Ink badge:
  // Stage 1: Terminal receives 480x720 PNG image
  // Stage 2: Terminal E-Ink screen refreshes display
  const handleStartEInkSync = (overrideMode?: CommSimulationMode) => {
    if (!generatedPngUrl || isCommBusy) return;
    const activeMode = overrideMode || simMode;

    // Reset and start Stage 1: Receiving image
    setReceiveStatus('running');
    setRefreshStatus('idle');

    setTimeout(() => {
      if (activeMode === 'fail_receive') {
        setReceiveStatus('error');
        setRefreshStatus('idle');
        return;
      }

      // Stage 1 succeeded -> start Stage 2: E-Ink screen refresh
      setReceiveStatus('success');
      setRefreshStatus('running');

      setTimeout(() => {
        if (activeMode === 'fail_refresh') {
          setRefreshStatus('error');
          return;
        }

        // Stage 2 succeeded -> Save & automatically return to Device Info page
        setRefreshStatus('success');
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const updatedConfig: BadgeCardConfig = {
          ...draft,
          generatedPngDataUrl: generatedPngUrl,
          generatedAt: timeStr
        };
        onSaveAndSync(updatedConfig, false);

        setTimeout(() => {
          onClose();
        }, 650);
      }, 650);
    }, 600);
  };

  const handleSaveAdminConfig = async () => {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 480;
    offscreenCanvas.height = 720;
    const pngDataUrl = await renderBadgeCardToCanvas(offscreenCanvas, draft);
    const updatedConfig: BadgeCardConfig = {
      ...draft,
      generatedPngDataUrl: pngDataUrl
    };
    onSaveAndSync(updatedConfig, false);
    setAdminSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  // ===========================================================================
  // MODE A: ADMINISTRATOR MAINTENANCE PAGE (企业工牌信息维护 - 多终端中心全局配置)
  // ===========================================================================
  if (mode === 'admin') {
    return (
      <div className="flex flex-col gap-3.5 pb-20 text-slate-800">
        {/* Top Mobile Sub-Navigation Bar */}
        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            id="close-admin-badge-btn"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>返回多终端中心</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-700">企业工牌信息维护</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
              管理员
            </span>
          </div>
        </div>

        {/* Admin Notice Banner */}
        <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-indigo-900 leading-relaxed">
            在此统一维护全企业终端的<strong>公司名称 + Logo</strong> 与<strong>公司网址</strong>；各工牌的员工姓名与岗位由终端绑定的企业组织架构花名册自动匹配同步，无需管理员逐人手动编辑。
          </p>
        </div>

        <div className="space-y-3">
          {/* Field 1: 公司名称 + Logo */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>1. 公司名称 + Logo</span>
              </label>
              <div className="flex items-center gap-1.5">
                {draft.logoType === 'custom' && draft.customLogoUrl && (
                  <img
                    src={draft.customLogoUrl}
                    alt="已上传Logo"
                    className="h-5 w-auto max-w-[44px] object-contain rounded border border-slate-200 bg-slate-900 px-1"
                  />
                )}
                <button
                  type="button"
                  id="admin-upload-logo-btn"
                  onClick={() => logoInputRef.current?.click()}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer border flex items-center gap-1 transition-colors ${
                    draft.logoType === 'custom'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <Upload className="w-2.5 h-2.5" />
                  <span>上传Logo</span>
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCustomLogo}
                  className="hidden"
                />
              </div>
            </div>

            <input
              type="text"
              id="badge-company-input"
              maxLength={10}
              value={draft.companyName}
              onChange={(e) => setDraft(prev => ({ ...prev, companyName: e.target.value.slice(0, 10) }))}
              placeholder="请输入公司名称，限制10字符"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 text-xs font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400 outline-none transition-colors"
            />
          </div>

          {/* Field 2: 公司网址 */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>2. 公司网址（左下角竖排展示）</span>
            </label>
            <input
              type="text"
              id="badge-website-input"
              maxLength={50}
              value={draft.website}
              onChange={(e) => setDraft(prev => ({ ...prev, website: e.target.value.slice(0, 50) }))}
              placeholder="请输入网址，限制50字符"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 text-xs font-mono font-bold text-slate-800 placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 outline-none transition-colors"
            />
          </div>

          {/* Field 3: 员工姓名与岗位自动同步说明 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>3. 员工姓名与岗位信息</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                组织架构自动同步
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              终端绑定员工账号后自动拉取企业通讯录中的姓名、主岗位与职级头衔，无需管理员逐台终端手动维护。
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              id="save-admin-badge-config-btn"
              onClick={handleSaveAdminConfig}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{adminSaveSuccess ? '已保存并下发全企业终端 · 正在返回...' : '保存并同步至全企业终端'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // MODE B: EMPLOYEE BADGE CARD PAGE (员工端：只读企业信息 + 个人图片上传/查看 + 预览下发)
  // ===========================================================================
  const displayCompanyName = draft.companyName?.trim() || '魔点科技';
  const displayWebsite = draft.website?.trim() || 'www.moredian.com';

  return (
    <div className="flex flex-col gap-3.5 pb-20 text-slate-800">
      {/* Top Mobile Sub-Navigation Bar */}
      <div className="flex items-center justify-between pt-0.5">
        {step === 'form' ? (
          <button
            type="button"
            id="close-badge-generator-btn"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>返回设备设置</span>
          </button>
        ) : (
          <button
            type="button"
            id="back-to-edit-badge-btn"
            disabled={isCommBusy}
            onClick={() => setStep('form')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 disabled:opacity-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>返回修改信息</span>
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700">
            {step === 'form' ? '设置工牌身份名片' : '名片生成预览'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-mono font-bold">
            480×720 PNG
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* STEP 1: EMPLOYEE VIEW (Read-Only Corporate Info + Portrait Upload)    */}
      {/* ===================================================================== */}
      {step === 'form' ? (
        <div className="space-y-3">
          {/* Read-Only Section 1: 公司名称 + Logo */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>1. 公司名称 + Logo</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold">
                管理员维护 · 只读
              </span>
            </div>

            <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{displayCompanyName}</span>
              <div className="flex items-center gap-1.5">
                {draft.logoType === 'custom' && draft.customLogoUrl ? (
                  <img
                    src={draft.customLogoUrl}
                    alt="企业Logo"
                    className="h-5 w-auto max-w-[56px] object-contain rounded bg-slate-900 px-1.5 py-0.5"
                  />
                ) : (
                  <div className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono font-bold flex items-center gap-1">
                    <span>M</span>
                    <span className="text-[9px] font-normal text-slate-300">企业Logo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Read-Only Section 2: 员工姓名与岗位层级 */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>2. 员工姓名与岗位层级</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold">
                管理员维护 · 只读
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="block text-[10px] text-slate-400">姓名</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {draft.name || '沈知予'}
                </span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="block text-[10px] text-slate-400">主岗位</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {draft.primaryRole || '品牌设计师'}
                </span>
              </div>
            </div>

            {draft.secondaryRole && draft.secondaryRole.trim() && (
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">副职级 / 补充头衔</span>
                <span className="text-xs font-bold text-slate-700">
                  —— {draft.secondaryRole.trim()}
                </span>
              </div>
            )}
          </div>

          {/* Read-Only Section 3: 公司网址 */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>3. 公司网址（左下角竖排展示）</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold">
                管理员维护 · 只读
              </span>
            </div>

            <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-mono font-bold text-slate-700">{displayWebsite}</span>
            </div>
          </div>

          {/* Interactive Section 4: 个人形象图片 (Direct Upload + View Image) */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>4. 个人形象图片</span>
              </label>

              <button
                type="button"
                id="upload-custom-portrait-btn"
                onClick={() => portraitInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span>{draft.portraitUrl ? '重新上传图片' : '上传个人图片'}</span>
              </button>
              <input
                ref={portraitInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadCustomPortrait}
                className="hidden"
              />
            </div>

            {/* Uploaded Portrait Display & View Full Image Action */}
            {draft.portraitUrl ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={draft.portraitUrl}
                    alt="已上传个人形象照"
                    onClick={() => setIsPortraitPreviewOpen(true)}
                    className="w-12 h-16 rounded-lg object-cover object-top bg-slate-900 border border-slate-300 flex-shrink-0 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>已上传个人照片</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      可点击右侧按钮查看已上传高清原图
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="view-uploaded-portrait-btn"
                  onClick={() => setIsPortraitPreviewOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1 flex-shrink-0 cursor-pointer shadow-2xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>查看图片</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => portraitInputRef.current?.click()}
                className="p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">点击上传个人形象照片</span>
                <span className="text-[10px] text-slate-400">支持 PNG / JPG 人像图片</span>
              </div>
            )}
          </div>

          {/* Bottom Confirm & Generate Preview Action */}
          <div className="pt-1">
            <button
              type="button"
              id="confirm-generate-480x720-png-btn"
              disabled={isGenerating}
              onClick={handleConfirmGeneratePng}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? '正在合成 480×720 PNG...' : '确认无误 · 生成 480×720 PNG 预览'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* STEP 2: 480x720 PNG PREVIEW & 2-STAGE TERMINAL COMMUNICATION          */
        /* ===================================================================== */
        <div
          id="png-generated-preview-page"
          className="space-y-3.5"
        >
          {/* Preview Showcase Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>已生成工牌身份名片预览</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                480 × 720 px · PNG
              </span>
            </div>

            {/* Generated 480x720 PNG Image Preview (2:3 Aspect Ratio) */}
            <div className="relative w-[220px] h-[330px] rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 bg-slate-950">
              {generatedPngUrl && (
                <img
                  id="generated-badge-png-img"
                  src={generatedPngUrl}
                  alt={`${draft.name} 480x720 工牌名片预览`}
                  className="w-full h-full object-contain block"
                />
              )}
            </div>
          </div>

          {/* Two-Stage Terminal E-Ink Communication Status Card */}
          <div
            id="eink-comm-status-card"
            className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                <span>终端墨水屏两阶段通讯状态</span>
              </div>

              {/* Simulation Mode Switcher (Normal / Fail Receive / Fail Refresh) */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {[
                  { id: 'normal', label: '正常流转' },
                  { id: 'fail_receive', label: '模拟接收失败' },
                  { id: 'fail_refresh', label: '模拟刷新失败' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    id={`sim-mode-${item.id}`}
                    disabled={isCommBusy}
                    onClick={() => setSimMode(item.id as CommSimulationMode)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                      simMode === item.id
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Two Communication Steps List */}
            <div className="space-y-2">
              {/* Step 1: Terminal Image Reception */}
              <div
                id="comm-step-1-receive"
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                  receiveStatus === 'success'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : receiveStatus === 'error'
                    ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                    : receiveStatus === 'running'
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200/80 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 ${
                      receiveStatus === 'success'
                        ? 'bg-emerald-600 text-white'
                        : receiveStatus === 'error'
                        ? 'bg-rose-600 text-white'
                        : receiveStatus === 'running'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    1
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold">第一次通讯：终端接收图片</div>
                    <div className="text-[10px] opacity-80 truncate">
                      {receiveStatus === 'idle' && '等待下发 480×720 PNG 名片数据包'}
                      {receiveStatus === 'running' && '正在传输 480×720 PNG 数据至工牌终端...'}
                      {receiveStatus === 'success' && '终端已接收图片，数据包 CRC 校验通过'}
                      {receiveStatus === 'error' && '终端未接收到图片（通讯超时），请点击重试'}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {receiveStatus === 'idle' && (
                    <span className="text-[10px] font-mono text-slate-400">待触发</span>
                  )}
                  {receiveStatus === 'running' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>接收中</span>
                    </span>
                  )}
                  {receiveStatus === 'success' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>已接收</span>
                    </span>
                  )}
                  {receiveStatus === 'error' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      <AlertCircle className="w-3 h-3" />
                      <span>接收失败</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Step 2: E-Ink Screen Refresh */}
              <div
                id="comm-step-2-refresh"
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                  refreshStatus === 'success'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : refreshStatus === 'error'
                    ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                    : refreshStatus === 'running'
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200/80 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 ${
                      refreshStatus === 'success'
                        ? 'bg-emerald-600 text-white'
                        : refreshStatus === 'error'
                        ? 'bg-rose-600 text-white'
                        : refreshStatus === 'running'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold">第二次通讯：墨水屏画面刷新</div>
                    <div className="text-[10px] opacity-80 truncate">
                      {refreshStatus === 'idle' && '等待终端接收图片成功后驱动墨水屏刷新'}
                      {refreshStatus === 'running' && '正在驱动 3.7" 墨水屏执行全屏电子墨水刷新...'}
                      {refreshStatus === 'success' && '墨水屏刷新成功！即将自动返回设备信息页'}
                      {refreshStatus === 'error' && '墨水屏刷新失败（驱动响应异常），请重试'}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {refreshStatus === 'idle' && (
                    <span className="text-[10px] font-mono text-slate-400">待刷新</span>
                  )}
                  {refreshStatus === 'running' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>刷新中</span>
                    </span>
                  )}
                  {refreshStatus === 'success' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>刷新成功</span>
                    </span>
                  )}
                  {refreshStatus === 'error' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      <AlertCircle className="w-3 h-3" />
                      <span>刷新失败</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Single Primary Action: Update to E-Ink Screen & Auto Return */}
          <div className="space-y-2.5">
            {receiveStatus === 'error' || refreshStatus === 'error' ? (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="retry-current-sim-btn"
                  onClick={() => handleStartEInkSync(simMode)}
                  className="py-3.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重试当前通讯</span>
                </button>
                <button
                  type="button"
                  id="retry-normal-success-btn"
                  onClick={() => {
                    setSimMode('normal');
                    handleStartEInkSync('normal');
                  }}
                  className="py-3.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>恢复正常并更新</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="update-to-eink-btn"
                disabled={isCommBusy || refreshStatus === 'success'}
                onClick={() => handleStartEInkSync()}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-80 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 transition-all"
              >
                {isCommBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {receiveStatus === 'running'
                        ? '第一次通讯：正在向终端发送图片...'
                        : '第二次通讯：终端已接收，正在刷新墨水屏...'}
                    </span>
                  </>
                ) : refreshStatus === 'success' ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>墨水屏刷新成功 · 正在返回设备信息页...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>更新到墨水屏</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              id="edit-again-badge-btn"
              disabled={isCommBusy}
              onClick={() => setStep('form')}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>返回上一步</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-IMAGE LIGHTBOX FOR VIEWING UPLOADED PORTRAIT                     */}
      {/* ===================================================================== */}
      {isPortraitPreviewOpen && draft.portraitUrl && (
        <div
          id="uploaded-portrait-lightbox"
          onClick={() => setIsPortraitPreviewOpen(false)}
          className="fixed inset-0 max-w-md mx-auto z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">已上传个人形象照片预览</span>
              <button
                type="button"
                id="close-portrait-lightbox-btn"
                onClick={() => setIsPortraitPreviewOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-[220px] h-[330px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
              <img
                src={draft.portraitUrl}
                alt="个人形象大图"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsPortraitPreviewOpen(false);
                  portraitInputRef.current?.click();
                }}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>更换照片</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPortraitPreviewOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
