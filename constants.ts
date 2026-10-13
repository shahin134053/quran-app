
export { UI_TRANSLATIONS, SURAH_LOCALE_NAMES, getLocalizedSurah } from './translations';
export type { TranslationDictionary } from './translations';

export const PRAYER_RAKATS = {
  Fajr: [
    { type: 'Sunnah', count: 2 },
    { type: 'Fard', count: 2 }
  ],
  Dhuhr: [
    { type: 'Sunnah', count: 4 },
    { type: 'Fard', count: 4 },
    { type: 'Sunnah', count: 2 },
    { type: 'Nafl', count: 2 }
  ],
  Asr: [
    { type: 'Sunnah', count: 4, note: 'Ghair Muakkadah' },
    { type: 'Fard', count: 4 }
  ],
  Maghrib: [
    { type: 'Fard', count: 3 },
    { type: 'Sunnah', count: 2 },
    { type: 'Nafl', count: 2 }
  ],
  Isha: [
    { type: 'Sunnah', count: 4, note: 'Ghair Muakkadah' },
    { type: 'Fard', count: 4 },
    { type: 'Sunnah', count: 2 },
    { type: 'Nafl', count: 2 },
    { type: 'Witr', count: 3 },
    { type: 'Nafl', count: 2 }
  ]
};

export interface PrayerDuaDetail {
  arabic: string;
  transliteration: string;
  translation: string;
  translations: {
    bn: string;
    en: string;
    hi: string;
  };
  titleBn: string;
  titleEn: string;
  reference: string;
}

