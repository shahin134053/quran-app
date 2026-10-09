import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Star, CheckCircle2, XCircle, Brain, HelpCircle, BookOpen, History, Trophy, ChevronRight, Play, Lock, Unlock, ListOrdered, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

interface IslamicGamesProps {
  setActiveTab: (tab: string) => void;
}

type GameType = 'quiz' | 'timeline' | 'surah' | null;

const IslamicGames: React.FC<IslamicGamesProps> = ({ setActiveTab }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => activeGame ? setActiveGame(null) : setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">
          {activeGame ? (
            activeGame === 'quiz' ? t.quizGame : 
            activeGame === 'timeline' ? t.timelineGame : 
            t.surahGame
          ) : t.games}
        </h2>
      </div>

      {!activeGame ? (
        <div className="grid grid-cols-1 gap-4">
          <GameCard 
            title={t.quizGame} 
            description="Test your knowledge across categories" 
            icon={<Brain size={32} />} 
            color="emerald" 
            onClick={() => setActiveGame('quiz')} 
          />
          <GameCard 
            title={t.timelineGame} 
            description="Arrange Islamic history events" 
            icon={<History size={32} />} 
            color="orange" 
            onClick={() => setActiveGame('timeline')} 
          />
          <GameCard 
            title={t.surahGame} 
            description="Learn Surah order and Ayahs" 
            icon={<BookOpen size={32} />} 
            color="indigo" 
            onClick={() => setActiveGame('surah')} 
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[400px]">
          {activeGame === 'quiz' && <QuizMaster t={t} />}
          {activeGame === 'timeline' && <TimelineChallenge t={t} />}
          {activeGame === 'surah' && <SurahBuilder t={t} />}
        </div>
      )}
    </motion.div>
  );
};

