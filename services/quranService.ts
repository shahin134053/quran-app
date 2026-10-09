
import { SurahMetadata, SurahDetail, AppLanguage, PrayerTimings, HijriDate, Hadith } from '../types';

const QURAN_BASE_URL = 'https://api.alquran.cloud/v1';
const PRAYER_BASE_URL = 'https://api.aladhan.com/v1';

// Translation identifiers for the API
const TRANSLATION_MAP: Record<AppLanguage, string> = {
  en: 'en.pickthall',
  bn: 'bn.bengali',
  hi: 'hi.hindi',
  ar: 'ar.jalalayn'
};

// Tafsir/Explanatory identifiers for the API
const TAFSIR_MAP: Record<AppLanguage, string> = {
  en: 'en.ibnkathir',
  bn: 'bn.fmazid', // Fazlul Karim - often detailed
  hi: 'hi.hindi',
  ar: 'ar.jalalayn'
};

const CACHE_PREFIX = 'quran_surah_';

export const isSurahCached = (surahNumber: number, lang: AppLanguage): boolean => {
  try {
    return !!localStorage.getItem(`${CACHE_PREFIX}${surahNumber}_${lang}`);
  } catch {
    return false;
  }
};

export const saveSurahToCache = (surahNumber: number, lang: AppLanguage, data: SurahDetail) => {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${surahNumber}_${lang}`, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Storage quota exceeded', e);
    return false;
  }
};

export const removeSurahFromCache = (surahNumber: number, lang: AppLanguage) => {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${surahNumber}_${lang}`);
  } catch (e) {
    console.error('Error removing surah', e);
  }
};

export const fetchSurahList = async (): Promise<SurahMetadata[]> => {
  try {
    const cached = localStorage.getItem('quran_surah_list');
    if (cached) return JSON.parse(cached);

    const response = await fetch(`${QURAN_BASE_URL}/surah`);
    const data = await response.json();
    
    localStorage.setItem('quran_surah_list', JSON.stringify(data.data));
    return data.data;
  } catch (error) {
    console.error("Failed to fetch surah list", error);
    const cached = localStorage.getItem('quran_surah_list');
    return cached ? JSON.parse(cached) : [];
  }
};

