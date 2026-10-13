import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Moon, Calendar, Clock, BookOpen, Quote, 
  Sparkles, HeartHandshake, Volume2, CheckCircle2, 
  Copy, Check, Star, ShieldCheck, ChevronDown, ChevronUp,
  Share2, Sun, Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playAudioText, stopAllAudio } from '../utils/audioHelper';
import { PrayerTimings, HijriDate } from '../types';

interface RamadanDedicatedViewProps {
  setActiveTab: (tab: string) => void;
  prayerData?: { timings: PrayerTimings; hijri: HijriDate } | null;
  ramadanDays: number | null;
  ramadanCalendar?: any[];
}

export const RamadanDedicatedView: React.FC<RamadanDedicatedViewProps> = ({
  setActiveTab,
  prayerData,
  ramadanDays,
  ramadanCalendar = []
}) => {
  const { language, activeThemeConfig } = useApp();
  const [activeSection, setActiveSection] = useState<'all' | 'quran' | 'hadith' | 'duas' | 'rules' | 'calendar'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Check if current Hijri month is genuinely Ramadan (month 9) or demo active
  const isCurrentlyRamadan = Boolean(
    prayerData?.hijri?.month?.number === 9 || 
    prayerData?.hijri?.month?.en?.toLowerCase().includes('ramadan') ||
    prayerData?.hijri?.month?.ar?.includes('রমضان') ||
    (typeof window !== 'undefined' && localStorage.getItem('ramadan_demo_highlight') === 'true')
  );
  const currentRamadanDay = isCurrentlyRamadan ? parseInt(prayerData?.hijri?.day || '1') : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getNextFastingMilestone = () => {
    if (!prayerData?.timings?.Fajr || !prayerData?.timings?.Maghrib) return null;
    try {
      const now = new Date();
      const parseTimeToDate = (timeStr: string) => {
        const clean = timeStr.split(' ')[0];
        const [h, m] = clean.split(':').map(Number);
        const d = new Date(now);
        d.setHours(h, m, 0, 0);
        return d;
      };

      const fajrDate = parseTimeToDate(prayerData.timings.Fajr);
      const maghribDate = parseTimeToDate(prayerData.timings.Maghrib);

      if (now < fajrDate) {
        const diffMs = fajrDate.getTime() - now.getTime();
        const hrs = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return {
          type: 'sehri',
          labelBn: `আজকের সেহরি শেষ হতে বাকি: ${hrs} ঘণ্টা ${mins} মিনিট`,
          labelEn: `Time left for Sehri: ${hrs}h ${mins}m`,
          time: prayerData.timings.Fajr
        };
      } else if (now < maghribDate) {
        const diffMs = maghribDate.getTime() - now.getTime();
        const hrs = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return {
          type: 'iftar',
          labelBn: `আজকের ইফতারের বাকি: ${hrs} ঘণ্টা ${mins} মিনিট`,
          labelEn: `Time left for Iftar: ${hrs}h ${mins}m`,
          time: prayerData.timings.Maghrib
        };
      } else {
        return {
          type: 'tomorrow',
          labelBn: `আলহামদুলিল্লাহ, আজকের ইফতার সম্পন্ন হয়েছে`,
          labelEn: `Today's Iftar completed`,
          time: prayerData.timings.Maghrib
        };
      }
    } catch {
      return null;
    }
  };

  const fastingMilestone = getNextFastingMilestone();

  const playDuaVoice = (text: string, id: string) => {
    if (playingAudioId === id) {
      stopAllAudio();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(id);
    playAudioText(text, 'ar', {
      onEnd: () => setPlayingAudioId(null),
      onError: () => setPlayingAudioId(null)
    });
  };

  const QURAN_VERSES = language === 'en' ? [
    {
      surah: 'Surah Al-Baqarah, 183',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
      translation: 'O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.',
      tafsir: 'This verse establishes that the primary objective of fasting is Taqwa (God-consciousness), purifying the soul and restraining desires.'
    },
    {
      surah: 'Surah Al-Baqarah, 185',
      arabic: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ ۚ فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ',
      translation: 'The month of Ramadan [is that] in which was revealed the Qur\'an, guidance for the people and clear proofs of guidance and criterion. So whoever sights [the new moon of] the month, let him fast it.',
      tafsir: 'The greatest distinction of Ramadan is the revelation of the Quran. Muslims are encouraged to increase recitation, contemplation, and application during this month.'
    },
    {
      surah: 'Surah Al-Qadr, 1-5',
      arabic: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
      translation: 'Indeed, We sent the Qur\'an down during the Night of Decree. And what can make you know what is the Night of Decree? The Night of Decree is better than a thousand months.',
      tafsir: 'Encourages searching for Laylatul Qadr in the odd nights of the last ten days of Ramadan, granting rewards greater than 83 years of worship.'
    }
  ] : [
    {
      surah: 'সুরা আল-বাকারা, ১৮৩',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
      translation: 'হে ঈমানদারগণ! তোমাদের ওপর রোজা ফরজ করা হয়েছে, যেমন ফরজ করা হয়েছিল তোমাদের পূর্ববর্তীদের ওপর; যেন তোমরা তাকওয়া (আল্লাহভীতি) অর্জন করতে পারো।',
      tafsir: 'এই আয়াতে আল্লাহ তাআলা রোজা ফরজ করার মূল উদ্দেশ্য হিসেবে তাকওয়া অর্জনকে ঘোষণা করেছেন। সিয়াম মানুষের নফসকে নিয়ন্ত্রণ করে আত্মশুদ্ধির শিক্ষা দেয়।'
    },
    {
      surah: 'সুরা আল-বাকারা, ১৮৫',
      arabic: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ ۚ فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ',
      translation: 'রমাদান মাসই হলো সেই মাস, যাতে নাযিল করা হয়েছে আল-কুরআন, যা মানুষের জন্য হেদায়েত এবং সত্যপথের সুস্পষ্ট নিদর্শন ও সত্য-মিথ্যার পার্থক্যকারী। সুতরাং তোমাদের মধ্যে যে এ মাস পাবে, সে যেন রোজা রাখে।',
      tafsir: 'রমাদানের শ্রেষ্ঠত্বের প্রধান কারণ কুরআন নাযিল। এই মাসে বেশি বেশি কুরআন তিলাওয়াত, বুঝা ও বাস্তব জীবনে আমল করার বিশেষ তাগিদ রয়েছে।'
    },
    {
      surah: 'সুরা আল-কদর, ১-৫',
      arabic: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
      translation: 'নিশ্চয়ই আমি এটি নাযিল করেছি মহিমান্বিত রজনীতে (লাইলাতুল কদর)। আর আপনি কি জানেন মহিমান্বিত রজনী কী? মহিমান্বিত রজনী এক হাজার মাস অপেক্ষা উত্তম।',
      tafsir: 'রমাদানের শেষ দশকের বিজোড় রাতগুলোতে লাইলাতুল কদর তালাশ করার নির্দেশ এসেছে, যাতে রয়েছে ৮৩ বছর ৪ মাসের চেয়েও বেশি সময়ের ইবাদতের সওয়াব।'
    }
  ];

  const HADITHS = language === 'en' ? [
    {
      title: 'Ar-Rayyan: The Special Gate of Paradise',
      source: 'Sahih Bukhari 1896, Sahih Muslim 1152',
      arabic: 'إِنَّ فِي الْجَنَّةِ بَابًا يُقَالُ لَهُ الرَّيَّانُ يَدْخُلُ مِنْهُ الصَّائِمُونَ يَوْمَ الْقِيَامَةِ لَا يَدْخُلُ مِنْهُ أَحَدٌ غَيْرُهُمْ',
      translation: 'The Prophet (ﷺ) said: "Indeed, in Paradise there is a gate called Ar-Rayyan, through which those who fast will enter on the Day of Resurrection, and no one else will enter through it alongside them."'
    },
    {
      title: 'Forgiveness of All Past Sins',
      source: 'Sahih Bukhari 38, Sahih Muslim 760',
      arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
      translation: 'The Prophet (ﷺ) said: "Whoever fasts Ramadan out of faith and in the hope of reward, his previous sins will be forgiven."'
    },
    {
      title: 'Two Joys for the Fasting Person',
      source: 'Sahih Bukhari 1904',
      arabic: 'لِلصَّائِمِ فَرْحَتَانِ يَفْرَحُهُمَا: إِذَا أَفْطَرَ فَرِحَ، وَإِذَا لَقِيَ رَبَّهُ فَرِحَ بِصَوْمِهِ',
      translation: 'The Prophet (ﷺ) said: "The fasting person has two joys: one when he breaks his fast, and one when he meets his Lord and rejoices in his fast."'
    },
    {
      title: 'Chaining of Shayateen & Opening of Mercy',
      source: 'Sahih Bukhari 1899',
      arabic: 'إِذَا دَخَلَ شَهْرُ رَمَضَانَ فُتِّحَتْ أَبْوَابُ السَّمَاءِ، وَغُلِّقَتْ أَبْوَابُ جَهَنَّمَ، وَسُلْسِلَتِ الشَّيَاطِينُ',
      translation: 'The Prophet (ﷺ) said: "When Ramadan begins, the gates of heaven are opened, the gates of Hell are closed, and the devils are chained."'
    }
  ] : [
    {
      title: 'জান্নাতের বিশেষ তোরণ রাইয়ান',
      source: 'সহীহ বুখারী ১৮৯৬, সহীহ মুসলিম ১১৫২',
      arabic: 'إِنَّ فِي الْجَنَّةِ بَابًا يُقَالُ لَهُ الرَّيَّانُ يَدْخُلُ مِنْهُ الصَّائِمُونَ يَوْمَ الْقِيَامَةِ لَا يَدْخُلُ مِنْهُ أَحَدٌ غَيْرُهُمْ',
      translation: 'রাসূলুল্লাহ (সা.) বলেছেন: "জান্নাতে রাইয়ান নামক একটি দরজা আছে। কিয়ামতের দিন রোজাদারগণ ছাড়া আর কেউ সেই দরজা দিয়ে প্রবেশ করবে না। ঘোষণা করা হবে, রোজাদাররা কোথায়? তখন তারা উঠবে এবং প্রবেশ করবে। তাদের প্রবেশের পর দরজাটি বন্ধ করে দেওয়া হবে।"'
    },
    {
      title: 'পূর্বের সমস্ত গুনাহ মাফ',
      source: 'সহীহ বুখারী ৩৮, সহীহ মুসলিম ৭৬০',
      arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
      translation: 'রাসূলুল্লাহ (সা.) বলেছেন: "যে ব্যক্তি ঈমান ও সওয়াবের আশায় রমাদানের রোজা রাখবে, তার পূর্ববর্তী সমস্ত গুনাহ ক্ষমা করে দেওয়া হবে।"'
    },
    {
      title: 'রোজাদারের জন্য দুটি আনন্দ',
      source: 'সহীহ বুখারী ১৯০৪',
      arabic: 'لِلصَّائِمِ فَرْحَتَانِ يَفْرَحُهُمَا: إِذَا أَفْطَرَ فَرِحَ، وَإِذَا لَقِيَ رَبَّهُ فَرِحَ بِصَوْمِهِ',
      translation: 'রাসূলুল্লাহ (সা.) বলেছেন: "রোজাদারের জন্য দুটি আনন্দঘন মুহূর্ত রয়েছে। একটি যখন সে ইফতার করে, তখন আনন্দ পায়; আর দ্বিতীয়টি যখন সে তার রবের সাথে সাক্ষাৎ করবে, তখন নিজের রোজার কারণে আনন্দিত হবে।"'
    },
    {
      title: 'শয়তানকে শৃঙ্খলিত করা ও রহমত উন্মুক্তকরণ',
      source: 'সহীহ বুখারী ১৮৯৯',
      arabic: 'إِذَا دَخَلَ شَهْرُ رَمَضَانَ فُتِّحَتْ أَبْوَابُ السَّمَاءِ، وَغُلِّقَتْ أَبْوَابُ جَهَنَّمَ، وَسُلْسِلَتِ الشَّيَاطِينُ',
      translation: 'রাসূলুল্লাহ (সা.) বলেছেন: "রমাদান মাস উপস্থিত হলে আকাশের দরজাসমূহ খুলে দেওয়া হয়, জাহান্নামের দরজাসমূহ বন্ধ করে দেওয়া হয় এবং শয়তানদের শিকলবদ্ধ করা হয়।"'
    }
  ];

  const DUAS = language === 'en' ? [
    {
      id: 'dua-sehri',
      title: 'Intention for Fasting (Sehri)',
      arabic: 'نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَكَ يَا اللَّهُ فَتَقَبَّلْ مِنِّي إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
      transliteration: 'Nawaytu an asuma ghadan min shahri ramadan al-mubarak fardan laka ya Allah, fataqabbal minni innaka anta as-samiul alim.',
      meaning: 'O Allah! I intend to keep the obligatory fast of Ramadan tomorrow for Your sake. So accept it from me, indeed You are the All-Hearing, All-Knowing.'
    },
    {
      id: 'dua-iftar-sahih',
      title: 'Authentic Sunnah Dua upon Breaking Fast',
      arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
      transliteration: 'Dhahaba adh-zama\'u wabtallatil uruqu wa thabatal ajru in sha\' Allah.',
      meaning: 'Thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills. (Abu Dawud 2357)'
    },
    {
      id: 'dua-iftar-common',
      title: 'Common Dua upon Iftar',
      arabic: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
      transliteration: 'Allahumma inni laka sumtu wa ala rizqika aftartu.',
      meaning: 'O Allah! For You I have fasted, and with Your sustenance I have broken my fast. (Abu Dawud 2358)'
    },
    {
      id: 'dua-qadr',
      title: 'Special Dua for Laylatul Qadr',
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      transliteration: 'Allahumma innaka afuwwun tuhibbul afwa fa\'fu anni.',
      meaning: 'O Allah! Indeed You are Pardoning, You love pardon, so pardon me. (Tirmidhi 3513)'
    }
  ] : [
    {
      id: 'dua-sehri',
      title: 'রোজার নিয়ত (সাহরি)',
      arabic: 'نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَكَ يَا اللَّهُ فَتَقَبَّلْ مِنِّي إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
      transliteration: 'নাওয়াইতু আন আসূমা গাদাম মিন শাহরি রামাদানাল মুবারাকি ফারদাল লাকা ইয়া আল্লাহু ফাতাকাব্বাল মিন্নী ইন্নাকা আনতাস সামীউল আলীম।',
      meaning: 'হে আল্লাহ! আমি আগামীকাল পবিত্র রমাদান মাসের ফরজ রোজা রাখার নিয়ত করলাম। অতএব আপনি আমার পক্ষ থেকে তা কবুল করুন, নিশ্চয়ই আপনি সর্বশ্রোতা ও সর্বজ্ঞাত। (মনে মনে সংকল্প করাই নিয়তের মূল)।'
    },
    {
      id: 'dua-iftar-sahih',
      title: 'ইফতারের সহীহ সুন্নাহ দু\'আ',
      arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
      transliteration: 'যাহাবাজ জামাউ ওয়াবতাল্লাতিল উরূকু ওয়া ছাবাতাল আজরু ইনশাআল্লাহ।',
      meaning: 'পিপাসা দূর হলো, শিরা-উপশিরা সিক্ত হলো এবং ইনশাআল্লাহ সওয়াবও সুনিশ্চিত হলো। (আবু দাউদ ২৩৫৭)'
    },
    {
      id: 'dua-iftar-common',
      title: 'ইফতার গ্রহণের প্রচলিত দু\'আ',
      arabic: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
      transliteration: 'আল্লাহুম্মা ইন্নী লাকা সুমতু ওয়া আলা রিযক্বিকা আফতারতু।',
      meaning: 'হে আল্লাহ! আমি আপনার সন্তুষ্টির জন্যই রোজা রেখেছি এবং আপনারই দেওয়া রিজিক দ্বারা ইফতার করছি। (আবু দাউদ ২৩৫৮)'
    },
    {
      id: 'dua-qadr',
      title: 'লাইলাতুল কদরের বিশেষ দু\'আ',
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      transliteration: 'আল্লাহুম্মা ইন্নাকা আফুউউন তুহিব্বুল আফওয়া ফা\'ফু আন্নী।',
      meaning: 'হে আল্লাহ! নিশ্চয়ই আপনি ক্ষমাশীল, ক্ষমা করতে ভালোবাসেন; অতএব আমাকে ক্ষমা করে দিন। (তিরমিযী ৩৫১৩)'
    }
  ];

  const RULES = language === 'en' ? [
    {
      title: 'Who is fasting obligatory upon?',
      content: 'Fasting Ramadan is obligatory upon every sane, adult, capable Muslim. Travelers and the sick have temporary exemptions and must make up for missed fasts later.'
    },
    {
      title: 'Acts that invalidate the fast',
      content: 'Intentionally eating, drinking, or smoking, sexual intercourse, intentionally swallowing induced vomit, and breaking the fast before sunset.'
    },
    {
      title: 'Acts that do not invalidate the fast',
      content: 'Eating or drinking out of forgetfulness (continue fasting immediately upon remembering), eye drops, injections, using Miswak, and applying kohl.'
    },
    {
      title: 'Sadaqatul Fitr (Fitra)',
      content: 'Wajib for every Muslim who possesses nisab wealth before Fajr on Eid al-Fitr, on behalf of themselves and dependents. It is Sunnah to distribute it before Eid prayer.'
    }
  ] : [
    {
      title: 'কাদের ওপর রোজা রাখা ফরজ?',
      content: 'প্রত্যেক সুস্থ মস্তিষ্কসম্পন্ন, বালেগ বা প্রাপ্তবয়স্ক মুসলমান নর-নারীর ওপর রমাদানের রোজা রাখা ফরজ। মুসাফির ও অসুস্থ ব্যক্তির জন্য সাময়িক ছাড় রয়েছে, পরবর্তীতে কাজা করতে হবে।'
    },
    {
      title: 'রোজা ভঙ্গের কারণসমূহ',
      content: 'ইচ্ছাকৃতভাবে পানাহার করা বা ধূমপান করা, স্বামী-স্ত্রীর মিলন, বমি ইচ্ছাকৃতভাবে গিলে ফেলা, এবং সূর্যাস্তের পূর্বে ইফতার করা।'
    },
    {
      title: 'যেসব কারণে রোজা ভাঙে না',
      content: 'ভুলবশত পানাহার করা (মনে পড়ার সাথে সাথে থুথু ফেলে রোজা অব্যাহত রাখবে), চোখের ড্রপ, ইনজেকশন বা স্যালাইন (যা খাদ্যের বিকল্প নয়), মেসওয়াক করা এবং চোখে সুরমা লাগানো।'
    },
    {
      title: 'সাদকাতুল ফিতর (ফিতরা)',
      content: 'ঈদুল ফিতরের দিন সুবহে সাদিকের পূর্বে যে ব্যক্তি নিসাব পরিমাণ সম্পদের মালিক হবে, তার ওপর এবং তার অধীনস্থদের পক্ষ থেকে ফিতরা আদায় করা ওয়াজিব। ঈদের নামাজের আগেই ফিতরা বণ্টন করা সুন্নাহ।'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 pt-2 pb-16"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setActiveTab('home')}
          className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 active:scale-95 transition-all text-slate-700 dark:text-slate-200 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-black">{language === 'bn' ? 'হোমে ফিরে যান' : 'Back Home'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span 
            className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: activeThemeConfig.primaryColor }}
          >
            {isCurrentlyRamadan ? (language === 'bn' ? 'রমাদান চলমান' : 'Ramadan Active') : (language === 'bn' ? 'রমাদান মুবারক' : 'Ramadan Mubarak')}
          </span>
        </div>
      </div>

      {/* Hero Ramadan Countdown & Status Banner (Continuously Animated) */}
      <motion.div 
        animate={{
          boxShadow: [
            '0 10px 25px -5px rgba(245, 158, 11, 0.25)',
            '0 20px 35px -5px rgba(245, 158, 11, 0.5)',
            '0 10px 25px -5px rgba(245, 158, 11, 0.25)'
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative overflow-hidden rounded-[2.5rem] p-1 bg-gradient-to-br from-amber-500/40 via-orange-500/30 to-amber-600/40 border-2 border-amber-400/50"
      >
        <div className="p-6 sm:p-8 rounded-[2.2rem] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md relative overflow-hidden">
          {/* Ambient decorative motif */}
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Moon size={140} className="text-amber-500" fill="currentColor" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <motion.div 
                  animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: activeThemeConfig.primaryColor }}
                >
                  <Moon size={20} fill="currentColor" />
                </motion.div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                    {language === 'bn' ? 'পবিত্র মাহে রমাদানুল মুবারক' : 'Holy Month of Ramadan'}
                  </span>
                  <p className="text-xs font-bold text-slate-400">
                    {prayerData?.hijri?.year ? (language === 'bn' ? `হিজরি ${prayerData.hijri.year}` : `Hijri ${prayerData.hijri.year}`) : (language === 'bn' ? 'পবিত্র রমাদান স্পেশাল' : 'Ramadan Special')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-black animate-pulse">
                <Sparkles size={12} />
                <span>{language === 'bn' ? 'ডেডিকেটেড সেকশন' : 'Dedicated'}</span>
              </div>
            </div>

            {isCurrentlyRamadan ? (
              /* Genuine Ramadan Running View */
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'bn' ? 'পবিত্র মাহে রমাদানুল মুবারক চলমান' : 'Holy Ramadan is Ongoing'}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {language === 'bn' ? `আজ রমাদানের ${currentRamadanDay}তম রোজা` : `Today is Ramadan Day ${currentRamadanDay}`}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-lg">
                  {language === 'bn' ? 'আল্লাহ তাআলা আপনার সকল সিয়াম, তারাবীহ, কুরআন তিলাওয়াত ও দোয়া কবুল করুন। আমিন।' : 'May Allah accept all your fasts, Taraweeh, Quran recitation and duas. Ameen.'}
                </p>
              </div>
            ) : (
              /* Countdown to upcoming Ramadan View */
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-black border border-amber-500/30">
                  <Calendar size={13} />
                  <span>{language === 'bn' ? 'রমাদান আগমনী কাউন্টডাউন' : 'Ramadan Arrival Countdown'}</span>
                </span>
                <div className="flex items-baseline gap-3">
                  <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {ramadanDays !== null ? ramadanDays : '32'}
                  </h1>
                  <span className="text-base sm:text-lg font-bold text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? 'দিন বাকি' : 'Days Left'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-lg">
                  {language === 'bn' 
                    ? '"হে আল্লাহ! আমাদের রজব ও শাবান মাসে বরকত দান করুন এবং আমাদের রমাদান পর্যন্ত পৌঁছে দিন।" (মুসনাদে আহমাদ)'
                    : '"O Allah, bless us in Rajab and Sha\'ban and let us reach Ramadan." (Musnad Ahmad)'}
                </p>
              </div>
            )}

            {/* Live Sehri/Iftar Countdown Card */}
            {fastingMilestone && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 block leading-tight">
                      {language === 'bn' ? 'আজকের রোজা ও ইফতার পর্যবেক্ষণ' : 'Fasting Status'}
                    </span>
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {language === 'bn' ? fastingMilestone.labelBn : fastingMilestone.labelEn}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-white text-[11px] font-black shrink-0 shadow-sm">
                  {fastingMilestone.time}
                </span>
              </div>
            )}

            {/* Quick Today's Prayer / Sehri-Iftar Times if available */}
            {prayerData && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">{language === 'bn' ? 'ফজর / সাহরি শেষ' : 'Fajr / Sehri'}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{prayerData.timings.Fajr}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">{language === 'bn' ? 'মাগরিব / ইফতার' : 'Maghrib / Iftar'}</span>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">{prayerData.timings.Maghrib}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">{language === 'bn' ? 'জোহর' : 'Dhuhr'}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{prayerData.timings.Dhuhr}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">{language === 'bn' ? 'ইশা ও তারাবীহ' : 'Isha & Taraweeh'}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{prayerData.timings.Isha}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: language === 'bn' ? 'সব বিষয়' : 'All Subjects' },
          { id: 'quran', label: language === 'bn' ? '📖 কুরআনের আয়াত' : '📖 Quran Verses' },
          { id: 'hadith', label: language === 'bn' ? '📜 সহীহ হাদিস' : '📜 Hadiths' },
          { id: 'duas', label: language === 'bn' ? '🤲 দু\'আ ও নিয়ত' : '🤲 Duas' },
          { id: 'rules', label: language === 'bn' ? '⚖️ জরুরি বিধান' : '⚖️ Fiqh Rules' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 transition-all active:scale-95 ${
              activeSection === tab.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: DYNAMIC QURANIC VERSES OR ACTIVE RAMADAN CALENDAR */}
      {(activeSection === 'all' || activeSection === 'quran') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-amber-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isCurrentlyRamadan 
                  ? (language === 'bn' ? 'মাহে রমাদানের ৩০ দিনের সেহরি ও ইফতার ক্যালেন্ডার' : 'Ramadan 30-Day Sehri & Iftar Calendar')
                  : (language === 'bn' ? 'পবিত্র কুরআনে মাহে রমাদান ও সিয়ামের আয়াতসমূহ' : 'Quranic Verses on Ramadan & Fasting')}
              </h3>
            </div>
            {isCurrentlyRamadan && (
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider animate-pulse">
                Live Calendar Active
              </span>
            )}
          </div>

          {isCurrentlyRamadan ? (
            /* Active Ramadan Sehri & Iftar 30-Day Table */
            <div className="bg-white dark:bg-slate-800 rounded-[2.2rem] overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-sm">
              <div className="p-4 bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center justify-between">
                <span>{language === 'bn' ? '📅 রমাদানের প্রতিদিনের সেহরি শেষ সময় ও ইফতারের সঠিক সময়' : '📅 Daily Sehri End Time & Accurate Iftar Time'}</span>
                <span className="text-[10px] uppercase font-black">{language === 'bn' ? 'সিয়াম ও সালাত' : 'Fasting & Prayer'}</span>
              </div>
              <div className="overflow-x-auto max-h-[420px] overflow-y-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 sticky top-0 border-b border-slate-100 dark:border-slate-700 z-10">
                    <tr>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'bn' ? 'রোজা' : 'Day'}</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'bn' ? 'সেহরি শেষ' : 'Sehri Ends'}</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'bn' ? 'ইফতার' : 'Iftar'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {ramadanCalendar.length > 0 ? ramadanCalendar.map((day, i) => {
                      const isToday = currentRamadanDay === i + 1;
                      return (
                        <tr key={i} className={`transition-colors ${isToday ? 'bg-amber-500/15 dark:bg-amber-950/40 font-black' : 'hover:bg-slate-50 dark:hover:bg-slate-900/30'}`}>
                          <td className="p-4 font-black text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                            <span>{i + 1}</span>
                            {isToday && <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px]">{language === 'bn' ? 'আজ' : 'Today'}</span>}
                          </td>
                          <td className="p-4 text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {day.date.gregorian.day} {day.date.gregorian.month.en}
                          </td>
                          <td className="p-4 text-xs font-bold text-slate-800 dark:text-slate-100">
                            {day.timings.Fajr.split(' ')[0]}
                          </td>
                          <td className="p-4 text-xs font-bold text-amber-700 dark:text-amber-300">
                            {day.timings.Maghrib.split(' ')[0]}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 text-xs font-bold">Loading Ramadan calendar schedule...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Default Quranic Verses when Ramadan is not running */
            <div className="space-y-4">
              {QURAN_VERSES.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {item.surah}
                    </span>
                    <button
                      onClick={() => handleCopy(`${item.arabic}\n\n${item.translation}`, `quran-${idx}`)}
                      className="p-2 text-slate-400 hover:text-amber-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      title={language === 'bn' ? 'কপি করুন' : 'Copy'}
                    >
                      {copiedKey === `quran-${idx}` ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <p className="font-arabic text-lg sm:text-xl font-bold text-right text-slate-800 dark:text-slate-100 leading-loose">
                    {item.arabic}
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                    {item.translation}
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{language === 'bn' ? 'তাফসীর নোট: ' : 'Tafsir Note: '}</span>
                    {item.tafsir}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: HADITHS */}
      {(activeSection === 'all' || activeSection === 'hadith') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Quote size={18} className="text-emerald-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {language === 'bn' ? 'সহীহ হাদিসের আলোকে মাহে রমাদান ও রোজার ফজিলত' : 'Virtues of Ramadan in Light of Sahih Hadiths'}
            </h3>
          </div>

          <div className="space-y-4">
            {HADITHS.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {item.source}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(`${item.arabic}\n\n${item.translation}`, `hadith-${idx}`)}
                    className="p-2 text-slate-400 hover:text-emerald-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copiedKey === `hadith-${idx}` ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>

                <p className="font-arabic text-base sm:text-lg font-bold text-right text-slate-800 dark:text-slate-100 leading-loose">
                  {item.arabic}
                </p>

                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                  {item.translation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: DUAS & INTENTION */}
      {(activeSection === 'all' || activeSection === 'duas') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles size={18} className="text-amber-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {language === 'bn' ? 'সাহরি, ইফতার ও শবে কদরের প্রয়োজনীয় দু\'আসমূহ' : 'Essential Duas for Sehri, Iftar & Laylatul Qadr'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {DUAS.map((item) => (
              <div 
                key={item.id}
                className="p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>{item.title}</span>
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => playDuaVoice(`${item.arabic}. ${item.transliteration}`, item.id)}
                      className={`p-2 rounded-xl transition-all ${
                        playingAudioId === item.id 
                          ? 'bg-amber-500 text-white animate-pulse' 
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                      title={language === 'bn' ? 'অডিও শুনুন' : 'Listen Audio'}
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      onClick={() => handleCopy(`${item.arabic}\n${item.transliteration}\n${item.meaning}`, item.id)}
                      className="p-2 text-slate-400 hover:text-amber-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      title={language === 'bn' ? 'কপি করুন' : 'Copy'}
                    >
                      {copiedKey === item.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <p className="font-arabic text-lg sm:text-xl font-bold text-right text-amber-700 dark:text-amber-400 leading-loose">
                  {item.arabic}
                </p>

                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-700/60 pt-3">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-slate-400">{language === 'bn' ? 'উচ্চারণ: ' : 'Transliteration: '}</span>
                    {item.transliteration}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-400">{language === 'bn' ? 'অর্থ: ' : 'Meaning: '}</span>
                    {item.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: RULES & FASTING GUIDE */}
      {(activeSection === 'all' || activeSection === 'rules') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck size={18} className="text-teal-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {language === 'bn' ? 'সিয়াম ও রমাদানের জরুরি শরঈ বিধান ও মাসআলা' : 'Essential Shariah Rulings & Fiqh of Fasting'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RULES.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-2"
              >
                <h4 className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};
