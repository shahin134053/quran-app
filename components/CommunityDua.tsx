import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, Send, Heart, User, Clock, RefreshCw } from 'lucide-react';
import { db, auth, signInWithGoogle } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

interface DuaRequest {
  id: string;
  text: string;
  authorName: string;
  authorUid: string;
  createdAt: any;
  aminCount: number;
}

const CommunityDua: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [duas, setDuas] = useState<DuaRequest[]>([]);
  const [newDua, setNewDua] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'community_duas'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DuaRequest[];
      setDuas(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDua.trim() || !auth.currentUser) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'community_duas'), {
        text: newDua,
        authorName: auth.currentUser.displayName || 'Anonymous User',
        authorUid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        aminCount: 0
      });
      setNewDua('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAmin = async (duaId: string, currentCount: number) => {
    try {
      const duaRef = doc(db, 'community_duas', duaId);
      await updateDoc(duaRef, {
        aminCount: currentCount + 1
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black tracking-tight">Community Dua</h2>
      </div>

      <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageSquare size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Pray for Each Other</h3>
          <p className="text-indigo-100 text-sm font-medium opacity-90">Submit a prayer request or say 'Amin' to support others.</p>
        </div>
      </div>

      {!auth.currentUser ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto text-indigo-600">
            <User size={32} />
          </div>
          <h3 className="text-lg font-black tracking-tight">Sign in to participate</h3>
          <p className="text-sm text-slate-400 font-medium">Join the community to submit prayer requests and support others.</p>
          <button 
            onClick={signInWithGoogle}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <textarea 
            value={newDua}
            onChange={(e) => setNewDua(e.target.value)}
            placeholder="Write your prayer request here..."
            className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none"
          />
          <div className="flex justify-end mt-4">
            <button 
              type="submit"
              disabled={submitting || !newDua.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : (
          duas.map((dua) => (
            <motion.div 
              key={dua.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{dua.authorName}</h4>
                  <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={8} />
                    {dua.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 italic">"{dua.text}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-900">
                <div className="flex items-center gap-2 text-pink-500">
                  <Heart size={14} fill={dua.aminCount > 0 ? "currentColor" : "none"} />
                  <span className="text-xs font-black">{dua.aminCount} Amins</span>
                </div>
                <button 
                  onClick={() => handleAmin(dua.id, dua.aminCount)}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Say Amin
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CommunityDua;
