
import { SurahMetadata, SurahDetail, AppLanguage, PrayerTimings, HijriDate, Hadith } from '../types';

const QURAN_BASE_URL = 'https://api.alquran.cloud/v1';
const PRAYER_BASE_URL = 'https://api.aladhan.com/v1';

// Translation identifiers for the API
const TRANSLATION_MAP: Record<AppLanguage, string> = {
  en: 'en.pickthall',
  bn: 'bn.bengali',
  hi: 'hi.hindi',
  ar: 'ar.jalalayn',
  de: 'de.aburida',
  es: 'es.cortes'
};

// Tafsir/Explanatory identifiers for the API
const TAFSIR_MAP: Record<AppLanguage, string> = {
  en: 'en.ibnkathir',
  bn: 'bn.fmazid', // Fazlul Karim - often detailed
  hi: 'hi.hindi',
  ar: 'ar.jalalayn',
  de: 'de.aburida',
  es: 'es.cortes'
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

const RAW_FALLBACK_NAMES = [
  "Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
  "Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Taha",
  "Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-'Ankabut","Ar-Rum",
  "Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Yasin","As-Saffat","Sad","Az-Zumar","Ghafir",
  "Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
  "Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
  "As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij",
  "Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","'Abasa",
  "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad",
  "Ash-Shams","Al-Layl","Ad-Duhaa","Ash-Sharh","At-Tin","Al-'Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-'Adiyat",
  "Al-Qari'ah","At-Takathur","Al-'Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
  "Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];

const RAW_AYAH_COUNTS = [
  7,286,200,176,120,165,206,75,129,109,
  123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60,
  34,30,73,54,45,83,182,88,75,85,
  54,53,89,59,37,35,38,29,18,45,
  60,49,62,55,78,96,29,22,24,13,
  14,11,11,18,12,12,30,52,52,44,
  28,28,20,56,40,31,50,40,46,42,
  29,19,36,25,22,17,19,26,30,20,
  15,21,11,8,8,19,5,8,8,11,
  11,8,3,9,5,4,7,3,6,3,
  5,4,5,6
];

export const FALLBACK_SURAH_LIST: SurahMetadata[] = RAW_FALLBACK_NAMES.map((name, i) => ({
  number: i + 1,
  name: name,
  englishName: name,
  englishNameTranslation: name,
  numberOfAyahs: RAW_AYAH_COUNTS[i] || 10,
  revelationType: [9, 13, 22, 24, 33, 47, 48, 49, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 98, 110].includes(i + 1) ? 'Medinan' : 'Meccan'
}));

export const fetchSurahList = async (): Promise<SurahMetadata[]> => {
  try {
    const cached = localStorage.getItem('quran_surah_list');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length === 114) {
        return parsed;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${QURAN_BASE_URL}/surah`, { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (data && data.data && Array.isArray(data.data)) {
      try {
        localStorage.setItem('quran_surah_list', JSON.stringify(data.data));
      } catch {}
      return data.data;
    }
  } catch (error) {
    console.warn("Using offline fallback surah list", error);
  }
  return FALLBACK_SURAH_LIST;
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

    const paddedSurah = String(surahNumber).padStart(3, '0');

    const ayahs = arabicData.data.ayahs.map((ayah: any, index: number) => {
      const ayahNum = ayah.numberInSurah || (index + 1);
      const paddedAyah = String(ayahNum).padStart(3, '0');
      const fallbackAudio = `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedAyah}.mp3`;
      let rawAudio = audioData.data?.ayahs[index]?.audio || fallbackAudio;
      if (rawAudio.startsWith('http://')) {
        rawAudio = rawAudio.replace('http://', 'https://');
      }

      return {
        ...ayah,
        translation: transData.data.ayahs[index]?.text || "",
        audio: rawAudio || fallbackAudio,
        // Use Tafsir data if available and successful (code 200), otherwise fallback to translation
        tafsir: (tafsirData.code === 200 && tafsirData.data?.ayahs[index]?.text) 
          ? tafsirData.data.ayahs[index].text 
          : (transData.data.ayahs[index]?.text || "")
      };
    });

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

/**
 * Determines the authoritative Islamic calculation method for given GPS coordinates:
 * - Method 1 (Karachi): Bangladesh, India, Pakistan (Standard Hanafi / Bangladesh Islamic Foundation)
 * - Method 4 (Umm al-Qura): Saudi Arabia & Gulf
 * - Method 5 (Egyptian General Authority): Egypt & North Africa
 * - Method 2 (ISNA): United States & Canada
 * - Method 3 (Muslim World League): Europe, UK & Global
 */
export function getPrayerMethodForCoordinates(lat: number, lng: number): number {
  // South Asia (Bangladesh, India, Pakistan)
  if (lat >= 8 && lat <= 38 && lng >= 60 && lng <= 98) {
    return 1;
  }
  // Gulf / Saudi Arabia (Makkah & Madinah)
  if (lat >= 12 && lat <= 33 && lng >= 34 && lng <= 60) {
    return 4;
  }
  // Egypt & North Africa
  if (lat >= -5 && lat <= 38 && lng >= -18 && lng <= 34) {
    return 5;
  }
  // North America (USA & Canada)
  if (lng <= -50 && lat >= 15) {
    return 2;
  }
  // Europe / rest of world
  return 3;
}

export const fetchPrayerTimings = async (lat: number, lng: number): Promise<{ timings: PrayerTimings, hijri: HijriDate }> => {
  const todayKey = `prayer_cache_v5_${new Date().toISOString().split('T')[0]}_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  try {
    const cached = localStorage.getItem(todayKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // ignore localstorage error
  }

  const method = getPrayerMethodForCoordinates(lat, lng);
  const timestamp = Math.floor(Date.now() / 1000);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch(`${PRAYER_BASE_URL}/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${method}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Prayer API responded with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.data || !data.data.timings) {
      throw new Error('Invalid prayer timings data');
    }
    const result = {
      timings: data.data.timings,
      hijri: data.data.date.hijri
    };

    try {
      localStorage.setItem(todayKey, JSON.stringify(result));
    } catch (e) {}

    return result;
  } catch (error) {
    console.warn("Prayer timings fetch error or rate limit, using offline fallback:", error);
    return {
      timings: {
        Fajr: "04:32",
        Sunrise: "05:48",
        Dhuhr: "12:05",
        Asr: "16:20",
        Sunset: "18:22",
        Maghrib: "18:22",
        Isha: "19:38",
        Imsak: "04:22",
        Midnight: "00:05"
      },
      hijri: {
        date: "11/10/1447",
        day: "11",
        month: { number: 9, en: "Ramadān", ar: "رَمضَان" },
        year: "1447"
      }
    };
  }
};

export const fetchRamadanCalendar = async (lat: number, lng: number, year: number): Promise<any[]> => {
  const method = getPrayerMethodForCoordinates(lat, lng);
  const calKey = `ramadan_cal_v5_${year}_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  try {
    const cached = localStorage.getItem(calKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    // Fetch specifically for Ramadan (Month 9) of the given Hijri year
    const response = await fetch(`${PRAYER_BASE_URL}/hijriCalendar?latitude=${lat}&longitude=${lng}&method=${method}&month=9&year=${year}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    if (Array.isArray(data.data)) {
      try {
        localStorage.setItem(calKey, JSON.stringify(data.data));
      } catch (e) {}
      return data.data;
    }
    return [];
  } catch (error) {
    console.warn("Failed to fetch Ramadan calendar or rate limited", error);
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