export const PRAYER_DUAS: Record<string, PrayerDuaDetail> = {
  Fajr: {
    titleBn: "ফজরের নামাজের পর বরকতময় দু'আ",
    titleEn: "Fajr Prayer Recommended Dua",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
    transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
    translation: "হে আল্লাহ! আমি আপনার কাছে উপকারী জ্ঞান, পবিত্র রিযিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।",
    translations: {
      bn: "হে আল্লাহ! আমি আপনার কাছে উপকারী জ্ঞান, পবিত্র রিযিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।",
      en: "O Allah, I ask You for beneficial knowledge, good provision, and acceptable deeds.",
      hi: "ऐ अल्लाह! मैं तुझसे लाभदायक ज्ञान, हलाल रोज़ी और कुबूल होने वाले अमल की दरख्वास्त करता हूँ।"
    },
    reference: "সুনানে ইবনে মাজাহ: ৯২৫, মুসনাদে আহমাদ: ২৬৫২১"
  },
  Dhuhr: {
    titleBn: "যোহরের নামাজের পর ক্ষমা প্রার্থনার দু'আ",
    titleEn: "Dhuhr Prayer Recommended Dua",
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ",
    transliteration: "Allahumma-ghfir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu wa 'alaniyatahu wa sirrahu",
    translation: "হে আল্লাহ! আমার সমস্ত গুনাহ ক্ষমা করুন—ছোট ও বড়, প্রথম ও শেষ, প্রকাশ্য ও গোপন।",
    translations: {
      bn: "হে আল্লাহ! আমার সমস্ত গুনাহ ক্ষমা করুন—ছোট ও বড়, প্রথম ও শেষ, প্রকাশ্য ও গোপন।",
      en: "O Allah! Forgive all my sins, the small and great, the first and the last, the open and the secret.",
      hi: "ऐ अल्लाह! मेरे तमाम गुनाह माफ़ फरमा, छोटे और बड़े, पहले और पिछले, ज़ाहिर और पोशीदा।"
    },
    reference: "সহীহ মুসলিম: ৪৮৩"
  },
  Asr: {
    titleBn: "আসর পরবর্তী ক্ষমা ও তওবার দু'আ",
    titleEn: "Asr Prayer Recommended Dua",
    arabic: "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullah-alladhi la ilaha illa Huwal-Hayyul-Qayyum, wa atubu ilaih",
    translation: "আমি ক্ষমা প্রার্থনা করছি আল্লাহর কাছে, যিনি ছাড়া কোনো সত্য ইলাহ নেই, যিনি চিরঞ্জীব ও সবকিছুর ধারক; এবং আমি তাঁরই কাছে তওবা করছি।",
    translations: {
      bn: "আমি ক্ষমা প্রার্থনা করছি আল্লাহর কাছে, যিনি ছাড়া কোনো সত্য ইলাহ নেই, যিনি চিরঞ্জীব ও সবকিছুর ধারক; এবং আমি তাঁরই কাছে তওবা করছি।",
      en: "I seek the forgiveness of Allah, whom there is no deity except Him, The Living, The Sustainer, and I repent to Him.",
      hi: "मैं अल्लाह से बख्शिश मांगता हूँ जिसके सिवा कोई माबूद नहीं, जो ज़िंदा और सबको संभालने वाला है, और उसी की तरफ तौबा करता हूँ।"
    },
    reference: "সুনানে আবু দাউদ: ১৫১৭, জামে তিরমিযী: ৩৫৭৭"
  },
  Maghrib: {
    titleBn: "মাগরিব পরবর্তী হিফাজত ও মাগফিরাতের দু'আ",
    titleEn: "Maghrib Prayer Recommended Dua",
    arabic: "اللَّهُمَّ إِنَّ هَذَا إِقْبَالُ لَيْلِكَ، وَإِدْبَارُ نَهَارِكَ، وَأَصْوَاتُ دُعَاتِكَ، فَاغْفِرْ لِي",
    transliteration: "Allahumma inna hadha iqbalu laylika, wa idbaru naharika, wa aswatu du'atika, faghfir li",
    translation: "হে আল্লাহ! এটি আপনার রাতের আগমন, আপনার দিনের প্রস্থান এবং আপনার আহ্বানকারীদের কণ্ঠস্বর; অতএব আমাকে ক্ষমা করুন।",
    translations: {
      bn: "হে আল্লাহ! এটি আপনার রাতের আগমন, আপনার দিনের প্রস্থান এবং আপনার আহ্বানকারীদের কণ্ঠস্বর; অতএব আমাকে ক্ষমা করুন।",
      en: "O Allah, this is the approach of Your night, the departure of Your day, and the voices of Your callers, so forgive me.",
      hi: "ऐ अल्लाह! यह तेरी रात की आमद है और तेरे दिन की रुखसत और तेरे पुकारने वालों की आवाजें हैं, पस मुझे बख्श दे।"
    },
    reference: "সুনানে আবু দাউদ: ৫৩০, জামে তিরমিযী: ৩৫৮০"
  },
  Isha: {
    titleBn: "ইশার পর রাত্রিবেলার নিরাপত্তা ও মাগফিরাতের দু'আ",
    titleEn: "Isha Prayer Recommended Dua",
    arabic: "بِسْمِ اللَّهِ وَضَعْتُ جَنْبِي، اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، وَاخْسَأْ شَيْطَانِي، وَفُكَّ رِهَانِي، وَاجْعَلْنِي فِي النَّدِيِّ الْأَعْلَى",
    transliteration: "Bismillahi wada'tu janbi, Allahumma-ghfir li dhanbi, wa akhsa' shaytani, wa fukka rihani, waj'alni fin-nadiyyil-a'la",
    translation: "আল্লাহর নামে আমি আমার পার্শ্বদেশ শয়ন করালাম। হে আল্লাহ! আমার পাপ ক্ষমা করুন, আমার শয়তানকে বিতাড়িত করুন, আমার বন্ধন মুক্ত করুন এবং আমাকে উচ্চ মর্যাদাসম্পন্ন সমাবেশে স্থান দিন।",
    translations: {
      bn: "আল্লাহর নামে আমি আমার পার্শ্বদেশ শয়ন করালাম। হে আল্লাহ! আমার পাপ ক্ষমা করুন, আমার শয়তানকে বিতাড়িত করুন, আমার বন্ধন মুক্ত করুন এবং আমাকে উচ্চ মর্যাদাসম্পন্ন সমাবেশে স্থান দিন।",
      en: "In the name of Allah I lay down my side. O Allah, forgive my sin, repel my devil, free my burden, and place me in the highest assembly.",
      hi: "अल्लाह के नाम के साथ मैंने अपना पहलू रखा। ऐ अल्लाह! मेरे गुनाह बख्श दे, मेरे शैतान को दूर कर और मुझे आला मकाम अता फरमा।"
    },
    reference: "সুনানে আবু দাউদ: ৫০৫৪"
  }
};

export const SURAH_LIST_STATIC = [
  { number: 1, name: "سُورَةُ الفَاتِحَةِ", englishName: "Al-Faatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "سُورَةُ البَقَرَةِ", englishName: "Al-Baqara", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
];

export const APP_LANGUAGES = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { id: 'ar', name: 'Arabic', nativeName: 'عربي' },
  { id: 'de', name: 'German', nativeName: 'Deutsch' },
  { id: 'es', name: 'Spanish', nativeName: 'Español' }
];

export interface DailyAyahItem {
  id: number;
  surahNumber: number;
  ayahNumber: number;
  surahNameBn: string;
  surahNameEn: string;
  arabic: string;
  bangla: string;
  english: string;
  theme: string;
}

