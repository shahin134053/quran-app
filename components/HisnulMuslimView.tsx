import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Volume2, VolumeX, Copy, Check, Share2, 
  Sparkles, Bookmark, BookOpen, Heart, RefreshCw, 
  CheckCircle2, Compass, Shield, Sun, Moon, AlertCircle,
  Headphones, Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playAudioText, stopAllAudio } from '../utils/audioHelper';

export interface DuaItem {
  id: string;
  category: string;
  titleBn: string;
  titleEn?: string;
  arabic: string;
  pronunciationBn: string;
  pronunciationEn?: string;
  meaningBn: string;
  meaningEn?: string;
  meaningHi?: string;
  virtueBn: string;
  reference: string;
  repeatTarget?: number;
  audioUrl?: string;
}

export const HISNUL_MUSLIM_DUAS: DuaItem[] = [
  // ঘুম ও জাগ্রত
  {
    id: 'sleep-wake-1',
    category: 'sleep',
    titleBn: 'ঘুম থেকে জাগ্রত হওয়ার পর দু\'আ',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    pronunciationBn: 'আলহামদু লিল্লাহিল্লাযী আহ্ইয়ানা বা\'দা মা আমাতানা ওয়া ইলাইহিন নুশূর।',
    meaningBn: 'সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে মৃত্যু (ঘুম) দেওয়ার পর পুনরায় জীবন দান করলেন এবং তাঁরই কাছে সবার পুনরুত্থান হবে।',
    virtueBn: 'ঘুম থেকে উঠে এ দু\'আ পড়লে সারাদিনের কাজের মধ্যে আল্লাহর বরকত নেমে আসে এবং অন্তরে কৃতজ্ঞতা তৈরি হয়।',
    reference: 'সহীহ বুখারী: ৬৩১২, সহীহ মুসলিম: ২৭১১',
    repeatTarget: 1
  },
  {
    id: 'sleep-bed-1',
    category: 'sleep',
    titleBn: 'ঘুমানোর সময় পড়ার দু\'আ',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    pronunciationBn: 'বিস্‌মিকা আল্লাহুম্মা আমূতু ওয়া আহ্ইয়া।',
    meaningBn: 'হে আল্লাহ! আপনারই নামে আমি মৃত্যুবরণ করছি (ঘুমাচ্ছি) এবং জীবিত হচ্ছি (জাগ্রত হব)।',
    virtueBn: 'ঘুমানোর পূর্বে রাসুলুল্লাহ (ﷺ) ডান কাতে শুয়ে এ দু\'আ পড়তেন। এর ফলে রাতের ঘুম নিরাপদ ও সুরক্ষাময় হয়।',
    reference: 'সহীহ বুখারী: ৬৩২৪, সহীহ মুসলিম: ২৭১১',
    repeatTarget: 1
  },
  {
    id: 'sleep-bed-ayatul-kursi',
    category: 'sleep',
    titleBn: 'ঘুমানোর সময় আয়াতুল কুরসী তিলাওয়াত',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...',
    pronunciationBn: 'আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল ক্বাইয়্যূম...',
    meaningBn: 'আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক...',
    virtueBn: 'রাতের বেলা শোওয়ার আগে আয়াতুল কুরসী পাঠ করলে সারারাত আল্লাহর পক্ষ থেকে একজন রক্ষাকারী ফেরেশতা নিয়োজিত থাকে এবং শয়তান কাছে আসতে পারে না।',
    reference: 'সহীহ বুখারী: ২৩১১ (সূরা আল-বাক্বারাহ: ২৫৫)',
    repeatTarget: 1,
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3'
  },

  // সকাল ও সন্ধ্যার জিকির ও হিফাজত
  {
    id: 'azkar-sayyidul-istighfar',
    category: 'azkar',
    titleBn: 'সাইয়্যিদুল ইস্তিগফার (শ্রেষ্ঠ ক্ষমা প্রার্থনা)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    pronunciationBn: 'আল্লাহুম্মা আনতা রব্বী, লা ইলাহা ইল্লা আনতা, খালাক্বতানী ওয়া আনা \'আবদুকা, ওয়া আনা \'আলা \'আহ্দিকা ওয়া ওয়া\'দিকা মাসতাত্বা\'তু। আ\'উযু বিকা মিন শার্রি মা সানা\'তু, আবূউ লাকা বিনি\'মাতিকা \'আলাইয়্যা, ওয়া আবূউ লাকা বিযাম্বী, ফাগ্ফির লী, ফা ইন্নাহূ লা ইয়াগফিরুয যুনূবা ইল্লা আনতা।',
    meaningBn: 'হে আল্লাহ! আপনি আমার রব, আপনি ছাড়া কোনো উপাস্য নেই। আপনি আমাকে সৃষ্টি করেছেন এবং আমি আপনার দাস। আমি আপনার অঙ্গীকার ও প্রতিশ্রুতির ওপর সাধ্যমতো অটল আছি। আমি আমার কৃতকর্মের অনিষ্ট থেকে আপনার আশ্রয় চাই। আমার ওপর আপনার নিয়ামত স্বীকার করছি এবং আমার পাপ স্বীকার করছি। অতএব আমাকে ক্ষমা করুন, কেননা আপনি ছাড়া গুনাহ মাফ করার কেউ নেই।',
    virtueBn: 'যে ব্যক্তি সকালে দৃঢ় বিশ্বাসের সাথে এটি পড়বে এবং সন্ধ্যার পূর্বে মারা যাবে, সে জান্নাতে প্রবেশ করবে। যে সন্ধ্যায় পড়বে এবং সকালের পূর্বে মারা যাবে, সেও জান্নাতে প্রবেশ করবে।',
    reference: 'সহীহ বুখারী: ৬৩০৬',
    repeatTarget: 1
  },
  {
    id: 'azkar-bismillahillazi',
    category: 'azkar',
    titleBn: 'সকাল-সন্ধ্যার বিপদ ও ক্ষতি থেকে বাঁচার দু\'আ',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    pronunciationBn: 'বিস্‌মিল্লাহিল্লাযী লা ইয়াদ্বুররু মা\'আ ইস্‌মিহী শাইউন ফিল আরদ্বি ওয়ালা ফিস্‌ সামা-ই, ওয়া হুয়াস সামী\'উল \'আলীম।',
    meaningBn: 'আল্লাহর নামে, যাঁর নামের সাথে আসমান ও যমীনের কোনো কিছুই কোনো ক্ষতি করতে পারে না। আর তিনি সর্বশ্রোতা, সর্বজ্ঞানী।',
    virtueBn: 'সকালে ও সন্ধ্যায় ৩ বার পাঠ করলে আসমান ও যমীনের কোনো অনিষ্ট বা বিষাক্ত পোকা ক্ষতি করতে পারবে না।',
    reference: 'সুনানে আবু দাউদ: ৫০৮৮, জামে তিরমিযী: ৩৩৪৭',
    repeatTarget: 3
  },
  {
    id: 'azkar-radheetu-billah',
    category: 'azkar',
    titleBn: 'আল্লাহর প্রতি সন্তুষ্টি প্রকাশের সকাল-সন্ধ্যার দু\'আ',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    pronunciationBn: 'রাদীতু বিল্লাহি রব্বান, ওয়া বিল-ইসলামি দীনান, ওয়া বি-মুহাম্মাদিন সাল্লাল্লাহু \'আলাইহি ওয়াসাল্লামা নাবিয়্যান।',
    meaningBn: 'আমি আল্লাহকে প্রতিপালক হিসেবে, ইসলামকে দ্বীন হিসেবে এবং মুহাম্মাদ (ﷺ)-কে নবী হিসেবে পেয়ে সন্তুষ্ট হলাম।',
    virtueBn: 'যে ব্যক্তি সকাল ও সন্ধ্যায় ৩ বার এটি পড়বে, কিয়ামতের দিন আল্লাহ তা\'আলা তাকে সন্তুষ্ট করা নিজের ওপর আবশ্যক করে নেন।',
    reference: 'সুনানে তিরমিযী: ৩৩৮৯, আবু দাউদ: ১৫২৯',
    repeatTarget: 3
  },
  {
    id: 'azkar-subhanallahi-wabihamdihi',
    category: 'azkar',
    titleBn: 'সকালে ১০০ বার তাসবীহ পাঠ',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    pronunciationBn: 'সুবহানাল্লাহি ওয়া বিহামদিহী।',
    meaningBn: 'আল্লাহ তা\'আলা অত্যন্ত পবিত্র এবং যাবতীয় প্রশংসা একমাত্র তাঁরই।',
    virtueBn: 'যে ব্যক্তি দিনে ১০০ বার এটি পাঠ করে, তার সমুদ্রের ফেনা পরিমাণ পাপ হলেও ক্ষমা করে দেওয়া হয়।',
    reference: 'সহীহ বুখারী: ৬৪০৫, সহীহ মুসলিম: ২৬৯১',
    repeatTarget: 100
  },

  // মসজিদ ও ঘর
  {
    id: 'mosque-enter',
    category: 'mosque',
    titleBn: 'মসজিদে প্রবেশের দু\'আ',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    pronunciationBn: 'আল্লাহুম্মাফ তাহ্ লী আবওয়াবা রহ্‌মাতিক।',
    meaningBn: 'হে আল্লাহ! আমার জন্য আপনার রহমতের দরজাসমূহ উন্মুক্ত করে দিন।',
    virtueBn: 'ডান পা দিয়ে মসজিদে প্রবেশ করে এ দু\'আ পাঠ করলে আল্লাহর অসীম রহমতের ছায়া লাভ হয়।',
    reference: 'সহীহ মুসলিম: ৭১৩',
    repeatTarget: 1
  },
  {
    id: 'mosque-exit',
    category: 'mosque',
    titleBn: 'মসজিদ থেকে বের হওয়ার দু\'আ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    pronunciationBn: 'আল্লাহুম্মা ইন্নী আসআলুকা মিন ফাদ্বলিক।',
    meaningBn: 'হে আল্লাহ! নিশ্চয় আমি আপনার অনুগ্রহ প্রার্থনা করছি।',
    virtueBn: 'বাম পা দিয়ে মসজিদ থেকে বের হওয়ার সময় এ দু\'আ পাঠ করা সুন্নাত।',
    reference: 'সহীহ মুসলিম: ৭১৩',
    repeatTarget: 1
  },
  {
    id: 'house-exit',
    category: 'house',
    titleBn: 'বাড়ি থেকে বের হওয়ার সময় দু\'আ',
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    pronunciationBn: 'বিস্‌মিল্লাহি তাওয়াক্কালতু \'আলাল্লাহ, ওয়ালা হাওলা ওয়ালা কুউওয়াতা ইল্লা বিল্লাহ।',
    meaningBn: 'আল্লাহর নামে, আল্লাহর ওপরই ভরসা করলাম। আল্লাহর সাহায্য ছাড়া কোনো অনিষ্ট দূর করার বা ভালো কাজের কোনো শক্তি নেই।',
    virtueBn: 'এ দু\'আ পড়লে ফেরেশতারা বলেন: তোমাকে পথ দেখানো হয়েছে, তোমার জন্য আল্লাহই যথেষ্ট এবং শয়তান তার থেকে দূরে চলে যায়।',
    reference: 'সুনানে আবু দাউদ: ৫০৯৫, তিরমিযী: ৩৪২৬',
    repeatTarget: 1
  },
  {
    id: 'house-enter',
    category: 'house',
    titleBn: 'ঘরে প্রবেশের সময় দু\'আ',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    pronunciationBn: 'বিস্‌মিল্লাহি ওয়ালাজনা, ওয়া বিস্‌মিল্লাহি খারাজনা, ওয়া \'আলাল্লাহি রব্বিনা তাওয়াক্কালনা।',
    meaningBn: 'আল্লাহর নামে আমরা প্রবেশ করলাম, আল্লাহর নামে আমরা বের হলাম এবং আমাদের রব আল্লাহর ওপরই আমরা ভরসা করলাম।',
    virtueBn: 'ঘরে প্রবেশের সময় সালাম দিয়ে এ দু\'আ পড়লে শয়তান বলে: এখানে আজ রাতে আমাদের থাকা ও খাওয়ার কোনো স্থান নেই।',
    reference: 'সুনানে আবু دাউদ: ৫০৯৬',
    repeatTarget: 1
  },

  // রিযিক, ঋণ ও দুশ্চিন্তা
  {
    id: 'distress-anxiety',
    category: 'distress',
    titleBn: 'দুশ্চিন্তা ও ঋণমুক্তি লাভের দু\'আ',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    pronunciationBn: 'আল্লাহুম্মা ইন্নী আ\'উযু বিকা মিনাল হাম্মি ওয়াল হাযানি, ওয়াল \'আজযি ওয়াল কাসালি, ওয়াল বুখলি ওয়াল জুবনি, ওয়া দ্বালা\'ইদ দাইনি ওয়া গালাবাতির রিজাল।',
    meaningBn: 'হে আল্লাহ! আমি আপনার আশ্রয় চাই দুশ্চিন্তা ও দুঃখ-বেদনা থেকে, অক্ষমতা ও অলসতা থেকে, কৃপণতা ও কাপুরুষতা থেকে, ঋণের বোঝা ও মানুষের দমন-পীড়ন থেকে।',
    virtueBn: 'রাসুলুল্লাহ (ﷺ) প্রতিদিন এ দু\'আ অত্যন্ত গুরুত্ব সহকারে পাঠ করতেন। আবু উমামা (রা.) এ দু\'আর বদৌলতে পাহাড়সম ঋণ থেকে মুক্ত হয়েছিলেন।',
    reference: 'সহীহ বুখারী: ২৮৯৩',
    repeatTarget: 1
  },
  {
    id: 'distress-la-ilaha-illa-anta',
    category: 'distress',
    titleBn: 'বিপদ মুক্তির দু\'আয়ে ইউনুস (আ.)',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    pronunciationBn: 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নী কুন্তু মিনায জোয়ালিমীন।',
    meaningBn: 'আপনি ছাড়া কোনো সত্য উপাস্য নেই, আপনি মহাপবিত্র! নিশ্চয় আমি জালিমদের অন্তর্ভুক্ত ছিলাম।',
    virtueBn: 'রাসুলুল্লাহ (ﷺ) বলেছেন: যে কোনো মুসলিম বিপদে পড়ে এই দু\'আ করলে আল্লাহ তা\'আলা অবশ্যই তার ডাক শোনেন এবং বিপদ দূর করেন।',
    reference: 'সূরা আল-আম্বিয়া: ৮৭, জামে তিরমিযী: ৩৫০৫',
    repeatTarget: 1,
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/021087.mp3'
  },
  {
    id: 'health-shifa',
    category: 'health',
    titleBn: 'রোগীর শেফা ও শারীরিক সুস্থতার দু\'আ',
    arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    pronunciationBn: 'আল্লাহুম্মা রব্বান নাসি আযহিবিল বা\'স, ইশফি আনতাশ শাফী, লা শিফা-আ ইল্লা শিফাউকা, শিফা-আন লা ইউগাদিরু সাক্বামা।',
    meaningBn: 'হে আল্লাহ! মানবজাতির রব! কষ্ট দূর করে দিন, আরোগ্য দান করুন, আপনিই আরোগ্যকারী। আপনার আরোগ্য ছাড়া কোনো আরোগ্য নেই, এমন আরোগ্য দিন যা কোনো রোগ অবশিষ্ট রাখে না।',
    virtueBn: 'রাসুলুল্লাহ (ﷺ) অসুস্থ সাহাবীদের দেখতে গেলে তাদের গায়ে ডান হাত রেখে এ দু\'আ পড়ে ফুঁ দিতেন।',
    reference: 'সহীহ বুখারী: ৫৭৪২, সহীহ মুসলিম: ২১৯১',
    repeatTarget: 1
  },

  // পিতা-মাতা
  {
    id: 'parents-dua',
    category: 'parents',
    titleBn: 'পিতা-মাতার মাগফিরাত ও রহমতের জন্য কুরআনী দু\'আ',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    pronunciationBn: 'রব্বির হামহুমা কামা রব্বায়ানী সগীরা।',
    meaningBn: 'হে আমার রব! তাদের উভয়ের প্রতি দয়া করুন, যেভাবে শৈশবে তারা আমাকে লালন-পালন করেছেন।',
    virtueBn: 'সন্তানের এ দু\'আর কারণে কবরে থাকা পিতা-মাতার মর্যাদা আল্লাহ তা\'আলা বহু গুণ বৃদ্ধি করে দেন।',
    reference: 'সূরা বনী ইসরাঈল: ২৪',
    repeatTarget: 1,
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/017024.mp3'
  }
];

