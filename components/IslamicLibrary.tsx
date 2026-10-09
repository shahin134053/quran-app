import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Search, Star, Bookmark, ExternalLink, Library } from 'lucide-react';

const BOOKS = [
  {
    id: 'seerah',
    title: 'Seerat-un-Nabi (PBUH)',
    author: 'Safiyur-Rahman al-Mubarakpuri',
    category: 'Biography',
    description: 'The Sealed Nectar - A detailed biography of the Prophet Muhammad (PBUH).',
    rating: 5.0
  },
  {
    id: 'sahaba',
    title: 'Stories of the Sahaba',
    author: 'Maulana Muhammad Zakariyya',
    category: 'History',
    description: 'Inspiring stories of the companions of the Prophet (PBUH).',
    rating: 4.9
  },
  {
    id: 'fiqh',
    title: 'Fiqh as-Sunnah',
    author: 'Sayyid Sabiq',
    category: 'Jurisprudence',
    description: 'A comprehensive guide to Islamic jurisprudence based on the Sunnah.',
    rating: 4.8
  },
  {
    id: 'hadith',
    title: 'Riyad as-Salihin',
    author: 'Imam an-Nawawi',
    category: 'Hadith',
    description: 'The Meadows of the Righteous - A collection of authentic hadiths.',
    rating: 5.0
  }
];

const IslamicLibrary: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = BOOKS.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black tracking-tight">Islamic Library</h2>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Library size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Knowledge is Light</h3>
          <p className="text-slate-400 text-sm font-medium opacity-90">Explore our collection of essential Islamic literature.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-slate-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBooks.map((book) => (
          <motion.div 
            key={book.id}
            layout
            className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex gap-6 group hover:border-slate-400 transition-all"
          >
            <div className="w-24 h-32 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 relative overflow-hidden">
              <Book size={40} />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-400" />
            </div>
            <div className="flex-grow flex flex-col justify-between py-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{book.category}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-black">{book.rating}</span>
                  </div>
                </div>
                <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight mb-1">{book.title}</h4>
                <p className="text-[10px] font-bold text-slate-500 mb-2">by {book.author}</p>
                <p className="text-xs text-slate-400 line-clamp-2">{book.description}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button className="flex-grow py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  <ExternalLink size={12} />
                  Read Now
                </button>
                <button className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default IslamicLibrary;
