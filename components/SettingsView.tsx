
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, ArrowLeft, User, Globe, Moon, Sun, Type, Save, CheckCircle2, Shield, LogIn, LogOut, Mail, Lock, Eye, EyeOff, AlertCircle, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS, APP_LANGUAGES } from '../constants';
import { ThemeMode } from '../types';
import { auth, signInWithGoogle, loginWithEmail } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface SettingsViewProps {
  setActiveTab: (tab: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ setActiveTab }) => {
  const { 
    language, setLanguage, 
    theme, setTheme,
    userName, setUserName,
    arabicFontSize, setArabicFontSize,
    translationFontSize, setTranslationFontSize
  } = useApp();
  
  const t = UI_TRANSLATIONS[language];
  const [nameInput, setNameInput] = useState(userName);
  const [showSaved, setShowSaved] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  
  // Email Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === 'shahin.prpl@gmail.com';

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const handleSaveName = () => {
    setUserName(nameInput);
    setShowSaved(true);
    setTimeout(() => setShowSaved(null), 2000);
    if (navigator.vibrate) navigator.vibrate(50);
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
          <h2 className="text-2xl font-black tracking-tight">{t.settings}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Personalize your experience</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-6">
          <div className="flex items-center gap-3">
            <User size={20} className="text-blue-600" />
            <h3 className="font-black text-xs uppercase tracking-widest">Account</h3>
          </div>
          
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-full border-2 border-emerald-500/20" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-100">{user.displayName || user.email?.split('@')[0] || 'User'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl active:scale-90 transition-transform"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                <button 
                  onClick={() => setAuthMethod('google')}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMethod === 'google' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Google
                </button>
                <button 
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMethod === 'email' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Email
                </button>
              </div>

              {authMethod === 'google' ? (
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isAuthLoading}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  <LogIn size={18} />
                  {isAuthLoading ? 'Connecting...' : 'Sign In with Google'}
                </button>
              ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-sm"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-sm"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  {authError && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl">
                      <AlertCircle size={14} />
                      <p className="text-[10px] font-bold uppercase tracking-wider">{authError}</p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isAuthLoading ? 'Processing...' : 'Sign In / Register'}
                  </button>
                  <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-[0.15em]">New users will be registered automatically</p>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 card-shadow border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 text-emerald-500">
              <Shield size={20} />
              <h3 className="font-black text-xs uppercase tracking-widest">Admin Controls</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium">You have administrative access. Manage global app settings and content.</p>
            <button 
              onClick={() => setActiveTab('admin')}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
              Open Admin Dashboard
            </button>
          </div>
        )}

        {/* Support Us Section */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Heart size={80} fill="currentColor" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-rose-100">
              <Heart size={20} fill="currentColor" className="animate-pulse" />
              <h3 className="font-black text-xs uppercase tracking-widest">Support Al-Muneer</h3>
            </div>
            <p className="text-sm font-medium opacity-90 leading-relaxed">
              This app is a 100% non-profit project. Help us keep it free, ad-free, and growing for the Ummah.
            </p>
            <button 
              onClick={() => setActiveTab('donation')}
              className="w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-md"
            >
              Donate Now
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-6">
          <div className="flex items-center gap-3">
            <User size={20} className="text-emerald-600" />
            <h3 className="font-black text-xs uppercase tracking-widest">Profile</h3>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-sm"
              />
              <button 
                onClick={handleSaveName}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20 active:scale-90 transition-transform"
              >
                {showSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-6">
          <div className="flex items-center gap-3">
            <Moon size={20} className="text-purple-600" />
            <h3 className="font-black text-xs uppercase tracking-widest">Appearance</h3>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setTheme(ThemeMode.LIGHT)}
              className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${theme === ThemeMode.LIGHT ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
            >
              <Sun size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Light</span>
            </button>
            <button 
              onClick={() => setTheme(ThemeMode.DARK)}
              className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${theme === ThemeMode.DARK ? 'bg-emerald-900/20 border-emerald-900/30 text-emerald-400' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}
            >
              <Moon size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Dark</span>
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-6">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-blue-600" />
            <h3 className="font-black text-xs uppercase tracking-widest">Language</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {APP_LANGUAGES.map(lang => (
              <button 
                key={lang.id}
                onClick={() => setLanguage(lang.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${language === lang.id ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
              >
                <span className="block text-xs font-black uppercase tracking-widest">{lang.name}</span>
                <span className="text-[8px] font-bold opacity-60">{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-6">
          <div className="flex items-center gap-3">
            <Type size={20} className="text-orange-600" />
            <h3 className="font-black text-xs uppercase tracking-widest">Typography</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Arabic Font Size</span>
                <span className="text-xs font-black text-emerald-600">{arabicFontSize}px</span>
              </div>
              <input 
                type="range" min="20" max="50" step="2"
                value={arabicFontSize}
                onChange={(e) => setArabicFontSize(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Translation Font Size</span>
                <span className="text-xs font-black text-emerald-600">{translationFontSize}px</span>
              </div>
              <input 
                type="range" min="12" max="24" step="1"
                value={translationFontSize}
                onChange={(e) => setTranslationFontSize(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
