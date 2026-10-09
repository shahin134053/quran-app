
export interface Dua {
  id: number;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation_en: string;
  translation_bn: string;
  reference: string;
}

export const DUA_CATEGORIES = [
  "Morning & Evening",
  "Prayer",
  "Eating & Drinking",
  "Travel",
  "Nature",
  "Sickness & Death",
  "Joy & Distress"
];

export const DUAS: Dua[] = [
  {
    id: 1,
    category: "Morning & Evening",
    title: "Morning Supplication",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration: "Asbahna wa-asbahal-mulku lillahi walhamdu lillahi...",
    translation_en: "We have entered a new day and with it all dominion is Allah's...",
    translation_bn: "আমরা সকালে উপনীত হয়েছি এবং রাজত্বও আল্লাহর সকালে উপনীত হয়েছে...",
    reference: "Muslim 4/2088"
  },
  {
    id: 2,
    category: "Eating & Drinking",
    title: "Before Eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillahi",
    translation_en: "In the name of Allah",
    translation_bn: "আল্লাহর নামে শুরু করছি",
    reference: "Abu Dawud 3/347"
  },
  {
    id: 3,
    category: "Eating & Drinking",
    title: "After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Alhamdu lillahil-ladhi at'amani hadha...",
    translation_en: "Praise is to Allah who has fed me this and provided it for me...",
    translation_bn: "সকল প্রশংসা আল্লাহর জন্য যিনি আমাকে এই আহার করালেন...",
    reference: "Abu Dawud, Tirmidhi"
  },
  {
    id: 4,
    category: "Travel",
    title: "When Mounting a Vehicle",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-ladhi sakhkhara lana hadha...",
    translation_en: "Glory is to Him Who has subjected this to us...",
    translation_bn: "পবিত্র সেই সত্তা যিনি এদেরকে আমাদের বশীভূত করে দিয়েছেন...",
    reference: "Az-Zukhruf 13-14"
  },
  {
    id: 5,
    category: "Prayer",
    title: "After Prayer (Istighfar)",
    arabic: "أَسْتَغْفِرُ اللهَ (ثَلَاثاً) اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Astaghfirullah (3 times). Allahumma Antas-Salam...",
    translation_en: "I ask Allah for forgiveness. O Allah, You are Peace and from You comes peace...",
    translation_bn: "আমি আল্লাহর নিকট ক্ষমা প্রার্থনা করছি (৩ বার)। হে আল্লাহ! আপনিই শান্তি...",
    reference: "Muslim 1/414"
  },
  {
    id: 6,
    category: "Joy & Distress",
    title: "In Times of Distress",
    arabic: "لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّা اللهُ رَبُّ الْعَرْশِ الْعَظِيمِ",
    transliteration: "La ilaha illallahul-Azimul-Halim...",
    translation_en: "There is no god but Allah, the Magnificent, the Forbearing...",
    translation_bn: "আল্লাহ ছাড়া কোনো উপাস্য নেই, যিনি মহান ও সহনশীল...",
    reference: "Bukhari 7/154"
  },
  {
    id: 7,
    category: "Nature",
    title: "When it Rains",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    transliteration: "Allahumma sayyiban nafi'an",
    translation_en: "O Allah, may it be a beneficial rain.",
    translation_bn: "হে আল্লাহ! আপনি আমাদের জন্য উপকারী বৃষ্টি দান করুন।",
    reference: "Bukhari 2/518"
  },
  {
    id: 8,
    category: "Sickness & Death",
    title: "Visiting the Sick",
    arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللهُ",
    transliteration: "La ba'sa tahurun in sha' Allah",
    translation_en: "No need to worry, it is a purification, if Allah wills.",
    translation_bn: "ভয় নেই, আল্লাহর ইচ্ছায় এটি গুনাহ থেকে পবিত্রকারী হবে।",
    reference: "Bukhari 10/118"
  }
];