const CATEGORIES = [
  { id: 'all', labelBn: 'সকল দু\'আ' },
  { id: 'sleep', labelBn: 'ঘুম ও জাগ্রত' },
  { id: 'azkar', labelBn: 'সকাল-সন্ধ্যার জিকির' },
  { id: 'mosque', labelBn: 'মসজিদ ও সালাত' },
  { id: 'house', labelBn: 'ঘর ও চলাফেরা' },
  { id: 'distress', labelBn: 'বিপদ ও ঋণমুক্তি' },
  { id: 'health', labelBn: 'রোগমুক্তি ও শেফা' },
  { id: 'parents', labelBn: 'পিতা-মাতা' },
];

interface HisnulMuslimViewProps {
  setActiveTab: (tab: string) => void;
  onOpenCardGenerator?: (text: string, title: string) => void;
}

export const HisnulMuslimView: React.FC<HisnulMuslimViewProps> = ({ setActiveTab, onOpenCardGenerator }) => {
  const { language, activeThemeConfig } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counts, setCounts] = useState<{ [id: string]: number }>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingType, setPlayingType] = useState<'arabic' | 'meaning' | null>(null);
  const [autoPlayMeaning, setAutoPlayMeaning] = useState<boolean>(true);

  const filteredDuas = HISNUL_MUSLIM_DUAS.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesQuery = 
      item.titleBn.toLowerCase().includes(q) ||
      item.meaningBn.toLowerCase().includes(q) ||
      item.pronunciationBn.toLowerCase().includes(q) ||
      item.arabic.includes(q) ||
      item.reference.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.titleBn}\n\n${dua.arabic}\n\nউচ্চারণ: ${dua.pronunciationBn}\n\nঅর্থ: ${dua.meaningBn}\n\nফযিলত: ${dua.virtueBn}\nরেফারেন্স: ${dua.reference}\n\n(আল-কুরআনুল কারীম অ্যাপ)`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (dua: DuaItem) => {
    const text = `${dua.titleBn}\n\n${dua.arabic}\n\nঅর্থ: ${dua.meaningBn}\nসূত্র: ${dua.reference}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: dua.titleBn,
          text: text
        });
      } catch (e) {
        handleCopy(dua);
      }
    } else {
      handleCopy(dua);
    }
  };

  const handleIncrement = (id: string, target?: number) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
    setCounts(prev => {
      const curr = prev[id] || 0;
      return { ...prev, [id]: curr + 1 };
    });
  };

  const handleResetCount = (id: string) => {
    setCounts(prev => ({ ...prev, [id]: 0 }));
  };

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Language selection per dua (default to app language or 'bn')
  const defaultLang: 'bn' | 'en' | 'hi' = (language === 'en' || language === 'hi') ? language : 'bn';
  const [duaLangs, setDuaLangs] = useState<Record<string, 'bn' | 'en' | 'hi'>>({});

  const getDuaLanguage = (duaId: string): 'bn' | 'en' | 'hi' => {
    return duaLangs[duaId] || defaultLang;
  };

  const cycleDuaLanguage = (duaId: string) => {
    const current = getDuaLanguage(duaId);
    const order: Array<'bn' | 'en' | 'hi'> = ['bn', 'en', 'hi'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setDuaLangs(prev => ({ ...prev, [duaId]: next }));
  };

  const getLocalizedMeaning = (dua: DuaItem, lang: 'bn' | 'en' | 'hi') => {
    if (lang === 'en' && dua.meaningEn) return dua.meaningEn;
    if (lang === 'hi' && dua.meaningHi) return dua.meaningHi;
    return dua.meaningBn;
  };

  const getLocalizedTitle = (dua: DuaItem, lang: 'bn' | 'en' | 'hi') => {
    if (lang === 'en' && dua.titleEn) return dua.titleEn;
    return dua.titleBn;
  };

  const stopActiveAudio = () => {
    stopAllAudio();
    setPlayingId(null);
    setPlayingType(null);
  };

  const handleSpeak = (dua: DuaItem, type: 'sequential' | 'arabic' | 'meaning' = 'sequential') => {
    if (playingId === dua.id && (playingType === type || (type === 'sequential' && (playingType === 'arabic' || playingType === 'meaning')))) {
      stopActiveAudio();
      return;
    }

    const currentDuaLang = getDuaLanguage(dua.id);
    const localizedTitle = getLocalizedTitle(dua, currentDuaLang);
    const localizedMeaning = getLocalizedMeaning(dua, currentDuaLang);

    if (type === 'sequential') {
      setPlayingId(dua.id);
      setPlayingType('arabic');

      // 1. Play Arabic recitation first
      playAudioText(
        dua.arabic,
        'ar',
        {
          directUrl: dua.audioUrl,
          onEnd: () => {
            // 2. Play translation in selected language immediately after Arabic completes
            setPlayingType('meaning');
            setTimeout(() => {
              const speechText = `${localizedTitle}। অর্থ: ${localizedMeaning}`;
              playAudioText(
                speechText,
                currentDuaLang,
                {
                  onEnd: () => {
                    setPlayingId(null);
                    setPlayingType(null);
                  },
                  onError: () => {
                    setPlayingId(null);
                    setPlayingType(null);
                  }
                }
              );
            }, 350);
          },
          onError: () => {
            setPlayingId(null);
            setPlayingType(null);
          }
        }
      );
    } else if (type === 'arabic') {
      setPlayingId(dua.id);
      setPlayingType('arabic');
      playAudioText(
        dua.arabic,
        'ar',
        {
          directUrl: dua.audioUrl,
          onEnd: () => {
            setPlayingId(null);
            setPlayingType(null);
          },
          onError: () => {
            setPlayingId(null);
            setPlayingType(null);
          }
        }
      );
    } else {
      setPlayingId(dua.id);
      setPlayingType('meaning');
      const speechText = `অর্থ: ${localizedMeaning}`;
      playAudioText(
        speechText,
        currentDuaLang,
        {
          onEnd: () => {
            setPlayingId(null);
            setPlayingType(null);
          },
          onError: () => {
            setPlayingId(null);
            setPlayingType(null);
          }
        }
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-2 pb-16"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('home')} 
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
              দৈনন্দিন আমল ও মাসনূন দু'আ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              হিসনুল মুসলিম • সহীহ হাদীস ভিত্তিক দু'আ সম্ভার
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-black rounded-full border border-emerald-200/50">
          {filteredDuas.length} টি দু'আ
        </span>
      </div>

      {/* Hero Banner */}
      <div 
        className="rounded-[2.2rem] p-6 text-white shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${activeThemeConfig.primaryColor}, ${activeThemeConfig.accentGold || '#047857'})`
        }}
      >
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-amber-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
              দৈনিক মুমিনের দুর্গ • হিসনুল মুসলিম
            </span>
          </div>
          <h3 className="text-lg font-black leading-snug">
            "দু'আ হলো মুমিনের শ্রেষ্ঠ হাতিয়ার ও ইবাদতের মূলমজ্জা"
          </h3>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            সকাল-সন্ধ্যা, বিপদ-আপদ এবং প্রতিটি পদক্ষেপে আল্লাহর স্মরণই আত্মিক প্রশান্তি ও নিরাপত্তার চাবিকাঠি।
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-15">
          <Heart size={160} />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="দু'আ বা আমল খুঁজুন (অর্থ, ফযিলত, রেফারেন্স)..."
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            মুছুন
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all active:scale-95 ${
                isSelected 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700'
              }`}
            >
              {cat.labelBn}
            </button>
          );
        })}
      </div>

      {/* Audio Options Banner */}
      <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800/40 text-xs font-bold text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <Headphones size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>আরবির সাথেই স্বয়ংক্রিয়ভাবে অনুবাদ শুনুন</span>
        </div>
        <button
          onClick={() => setAutoPlayMeaning(!autoPlayMeaning)}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 shrink-0 ${
            autoPlayMeaning 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {autoPlayMeaning ? 'অটো অর্থ: চালু' : 'অটো অর্থ: বন্ধ'}
        </button>
      </div>

      {/* Dua Cards List */}
      <div className="space-y-4">
        {filteredDuas.map((dua, index) => {
          const currentCount = counts[dua.id] || 0;
          const isGoalReached = dua.repeatTarget ? currentCount >= dua.repeatTarget : false;

          return (
            <motion.div
              key={dua.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white dark:bg-slate-800 rounded-[2.2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4 hover:shadow-md transition-all group"
            >
              {/* Card Top Title & Actions */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                    #{index + 1} • {CATEGORIES.find(c => c.id === dua.category)?.labelBn || 'আমল'}
                  </span>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    {dua.titleBn}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {/* Play Audio Button: Arabic First, then Translation sequentially */}
                  <button
                    onClick={() => handleSpeak(dua, 'sequential')}
                    title="প্রথমে আরবি তিলাওয়াত ও পরে অনুবাদ অডিও শুনুন"
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black shadow-sm active:scale-95 ${
                      playingId === dua.id
                        ? 'bg-emerald-600 text-white animate-pulse shadow-md ring-2 ring-emerald-400' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {playingId === dua.id ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    <span>
                      {playingId === dua.id
                        ? (playingType === 'arabic' ? 'আরবি বাজছে...' : 'অনুবাদ বাজছে...')
                        : 'প্লে অডিও'}
                    </span>
                  </button>

                  {/* Translate Button: Cycles between বাংলা, English, and हिन्दी */}
                  <button
                    onClick={() => cycleDuaLanguage(dua.id)}
                    title="অনুবাদ ভাষা পরিবর্তন করুন (বাংলা / English / हिन्दी)"
                    className="px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-emerald-500 shadow-sm active:scale-95"
                  >
                    <Languages size={15} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="font-black text-emerald-700 dark:text-emerald-300">
                      {getDuaLanguage(dua.id) === 'bn' ? 'বাংলা' : getDuaLanguage(dua.id) === 'en' ? 'EN' : 'हिन्दी'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleCopy(dua)}
                    title="কপি করুন"
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:text-emerald-600 transition-colors"
                  >
                    {copiedId === dua.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>

                  <button
                    onClick={() => handleShare(dua)}
                    title="শেয়ার করুন"
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:text-emerald-600 transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {/* Arabic Box */}
              <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-900/60 border border-amber-200/40 dark:border-slate-700/60 text-right">
                <p className="font-arabic text-2xl sm:text-3xl leading-[2.2] text-slate-900 dark:text-amber-100 font-bold select-text" dir="rtl">
                  {dua.arabic}
                </p>
              </div>

              {/* Bengali Pronunciation */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  উচ্চারণ:
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                  {dua.pronunciationBn}
                </p>
              </div>

              {/* Meaning with language badge and listen meaning button */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    অনুবাদ ({getDuaLanguage(dua.id) === 'bn' ? 'বাংলা' : getDuaLanguage(dua.id) === 'en' ? 'English' : 'हिन्दी'}):
                  </span>
                  <button
                    onClick={() => handleSpeak(dua, 'meaning')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                      playingId === dua.id && playingType === 'meaning'
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/80'
                    }`}
                  >
                    <Volume2 size={13} />
                    <span>অর্থ শুনুন</span>
                  </button>
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                  {getLocalizedMeaning(dua, getDuaLanguage(dua.id))}
                </p>
              </div>

              {/* Virtue & Reference */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-200">ফযিলত:</strong> {dua.virtueBn}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold pl-5">
                  সূত্র: {dua.reference}
                </p>
              </div>

              {/* Tap Counter for Daily Azkar */}
              {dua.repeatTarget && (
                <div className="pt-2 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                      লক্ষ্য: {dua.repeatTarget} বার
                    </span>
                    {isGoalReached && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} /> সম্পন্ন
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentCount > 0 && (
                      <button
                        onClick={() => handleResetCount(dua.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                        title="রিসেট"
                      >
                        <RefreshCw size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleIncrement(dua.id, dua.repeatTarget)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
                        isGoalReached 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                      }`}
                    >
                      ট্যাপ করুন ({currentCount}/{dua.repeatTarget})
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredDuas.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-[2.2rem] space-y-3">
            <AlertCircle size={40} className="mx-auto text-slate-400" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              কোনো দু'আ বা আমল খুঁজে পাওয়া যায়নি।
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs font-black text-emerald-600 underline"
            >
              সব দু'আ দেখুন
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
