
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowLeft, Info, DollarSign, Coins, Briefcase, Gem, Landmark, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

interface ZakatCalculatorProps {
  setActiveTab: (tab: string) => void;
}

const ZakatCalculator: React.FC<ZakatCalculatorProps> = ({ setActiveTab }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];

  const [assets, setAssets] = useState({
    cash: 0,
    bank: 0,
    gold: 0,
    silver: 0,
    investments: 0,
    business: 0,
    receivables: 0
  });

  const [liabilities, setLiabilities] = useState({
    debts: 0,
    expenses: 0
  });

  const [nisab, setNisab] = useState(60000); // Default Nisab in BDT/Local currency
  const [totalZakat, setTotalZakat] = useState(0);

  useEffect(() => {
    const totalAssets = Object.values(assets).reduce((a, b) => (a as number) + (b as number), 0) as number;
    const totalLiabilities = Object.values(liabilities).reduce((a, b) => (a as number) + (b as number), 0) as number;
    const netWealth = totalAssets - totalLiabilities;

    if (netWealth >= nisab) {
      setTotalZakat(netWealth * 0.025);
    } else {
      setTotalZakat(0);
    }
  }, [assets, liabilities, nisab]);

  const handleAssetChange = (key: keyof typeof assets, value: string) => {
    setAssets(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleLiabilityChange = (key: keyof typeof liabilities, value: string) => {
    setLiabilities(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Zakat Calculator</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Calculate your Zakat easily</p>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100/80 mb-2">Total Zakat Payable</p>
          <h3 className="text-5xl font-black tracking-tighter mb-2">
            {totalZakat.toLocaleString()} <span className="text-xl opacity-60">BDT</span>
          </h3>
          <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest">2.5% of your net wealth</p>
        </div>
        <Calculator className="absolute top-1/2 -right-8 -translate-y-1/2 text-white/5 w-56 h-56 pointer-events-none" />
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30">
          <div className="flex items-center gap-3 mb-8">
            <Coins className="text-emerald-600" size={20} />
            <h4 className="font-black text-xs uppercase tracking-widest">Assets</h4>
          </div>
          <div className="space-y-4">
            {[
              { key: 'cash', label: 'Cash on hand', icon: DollarSign },
              { key: 'bank', label: 'Bank accounts', icon: Landmark },
              { key: 'gold', label: 'Gold value', icon: Gem },
              { key: 'silver', label: 'Silver value', icon: Coins },
              { key: 'investments', label: 'Investments', icon: Briefcase },
            ].map((item) => (
              <div key={item.key} className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><item.icon size={16} /></div>
                <input 
                  type="number" 
                  placeholder={item.label}
                  onChange={(e) => handleAssetChange(item.key as any, e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-sm"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="text-red-500" size={20} />
            <h4 className="font-black text-xs uppercase tracking-widest">Liabilities</h4>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign size={16} /></div>
              <input 
                type="number" 
                placeholder="Debts / Loans"
                onChange={(e) => handleLiabilityChange('debts', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-red-500/10 transition-all font-bold text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30 space-y-4">
          <div className="flex items-center gap-3">
            <Info className="text-amber-600" size={20} />
            <h4 className="font-black text-xs uppercase tracking-widest text-amber-800 dark:text-amber-200">Nisab Threshold</h4>
          </div>
          <p className="text-xs font-medium text-amber-800 dark:text-amber-200 leading-relaxed">
            Nisab is the minimum amount of wealth a Muslim must possess before they are obligated to pay Zakat. 
            The current Nisab is approximately the value of 87.48 grams of gold or 612.36 grams of silver.
          </p>
          <div className="relative">
            <input 
              type="number" 
              value={nisab}
              onChange={(e) => setNisab(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/30 rounded-2xl py-4 px-6 outline-none font-bold text-sm text-amber-900 dark:text-amber-100"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-amber-400 uppercase">Set Nisab</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ZakatCalculator;