export const DAILY_AYAH_LIST: DailyAyahItem[] = [
  {
    id: 1,
    surahNumber: 94,
    ayahNumber: 5,
    surahNameBn: 'সূরা আল-ইনশিরাহ',
    surahNameEn: 'Ash-Sharh',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    bangla: 'নিশ্চয় কষ্টের সাথেই স্বস্তি রয়েছে।',
    english: 'For indeed, with hardship [will be] ease.',
    theme: 'ধৈর্য ও আশা'
  },
  {
    id: 2,
    surahNumber: 13,
    ayahNumber: 28,
    surahNameBn: 'সূরা আর-রাদ',
    surahNameEn: 'Ar-Ra\'d',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    bangla: 'জেনে রেখো, আল্লাহর স্মরণেই কেবল হৃদয় প্রশান্ত হয়।',
    english: 'Unquestionably, by the remembrance of Allah hearts are assured.',
    theme: 'আত্মিক প্রশান্তি'
  },
  {
    id: 3,
    surahNumber: 2,
    ayahNumber: 152,
    surahNameBn: 'সূরা আল-বাক্বারাহ',
    surahNameEn: 'Al-Baqarah',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    bangla: 'অতএব তোমরা আমাকে স্মরণ কর, আমিও তোমাদের স্মরণ করব। আর আমার কৃতজ্ঞতা স্বীকার কর এবং অকৃতজ্ঞ হয়ো না।',
    english: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    theme: 'জিকির ও কৃতজ্ঞতা'
  },
  {
    id: 4,
    surahNumber: 65,
    ayahNumber: 3,
    surahNameBn: 'সূরা আত-তালাক',
    surahNameEn: 'At-Talaq',
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    bangla: 'আর যে আল্লাহর ওপর ভরসা করে, তিনিই তার জন্য যথেষ্ট।',
    english: 'And whoever relies upon Allah - then He is sufficient for him.',
    theme: 'তাওয়াক্কুল (ভরসা)'
  },
  {
    id: 5,
    surahNumber: 2,
    ayahNumber: 186,
    surahNameBn: 'সূরা আল-বাক্বারাহ',
    surahNameEn: 'Al-Baqarah',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    bangla: 'আর যখন আমার বান্দারা আপনাকে আমার সম্পর্কে জিজ্ঞেস করে, আমি তো কাছেই আছি। প্রার্থনাকারী যখন আমাকে ডাকে, আমি তার ডাকে সাড়া দেই।',
    english: 'And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.',
    theme: 'দু\'আ ও নৈকট্য'
  },
  {
    id: 6,
    surahNumber: 3,
    ayahNumber: 139,
    surahNameBn: 'সূরা আলে-ইমরান',
    surahNameEn: 'Ali \'Imran',
    arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
    bangla: 'তোমরা হীনবল হয়ো না এবং দুঃখিত হয়ো না; তোমরাই বিজয়ী হবে যদি তোমরা প্রকৃত মুমিন হও।',
    english: 'So do not weaken and do not grieve, and you will be superior if you are [true] believers.',
    theme: 'সাহস ও দৃঢ়তা'
  },
  {
    id: 7,
    surahNumber: 39,
    ayahNumber: 53,
    surahNameBn: 'সূরা আয-যুমার',
    surahNameEn: 'Az-Zumar',
    arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    bangla: 'বলুন, হে আমার বান্দাগণ! যারা নিজেদের ওপর বাড়াবাড়ি করেছ, তোমরা আল্লাহর রহমত থেকে নিরাশ হয়ো না। নিশ্চয়ই আল্লাহ সমস্ত পাপ ক্ষমা করে দেন।',
    english: 'Say, "O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins."',
    theme: 'তওবা ও মাগফিরাত'
  },
  {
    id: 8,
    surahNumber: 55,
    ayahNumber: 13,
    surahNameBn: 'সূরা আর-রহমান',
    surahNameEn: 'Ar-Rahman',
    arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    bangla: 'অতএব তোমরা উভয়ে তোমাদের রবের কোন কোন নিয়ামতকে অস্বীকার করবে?',
    english: 'So which of the favors of your Lord would you deny?',
    theme: 'আল্লাহর অসীম নিয়ামত'
  }
];