const GameCard = ({ title, description, icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/30 active:scale-95 transition-all group text-left w-full"
  >
    <div className="flex items-center gap-4">
      <div className={`w-16 h-16 bg-${color}-50 dark:bg-${color}-900/30 rounded-2xl flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
      <div className={`ml-auto w-10 h-10 rounded-full bg-${color}-50 dark:bg-${color}-900/30 flex items-center justify-center text-${color}-600 opacity-0 group-hover:opacity-100 transition-opacity`}>
        <ChevronRight size={20} />
      </div>
    </div>
  </button>
);

const QuizMaster = ({ t }: { t: any }) => {
  const { language } = useApp();
  const [category, setCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const getQuestions = (cat: string) => {
    // Simplified database
    const db: any = {
      prophets: [
        { q: "Who built the Kaaba?", o: ["Adam (AS)", "Ibrahim (AS)", "Nuh (AS)", "Musa (AS)"], a: 1 },
        { q: "Who was swallowed by a whale?", o: ["Yunus (AS)", "Yusuf (AS)", "Isa (AS)", "Musa (AS)"], a: 0 },
        { q: "Which prophet could speak to animals?", o: ["Sulaiman (AS)", "Dawud (AS)", "Ibrahim (AS)", "Nuh (AS)"], a: 0 },
        { q: "Who is the last prophet?", o: ["Isa (AS)", "Musa (AS)", "Muhammad (SAW)", "Ibrahim (AS)"], a: 2 },
        { q: "Who was given the Taurat?", o: ["Musa (AS)", "Isa (AS)", "Dawud (AS)", "Ibrahim (AS)"], a: 0 },
      ],
      quran: [
        { q: "How many Surahs in Quran?", o: ["110", "112", "114", "116"], a: 2 },
        { q: "Longest Surah?", o: ["Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Maidah"], a: 0 },
        { q: "Shortest Surah?", o: ["Al-Asr", "Al-Kawthar", "Al-Ikhlas", "An-Nasr"], a: 1 },
        { q: "Heart of the Quran?", o: ["Ya-Sin", "Al-Rahman", "Al-Mulk", "Al-Fatiha"], a: 0 },
        { q: "First Surah revealed?", o: ["Al-Fatiha", "Al-Alaq", "Al-Muddathir", "Al-Baqarah"], a: 1 },
      ],
      pillars: [
        { q: "How many pillars of Islam?", o: ["3", "4", "5", "6"], a: 2 },
        { q: "What is the first pillar?", o: ["Salah", "Shahada", "Zakat", "Sawm"], a: 1 },
        { q: "Fasting is in which month?", o: ["Rajab", "Sha'ban", "Ramadan", "Shawwal"], a: 2 },
        { q: "Hajj is to which city?", o: ["Madinah", "Jerusalem", "Makkah", "Taif"], a: 2 },
        { q: "Zakat is for?", o: ["Rich", "Poor", "Travelers", "Family"], a: 1 },
      ]
    };
    return db[cat] || [];
  };

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const questions = getQuestions(category!);
    const correct = index === questions[currentQuestion].a;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  if (!category) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-center mb-6">{t.categories}</h3>
        {[
          { id: 'prophets', label: t.prophets, icon: <User /> },
          { id: 'quran', label: t.quran, icon: <BookOpen /> },
          { id: 'pillars', label: t.pillars, icon: <Star /> }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategory(cat.id); setCurrentQuestion(0); setScore(0); setShowScore(false); }}
            className="w-full p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 group hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
          >
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
              {cat.icon}
            </div>
            <span className="font-black text-lg text-slate-700 dark:text-slate-200 group-hover:text-emerald-600">{cat.label}</span>
            <ChevronRight className="ml-auto text-slate-400" />
          </button>
        ))}
      </div>
    );
  }

  const questions = getQuestions(category);
  const question = questions[currentQuestion];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between w-full mb-6 px-1">
        <button onClick={() => setCategory(null)} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
          <ArrowLeft size={14} /> {t.categories}
        </button>
      </div>

      {showScore ? (
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <Trophy size={40} fill="currentColor" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">{t.finalScore}</h3>
          <p className="text-4xl font-black text-emerald-600 mb-6">{score} / {questions.length}</p>
          <button 
            onClick={() => setCategory(null)}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-transform"
          >
            {t.playAgain}
          </button>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-slate-500">Q {currentQuestion + 1}/{questions.length}</span>
            <span className="text-sm font-bold text-emerald-600">{t.score}: {score}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center min-h-[80px] flex items-center justify-center">
            {question.q}
          </h3>

          <div className="space-y-3">
            {question.o.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all flex justify-between items-center ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                      : 'bg-red-100 text-red-700 border-2 border-red-500'
                    : selectedAnswer !== null && index === question.a
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
                }`}
              >
                {option}
                {selectedAnswer === index && (
                  isCorrect ? <CheckCircle2 size={20} className="text-emerald-600" /> : <XCircle size={20} className="text-red-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TimelineChallenge = ({ t }: { t: any }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [orderedEvents, setOrderedEvents] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  const allEvents = [
    { id: 1, text: "Birth of Prophet Muhammad (SAW)", year: 570 },
    { id: 2, text: "First Revelation (Hira)", year: 610 },
    { id: 3, text: "Migration to Madinah (Hijrah)", year: 622 },
    { id: 4, text: "Battle of Badr", year: 624 },
    { id: 5, text: "Conquest of Makkah", year: 630 },
    { id: 6, text: "Death of Prophet Muhammad (SAW)", year: 632 }
  ];

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setEvents([...allEvents].sort(() => Math.random() - 0.5));
    setOrderedEvents([]);
    setMessage('');
    setCompleted(false);
  };

  const handleEventClick = (event: any) => {
    if (completed) return;
    
    // Check if this is the next correct event
    const nextCorrectIndex = orderedEvents.length;
    const correctEvent = allEvents[nextCorrectIndex];

    if (event.id === correctEvent.id) {
      const newOrdered = [...orderedEvents, event];
      setOrderedEvents(newOrdered);
      setEvents(events.filter(e => e.id !== event.id));
      setMessage(t.correctOrder);
      
      if (newOrdered.length === allEvents.length) {
        setCompleted(true);
        setMessage(t.completed + "!");
      }
    } else {
      setMessage(t.wrongOrder);
      setTimeout(() => setMessage(''), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full mb-6">
        <h3 className="text-lg font-bold text-center mb-2">{t.arrangeEvents}</h3>
        <p className="text-xs text-center text-slate-500">Tap events in chronological order</p>
      </div>

      <div className="w-full space-y-2 mb-8 min-h-[200px] bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-xs font-bold uppercase text-slate-400 mb-2">Timeline</p>
        {orderedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded-xl text-sm font-bold flex items-center gap-3"
          >
            <div className="w-6 h-6 bg-emerald-200 dark:bg-emerald-800 rounded-full flex items-center justify-center text-xs">{index + 1}</div>
            {event.text}
          </motion.div>
        ))}
        {orderedEvents.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm italic">Start tapping events below...</div>
        )}
      </div>

      {message && (
        <div className={`mb-4 font-bold ${message.includes(t.wrongOrder) ? 'text-red-500' : 'text-emerald-500'}`}>
          {message}
        </div>
      )}

      {completed ? (
        <button onClick={resetGame} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-transform">
          {t.playAgain}
        </button>
      ) : (
        <div className="w-full grid gap-2">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-left hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
            >
              {event.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SurahBuilder = ({ t }: { t: any }) => {
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [orderedAyahs, setOrderedAyahs] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');

  // Al-Ikhlas
  const correctOrder = [
    { id: 1, text: "Qul huwal laahu ahad" },
    { id: 2, text: "Allah hus-samad" },
    { id: 3, text: "Lam yalid wa lam yoolad" },
    { id: 4, text: "Wa lam yakul-lahu kufuwan ahad" }
  ];

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setAyahs([...correctOrder].sort(() => Math.random() - 0.5));
    setOrderedAyahs([]);
    setCompleted(false);
    setMessage('');
  };

  const handleAyahClick = (ayah: any) => {
    if (completed) return;

    const nextCorrectIndex = orderedAyahs.length;
    const correctAyah = correctOrder[nextCorrectIndex];

    if (ayah.id === correctAyah.id) {
      const newOrdered = [...orderedAyahs, ayah];
      setOrderedAyahs(newOrdered);
      setAyahs(ayahs.filter(a => a.id !== ayah.id));
      
      if (newOrdered.length === correctOrder.length) {
        setCompleted(true);
        setMessage(t.correctOrder);
      }
    } else {
      setMessage(t.wrongOrder);
      setTimeout(() => setMessage(''), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full mb-6 text-center">
        <h3 className="text-lg font-bold mb-1">Surah Al-Ikhlas</h3>
        <p className="text-xs text-slate-500">{t.arrangeAyahs}</p>
      </div>

      <div className="w-full space-y-2 mb-8 min-h-[150px] bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
        {orderedAyahs.map((ayah, index) => (
          <motion.div
            key={ayah.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-xl text-sm font-bold flex items-center gap-3"
          >
            <div className="w-6 h-6 bg-indigo-200 dark:bg-indigo-800 rounded-full flex items-center justify-center text-xs">{index + 1}</div>
            {ayah.text}
          </motion.div>
        ))}
        {orderedAyahs.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm italic">Tap Ayahs to build the Surah...</div>
        )}
      </div>

      {message && (
        <div className={`mb-4 font-bold ${message.includes(t.wrongOrder) ? 'text-red-500' : 'text-emerald-500'}`}>
          {message}
        </div>
      )}

      {completed ? (
        <button onClick={resetGame} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-transform">
          {t.playAgain}
        </button>
      ) : (
        <div className="w-full grid gap-2">
          {ayahs.map((ayah) => (
            <button
              key={ayah.id}
              onClick={() => handleAyahClick(ayah)}
              className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-left hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
            >
              {ayah.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IslamicGames;