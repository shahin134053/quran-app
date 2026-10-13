import React from 'react';
import { RefreshCw, ShieldAlert, Trash2, Sparkles } from 'lucide-react';

export interface Props {
  children?: React.ReactNode;
}

export interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in Al-Shahin Quran App:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetApp = () => {
    if (window.confirm('আপনি কি অ্যাপের ক্যাশ ও ডাটা ক্লিয়ার করে সম্পূর্ণ নতুনভাবে চালু করতে চান?')) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
      window.location.reload();
    }
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full bg-slate-800/90 border border-emerald-500/30 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            
            <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/40 animate-pulse">
              <ShieldAlert size={40} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-amber-300">
                আল-শাহীন কুরআন অ্যাপ
              </h2>
              <p className="text-base font-bold text-slate-200">
                অ্যাপ লোড হতে সাময়িক সমস্যা হয়েছে
              </p>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা অ্যাপের সংরক্ষিত পুরনো ডাটা রিসেট করুন।
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-700/60 text-left overflow-hidden">
                <p className="text-[10px] font-mono text-rose-400 truncate">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                <span>পুনরায় চেষ্টা করুন (Reload)</span>
              </button>

              <button
                onClick={this.handleResetApp}
                className="w-full py-3.5 bg-slate-700/80 hover:bg-slate-700 active:scale-95 transition-all rounded-2xl font-bold text-xs text-slate-300 hover:text-white border border-slate-600 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} className="text-rose-400" />
                <span>ক্যাশ ক্লিয়ার ও অ্যাপ রিসেট করুন</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <Sparkles size={12} className="text-amber-400" />
              <span>বিসমিল্লাহির রাহমানির রাহিম</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
