import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, CheckCircle2, XCircle, RefreshCw, User, Medal } from 'lucide-react';
import { db, auth, signInWithGoogle } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, setDoc, doc, serverTimestamp } from 'firebase/firestore';

const QUIZ_QUESTIONS = [
  {
    question: "How many Surahs are there in the Holy Quran?",
    options: ["110", "114", "120", "118"],
    answer: 1
  },
  {
    question: "Which Prophet is known as the 'Friend of Allah' (Khalilullah)?",
    options: ["Prophet Musa (AS)", "Prophet Ibrahim (AS)", "Prophet Isa (AS)", "Prophet Muhammad (PBUH)"],
    answer: 1
  },
  {
    question: "What is the first month of the Islamic calendar?",
    options: ["Ramadan", "Muharram", "Dhul-Hijjah", "Rajab"],
    answer: 1
  },
  {
    question: "In which city was the Prophet Muhammad (PBUH) born?",
    options: ["Madinah", "Makkah", "Jerusalem", "Taif"],
    answer: 1
  }
];

interface LeaderboardEntry {
  uid: string;
  userName: string;
  score: number;
}

const QuizLeaderboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [view, setView] = useState<'quiz' | 'leaderboard'>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
      setLeaderboard(entries);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAnswer = (index: number) => {
    if (index === QUIZ_QUESTIONS[currentQuestion].answer) {
      setScore(s => s + 10);
    }

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setQuizFinished(true);
      saveScore();
    }
  };

  const saveScore = async () => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, 'leaderboard', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous User',
        score: score + (QUIZ_QUESTIONS[currentQuestion].answer === QUIZ_QUESTIONS[currentQuestion].answer ? 10 : 0), // Adjust for last question
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
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
        <h2 className="text-2xl font-black tracking-tight">Islamic Quiz & Leaderboard</h2>
      </div>

      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button 
          onClick={() => setView('quiz')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'quiz' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
        >
          Take Quiz
        </button>
        <button 
          onClick={() => setView('leaderboard')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'leaderboard' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
        >
          Leaderboard
        </button>
      </div>

      {!auth.currentUser && view === 'quiz' ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] text-center border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <Trophy size={40} />
          </div>
          <div>
            <h3 className="text-xl font-black mb-2">Sign in to Play</h3>
            <p className="text-sm text-slate-400 font-medium">Sign in to save your score and compete on the global leaderboard.</p>
          </div>
          <button 
            onClick={signInWithGoogle}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'quiz' ? (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {!quizFinished ? (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
                    <span className="text-xs font-black text-emerald-600">Score: {score}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-8 leading-tight">
                    {QUIZ_QUESTIONS[currentQuestion].question}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-left font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 transition-all border border-transparent"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] text-center border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <Trophy size={48} />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Quiz Completed!</h3>
                  <p className="text-slate-400 font-bold text-sm mb-8">Your final score is {score}</p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={restartQuiz}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => setView('leaderboard')}
                      className="w-full py-4 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      View Leaderboard
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {loading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="animate-spin text-emerald-500" size={32} />
                </div>
              ) : (
                leaderboard.map((entry, idx) => (
                  <div 
                    key={entry.uid}
                    className={`bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between ${idx === 0 ? 'ring-2 ring-amber-400' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        idx === 0 ? 'bg-amber-100 text-amber-600' : 
                        idx === 1 ? 'bg-slate-100 text-slate-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-slate-50 text-slate-400'
                      }`}>
                        {idx === 0 ? <Medal size={20} /> : idx + 1}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 dark:text-slate-100">{entry.userName}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Top Contributor</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Star size={14} fill="currentColor" />
                      <span className="text-lg font-black">{entry.score}</span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default QuizLeaderboard;
