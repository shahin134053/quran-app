
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, RefreshCw, AlertCircle, CheckCircle2, Megaphone, Heart, Activity, User, CreditCard, Building, Bell, Trash2, Send } from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';

interface AppConfig {
  homeAnnouncement: string;
  featuredDua: string;
  appStatus: string;
  donationBkash?: string;
  donationNagad?: string;
  donationDBBLAccount?: string;
  donationDBBLName?: string;
  donationBankAsiaAccount?: string;
  donationBankAsiaName?: string;
  eidMoonSighted?: boolean;
  eidMessage?: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: any;
}

const AdminDashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [config, setConfig] = useState<AppConfig>({
    homeAnnouncement: '',
    featuredDua: '',
    appStatus: 'online',
    donationBkash: '01919462158',
    donationNagad: '01919462158',
    donationDBBLAccount: '1481030371831',
    donationDBBLName: 'Md Shahin',
    donationBankAsiaAccount: '01034016742',
    donationBankAsiaName: 'Md. Shahin',
    eidMoonSighted: false,
    eidMessage: 'Eid Mubarak! May Allah accept our fasts and prayers.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementMessage, setNewAnnouncementMessage] = useState('');
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  const isAdmin = auth.currentUser?.email === 'shahin.prpl@gmail.com';

  useEffect(() => {
    if (!isAdmin) return;
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'app_config', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as AppConfig);
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();

    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Announcement[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Announcement);
      });
      setAnnouncements(data);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await setDoc(doc(db, 'app_config', 'global'), {
        ...config,
        updatedAt: serverTimestamp()
      });
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      console.error("Error saving config:", err);
      setMessage({ type: 'error', text: 'Failed to save settings. Check permissions.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementTitle.trim() || !newAnnouncementMessage.trim()) return;
    
    setSendingAnnouncement(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        title: newAnnouncementTitle,
        message: newAnnouncementMessage,
        createdAt: serverTimestamp()
      });
      setNewAnnouncementTitle('');
      setNewAnnouncementMessage('');
      setMessage({ type: 'success', text: 'Announcement sent successfully!' });
    } catch (err) {
      console.error("Error sending announcement:", err);
      setMessage({ type: 'error', text: 'Failed to send announcement.' });
    } finally {
      setSendingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600">
          <AlertCircle size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">You do not have administrative permissions to access this dashboard.</p>
        </div>
        <button 
          onClick={() => setActiveTab('home')}
          className="px-8 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold active:scale-95 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <RefreshCw className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

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
          <h2 className="text-2xl font-black tracking-tight">Admin Dashboard</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Manage App Content</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-xs font-bold">{message.text}</span>
          </motion.div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Megaphone size={18} />
              <label className="text-xs font-black uppercase tracking-widest">Home Announcement</label>
            </div>
            <textarea 
              value={config.homeAnnouncement}
              onChange={(e) => setConfig({ ...config, homeAnnouncement: e.target.value })}
              placeholder="Enter announcement text..."
              className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="text-xl">🌙</span>
                <label className="text-xs font-black uppercase tracking-widest">Eid Moon Sighted (Global Alert)</label>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, eidMoonSighted: !config.eidMoonSighted })}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${config.eidMoonSighted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${config.eidMoonSighted ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            {config.eidMoonSighted && (
              <div className="pt-4">
                <textarea 
                  value={config.eidMessage || ''}
                  onChange={(e) => setConfig({ ...config, eidMessage: e.target.value })}
                  placeholder="Enter Eid Mubarak message..."
                  className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-none"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-pink-600">
              <Heart size={18} />
              <label className="text-xs font-black uppercase tracking-widest">Featured Dua</label>
            </div>
            <textarea 
              value={config.featuredDua}
              onChange={(e) => setConfig({ ...config, featuredDua: e.target.value })}
              placeholder="Enter featured dua..."
              className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-pink-500 min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Activity size={18} />
              <label className="text-xs font-black uppercase tracking-widest">App Status</label>
            </div>
            <select 
              value={config.appStatus}
              onChange={(e) => setConfig({ ...config, appStatus: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="online">Online</option>
              <option value="maintenance">Maintenance</option>
              <option value="update">Update Required</option>
            </select>
          </div>
        </div>

        {/* Donation Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
              <CreditCard size={20} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest">Donation Details</h3>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Mobile Banking</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">bKash Number</span>
                <input 
                  type="text"
                  value={config.donationBkash}
                  onChange={(e) => setConfig({ ...config, donationBkash: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm font-bold border-none focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Nagad Number</span>
                <input 
                  type="text"
                  value={config.donationNagad}
                  onChange={(e) => setConfig({ ...config, donationNagad: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm font-bold border-none focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Bank Accounts</label>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Building size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Dutch Bangla Bank</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Name</span>
                  <input 
                    type="text"
                    value={config.donationDBBLName}
                    onChange={(e) => setConfig({ ...config, donationDBBLName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 text-sm font-bold border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Number</span>
                  <input 
                    type="text"
                    value={config.donationDBBLAccount}
                    onChange={(e) => setConfig({ ...config, donationDBBLAccount: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 text-sm font-bold border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Building size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Bank Asia</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Name</span>
                  <input 
                    type="text"
                    value={config.donationBankAsiaName}
                    onChange={(e) => setConfig({ ...config, donationBankAsiaName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 text-sm font-bold border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Number</span>
                  <input 
                    type="text"
                    value={config.donationBankAsiaAccount}
                    onChange={(e) => setConfig({ ...config, donationBankAsiaAccount: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 text-sm font-bold border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="w-full py-5 bg-emerald-600 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </form>

      {/* Push Announcements Section */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
            <Bell size={20} />
          </div>
          <h3 className="font-black text-sm uppercase tracking-widest">Push Announcements</h3>
        </div>

        <form onSubmit={handleSendAnnouncement} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
            <input 
              type="text"
              value={newAnnouncementTitle}
              onChange={(e) => setNewAnnouncementTitle(e.target.value)}
              placeholder="E.g., Ramadan Update"
              className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm font-bold border-none focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
            <textarea 
              value={newAnnouncementMessage}
              onChange={(e) => setNewAnnouncementMessage(e.target.value)}
              placeholder="Enter announcement details..."
              className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none outline-none"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={sendingAnnouncement}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {sendingAnnouncement ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
            {sendingAnnouncement ? 'Sending...' : 'Send Announcement'}
          </button>
        </form>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Previous Announcements</h4>
          {announcements.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No announcements sent yet.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">{announcement.title}</h5>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{announcement.message}</p>
                    {announcement.createdAt && (
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">
                        {new Date(announcement.createdAt.toDate()).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Admin Info</h4>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{auth.currentUser?.email}</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Verified Administrator</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