export const fetchSurahDetail = async (
  surahNumber: number,
  lang: AppLanguage
): Promise<SurahDetail> => {
  try {
    // Check cache first
    const cached = localStorage.getItem(`${CACHE_PREFIX}${surahNumber}_${lang}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const [arabicRes, transRes, audioRes, tafsirRes] = await Promise.all([
      fetch(`${QURAN_BASE_URL}/surah/${surahNumber}/quran-uthmani`),
      fetch(`${QURAN_BASE_URL}/surah/${surahNumber}/${TRANSLATION_MAP[lang]}`),
      fetch(`${QURAN_BASE_URL}/surah/${surahNumber}/ar.alafasy`),
      fetch(`${QURAN_BASE_URL}/surah/${surahNumber}/${TAFSIR_MAP[lang]}`)
    ]);

    const arabicData = await arabicRes.json();
    const transData = await transRes.json();
    const audioData = await audioRes.json();
    const tafsirData = await tafsirRes.json();

    if (!arabicData.data || !transData.data) {
      throw new Error("Invalid response from Quran API");
    }

    const ayahs = arabicData.data.ayahs.map((ayah: any, index: number) => ({
      ...ayah,
      translation: transData.data.ayahs[index]?.text || "",
      audio: audioData.data?.ayahs[index]?.audio || "",
      // Use Tafsir data if available and successful (code 200), otherwise fallback to translation
      tafsir: (tafsirData.code === 200 && tafsirData.data?.ayahs[index]?.text) 
        ? tafsirData.data.ayahs[index].text 
        : (transData.data.ayahs[index]?.text || "")
    }));

    const result = {
      ...arabicData.data,
      ayahs
    };

    return result;
  } catch (error) {
    console.error("Error fetching surah detail:", error);
    // Try cache as fallback if not checked above (though we checked above)
    const cached = localStorage.getItem(`${CACHE_PREFIX}${surahNumber}_${lang}`);
    if (cached) return JSON.parse(cached);
    throw error;
  }
};

export const fetchPrayerTimings = async (lat: number, lng: number): Promise<{ timings: PrayerTimings, hijri: HijriDate }> => {
  const response = await fetch(`${PRAYER_BASE_URL}/timings?latitude=${lat}&longitude=${lng}&method=2`);
  const data = await response.json();
  return {
    timings: data.data.timings,
    hijri: data.data.date.hijri
  };
};

export const fetchRamadanCalendar = async (lat: number, lng: number, year: number): Promise<any[]> => {
  try {
    // Fetch specifically for Ramadan (Month 9) of the given Hijri year
    const response = await fetch(`${PRAYER_BASE_URL}/hijriCalendar?latitude=${lat}&longitude=${lng}&method=2&month=9&year=${year}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch Ramadan calendar", error);
    return [];
  }
};

export const getRamadanHistory = () => {
  return [
    { year: 2025, date: 'February 28', hijri: 1446 },
    { year: 2024, date: 'March 11', hijri: 1445 },
    { year: 2023, date: 'March 23', hijri: 1444 },
    { year: 2022, date: 'April 2', hijri: 1443 },
    { year: 2021, date: 'April 13', hijri: 1442 },
    { year: 2020, date: 'April 24', hijri: 1441 },
    { year: 2019, date: 'May 6', hijri: 1440 },
    { year: 2018, date: 'May 16', hijri: 1439 },
    { year: 2017, date: 'May 27', hijri: 1438 },
    { year: 2016, date: 'June 6', hijri: 1437 },
  ];
};

export const getRamadanCountdown = (hijri: HijriDate): number => {
  const currentMonth = hijri.month.number;
  const currentDay = parseInt(hijri.day);
  if (currentMonth === 9) return 0;
  let monthsLeft = 0;
  if (currentMonth < 9) {
    monthsLeft = 9 - currentMonth;
  } else {
    monthsLeft = (12 - currentMonth) + 9;
  }
  return (monthsLeft * 30) - currentDay;
};

export const fetchRandomHadith = async (): Promise<Hadith> => {
  const hadiths: Hadith[] = [
    {
      id: 1,
      hadithArabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
      hadithEnglish: "Actions are judged by intentions.",
      hadithBengali: "সমস্ত কাজ নিয়তের ওপর নির্ভরশীল।",
      bookName: "Sahih Bukhari",
      chapterName: "Revelation",
      writerName: "Imam Bukhari"
    },
    {
      id: 2,
      hadithArabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      hadithEnglish: "The best among you are those who learn the Quran and teach it.",
      hadithBengali: "তোমাদের মধ্যে সর্বোত্তম সেই যে কুরআন শিখে এবং অন্যকে শেখায়।",
      bookName: "Sahih Bukhari",
      chapterName: "Virtues of Quran",
      writerName: "Imam Bukhari"
    },
    {
      id: 3,
      hadithArabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      hadithEnglish: "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.",
      hadithBengali: "তোমাদের কেউ ততক্ষণ পর্যন্ত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তাই পছন্দ করে যা সে নিজের জন্য পছন্দ করে।",
      bookName: "Sahih Bukhari",
      chapterName: "Belief",
      writerName: "Imam Bukhari"
    },
    {
      id: 4,
      hadithArabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
      hadithEnglish: "A good word is a charity.",
      hadithBengali: "ভালো কথা বলাও একটি সদকা।",
      bookName: "Sahih Bukhari",
      chapterName: "Good Manners",
      writerName: "Imam Bukhari"
    },
    {
      id: 5,
      hadithArabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
      hadithEnglish: "Whoever believes in Allah and the Last Day should talk what is good or keep quiet.",
      hadithBengali: "যে আল্লাহ ও শেষ দিবসের প্রতি বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
      bookName: "Sahih Bukhari",
      chapterName: "Good Manners",
      writerName: "Imam Bukhari"
    }
  ];
  return hadiths[Math.floor(Math.random() * hadiths.length)];
};
