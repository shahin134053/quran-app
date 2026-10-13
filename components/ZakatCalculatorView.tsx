import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calculator, Coins, ShieldCheck, AlertCircle, 
  HelpCircle, Copy, Check, Share2, Info, ChevronDown, ChevronUp, DollarSign, Download, FileText,
  MapPin, Globe, Sparkles, BookOpen, RefreshCw, Zap, ExternalLink, Award, Code, Mail, ChevronRight, Headphones
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import jsPDF from 'jspdf';
import { useMetalPrices, COUNTRY_METADATA } from '../hooks/useMetalPrices';

export const ZakatCalculatorView: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { activeThemeConfig, language, userName, simulatedLocation } = useApp();

  // Custom Metal Prices Hook based on location & live market rates
  const metalPrices = useMetalPrices(simulatedLocation?.countryCode);

  // Nisab configuration state (prices per Tola/Bhori = 11.6638g)
  const [goldPricePerBhori, setGoldPricePerBhori] = useState<number>(metalPrices.goldPricePerTola);
  const [silverPricePerBhori, setSilverPricePerBhori] = useState<number>(metalPrices.silverPricePerTola);
  const [nisabStandard, setNisabStandard] = useState<'silver' | 'gold'>('silver');

  // Sync state when metalPrices hook completes fetching
  useEffect(() => {
    if (!metalPrices.isLoading) {
      setGoldPricePerBhori(metalPrices.goldPricePerTola);
      setSilverPricePerBhori(metalPrices.silverPricePerTola);
    }
  }, [metalPrices.goldPricePerTola, metalPrices.silverPricePerTola, metalPrices.isLoading]);

  // Wealth Inputs
  const [cashInHand, setCashInHand] = useState<number>(0);
  const [bankBalance, setBankBalance] = useState<number>(0);
  const [goldValue, setGoldValue] = useState<number>(0);
  const [silverValue, setSilverValue] = useState<number>(0);
  const [businessStock, setBusinessStock] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [receivables, setReceivables] = useState<number>(0);

  // Liabilities / Debts
  const [immediateDebts, setImmediateDebts] = useState<number>(0);
  const [unpaidBills, setUnpaidBills] = useState<number>(0);

  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Collapsible Educational Sections
  const [showNisabInfo, setShowNisabInfo] = useState(true);
  const [showHowToPayGuide, setShowHowToPayGuide] = useState(true);
  const [showQuranicRecipients, setShowQuranicRecipients] = useState(false);

  const currSym = metalPrices.currencySymbol;
  const currCode = metalPrices.currency;

  // Nisab Threshold calculation:
  // Silver Nisab: 52.5 Bhori (tola) = 612.36g
  // Gold Nisab: 7.5 Bhori (tola) = 87.48g
  const silverNisabThreshold = 52.5 * silverPricePerBhori;
  const goldNisabThreshold = 7.5 * goldPricePerBhori;
  const currentNisabThreshold = nisabStandard === 'silver' ? silverNisabThreshold : goldNisabThreshold;

  // Totals
  const totalAssets = cashInHand + bankBalance + goldValue + silverValue + businessStock + investments + receivables;
  const totalLiabilities = immediateDebts + unpaidBills;
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);
  const isNisabReached = netZakatableWealth >= currentNisabThreshold;
  const zakatPayable = isNisabReached ? Math.round(netZakatableWealth * 0.025) : 0;

  const formatCurrency = (amount: number) => {
    return `${currSym}${language === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US')}`;
  };

  const handleCopySummary = () => {
    const text = language === 'bn'
      ? `📊 স্মার্ট যাকাত হিসাব বিবরণী (${metalPrices.flag} ${metalPrices.countryNameBn})\nঅফিসিয়াল সোর্স: ${metalPrices.officialSourceBn}\n\nমোট যাকাতযোগ্য সম্পদ: ${formatCurrency(netZakatableWealth)}\nনিসাব থ্রেশহোল্ড (${nisabStandard === 'silver' ? 'রূপা ৫২.৫ ভরি' : 'স্বর্ণ ৭.৫ ভরি'}): ${formatCurrency(currentNisabThreshold)}\nনিসাব যোগ্যতা: ${isNisabReached ? 'যাকাত ফরজ হয়েছে' : 'নিসাব অতিক্রম করেনি'}\n\nপ্রদেয় যাকাত (২.৫%): ${formatCurrency(zakatPayable)}\n\n(আল-শাহিন কুরআন অ্যাপ দ্বারা হিসাবকৃত)`
      : `📊 Smart Zakat Calculation Summary (${metalPrices.flag} ${metalPrices.countryNameEn})\nOfficial Source: ${metalPrices.officialSourceEn}\n\nTotal Zakatable Assets: ${formatCurrency(netZakatableWealth)}\nNisab Threshold (${nisabStandard === 'silver' ? 'Silver 52.5 Tola' : 'Gold 7.5 Tola'}): ${formatCurrency(currentNisabThreshold)}\nNisab Qualification: ${isNisabReached ? 'Zakat is Mandatory' : 'Below Nisab Threshold'}\n\nZakat Payable (2.5%): ${formatCurrency(zakatPayable)}\n\n(Calculated by Al-Shahin Quran App)`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadAppLogoDataUrl = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 160;
          canvas.height = 160;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 160, 160);
            resolve(canvas.toDataURL('image/png'));
            return;
          }
        } catch (e) {
          console.warn('Canvas logo load error:', e);
        }
        resolve(null);
      };
      img.onerror = () => resolve(null);
      img.src = '/icon.svg';
    });
  };

  const handleDownloadPdfStatement = async () => {
    setIsExportingPdf(true);
    try {
      const logoDataUrl = await loadAppLogoDataUrl();
      const doc = new jsPDF();
      
      // Top Brand Banner
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 0, 210, 38, 'F');
      
      // Draw Official App Logo
      if (logoDataUrl) {
        try {
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(12, 5, 28, 28, 4, 4, 'F');
          doc.addImage(logoDataUrl, 'PNG', 14, 7, 24, 24);
        } catch (e) {
          console.warn('Could not draw logo on PDF:', e);
        }
      }

      const titleX = logoDataUrl ? 46 : 15;

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('AL-SHAHIN QURAN APP', titleX, 18);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`OFFICIAL ZAKAT STATEMENT (${metalPrices.countryNameEn.toUpperCase()})`, titleX, 28);
      
      // Metadata
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(10);
      const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Statement Date: ${todayDate}`, 15, 48);
      if (userName) doc.text(`Prepared For: ${userName}`, 15, 54);
      doc.text(`Country / Currency: ${metalPrices.countryNameEn} (${currCode})`, 15, userName ? 60 : 54);
      doc.text(`Rate Source: ${metalPrices.officialSourceEn}`, 15, userName ? 66 : 60);
      doc.text(`Nisab Basis: ${nisabStandard.toUpperCase()} (${nisabStandard === 'silver' ? '52.5 Tola/Bhori' : '7.5 Tola/Bhori'})`, 15, userName ? 72 : 66);
      doc.text(`Current Nisab Rate: ${currCode} ${currentNisabThreshold.toLocaleString('en-US')}`, 15, userName ? 78 : 72);

      // Table Header
      let y = userName ? 90 : 84;
      doc.setFillColor(241, 245, 249);
      doc.rect(15, y, 180, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Asset / Liability Breakdown', 20, y + 6.5);
      doc.text(`Amount (${currCode})`, 150, y + 6.5);

      y += 16;
      const rows = [
        { name: 'Cash in Hand & Bank Deposits', val: cashInHand + bankBalance },
        { name: 'Gold Holding Market Value', val: goldValue },
        { name: 'Silver Holding Market Value', val: silverValue },
        { name: 'Business Merchandise / Stock', val: businessStock },
        { name: 'Investments, Shares & Funds', val: investments },
        { name: 'Receivables & Money Owed', val: receivables },
        { name: 'TOTAL GROSS ASSETS', val: totalAssets, isBold: true },
        { name: 'Less: Debts & Unpaid Liabilities', val: totalLiabilities, isLiability: true },
        { name: 'NET ZAKATABLE WEALTH', val: netZakatableWealth, isBold: true, isHighlight: true },
      ];

      rows.forEach(r => {
        if (r.isHighlight) {
          doc.setFillColor(236, 253, 245);
          doc.rect(15, y - 5, 180, 10, 'F');
        }
        doc.setFont('helvetica', r.isBold ? 'bold' : 'normal');
        doc.setTextColor(r.isLiability ? 225 : 15, r.isLiability ? 29 : 23, r.isLiability ? 72 : 42);
        doc.text(r.name, 20, y);
        const textVal = r.isLiability ? `- ${currCode} ${r.val.toLocaleString('en-US')}` : `${currCode} ${r.val.toLocaleString('en-US')}`;
        doc.text(textVal, 150, y);
        y += 9;
      });

      // Payable Box
      y += 6;
      doc.setFillColor(isNisabReached ? 16 : 100, isNisabReached ? 185 : 116, isNisabReached ? 129 : 139);
      doc.rect(15, y, 180, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`NISAB STATUS: ${isNisabReached ? 'QUALIFIED FOR ZAKAT (MANDATORY)' : 'BELOW NISAB THRESHOLD'}`, 20, y + 9);
      doc.setFontSize(13);
      doc.text(`TOTAL ZAKAT PAYABLE (2.5%): ${currCode} ${zakatPayable.toLocaleString('en-US')}`, 20, y + 18);

      // Quranic Notes
      y += 34;
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Quranic Ordinance on Zakat (Surah At-Tawbah 9:60):', 15, y);
      doc.setFont('helvetica', 'italic');
      doc.text('"Zakah expenditures are only for the poor and for the needy and for those employed to collect..."', 15, y + 6);

      // Footer Signature
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('Calculated using Al-Shahin Quran App • May Allah accept your Zakat & purify your wealth.', 15, 282);

      doc.save(`Zakat_Statement_Al_Shahin_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-2 pb-16"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('home')} 
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
              {language === 'bn' ? 'স্মার্ট যাকাত ক্যালকুলেটর' : 'Smart Zakat Calculator'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
              <span>{language === 'bn' ? 'অথরাইজড সোর্স ও শতভাগ নির্ভুল জিওলোকেশন রেট সহ' : 'Authorized sources & 100% geolocation accuracy'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('developer')}
            title={language === 'bn' ? 'ডেভেলপার হেল্প অ্যান্ড সাপোর্ট' : 'Developer Help & Support'}
            className="px-3 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <Code size={16} />
            <span className="hidden sm:inline">{language === 'bn' ? 'ডেভেলপার হেল্প' : 'Developer Help'}</span>
          </button>

          <button
            onClick={handleDownloadPdfStatement}
            disabled={isExportingPdf}
            title={language === 'bn' ? 'PDF স্টেটমেন্ট ডাউনলোড করুন' : 'Download PDF Statement'}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">{language === 'bn' ? 'PDF স্টেটমেন্ট' : 'PDF Statement'}</span>
          </button>

          <button
            onClick={handleCopySummary}
            title={language === 'bn' ? 'হিসাব কপি করুন' : 'Copy calculation'}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Geolocation & Verified Official Source Metal Price Card */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 dark:from-slate-800 dark:via-slate-800/95 dark:to-slate-800/90 p-5 rounded-3xl border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <Globe size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  {language === 'bn' ? 'লাইভ লোকেশন ও জুয়েলার্স অ্যাসোসিয়েশন দর' : 'Geolocation & Official Jewellers Rate'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                  <Award size={12} className="text-emerald-500" />
                  <span>{language === 'bn' ? 'অথরাইজড সোর্স' : 'Authorized Source'}</span>
                </span>
              </div>
              <p className="text-[11px] text-amber-800/80 dark:text-slate-400 font-medium mt-0.5">
                {metalPrices.flag} {language === 'bn' ? metalPrices.countryNameBn : metalPrices.countryNameEn} ({currCode})
              </p>
            </div>
          </div>

          <button
            onClick={() => metalPrices.refetch()}
            disabled={metalPrices.isLoading}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={14} className={metalPrices.isLoading ? 'animate-spin' : ''} />
            <span>{metalPrices.isLoading ? (language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...') : (language === 'bn' ? 'দর রিফ্রেশ' : 'Refresh Rates')}</span>
          </button>
        </div>

        {/* Official Source Attribution Banner */}
        <div className="p-3 bg-amber-100/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-800/30 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-amber-950 dark:text-amber-200 font-bold">
            <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {language === 'bn' ? 'অফিসিয়াল সোর্স:' : 'Official Source:'} <span className="text-amber-900 dark:text-amber-300 font-extrabold">{language === 'bn' ? metalPrices.officialSourceBn : metalPrices.officialSourceEn}</span>
            </span>
          </div>

          <a
            href={metalPrices.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:underline inline-flex items-center gap-1 bg-white/60 dark:bg-slate-900/60 px-2.5 py-1 rounded-xl"
          >
            <span>{language === 'bn' ? 'সোর্স ওয়েবসাইট' : 'Source Website'}</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Karat Quality Selector */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-slate-600 dark:text-slate-300 font-bold text-[11px]">
            {language === 'bn' ? 'স্বর্ণের ক্যারেট মান:' : 'Gold Karat Quality:'}
          </span>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-amber-200 dark:border-slate-700">
            {(['22K', '21K', '24K'] as const).map(k => (
              <button
                key={k}
                onClick={() => metalPrices.changeKaratQuality(k)}
                className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] transition-all ${
                  metalPrices.karatQuality === k
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                }`}
              >
                {k === '22K' ? (language === 'bn' ? '২২ ক্যারেট (হলমার্ক)' : '22K Hallmark') : k}
              </button>
            ))}
          </div>
        </div>

        {/* Live Per Gram & Per Tola Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
              {language === 'bn' ? `স্বর্ণ (${metalPrices.karatQuality} প্রতি ভরি):` : `Gold (${metalPrices.karatQuality} Per Tola):`}
            </span>
            <span className="font-extrabold text-amber-700 dark:text-amber-300 text-xs">
              {formatCurrency(goldPricePerBhori)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
              {language === 'bn' ? `স্বর্ণ (${metalPrices.karatQuality} প্রতি গ্রাম):` : `Gold (${metalPrices.karatQuality} Per Gram):`}
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              {formatCurrency(metalPrices.goldPricePerGram)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
              {language === 'bn' ? 'রূপা (২২ ক্যারেট প্রতি ভরি):' : 'Silver (22K Per Tola):'}
            </span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300 text-xs">
              {formatCurrency(silverPricePerBhori)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
              {language === 'bn' ? 'রূপা (প্রতি গ্রাম):' : 'Silver (Per Gram):'}
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              {formatCurrency(metalPrices.silverPricePerGram)}
            </span>
          </div>
        </div>

        {/* Country Picker & Editable Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200/60 dark:border-slate-700">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'দেশ ও মুদ্রা পরিবর্তন:' : 'Country & Currency:'}
            </label>
            <select
              value={metalPrices.countryCode}
              onChange={(e) => metalPrices.selectCountry(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {Object.values(COUNTRY_METADATA).map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {language === 'bn' ? c.nameBn : c.nameEn} ({c.currency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              {language === 'bn' ? `স্বর্ণের মানসম্পন্ন দর (${currSym}/ভরি):` : `Gold Rate (${currSym}/Tola):`}
            </label>
            <input
              type="number"
              value={goldPricePerBhori}
              onChange={(e) => setGoldPricePerBhori(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              {language === 'bn' ? `রূপার মানসম্পন্ন দর (${currSym}/ভরি):` : `Silver Rate (${currSym}/Tola):`}
            </label>
            <input
              type="number"
              value={silverPricePerBhori}
              onChange={(e) => setSilverPricePerBhori(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Result Display Banner */}
      <div 
        className="rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden space-y-4"
        style={{
          background: isNisabReached 
            ? `linear-gradient(135deg, ${activeThemeConfig.primaryColor}, #047857)`
            : 'linear-gradient(135deg, #475569, #334155)'
        }}
      >
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block mb-1">
              {isNisabReached 
                ? (language === 'bn' ? 'যাকাত ফরজ হয়েছে (২.৫% প্রদেয়)' : 'Zakat is Mandatory (2.5% Payable)')
                : (language === 'bn' ? 'নিসাব সীমার নিচে (যাকাত ফরজ নয়)' : 'Below Nisab Limit (Zakat Not Mandatory)')}
            </span>
            <h3 className="text-3xl font-black text-amber-300">
              {formatCurrency(zakatPayable)}
            </h3>
          </div>

          <button
            onClick={handleDownloadPdfStatement}
            className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 border border-white/30 transition shadow-lg"
          >
            <Download size={16} />
            <span>{language === 'bn' ? 'PDF সেভ' : 'Save PDF'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/20 text-xs relative z-10">
          <div>
            <span className="text-emerald-100 text-[10px] block font-medium">
              {language === 'bn' ? 'মোট যাকাতযোগ্য সম্পদ:' : 'Total Zakatable Assets:'}
            </span>
            <span className="font-bold">
              {formatCurrency(netZakatableWealth)}
            </span>
          </div>
          <div>
            <span className="text-emerald-100 text-[10px] block font-medium">
              {language === 'bn' ? 'বর্তমান নিসাব থ্রেশহোল্ড:' : 'Nisab Threshold:'}
            </span>
            <span className="font-bold">
              {formatCurrency(currentNisabThreshold)}
            </span>
          </div>
        </div>
      </div>

      {/* Nisab Basis Selector */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Coins size={16} className="text-amber-500" />
            <span>{language === 'bn' ? 'নিসাব স্ট্যান্ডার্ড নির্বাচন করুন:' : 'Select Nisab Standard:'}</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setNisabStandard('silver')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              nisabStandard === 'silver'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="text-xs font-black">{language === 'bn' ? 'রূপার নিসাব (৫২.৫ ভরি / ৬১২.৩৬ গ্রাম)' : 'Silver Nisab (52.5 Tola / 612.36g)'}</div>
            <div className="text-[10px] opacity-80 mt-0.5 font-bold">
              {formatCurrency(silverNisabThreshold)}
            </div>
          </button>

          <button
            onClick={() => setNisabStandard('gold')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              nisabStandard === 'gold'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="text-xs font-black">{language === 'bn' ? 'স্বর্ণের নিসাব (৭.৫ ভরি / ৮৭.৪৮ গ্রাম)' : 'Gold Nisab (7.5 Tola / 87.48g)'}</div>
            <div className="text-[10px] opacity-80 mt-0.5 font-bold">
              {formatCurrency(goldNisabThreshold)}
            </div>
          </button>
        </div>
      </div>

      {/* Asset Breakdown Form */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Calculator size={18} className="text-emerald-500" />
          <span>{language === 'bn' ? `যাকাতযোগ্য সম্পদের পরিমাণ (${currSym}):` : `Zakatable Assets (${currCode}):`}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {language === 'bn' ? 'নগদ টাকা ও ব্যাংক ব্যালেন্স' : 'Cash & Bank Balance'}
            </label>
            <input
              type="number"
              value={cashInHand || ''}
              onChange={(e) => setCashInHand(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {language === 'bn' ? 'স্বর্ণের বর্তমান বাজারমূল্য' : 'Gold Market Value'}
            </label>
            <input
              type="number"
              value={goldValue || ''}
              onChange={(e) => setGoldValue(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {language === 'bn' ? 'রূপার বর্তমান বাজারমূল্য' : 'Silver Market Value'}
            </label>
            <input
              type="number"
              value={silverValue || ''}
              onChange={(e) => setSilverValue(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {language === 'bn' ? 'ব্যবসার পণ্য / স্টকের মূল্য' : 'Business Inventory'}
            </label>
            <input
              type="number"
              value={businessStock || ''}
              onChange={(e) => setBusinessStock(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {language === 'bn' ? 'শেয়ার, মিউচুয়াল ফান্ড ও বিনিয়োগ' : 'Investments & Shares'}
            </label>
            <input
              type="number"
              value={investments || ''}
              onChange={(e) => setInvestments(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {language === 'bn' ? 'পাওনা টাকা (যা ফেরত পাওয়ার সম্ভাবনা রয়েছে)' : 'Receivables / Money Owed'}
            </label>
            <input
              type="number"
              value={receivables || ''}
              onChange={(e) => setReceivables(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Liabilities / Deductible Debts */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <AlertCircle size={18} className="text-rose-500" />
          <span>{language === 'bn' ? `বাদযোগ্য দেনা ও ঋণ (${currSym}):` : `Deductible Liabilities & Debts (${currCode}):`}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {language === 'bn' ? 'তাৎক্ষণিক পরিশোধযোগ্য ঋণ' : 'Immediate Debts Payable'}
            </label>
            <input
              type="number"
              value={immediateDebts || ''}
              onChange={(e) => setImmediateDebts(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {language === 'bn' ? 'অপরিশোধিত বিল ও বকেয়া' : 'Unpaid Bills & Expenses'}
            </label>
            <input
              type="number"
              value={unpaidBills || ''}
              onChange={(e) => setUnpaidBills(Number(e.target.value))}
              placeholder="0"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Educational Section 1: কয় টাকার উপরে যাকাত দিতে হবে? (নিসাব গাইডলাইন) */}
      <div className="bg-emerald-50/60 dark:bg-slate-800/80 p-5 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/30 space-y-3">
        <button
          onClick={() => setShowNisabInfo(!showNisabInfo)}
          className="w-full flex items-center justify-between font-black text-xs text-emerald-950 dark:text-emerald-300"
        >
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'bn' ? '১. কয় টাকার উপরে যাকাত দিতে হবে? (নিসাব নির্দেশিকা)' : '1. Minimum Wealth Threshold for Zakat (Nisab Guide)'}</span>
          </div>
          {showNisabInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showNisabInfo && (
          <div className="pt-3 border-t border-emerald-200/60 dark:border-slate-700 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                <ShieldCheck size={15} />
                <span>{language === 'bn' ? 'নিসাব (Nisab) কী এবং এর পরিমাণ কত?' : 'What is Nisab & Minimum Threshold?'}</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {language === 'bn' 
                  ? `নিসাব হলো শরীয়াহ নির্ধারিত ন্যূনতম উদ্বৃত্ত সম্পদের পরিমাণ। কোনো মুসলিমের কাছে নিত্যপ্রয়োজনীয় খরচ ও ঋণ বাদ দিয়ে নিসাব পরিমাণ বা তার বেশি অলস সম্পদ টানা ১ হিজরি বছর থাকলে তার উপর ২.৫% যাকাত প্রদান ফরজ হয়।`
                  : `Nisab is the minimum threshold of net wealth that obligates a Muslim to pay Zakat. If your net zakatable wealth reaches or exceeds Nisab for a full lunar year (Hawl), paying 2.5% Zakat is obligatory.`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  {language === 'bn' ? '⚪ রূপার নিসাব মানদণ্ড (প্রস্তাবিত):' : '⚪ Silver Standard (Recommended):'}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                  {language === 'bn' ? `৫২.৫ তোলা / ভরি = ৬১২.৩৬ গ্রাম (${formatCurrency(silverNisabThreshold)})` : `52.5 Tola = 612.36g (${formatCurrency(silverNisabThreshold)})`}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'নগদ টাকা, ব্যাংক জমা ও বিভিন্ন সম্পদের মিশ্রণের ক্ষেত্রে রূপার নিসাব ধরা হয়, যা দরিদ্রদের উপকার নিশ্চিত করে।' : 'Standard for mixed assets (cash, bank, gold/silver, stock) ensuring greater support for the needy.'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  {language === 'bn' ? '🟡 স্বর্ণের নিসাব মানদণ্ড:' : '🟡 Gold Standard:'}
                </div>
                <div className="text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                  {language === 'bn' ? `৭.৫ তোলা / ভরি = ৮৭.৪৮ গ্রাম (${formatCurrency(goldNisabThreshold)})` : `7.5 Tola = 87.48g (${formatCurrency(goldNisabThreshold)})`}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'প্রধানত কেবল বিশুদ্ধ স্বর্ণ অলঙ্কারের মালিকদের ক্ষেত্রে প্রয়োগ করা হয়।' : 'Mainly applied when someone solely holds pure gold ornaments.'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h5 className="font-bold text-slate-800 dark:text-slate-100 text-[11px] mb-1">
                {language === 'bn' ? 'কার উপর যাকাত দেওয়া ফরজ?' : 'Who Must Pay Zakat?'}
              </h5>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                <li>{language === 'bn' ? '১. স্বাধীন, প্রাপ্তবয়স্ক ও সজ্ঞান মুসলিম হওয়া।' : '1. Being an adult, sane Muslim.'}</li>
                <li>{language === 'bn' ? '২. ঋণ ও নিত্যপ্রয়োজনীয় ব্যয়ের অতিরিক্ত নিসাব পরিমাণ সম্পদের মালিক হওয়া।' : '2. Owning net wealth equal to or exceeding Nisab.'}</li>
                <li>{language === 'bn' ? '৩. উক্ত সম্পদের উপর পুরো ১ চন্দ্রবছর (হাওল / ১২ হিজরি মাস) অতিক্রান্ত হওয়া।' : '3. Possessing the wealth for a full lunar year (Hawl).'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Educational Section 2: কিভাবে যাকাত দিতে হবে? (প্রদান পদ্ধতি ও গাইডলাইন) */}
      <div className="bg-blue-50/60 dark:bg-slate-800/80 p-5 rounded-3xl border border-blue-200/80 dark:border-blue-900/30 space-y-3">
        <button
          onClick={() => setShowHowToPayGuide(!showHowToPayGuide)}
          className="w-full flex items-center justify-between font-black text-xs text-blue-950 dark:text-blue-300"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
            <span>{language === 'bn' ? '২. কিভাবে যাকাত দিতে হবে? (ধাপভিত্তিক সঠিক নিয়ম)' : '2. How to Calculate & Pay Zakat (Step-by-Step Guide)'}</span>
          </div>
          {showHowToPayGuide ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showHowToPayGuide && (
          <div className="pt-3 border-t border-blue-200/60 dark:border-slate-700 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <span>ধাপ ১:</span>
                  <span>{language === 'bn' ? 'বর্ষপূর্তি (হাওল) গণনা' : '1. Lunar Year (Hawl)'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {language === 'bn' 
                    ? 'হিজরি ক্যালেন্ডার অনুযায়ী যে দিন আপনার সম্পদ নিসাবে পৌঁছায়, তার ঠিক ১২ মাস পর আপনার যাকাত হিসাব করার নির্ধারিত তারিখ।'
                    : 'Track 12 lunar months from the exact date your total wealth first met or exceeded Nisab.'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <span>ধাপ ২:</span>
                  <span>{language === 'bn' ? 'মোট নেট সম্পদ বের করা' : '2. Net Asset Calculation'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {language === 'bn' 
                    ? 'নগদ টাকা + ব্যাংক জমার অর্থ + স্বর্ণ/রূপার মূল্য + ব্যবসার স্টক + শেয়ার/বিনিয়োগ যোগ করে তৎক্ষণাৎ দেয় ঋণ বিয়োগ করুন।'
                    : 'Sum cash, bank balance, gold/silver values, inventory & investments, then subtract immediate short-term debts.'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <span>ধাপ ৩:</span>
                  <span>{language === 'bn' ? '২.৫% (১/৪০ অংশ) হিসাব' : '3. Calculate 2.5% Rate'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {language === 'bn' 
                    ? 'নেট সম্পদ নিসাব অতিক্রম করলে তার মোট পরিমাণের ৪০ ভাগের ১ ভাগ বা ২.৫০% যাকাত বাবদ আলাদা করুন (যেমন: ১ লাখ টাকায় ২৫০০ টাকা)।'
                    : 'If net wealth >= Nisab, calculate exactly 2.5% (1/40th) as obligatory Zakat due (e.g. 2,500 per 100,000).'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <span>ধাপ ৪:</span>
                  <span>{language === 'bn' ? 'নিয়ত ও বিনম্র বণ্টন' : '4. Niyyah & Humble Giving'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {language === 'bn' 
                    ? 'যাকাত প্রদানের সময় অন্তরে কেবল আল্লাহর সন্তুষ্টি ও ফরয আদায়ের নিয়ত রাখুন। কোনো খোটা বা অহংকার ছাড়া গোপনে বা সম্মানের সাথে প্রদান করুন।'
                    : 'Form intention purely for Allah. Hand over Zakat discreetly and with dignity without causing embarrassment.'}
                </p>
              </div>
            </div>

            {/* Ineligible Recipients Note */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle size={15} className="text-amber-600" />
                <span>{language === 'bn' ? 'যাদের যাকাত দেওয়া যাবে না (অযোগ্য খাতসমূহ):' : 'Ineligible Recipients (Do Not Give Zakat To):'}</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>{language === 'bn' ? 'নিজের উর্ধ্বতন বংশধর (বাবা-মা, দাদা-দাদী, নানা-নানী)' : 'Parents, grandparents (direct ancestors)'}</li>
                <li>{language === 'bn' ? 'নিজের অধস্তন বংশধর (ছেলে-মেয়ে, নাতি-নাতনী)' : 'Children, grandchildren (direct descendants)'}</li>
                <li>{language === 'bn' ? 'নিজের স্বামী বা স্ত্রী (পরস্পরকে যাকাত দেওয়া যাবে না)' : 'Spouse (husband or wife)'}</li>
                <li>{language === 'bn' ? 'ধনী বা বিত্তশালী ব্যক্তিবর্গ এবং অমুসলিম সম্প্রদায়' : 'Affluent/wealthy individuals & non-Muslims'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Quranic Recipients Guidance */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
        <button
          onClick={() => setShowQuranicRecipients(!showQuranicRecipients)}
          className="w-full flex items-center justify-between font-bold text-xs text-slate-700 dark:text-slate-200"
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-emerald-500" />
            <span>{language === 'bn' ? 'কুরআনে বর্ণিত যাকাত পাওয়ার ৮ টি খাত (সূরা আত-তওবা ৬০)' : '8 Recipients of Zakat in the Holy Quran (Surah At-Tawbah 60)'}</span>
          </div>
          {showQuranicRecipients ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showQuranicRecipients && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {language === 'bn' 
                ? 'সূরা আত-তওবা (আয়াত ৬০) অনুযায়ী যাকাত বিতরণের খাতসমূহ:'
                : 'According to Surah At-Tawbah (Verse 60):'}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              <li>{language === 'bn' ? '১. ফকির (যার সামান্য কিছু সম্পদ আছে কিন্তু চলার মতো যথেষ্ট নয়)' : '1. Poor (Fuqara)'}</li>
              <li>{language === 'bn' ? '২. মিসকীন (যার কোনো সম্পদই নেই, সহায়-সম্বলহীন)' : '2. Needy (Masakin)'}</li>
              <li>{language === 'bn' ? '৩. যাকাত সংগ্রাহক ও হিসাবরক্ষক (যাকাত বোর্ডে নিয়োজিত কর্মকর্তা)' : '3. Zakat Administrators'}</li>
              <li>{language === 'bn' ? '৪. নওমুসলিম (যাদের ঈমানের উপর অবিচল রাখতে বা মন জয় করতে)' : '4. Reconciling Hearts'}</li>
              <li>{language === 'bn' ? '৫. দাস বা বন্দী মুক্তকরণে (স্বাধীনতাহীন ব্যক্তি)' : '5. Freeing Captives/Slaves'}</li>
              <li>{language === 'bn' ? '৬. ঋণগ্রস্ত ব্যক্তি (যিনি ভালো কাজে ঋণ করে শোধ করতে পারছেন না)' : '6. Debtors in Distress'}</li>
              <li>{language === 'bn' ? '৭. আল্লাহর রাস্তায় (দ্বীনের প্রচার, প্রসার ও খেদমতে)' : '7. In the Cause of Allah'}</li>
              <li>{language === 'bn' ? '৮. অসহায় মুসাফির (যিনি সফর অবস্থায় নিঃস্ব হয়ে পড়েছেন)' : '8. Stranded Travelers'}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Developer Help & Support Bottom Corner Widget */}
      <div className="mt-8 pt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-gradient-to-r from-blue-50/80 via-slate-50 to-blue-50/50 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-slate-900/90 p-5 rounded-3xl border border-blue-100/80 dark:border-blue-900/30 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Code size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs flex items-center gap-2">
              <span>{language === 'bn' ? 'ডেভেলপার হেল্প অ্যান্ড সাপোর্ট' : 'Developer Help & Support'}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[9px] font-black uppercase tracking-wider">
                Direct Contact
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {language === 'bn' 
                ? 'যেকোনো প্রযুক্তিগত প্রশ্ন, ফিচার প্রস্তাব বা সহায়তার জন্য ডেভেলপারদের সাথে যোগাযোগ করুন' 
                : 'For technical questions, feature requests, or developer assistance'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <a
            href="mailto:shahin.prpl@gmail.com"
            className="px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="shahin.prpl@gmail.com"
          >
            <Mail size={14} className="text-blue-500" />
            <span>{language === 'bn' ? 'ইমেইল সাপোর্ট' : 'Email Support'}</span>
          </a>
          <button
            onClick={() => setActiveTab('developer')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'ডেভেলপার পেজ' : 'Developer Page'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