export const BENGALI_SURAH_NAMES: Record<number, string[]> = {
  1: ['ফাতিহা', 'ফাতিহাহ', 'ফাতিহা'],
  2: ['বাকারা', 'বাক্বারাহ', 'বাকারা'],
  3: ['আলে ইমরান', 'ইমরান'],
  4: ['নিসা', 'আন নিসা'],
  5: ['মায়েদা', 'আল মায়িদাহ'],
  6: ['আনআম'],
  7: ['আরাফ', 'আল আরাফ'],
  8: ['আনফাল'],
  9: ['তাওবা', 'তাওবাহ'],
  10: ['ইউনুস'],
  11: ['হুদ'],
  12: ['ইউসুফ'],
  13: ['রাদ', 'আর রাদ'],
  14: ['ইব্রাহিম'],
  15: ['হিজর'],
  16: ['নাহল'],
  17: ['ইসরা', 'বনি ইসরাইল'],
  18: ['কাহফ', 'আল কাহাফ'],
  19: ['মারইয়াম', 'মরিয়ম'],
  20: ['ত্বাহা', 'ত্বহা'],
  21: ['আম্বিয়া'],
  22: ['হজ', 'হজ্জ'],
  23: ['মুমিনুন'],
  24: ['নূর', 'নুর'],
  25: ['ফুরকান'],
  26: ['শুআরা'],
  27: ['নামল'],
  28: ['কাসাস'],
  29: ['আনকাবুত'],
  30: ['রুম'],
  31: ['লুকমান'],
  32: ['সাজদাহ'],
  33: ['আহযাব'],
  34: ['সাবা'],
  35: ['ফাতির'],
  36: ['ইয়াসীন', 'ইয়াসিন', 'ইয়াসিন'],
  37: ['সাফফাত'],
  38: ['সোয়াদ', 'সাদ'],
  39: ['যুমার'],
  40: ['মু\'মিন', 'গাফির'],
  41: ['ফুসসিলাত'],
  42: ['শুরা'],
  43: ['যুখরুফ'],
  44: ['দুখান'],
  45: ['জাসিয়া'],
  46: ['আহকাফ'],
  47: ['মুহাম্মদ'],
  48: ['ফাতহ'],
  49: ['হুজুরাত'],
  50: ['ক্বাফ', 'কাফ'],
  51: ['যারিয়াত'],
  52: ['তুর'],
  53: ['নাজম'],
  54: ['ক্বামার', 'কামার'],
  55: ['রহমান', 'আর রহমান'],
  56: ['ওয়াকিয়াহ', 'ওয়াকিয়া'],
  57: ['হাদীদ', 'হাদিদ'],
  58: ['মুজাদালাহ'],
  59: ['হাশর'],
  60: ['মুমতাহিনাহ'],
  61: ['সফ', 'সাফ'],
  62: ['জুমুআহ', 'জুমুআ'],
  63: ['মুনাফিকুন'],
  64: ['তাগাবুন'],
  65: ['তালাক'],
  66: ['তাহরীম', 'তাহরিম'],
  67: ['মুলক', 'আল মুলক'],
  68: ['কলম', 'ক্বলম'],
  69: ['হাক্কাহ'],
  70: ['মাআরিজ'],
  71: ['নূহ', 'নুহ'],
  72: ['জ্বিন', 'জিন'],
  73: ['মুযযাম্মিল'],
  74: ['মুদ্দাসসির'],
  75: ['কিয়ামাহ'],
  76: ['ইনসান', 'দাহর'],
  77: ['মুরসালাত'],
  78: ['নাবা'],
  79: ['নাযিয়াত'],
  80: ['আবাসা'],
  81: ['তাকভীর'],
  82: ['ইনফিতার'],
  83: ['মুতাফফিফীন'],
  84: ['ইনশিকাক'],
  85: ['বুরুজ'],
  86: ['তারিক'],
  87: ['আ\'লা'],
  88: ['গাশিয়াহ', 'গাশিয়া'],
  89: ['ফজর'],
  90: ['বালাদ'],
  91: ['শামস'],
  92: ['লাইল'],
  93: ['দুহা', 'দ্বোহা'],
  94: ['ইনশিরাহ', 'শারহ'],
  95: ['তীন'],
  96: ['আলাক'],
  97: ['ক্বদর', 'কদর'],
  98: ['বাইয়িনাহ'],
  99: ['যিলযাল'],
  100: ['আদিয়াত'],
  101: ['ক্বারিয়াহ'],
  102: ['তাকাসুর'],
  103: ['আসর'],
  104: ['হুমাযাহ'],
  105: ['ফিল'],
  106: ['কুরাইশ'],
  107: ['মাউন'],
  108: ['কাউসার'],
  109: ['কাফিরুন'],
  110: ['নাসর'],
  111: ['লাহাব'],
  112: ['ইখলাস', 'আল ইখলাস'],
  113: ['ফালাক', 'আল ফালাক'],
  114: ['নাস', 'আন নাস']
};
