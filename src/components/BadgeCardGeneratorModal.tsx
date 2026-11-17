import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Upload, Download, Check, Sparkles, Image as ImageIcon,
  Building2, User, Globe, ArrowRight, RotateCcw
} from 'lucide-react';
import { BadgeCardConfig } from '../types';

interface BadgeCardGeneratorModalProps {
  isOpen: boolean;
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

export const PRESET_PORTRAITS = [
  {
    id: 'shenzhiyu_dark',
    label: '沈知予 (商务深色)',
    url: '/assets/aistudio/shenzhiyu_clean_bg.png',
    recommendedTheme: 'dark' as const,
    defaultName: '沈知予',
    defaultPrimaryRole: '品牌设计师',
    defaultSecondaryRole: '设计总监'
  },
  {
    id: 'linchen_light',
    label: '林辰 (科技浅色)',
    url: '/assets/aistudio/linchen_portrait.png',
    recommendedTheme: 'light' as const,
    defaultName: '林辰',
    defaultPrimaryRole: '设计总监',
    defaultSecondaryRole: '创新硬件部'
  }
];

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

export function BadgeCardGeneratorModal({
  isOpen,
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
  const [isUpdatingToEInk, setIsUpdatingToEInk] = useState<boolean>(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const portraitInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(initialConfig);
      setGeneratedPngUrl(initialConfig.generatedPngDataUrl || null);
      setStep('form');
      setIsUpdatingToEInk(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

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
    setStep('preview');
  };

  const handleUpdateToEInk = () => {
    if (!generatedPngUrl || isUpdatingToEInk) return;
    setIsUpdatingToEInk(true);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updatedConfig: BadgeCardConfig = {
      ...draft,
      generatedPngDataUrl: generatedPngUrl,
      generatedAt: timeStr
    };
    onSaveAndSync(updatedConfig, false);
    setTimeout(() => {
      setIsUpdatingToEInk(false);
      onClose();
    }, 500);
  };

  return (
    <div className="flex flex-col gap-3.5 pb-20 text-slate-800">
      {/* ===================================================================== */}
      {/* Top Mobile Sub-Navigation Bar                                         */}
      {/* ===================================================================== */}
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
            onClick={() => setStep('form')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all active:scale-95 cursor-pointer shadow-2xs"
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
      {/* STEP 1: MOBILE CONFIGURATION FORM (No top preview box)                */}
      {/* ===================================================================== */}
      {step === 'form' ? (
        <div className="space-y-3">
          {/* Field 1: 公司名称 + Logo */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>1. 公司名称 + Logo</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
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

          {/* Field 2: 员工姓名与岗位层级 */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>2. 员工姓名与岗位层级</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="block text-[10px] font-semibold text-slate-500 mb-1">姓名</span>
                <input
                  type="text"
                  id="badge-name-input"
                  value={draft.name}
                  onChange={(e) => setDraft(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="如：沈知予"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 text-xs font-bold text-slate-800 outline-none transition-colors"
                />
              </div>

              <div>
                <span className="block text-[10px] font-semibold text-slate-500 mb-1">主岗位</span>
                <input
                  type="text"
                  id="badge-primary-role-input"
                  value={draft.primaryRole}
                  onChange={(e) => setDraft(prev => ({ ...prev, primaryRole: e.target.value }))}
                  placeholder="如：品牌设计师"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 text-xs font-bold text-slate-800 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-500 mb-1">
                副职级 / 补充头衔（选填，自动添加前置横线 ——）
              </span>
              <input
                type="text"
                id="badge-secondary-role-input"
                value={draft.secondaryRole}
                onChange={(e) => setDraft(prev => ({ ...prev, secondaryRole: e.target.value }))}
                placeholder="如：设计总监（留空则不显示第二行）"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 text-xs font-bold text-slate-800 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Field 3: 公司网址 */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>3. 公司网址（左下角竖排展示）</span>
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

          {/* Field 4: 个人形象图片 */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>4. 个人形象图片</span>
              </label>
              <button
                type="button"
                id="upload-custom-portrait-btn"
                onClick={() => portraitInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Upload className="w-3 h-3" />
                <span>上传本地个人照片</span>
              </button>
              <input
                ref={portraitInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadCustomPortrait}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESET_PORTRAITS.map((preset) => {
                const isSelected = draft.portraitUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setDraft(prev => ({
                        ...prev,
                        theme: preset.recommendedTheme,
                        portraitUrl: preset.url,
                        name: preset.defaultName,
                        primaryRole: preset.defaultPrimaryRole,
                        secondaryRole: preset.defaultSecondaryRole
                      }));
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-9 h-11 rounded-lg object-cover object-top bg-slate-900 flex-shrink-0 border border-slate-300"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold truncate">{preset.label}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        点击套用模版与人像
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
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
        /* STEP 2: 480x720 PNG PREVIEW PAGE (Shown ONLY after clicking confirm)  */
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
            <div className="relative w-[240px] h-[360px] rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 bg-slate-950">
              {generatedPngUrl && (
                <img
                  id="generated-badge-png-img"
                  src={generatedPngUrl}
                  alt={`${draft.name} 480x720 工牌名片预览`}
                  className="w-full h-full object-contain block"
                />
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-3 text-center">
              分辨率严格为 <strong className="font-mono text-slate-700">480 × 720</strong> 像素，确认后可一键更新至工牌墨水屏
            </p>
          </div>

          {/* Single Primary Action: Update to E-Ink Screen & Return to Device Info */}
          <div className="space-y-2.5">
            <button
              type="button"
              id="update-to-eink-btn"
              disabled={isUpdatingToEInk}
              onClick={handleUpdateToEInk}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-75 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isUpdatingToEInk ? '正在更新到墨水屏...' : '更新到墨水屏'}</span>
            </button>

            <button
              type="button"
              id="edit-again-badge-btn"
              disabled={isUpdatingToEInk}
              onClick={() => setStep('form')}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>返回修改名片信息</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
