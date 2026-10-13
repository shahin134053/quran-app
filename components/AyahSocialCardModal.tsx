import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, Share2, Copy, Check, Sparkles, 
  CheckCircle2, Smartphone, Square, LayoutTemplate,
  MessageCircle, Send, Eye, Image as ImageIcon,
  Minimize2, RefreshCw, Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QRCodeCanvas } from 'qrcode.react';

export interface AyahCardData {
  surahNumber: number;
  ayahNumber: number;
  surahNameBn: string;
  surahNameEn: string;
  arabicText: string;
  bengaliTranslation: string;
}

interface AyahSocialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AyahCardData | null;
}

export type CardTheme = 
  | 'kaaba'
  | 'emerald' 
  | 'midnight' 
  | 'royal' 
  | 'sunset' 
  | 'teal' 
  | 'marble'
  | 'dark';

export type CardAspectRatio = 'post' | 'story' | 'square' | 'banner';
export type CardFrameStyle = 'arabesque' | 'mihrab' | 'modern' | 'minimal';

export const AyahSocialCardModal: React.FC<AyahSocialCardModalProps> = ({ isOpen, onClose, data }) => {
  const { language } = useApp();
  const [theme, setTheme] = useState<CardTheme>('kaaba');
  const [aspectRatio, setAspectRatio] = useState<CardAspectRatio>('post');
  const [frameStyle, setFrameStyle] = useState<CardFrameStyle>('arabesque');
  const [showAppIcon, setShowAppIcon] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showAudioQrCode, setShowAudioQrCode] = useState(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  const [showDirectImageViewer, setShowDirectImageViewer] = useState(false);
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-End Luxury Theme Palettes
  const THEME_STYLES: Record<CardTheme, {
    bg1: string;
    bg2: string;
    bg3: string;
    border: string;
    arabicColor: string;
    textColor: string;
    accentColor: string;
    goldColor: string;
    panelBg: string;
    nameBn: string;
    nameEn: string;
    icon: string;
  }> = {
    kaaba: {
      bg1: '#050507',
      bg2: '#18181c',
      bg3: '#09090b',
      border: '#d97706',
      arabicColor: '#fde047',
      textColor: '#fafaf9',
      accentColor: '#fbbf24',
      goldColor: '#eab308',
      panelBg: 'rgba(255, 255, 255, 0.05)',
      nameBn: 'কাবার গিলাফ (সোনালী)',
      nameEn: 'Kaaba Kiswah (Gold)',
      icon: '🕋'
    },
    emerald: {
      bg1: '#022c22',
      bg2: '#064e3b',
      bg3: '#022c22',
      border: '#059669',
      arabicColor: '#fef08a',
      textColor: '#ecfdf5',
      accentColor: '#34d399',
      goldColor: '#fbbf24',
      panelBg: 'rgba(255, 255, 255, 0.06)',
      nameBn: 'মরকত মদিনা (সবুজ)',
      nameEn: 'Madina Emerald (Green)',
      icon: '🕌'
    },
    midnight: {
      bg1: '#030712',
      bg2: '#0f172a',
      bg3: '#1e1b4b',
      border: '#38bdf8',
      arabicColor: '#e0f2fe',
      textColor: '#f8fafc',
      accentColor: '#38bdf8',
      goldColor: '#7dd3fc',
      panelBg: 'rgba(255, 255, 255, 0.05)',
      nameBn: 'গহীন আসমান (নীল)',
      nameEn: 'Deep Sky (Blue)',
      icon: '🌌'
    },
    royal: {
      bg1: '#1e0038',
      bg2: '#3b0764',
      bg3: '#2e1065',
      border: '#c084fc',
      arabicColor: '#fef08a',
      textColor: '#faf5ff',
      accentColor: '#d8b4fe',
      goldColor: '#fbbf24',
      panelBg: 'rgba(255, 255, 255, 0.07)',
      nameBn: 'রাজকীয় আম্বর (বেগুনি)',
      nameEn: 'Royal Amber (Purple)',
      icon: '💎'
    },
    sunset: {
      bg1: '#2a0800',
      bg2: '#571500',
      bg3: '#7c2d12',
      border: '#ea580c',
      arabicColor: '#fed7aa',
      textColor: '#fff7ed',
      accentColor: '#fb923c',
      goldColor: '#f59e0b',
      panelBg: 'rgba(255, 255, 255, 0.06)',
      nameBn: 'মরু সূর্যাস্ত (লালচে)',
      nameEn: 'Desert Sunset (Rust)',
      icon: '🌅'
    },
    teal: {
      bg1: '#042f2e',
      bg2: '#115e59',
      bg3: '#134e4a',
      border: '#2dd4bf',
      arabicColor: '#ccfbf1',
      textColor: '#f0fdfa',
      accentColor: '#2dd4bf',
      goldColor: '#5eead4',
      panelBg: 'rgba(255, 255, 255, 0.06)',
      nameBn: 'আকসু সায়ান (ফিরোজা)',
      nameEn: 'Aqsa Cyan (Teal)',
      icon: '🌊'
    },
    marble: {
      bg1: '#f8fafc',
      bg2: '#f1f5f9',
      bg3: '#e2e8f0',
      border: '#b45309',
      arabicColor: '#854d0e',
      textColor: '#1e293b',
      accentColor: '#d97706',
      goldColor: '#b45309',
      panelBg: 'rgba(0, 0, 0, 0.03)',
      nameBn: 'শুভ্র মার্বেল (সাদা)',
      nameEn: 'Pure Marble (White)',
      icon: '🤍'
    },
    dark: {
      bg1: '#09090b',
      bg2: '#18181b',
      bg3: '#27272a',
      border: '#71717a',
      arabicColor: '#ffffff',
      textColor: '#f4f4f5',
      accentColor: '#a1a1aa',
      goldColor: '#e4e4e7',
      panelBg: 'rgba(255, 255, 255, 0.05)',
      nameBn: 'মিনিমাল ডার্ক',
      nameEn: 'Minimal Dark',
      icon: '🖤'
    }
  };

  const safeRoundRect = (
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    if (typeof (c as any).roundRect === 'function') {
      (c as any).roundRect(x, y, w, h, r);
    } else {
      let radius = r;
      if (w < 2 * radius) radius = w / 2;
      if (h < 2 * radius) radius = h / 2;
      c.beginPath();
      c.moveTo(x + radius, y);
      c.arcTo(x + w, y, x + w, y + h, radius);
      c.arcTo(x + w, y + h, x, y + h, radius);
      c.arcTo(x, y + h, x, y, radius);
      c.arcTo(x, y, x + w, y, radius);
      c.closePath();
    }
  };

  const drawCardOnCanvas = () => {
    if (!isOpen || !data) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Aspect ratio dimensions for crisp 4K rendering
    let W = 1080;
    let H = 1350; // default 4:5 (Post)
    if (aspectRatio === 'story') {
      W = 1080;
      H = 1920; // 9:16 (Story)
    } else if (aspectRatio === 'square') {
      W = 1080;
      H = 1080; // 1:1 (Square)
    } else if (aspectRatio === 'banner') {
      W = 1200;
      H = 675; // 16:9 (Banner)
    }

    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const currentStyle = THEME_STYLES[theme];

    // 1. Multi-Stage Background Gradient
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, Math.max(W, H));
    bgGrad.addColorStop(0, currentStyle.bg2);
    bgGrad.addColorStop(0.65, currentStyle.bg1);
    bgGrad.addColorStop(1, currentStyle.bg3);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Starlight Particle Dust Overlay
    ctx.fillStyle = currentStyle.goldColor;
    for (let i = 0; i < 50; i++) {
      const rx = (Math.sin(i * 99) * 0.5 + 0.5) * W;
      const ry = (Math.cos(i * 33) * 0.5 + 0.5) * H;
      const r = (i % 3) * 0.8 + 0.8;
      ctx.globalAlpha = (i % 5) === 0 ? 0.35 : 0.15;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Central Soft Glowing Aura behind Ayah
    const glowGrad = ctx.createRadialGradient(W / 2, H * 0.42, 10, W / 2, H * 0.42, W * 0.45);
    glowGrad.addColorStop(0, `${currentStyle.goldColor}22`);
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.42, W * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // 2. Decorative Frame Styles
    const margin = 48;
    const innerMargin = 66;

    if (frameStyle === 'arabesque') {
      ctx.strokeStyle = currentStyle.border;
      ctx.lineWidth = 4;
      ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);

      ctx.strokeStyle = currentStyle.goldColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([14, 8]);
      ctx.strokeRect(innerMargin, innerMargin, W - innerMargin * 2, H - innerMargin * 2);
      ctx.setLineDash([]);

      const drawStarRosette = (cx: number, cy: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = currentStyle.goldColor;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-16, -16, 32, 32);
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-16, -16, 32, 32);
        ctx.fillStyle = currentStyle.goldColor;
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawStarRosette(innerMargin, innerMargin);
      drawStarRosette(W - innerMargin, innerMargin);
      drawStarRosette(W - innerMargin, H - innerMargin);
      drawStarRosette(innerMargin, H - innerMargin);

    } else if (frameStyle === 'mihrab') {
      ctx.strokeStyle = currentStyle.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);

      const archTop = innerMargin - 10;
      const archHeight = aspectRatio === 'banner' ? 80 : 160;
      ctx.strokeStyle = currentStyle.goldColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(innerMargin, innerMargin + archHeight);
      ctx.quadraticCurveTo(W / 2, archTop - 30, W - innerMargin, innerMargin + archHeight);
      ctx.stroke();

      const lanternX = W / 2;
      const lanternY = innerMargin + (aspectRatio === 'banner' ? 25 : 50);
      ctx.strokeStyle = currentStyle.goldColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lanternX, innerMargin);
      ctx.lineTo(lanternX, lanternY);
      ctx.stroke();

      const lanternGlow = ctx.createRadialGradient(lanternX, lanternY + 12, 2, lanternX, lanternY + 12, 45);
      lanternGlow.addColorStop(0, `${currentStyle.goldColor}aa`);
      lanternGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = lanternGlow;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY + 12, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = currentStyle.goldColor;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY + 12, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lanternX, lanternY + 12, 18, 0, Math.PI * 2);
      ctx.stroke();

    } else if (frameStyle === 'modern') {
      ctx.strokeStyle = currentStyle.goldColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      safeRoundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 32);
      ctx.stroke();

      ctx.strokeStyle = currentStyle.border;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      safeRoundRect(ctx, innerMargin, innerMargin, W - innerMargin * 2, H - innerMargin * 2, 24);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = currentStyle.goldColor;
      ctx.lineWidth = 2.5;
      const arm = 30;
      ctx.beginPath();
      ctx.moveTo(margin, margin + arm);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + arm, margin);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(W - margin - arm, margin);
      ctx.lineTo(W - margin, margin);
      ctx.lineTo(W - margin, margin + arm);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(margin, H - margin - arm);
      ctx.lineTo(margin, H - margin);
      ctx.lineTo(margin + arm, H - margin);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(W - margin - arm, H - margin);
      ctx.lineTo(W - margin, H - margin);
      ctx.lineTo(W - margin, H - margin - arm);
      ctx.stroke();
    }

    let currentY = aspectRatio === 'story' 
      ? 250 
      : aspectRatio === 'square' 
      ? 120 
      : aspectRatio === 'banner'
      ? 80
      : 160;

    // 3. Top Bismillah & Header
    if (showAppIcon) {
      const iconCenterX = W / 2;
      const iconCenterY = currentY - (aspectRatio === 'banner' ? 12 : 20);

      ctx.save();
      ctx.translate(iconCenterX, iconCenterY);
      ctx.fillStyle = currentStyle.goldColor;
      ctx.fillRect(-14, -14, 28, 28);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-14, -14, 28, 28);
      ctx.restore();

      currentY += aspectRatio === 'banner' ? 20 : 28;
      ctx.textAlign = 'center';
      ctx.fillStyle = currentStyle.goldColor;
      ctx.font = `bold ${aspectRatio === 'banner' ? '20px' : '24px'} "Amiri", "Scheherazade New", serif`;
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', W / 2, currentY);

      currentY += aspectRatio === 'banner' ? 24 : 34;
      ctx.fillStyle = currentStyle.accentColor;
      const fontFam = language === 'bn' ? '"Noto Sans Bengali", sans-serif' : 'sans-serif';
      ctx.font = `${aspectRatio === 'banner' ? '13px' : '15px'} ${fontFam}`;
      const headerSubtitle = language === 'bn' 
        ? 'পবিত্র কুরআনের চিরন্তন বাণী • আল-কুরআনুল কারীম'
        : 'Eternal Words of Holy Quran • Al-Quran Al-Kareem';
      ctx.fillText(headerSubtitle, W / 2, currentY);

      currentY += aspectRatio === 'banner' ? 32 : 45;
    } else {
      currentY += aspectRatio === 'banner' ? 20 : 35;
    }

    // 4. Surah & Ayah Badge
    ctx.textAlign = 'center';
    const activeSurahName = language === 'bn' ? data.surahNameBn : data.surahNameEn;
    const badgeText = language === 'bn'
      ? `সূরা ${activeSurahName} • আয়াত ${data.ayahNumber}`
      : `Surah ${activeSurahName} • Verse ${data.ayahNumber}`;

    const badgeFontSize = aspectRatio === 'banner' ? 20 : 25;
    const fontFam = language === 'bn' ? '"Noto Sans Bengali", sans-serif' : 'sans-serif';
    ctx.font = `bold ${badgeFontSize}px ${fontFam}`;
    const textWidth = ctx.measureText(badgeText).width;

    ctx.fillStyle = currentStyle.panelBg;
    ctx.strokeStyle = currentStyle.border;
    ctx.lineWidth = 2;
    const pillW = textWidth + 60;
    const pillH = aspectRatio === 'banner' ? 40 : 48;
    ctx.beginPath();
    safeRoundRect(ctx, (W - pillW) / 2, currentY - (pillH * 0.7), pillW, pillH, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = currentStyle.goldColor;
    ctx.fillText(badgeText, W / 2, currentY);

    currentY += aspectRatio === 'banner' ? 50 : 70;

    // Word Wrap Helper Function
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      const lines: string[] = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let lineY = y;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].trim(), x, lineY);
        lineY += lineHeight;
      }
      return lineY;
    };

    // 5. Arabic Ayah Rendering
    if (showArabic && data.arabicText) {
      ctx.textAlign = 'center';
      ctx.fillStyle = currentStyle.arabicColor;

      let baseArabicSize = 36;
      if (aspectRatio === 'banner') baseArabicSize = fontSize === 'large' ? 30 : 24;
      else if (aspectRatio === 'square') baseArabicSize = fontSize === 'large' ? 36 : 30;
      else baseArabicSize = fontSize === 'large' ? 44 : 38;

      ctx.font = `bold ${baseArabicSize}px "Amiri", "Scheherazade New", serif`;
      const maxArabicWidth = W - (aspectRatio === 'banner' ? 180 : 220);
      currentY = wrapText(data.arabicText, W / 2, currentY, maxArabicWidth, baseArabicSize * 1.85);
      currentY += aspectRatio === 'banner' ? 20 : 32;
    }

    // 6. Ornamental Center Rosette Divider
    ctx.strokeStyle = currentStyle.goldColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 110, currentY);
    ctx.lineTo(W / 2 + 110, currentY);
    ctx.stroke();

    ctx.fillStyle = currentStyle.goldColor;
    ctx.beginPath();
    ctx.arc(W / 2, currentY, 6, 0, Math.PI * 2);
    ctx.fill();

    currentY += aspectRatio === 'banner' ? 28 : 42;

    // 7. Translation Rendering
    if (showTranslation && data.bengaliTranslation) {
      ctx.textAlign = 'center';
      ctx.fillStyle = currentStyle.textColor;

      let baseTranslationSize = 24;
      if (aspectRatio === 'banner') baseTranslationSize = fontSize === 'large' ? 20 : 16;
      else if (aspectRatio === 'square') baseTranslationSize = fontSize === 'large' ? 24 : 20;
      else baseTranslationSize = fontSize === 'large' ? 28 : 24;

      const trFontFam = language === 'bn' ? '"Noto Sans Bengali", sans-serif' : 'sans-serif';
      ctx.font = `500 ${baseTranslationSize}px ${trFontFam}`;
      const maxTrWidth = W - (aspectRatio === 'banner' ? 220 : 260);
      currentY = wrapText(`"${data.bengaliTranslation}"`, W / 2, currentY, maxTrWidth, baseTranslationSize * 1.75);
      currentY += aspectRatio === 'banner' ? 25 : 35;
    }

    // 8. Bottom Brand & Da'wah Signature
    const footerY = H - (aspectRatio === 'story' ? 140 : aspectRatio === 'banner' ? 60 : 100);
    ctx.textAlign = 'center';
    ctx.fillStyle = currentStyle.accentColor;
    ctx.font = `bold ${aspectRatio === 'banner' ? '14px' : '18px'} ${fontFam}`;
    ctx.fillText(`${data.surahNameEn} (${data.surahNumber}:${data.ayahNumber})`, W / 2, footerY - (aspectRatio === 'banner' ? 18 : 26));

    ctx.fillStyle = currentStyle.goldColor;
    ctx.font = `bold ${aspectRatio === 'banner' ? '13px' : '16px'} ${fontFam}`;
    const brandName = language === 'bn' ? 'আল- শাহিন ( Shahin) Quran App' : 'Al-Shahin Quran App';
    ctx.fillText(brandName, W / 2, footerY);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = `${aspectRatio === 'banner' ? '10px' : '12px'} ${fontFam}`;
    const brandFooter = language === 'bn' 
      ? 'পবিত্র কুরআনের চিরন্তন আলো ছড়িয়ে দিন • সদকায়ে জারিয়াহ' 
      : 'Spread the Eternal Light of Quran • Sadqah Jariyah';
    ctx.fillText(brandFooter, W / 2, footerY + (aspectRatio === 'banner' ? 16 : 22));

    // 9. Audio QR Code Drawing
    if (showAudioQrCode) {
      const qrSize = aspectRatio === 'banner' ? 60 : 75;
      const qrX = W - margin - qrSize - 15;
      const qrY = H - margin - qrSize - 15;

      // Draw card background for QR
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      safeRoundRect(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 22, 10);
      ctx.fill();
      ctx.strokeStyle = currentStyle.goldColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const hiddenQrCanvas = document.getElementById('hidden-ayah-qr-canvas') as HTMLCanvasElement;
      if (hiddenQrCanvas) {
        try {
          ctx.drawImage(hiddenQrCanvas, qrX, qrY, qrSize, qrSize);
        } catch (e) {
          console.warn("Could not draw local QR canvas:", e);
        }
      }

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AUDIO QR', qrX + qrSize / 2, qrY + qrSize + 11);
    }

    try {
      const url = canvas.toDataURL('image/png');
      setGeneratedDataUrl(url);
    } catch (e) {
      console.warn("Could not generate data URL:", e);
    }
  };

  useEffect(() => {
    if (isOpen && data) {
      const render = () => {
        drawCardOnCanvas();
      };
      const timer = setTimeout(() => {
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            requestAnimationFrame(render);
          });
        } else {
          requestAnimationFrame(render);
        }
      }, 60);

      return () => clearTimeout(timer);
    }
  }, [isOpen, data, theme, aspectRatio, frameStyle, showAppIcon, showArabic, showTranslation, showAudioQrCode, fontSize, language]);

  // Downloader (PNG / JPG)
  const handleDownloadImage = (format: 'png' | 'jpeg' = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    setIsGenerating(true);

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    const fileName = `Ayah_${data.surahNumber}_${data.ayahNumber}_Al_Shahin_Quran.${ext}`;

    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
          setDownloadSuccessToast(true);
          setTimeout(() => setDownloadSuccessToast(false), 3500);
          setIsGenerating(false);
        } else {
          fallbackDataUrlDownload(format);
        }
      }, mimeType, 0.95);
    } catch {
      fallbackDataUrlDownload(format);
    }
  };

  const fallbackDataUrlDownload = (format: 'png' | 'jpeg' = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas || !data) {
      setIsGenerating(false);
      return;
    }

    try {
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const ext = format === 'jpeg' ? 'jpg' : 'png';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Ayah_${data.surahNumber}_${data.ayahNumber}_Al_Shahin_Quran.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccessToast(true);
      setTimeout(() => setDownloadSuccessToast(false), 3500);
    } catch (e) {
      console.warn("Direct download triggered fallback link", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2500);
            return;
          } catch {
            // Fallback
          }
        }
        handleDownloadImage('png');
      }, 'image/png');
    } catch {
      handleDownloadImage('png');
    }
  };

  const handleShareToWhatsApp = () => {
    if (!data) return;
    const sName = language === 'bn' ? data.surahNameBn : data.surahNameEn;
    const text = encodeURIComponent(
      `📖 *${language === 'bn' ? 'সূরা' : 'Surah'} ${sName} (${language === 'bn' ? 'আয়াত' : 'Verse'} ${data.ayahNumber})*\n\n` +
      `${data.arabicText}\n\n` +
      `"${data.bengaliTranslation}"\n\n` +
      `— ${language === 'bn' ? 'আল- শাহিন ( Shahin) Quran App' : 'Al-Shahin Quran App'}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareToTelegram = () => {
    if (!data) return;
    const sName = language === 'bn' ? data.surahNameBn : data.surahNameEn;
    const text = encodeURIComponent(
      `📖 ${language === 'bn' ? 'সূরা' : 'Surah'} ${sName} (${language === 'bn' ? 'আয়াত' : 'Verse'} ${data.ayahNumber})\n\n` +
      `${data.arabicText}\n\n` +
      `"${data.bengaliTranslation}"\n\n` +
      `— ${language === 'bn' ? 'আল- শাহিন ( Shahin) Quran App' : 'Al-Shahin Quran App'}`
    );
    window.open(`https://t.me/share/url?text=${text}`, '_blank');
  };

  const handleShareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    setIsGenerating(true);

    const sName = language === 'bn' ? data.surahNameBn : data.surahNameEn;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }
        const file = new File([blob], `Ayah_${data.surahNumber}_${data.ayahNumber}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${language === 'bn' ? 'সূরা' : 'Surah'} ${sName} (${data.ayahNumber})`,
            text: `${data.bengaliTranslation}\n\n(${language === 'bn' ? 'আল- শাহিন ( Shahin) Quran' : 'Al-Shahin Quran'})`,
            files: [file]
          });
        } else if (navigator.share) {
          await navigator.share({
            title: `${language === 'bn' ? 'সূরা' : 'Surah'} ${sName} (${data.ayahNumber})`,
            text: `${data.arabicText}\n\n${data.bengaliTranslation}\n\n${language === 'bn' ? 'সূরা' : 'Surah'} ${sName} (${data.surahNumber}:${data.ayahNumber})`
          });
        } else {
          handleDownloadImage('png');
        }
        setIsGenerating(false);
      });
    } catch {
      handleDownloadImage('png');
    }
  };

  const handleCopyText = () => {
    if (!data) return;
    const sName = language === 'bn' ? data.surahNameBn : data.surahNameEn;
    const text = `${data.arabicText}\n\n"${data.bengaliTranslation}"\n\n— ${language === 'bn' ? 'সূরা' : 'Surah'} ${sName} (${data.surahNumber}:${data.ayahNumber})\n(${language === 'bn' ? 'আল- শাহিন ( Shahin) Quran' : 'Al-Shahin Quran'})`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 my-auto relative flex flex-col max-h-[92vh]"
      >
        {/* Success Toast */}
        <AnimatePresence>
          {downloadSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-black py-2.5 px-5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400 text-center"
            >
              <CheckCircle2 size={18} />
              <span>
                {language === 'bn'
                  ? '✓ এইচডি আয়া কার্ড সফলভাবে ডাউনলোড হয়েছে! (গ্যালারিতে দেখুন)'
                  : '✓ HD Ayah Card downloaded successfully! (Check gallery)'}
              </span>
            </motion.div>
          )}
          {copiedImage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white text-xs font-black py-2.5 px-5 rounded-full shadow-2xl flex items-center gap-2 border border-blue-400 text-center"
            >
              <CheckCircle2 size={18} />
              <span>
                {language === 'bn' ? '✓ ছবি ক্লিপবোর্ডে কপি হয়েছে!' : '✓ Image copied to clipboard!'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>{language === 'bn' ? 'আয়া কার্ড জেনারেটর' : 'Ayah Card Generator'}</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold uppercase">
                  4K HD
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">
                {language === 'bn'
                  ? `সূরা ${data.surahNameBn} • আয়াত #${data.ayahNumber}`
                  : `Surah ${data.surahNameEn} • Verse #${data.ayahNumber}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-5 no-scrollbar">
          
          {/* Live Canvas Preview Section */}
          <div className="bg-slate-950 p-4 rounded-[2rem] flex flex-col items-center justify-center border border-slate-800 shadow-inner relative group">
            <div className={`w-full ${
              aspectRatio === 'story' 
                ? 'max-w-[220px] aspect-[9/16]' 
                : aspectRatio === 'square' 
                ? 'max-w-[270px] aspect-square' 
                : aspectRatio === 'banner'
                ? 'max-w-[340px] aspect-[16/9]'
                : 'max-w-[250px] aspect-[4/5]'
            } rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 transition-all duration-300 relative bg-black`}>
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>

            {/* DIRECT UNMISSABLE DOWNLOAD BAR RIGHT UNDER PREVIEW */}
            <div className="mt-4 w-full flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => handleDownloadImage('png')}
                disabled={isGenerating}
                className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} className={isGenerating ? 'animate-bounce' : ''} />
                <span>{language === 'bn' ? '📥 ডাউনলোড করুন (PNG)' : '📥 Download (PNG)'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleDownloadImage('jpeg')}
                  disabled={isGenerating}
                  className="flex-1 sm:flex-none py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold text-xs border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  title={language === 'bn' ? 'JPG ফরম্যাটে সেভ করুন' : 'Save as JPG'}
                >
                  <ImageIcon size={15} />
                  <span>JPG</span>
                </button>

                <button
                  onClick={() => setShowDirectImageViewer(true)}
                  className="flex-1 sm:flex-none py-3 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-2xl font-bold text-xs border border-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  title={language === 'bn' ? 'এইচডি ছবি ক্লিক করে দেখুন বা সেভ করুন' : 'Click to view HD image'}
                >
                  <Eye size={15} />
                  <span>{language === 'bn' ? 'ছবি দেখুন' : 'View Image'}</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] font-bold text-slate-400 mt-2 text-center">
              {language === 'bn'
                ? '💡 টিপস: ফেসবুক, ইনস্ট্রাগ্রাম বা হোয়াটসঅ্যাপে সরাসরি হাই-কোয়ালিটিতে শেয়ার করতে পারবেন'
                : '💡 Tip: Share directly in high resolution on social platforms'}
            </p>
          </div>

          {/* Controls: Size / Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <LayoutTemplate size={14} className="text-amber-500" />
              <span>{language === 'bn' ? 'সোশ্যাল মিডিয়া সাইজ নির্বাচন করুন:' : 'Select Aspect Ratio:'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setAspectRatio('post')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === 'post'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <LayoutTemplate size={14} />
                <span>{language === 'bn' ? 'পোস্ট (৪:৫)' : 'Post (4:5)'}</span>
              </button>

              <button
                onClick={() => setAspectRatio('story')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === 'story'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Smartphone size={14} />
                <span>{language === 'bn' ? 'স্টোরি (৯:১৬)' : 'Story (9:16)'}</span>
              </button>

              <button
                onClick={() => setAspectRatio('square')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === 'square'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Square size={14} />
                <span>{language === 'bn' ? 'স্কয়ার (১:১)' : 'Square (1:1)'}</span>
              </button>

              <button
                onClick={() => setAspectRatio('banner')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === 'banner'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <ImageIcon size={14} />
                <span>{language === 'bn' ? 'ব্যনার (১৬:৯)' : 'Banner (16:9)'}</span>
              </button>
            </div>
          </div>

          {/* Controls: Theme Palette Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>{language === 'bn' ? 'প্রিমিয়াম কালার থিম:' : 'Premium Color Theme:'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(THEME_STYLES) as CardTheme[]).map(tKey => {
                const isSelected = theme === tKey;
                const style = THEME_STYLES[tKey];
                const themeName = language === 'bn' ? style.nameBn : style.nameEn;
                return (
                  <button
                    key={tKey}
                    onClick={() => setTheme(tKey)}
                    className={`p-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all border ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-amber-500 shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-amber-500/50'
                    }`}
                  >
                    <span className="text-base leading-none">{style.icon}</span>
                    <span className="truncate">{themeName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls: Frame Art */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders size={14} className="text-amber-500" />
              <span>{language === 'bn' ? 'ইসলামিক ফ্রেম আর্ট ও বর্ডার:' : 'Islamic Frame & Border:'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
              <button
                onClick={() => setFrameStyle('arabesque')}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  frameStyle === 'arabesque'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-black'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'bn' ? 'শাহী জ্যামিতিক' : 'Royal Geometry'}
              </button>

              <button
                onClick={() => setFrameStyle('mihrab')}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  frameStyle === 'mihrab'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-black'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'bn' ? 'মেহরাব ও ফানুস' : 'Mihrab & Lantern'}
              </button>

              <button
                onClick={() => setFrameStyle('modern')}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  frameStyle === 'modern'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-black'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'bn' ? 'লাক্সারি বর্ডার' : 'Luxury Border'}
              </button>

              <button
                onClick={() => setFrameStyle('minimal')}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  frameStyle === 'minimal'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-black'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'bn' ? 'স্নিগ্ধ আর্ট' : 'Minimal Art'}
              </button>
            </div>
          </div>

          {/* Controls: Elements & Typography */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              {language === 'bn' ? 'কার্ডের এলিমেন্ট ও টেক্সট সাইজ:' : 'Card Elements & Font Size:'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setShowAppIcon(!showAppIcon)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  showAppIcon
                    ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {language === 'bn'
                  ? (showAppIcon ? '✓ বিসমিল্লাহ হেডার অন' : '✕ হেডার বন্ধ')
                  : (showAppIcon ? '✓ Bismillah Header On' : '✕ Header Off')}
              </button>

              <button
                onClick={() => setShowArabic(!showArabic)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  showArabic
                    ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {language === 'bn'
                  ? (showArabic ? '✓ আরবি আয়াত অন' : '✕ আরবি বন্ধ')
                  : (showArabic ? '✓ Arabic Verse On' : '✕ Arabic Off')}
              </button>

              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  showTranslation
                    ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {language === 'bn'
                  ? (showTranslation ? '✓ অনুবাদ অন' : '✕ অনুবাদ বন্ধ')
                  : (showTranslation ? '✓ Translation On' : '✕ Translation Off')}
              </button>

              <button
                onClick={() => setShowAudioQrCode(!showAudioQrCode)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  showAudioQrCode
                    ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-black'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {language === 'bn'
                  ? (showAudioQrCode ? '✓ অডিও কিউআর অন' : '✕ কিউআর বন্ধ')
                  : (showAudioQrCode ? '✓ Audio QR On' : '✕ Audio QR Off')}
              </button>

              <button
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                className="p-2.5 rounded-2xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-left flex items-center justify-between"
              >
                <span>{language === 'bn' ? 'ফন্ট সাইজ:' : 'Font Size:'}</span>
                <span className="font-black text-amber-600 dark:text-amber-400">
                  {language === 'bn'
                    ? (fontSize === 'normal' ? 'সাধারণ' : 'বড়')
                    : (fontSize === 'normal' ? 'Normal' : 'Large')}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Direct Social Share Buttons */}
          <div className="pt-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              {language === 'bn' ? 'সোশ্যাল মিডিয়া কুইক শেয়ার:' : 'Quick Social Share:'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareToWhatsApp}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-800/40"
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleShareToTelegram}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center gap-1.5 hover:bg-sky-100 transition-colors border border-sky-200 dark:border-sky-800/40"
              >
                <Send size={15} />
                <span>Telegram</span>
              </button>

              <button
                onClick={handleCopyImageToClipboard}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition-colors border border-indigo-200 dark:border-indigo-800/40"
              >
                <Copy size={15} />
                <span>{language === 'bn' ? 'ছবি কপি' : 'Copy Image'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
          <button
            onClick={handleCopyText}
            className="p-3.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
            title={language === 'bn' ? 'শুধু টেক্সট কপি করুন' : 'Copy text only'}
          >
            {copiedText ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
            <span className="hidden sm:inline">{language === 'bn' ? 'টেক্সট কপি' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleShareImage}
            disabled={isGenerating}
            className="flex-1 py-3.5 bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 size={16} />
            <span>{language === 'bn' ? 'সোশ্যাল শেয়ার' : 'Social Share'}</span>
          </button>

          <button
            onClick={() => handleDownloadImage('png')}
            disabled={isGenerating}
            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-700/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} className={isGenerating ? 'animate-bounce' : ''} />
            <span>{language === 'bn' ? 'ডাউনলোড (PNG)' : 'Download (PNG)'}</span>
          </button>
        </div>
      </motion.div>

      {/* Direct HD Image Preview Modal (Touch/Long Press friendly for Mobile Devices) */}
      <AnimatePresence>
        {showDirectImageViewer && generatedDataUrl && (
          <div className="fixed inset-0 z-[120] bg-black/95 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md flex items-center justify-between mb-3 text-white">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-amber-400" />
                <span className="font-black text-sm">{language === 'bn' ? 'এইচডি কার্ড প্রিভিউ' : 'HD Card Preview'}</span>
              </div>
              <button
                onClick={() => setShowDirectImageViewer(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto rounded-2xl border border-white/20 shadow-2xl bg-black p-1">
              <img
                src={generatedDataUrl}
                alt="Ayah Card HD"
                className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
              />
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 text-center text-white w-full max-w-xs">
              <p className="text-xs font-bold text-amber-300">
                {language === 'bn'
                  ? '👉 ছবিতে কিছুক্ষণ চেপে ধরুন (Long Press) এবং "Save Image" / "Download Image" চাপুন।'
                  : '👉 Long press on the image and tap "Save Image" or "Download Image".'}
              </p>
              <button
                onClick={() => handleDownloadImage('png')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl"
              >
                <Download size={16} />
                <span>{language === 'bn' ? 'সরাসরি সেভ করুন' : 'Save Image Directly'}</span>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Offscreen QR Canvas for Instant Local QR Drawing */}
      {data && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
          <QRCodeCanvas
            id="hidden-ayah-qr-canvas"
            value={`https://quran.com/${data.surahNumber}/${data.ayahNumber}`}
            size={200}
            marginSize={1}
          />
        </div>
      )}
    </div>
  );
};

export default AyahSocialCardModal;
