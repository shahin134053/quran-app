import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Play, Info, Volume2, ChevronRight } from 'lucide-react';

const TAJWEED_LESSONS = [
  {
    id: 'makhraj',
    title: 'Makharij al-Huruf',
    description: 'The points of articulation for Arabic letters.',
    content: 'There are 17 specific points in the throat, tongue, lips, and nose where letters originate.',
    examples: ['Al-Halq (Throat)', 'Al-Lisan (Tongue)', 'Ash-Shafatan (Lips)']
  },
  {
    id: 'noon',
    title: 'Noon Sakinah & Tanween',
    description: 'Rules for the silent Noon and double vowels.',
    content: 'Four main rules: Izhaar (Clear), Idghaam (Merging), Iqlaab (Changing), and Ikhfaa (Hiding).',
    examples: ['Izhaar: Min-khawf', 'Idghaam: Mi-rrabbihim', 'Iqlaab: Mim-ba’di']
  },
  {
    id: 'meem',
    title: 'Meem Sakinah',
    description: 'Rules for the silent Meem.',
    content: 'Three main rules: Ikhfaa Shafawi, Idghaam Shafawi, and Izhaar Shafawi.',
    examples: ['Ikhfaa: Tarmeehim-bihijarah', 'Idghaam: Lakum-ma-sa’altum']
  },
  {
    id: 'madd',
    title: 'Al-Madd (Prolongation)',
    description: 'Rules for stretching vowel sounds.',
    content: 'Madd occurs when letters Alif, Waw, or Ya are followed by Hamza or Sukoon.',
    examples: ['Madd Tabee’ee (2 counts)', 'Madd Waajib (4-5 counts)', 'Madd Laazim (6 counts)']
  }
];

const TajweedEducation: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black tracking-tight">Tajweed Education</h2>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Volume2 size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Master Quranic Recitation</h3>
          <p className="text-blue-100 text-sm font-medium opacity-90">Learn the rules of Tajweed and Makhraj to recite beautifully.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TAJWEED_LESSONS.map((lesson) => (
          <div key={lesson.id} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button 
              onClick={() => setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id)}
              className="w-full p-6 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-slate-100">{lesson.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lesson.description}</p>
                </div>
              </div>
              <div className={`p-2 rounded-full transition-transform ${selectedLesson === lesson.id ? 'rotate-90 bg-blue-600 text-white' : 'text-slate-300'}`}>
                <ChevronRight size={20} />
              </div>
            </button>

            <AnimatePresence>
              {selectedLesson === lesson.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 space-y-4"
                >
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{lesson.content}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Examples</span>
                    <div className="flex flex-wrap gap-2">
                      {lesson.examples.map((ex, i) => (
                        <div key={i} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
                          <Play size={10} className="text-blue-600" />
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TajweedEducation;
