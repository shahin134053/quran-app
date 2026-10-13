import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Volume2, CheckCircle2, Circle, 
  Sparkles, Award, Star, Info, Share2, Copy, Check, Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playAudioText, stopAllAudio } from '../utils/audioHelper';
import { AppLanguage } from '../types';

export interface AllahName {
  id: number;
  arabic: string;
  transliterationBn: string;
  transliterationEn: string;
  meaningBn: string;
  explanationBn: string;
}

const ASMA_LOCALES: Record<AppLanguage, {
  title: string;
  subtitle: string;
  badge: string;
  hadithBadge: string;
  hadithText: string;
  hadithRef: string;
  progressText: string;
  searchPlaceholder: string;
  clearText: string;
  allTab: string;
  memorizedTab: string;
  remainingTab: string;
  meaningPrefix: string;
  listenTooltip: string;
  copyTooltip: string;
  markMemorized: string;
  memorizedDone: string;
}> = {
  bn: {
    title: 'আসমাউল হুসনা',
    subtitle: 'আল্লাহর ৯৯টি পবিত্র নাম, অর্থ ও ফযিলত',
    badge: '৯৯টি নাম',
    hadithBadge: 'সহীহ বুখারী ও মুসলিমের সুসংবাদ',
    hadithText: '"নিশ্চয় আল্লাহর ৯৯টি নাম রয়েছে। যে ব্যক্তি এগুলো মুখস্থ করবে ও বিশ্বাস রাখবে, সে জান্নাতে প্রবেশ করবে।"',
    hadithRef: '(সহীহ বুখারী: ২৭৩৬, সহীহ মুসলিম: ২৬৭৭)',
    progressText: 'মুখস্থ অগ্রগতি',
    searchPlaceholder: 'পবিত্র নাম বা অর্থ খুঁজুন (যেমন: আর-রহমান, পরম দয়ালু)...',
    clearText: 'মুছুন',
    allTab: 'সবগুলো',
    memorizedTab: 'মুখস্থ',
    remainingTab: 'বাকি আছে',
    meaningPrefix: 'অর্থ: ',
    listenTooltip: 'উচ্চারণ শুনুন',
    copyTooltip: 'কপি করুন',
    markMemorized: 'মুখস্থ মার্ক করুন',
    memorizedDone: 'মুখস্থ সম্পন্ন'
  },
  en: {
    title: 'Asmaul Husna',
    subtitle: '99 Beautiful Names of Allah, Meanings & Virtues',
    badge: '99 Names',
    hadithBadge: 'Glad Tidings from Sahih Bukhari & Muslim',
    hadithText: '"Indeed, Allah has 99 names. Whoever memorizes and acts upon them will enter Paradise."',
    hadithRef: '(Sahih Bukhari: 2736, Sahih Muslim: 2677)',
    progressText: 'Memorization Progress',
    searchPlaceholder: 'Search name or meaning (e.g., Ar-Rahman, Most Merciful)...',
    clearText: 'Clear',
    allTab: 'All',
    memorizedTab: 'Memorized',
    remainingTab: 'Remaining',
    meaningPrefix: 'Meaning: ',
    listenTooltip: 'Listen Recitation',
    copyTooltip: 'Copy',
    markMemorized: 'Mark as Memorized',
    memorizedDone: 'Memorized'
  },
  hi: {
    title: 'अस्माउल हुस्ना',
    subtitle: 'अल्लाह के 99 पवित्र नाम, अर्थ और फ़ज़ीलत',
    badge: '99 नाम',
    hadithBadge: 'सहीह बुख़ारी और मुस्लिम की शुभ सूचना',
    hadithText: '"बेशक अल्लाह के 99 नाम हैं। जो व्यक्ति इन्हें याद रखेगा और विश्वास रखेगा, वह जन्नत में प्रवेश करेगा।"',
    hadithRef: '(सहीह बुख़ारी: 2736, सहीह मुस्लिम: 2677)',
    progressText: 'याद करने की प्रगति',
    searchPlaceholder: 'पवित्र नाम या अर्थ खोजें (जैसे: अर-रहमान, परम दयालु)...',
    clearText: 'हटाएँ',
    allTab: 'सभी',
    memorizedTab: 'कंठस्थ',
    remainingTab: 'शेष',
    meaningPrefix: 'अर्थ: ',
    listenTooltip: 'उच्चारण सुनें',
    copyTooltip: 'कॉपी करें',
    markMemorized: 'कंठस्थ चिह्नित करें',
    memorizedDone: 'कंठस्थ पूर्ण'
  },
  es: {
    title: 'Asmaul Husna',
    subtitle: 'Los 99 Bellos Nombres de Alá, Significados y Virtudes',
    badge: '99 Nombres',
    hadithBadge: 'Buenas Nuevas de Sahih Bujari y Muslim',
    hadithText: '"Ciertamente Alá tiene 99 nombres. Quien los memorice y crea en ellos entrará al Paraíso."',
    hadithRef: '(Sahih Al-Bujari: 2736, Sahih Muslim: 2677)',
    progressText: 'Progreso de memorización',
    searchPlaceholder: 'Buscar nombre o significado (ej. Ar-Rahman, Misericordioso)...',
    clearText: 'Borrar',
    allTab: 'Todos',
    memorizedTab: 'Memorizados',
    remainingTab: 'Restantes',
    meaningPrefix: 'Significado: ',
    listenTooltip: 'Escuchar pronunciación',
    copyTooltip: 'Copiar',
    markMemorized: 'Marcar como memorizado',
    memorizedDone: 'Completado'
  },
  ar: {
    title: 'أسماء الله الحسنى',
    subtitle: '٩٩ اسمًا من أسماء الله الحسنى ومعانيها وفضائلها',
    badge: '٩٩ اسمًا',
    hadithBadge: 'بشارة صحيحي البخاري ومسلم',
    hadithText: '«إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلَّا وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الجَنَّةَ»',
    hadithRef: '(صحيح البخاري: ٢٧٣٦، صحيح مسلم: ٢٦٧٧)',
    progressText: 'تقدم الحفظ',
    searchPlaceholder: 'ابحث عن اسم أو معنى (مثل: الرحمن، الرحيم)...',
    clearText: 'مسح',
    allTab: 'الكل',
    memorizedTab: 'المحفوظة',
    remainingTab: 'المتبقية',
    meaningPrefix: 'المعنى: ',
    listenTooltip: 'استماع النطق',
    copyTooltip: 'نسخ',
    markMemorized: 'تحديد كمحفوظ',
    memorizedDone: 'تم الحفظ'
  },
  de: {
    title: 'Asmaul Husna',
    subtitle: 'Die 99 schönsten Namen Allahs, Bedeutungen & Vorzüge',
    badge: '99 Namen',
    hadithBadge: 'Frohe Botschaft aus Sahih Al-Bukhari & Muslim',
    hadithText: '"Wahrlich, Allah hat 99 Namen. Wer sie auswendig lernt und danach handelt, wird das Paradies betreten."',
    hadithRef: '(Sahih Al-Bukhari: 2736, Sahih Muslim: 2677)',
    progressText: 'Auswendiglern-Fortschritt',
    searchPlaceholder: 'Namen oder Bedeutung suchen (z. B. Ar-Rahman, Allerbarmer)...',
    clearText: 'Löschen',
    allTab: 'Alle',
    memorizedTab: 'Gelernt',
    remainingTab: 'Verbleibend',
    meaningPrefix: 'Bedeutung: ',
    listenTooltip: 'Aussprache anhören',
    copyTooltip: 'Kopieren',
    markMemorized: 'Als gelernt markieren',
    memorizedDone: 'Gelernt'
  }
};

export const ALLAH_99_NAMES: AllahName[] = [
  { id: 1, arabic: 'الرَّحْمَنُ', transliterationBn: 'আর-রহমান', transliterationEn: 'Ar-Rahmaan', meaningBn: 'পরম দয়ালু', explanationBn: 'যাঁর অসীম ও সার্বজনীন দয়া সমগ্র সৃষ্টিজগৎকে পরিবেষ্টন করে রেখেছে।' },
  { id: 2, arabic: 'الرَّحِيمُ', transliterationBn: 'আর-রাহীম', transliterationEn: 'Ar-Raheem', meaningBn: 'অতিশয় মেহেরবান', explanationBn: 'যিনি তাঁর মুমিন বান্দাদের প্রতি বিশেষ দয়া ও অনুগ্রহ বর্ষণ করেন।' },
  { id: 3, arabic: 'المَلِكُ', transliterationBn: 'আল-মালিক', transliterationEn: 'Al-Malik', meaningBn: 'সার্বভৌম রাজা ও মালিক', explanationBn: 'সমগ্র আসমান ও যমীনের একচ্ছত্র অধিপতি ও পরম শাসক।' },
  { id: 4, arabic: 'القُدُّوسُ', transliterationBn: 'আল-কুদ্দূস', transliterationEn: 'Al-Quddoos', meaningBn: 'মহাপবিত্র ও নিষ্কলুষ', explanationBn: 'যিনি সমস্ত দোষত্রুটি, অপূর্ণতা ও দুর্বলতা থেকে মুক্ত ও পবিত্র।' },
  { id: 5, arabic: 'السَّلَامُ', transliterationBn: 'আস-সালাম', transliterationEn: 'As-Salaam', meaningBn: 'শান্তি ও নিরাপত্তাদাতা', explanationBn: 'যাঁর সত্তা যাবতীয় সংকটমুক্ত এবং যিনি বান্দাকে শান্তি ও নিরাপত্তা দান করেন।' },
  { id: 6, arabic: 'المُؤْمِنُ', transliterationBn: 'আল-মু\'মিন', transliterationEn: 'Al-Mu\'min', meaningBn: 'নিরাপত্তা ও ঈমানদাতা', explanationBn: 'যিনি বান্দাদের অন্তরে বিশ্বাস ও ভীতিমুক্ত নিরাপত্তা নিশ্চিত করেন।' },
  { id: 7, arabic: 'المُهَيْمِنُ', transliterationBn: 'আল-মুহাইমিন', transliterationEn: 'Al-Muhaymin', meaningBn: 'মহা রক্ষক ও অভিভাবক', explanationBn: 'যিনি সমগ্র সৃষ্টির ওপর সদাসর্বদা সজাগ দৃষ্টি রাখেন ও সংরক্ষণ করেন।' },
  { id: 8, arabic: 'العَزِيزُ', transliterationBn: 'আল-আযীয', transliterationEn: 'Al-Azeez', meaningBn: 'পরাক্রমশালী ও অপরাজেয়', explanationBn: 'যাঁর শক্তির ওপর কোনো শক্তি নেই, যিনি সর্বশক্তিমান।' },
  { id: 9, arabic: 'الجَبَّارُ', transliterationBn: 'আল-জাব্বার', transliterationEn: 'Al-Jabbaar', meaningBn: 'মহাপ্রতাপশালী ও সংস্কারক', explanationBn: 'যিনি যা ইচ্ছা বলবৎ করেন এবং ভগ্ন হৃদয় ও অবস্থাকে জোড়া লাগান।' },
  { id: 10, arabic: 'المُتَكَبِّرُ', transliterationBn: 'আল-মুতাকাব্বির', transliterationEn: 'Al-Mutakabbir', meaningBn: 'গৌরবান্বিত ও অহংকারের একমাত্র অধিকারী', explanationBn: 'যাঁর বড়ত্ব ও শ্রেষ্ঠত্ব বর্ণনাতীত।' },
  { id: 11, arabic: 'الخَالِقُ', transliterationBn: 'আল-খালিক্ব', transliterationEn: 'Al-Khaaliq', meaningBn: 'সৃষ্টিকর্তা', explanationBn: 'যিনি পূর্ব নমুনা ছাড়া শূন্য থেকে সবকিছু সৃষ্টি করেছেন।' },
  { id: 12, arabic: 'البَارِئُ', transliterationBn: 'আল-বারী', transliterationEn: 'Al-Baari\'', meaningBn: 'সঠিক আকৃতি দানকারী', explanationBn: 'যিনি প্রাণীদের নিখুঁত ও চমৎকার অঙ্গসৌষ্ঠব দিয়েছেন।' },
  { id: 13, arabic: 'المُصَوِّرُ', transliterationBn: 'আল-মুসাওয়ির', transliterationEn: 'Al-Musawwir', meaningBn: 'রূপদানকারী ও নকশাকার', explanationBn: 'যিনি প্রতিটি সৃষ্টিকে নিজস্ব রূপ, অবয়ব ও বৈশিষ্ট্য দান করেন।' },
  { id: 14, arabic: 'الغَفَّارُ', transliterationBn: 'আল-গাফফার', transliterationEn: 'Al-Ghaffaar', meaningBn: 'মহাক্ষমাশীল', explanationBn: 'যিনি বান্দার বারবার করা গুনাহসমূহ গোপন রাখেন ও ক্ষমা করে দেন।' },
  { id: 15, arabic: 'القَهَّارُ', transliterationBn: 'আল-ক্বাহহার', transliterationEn: 'Al-Qahhaar', meaningBn: 'মহাদমনকারী ও কঠোর বিজয়ী', explanationBn: 'যাঁর কর্তৃত্ব ও শাসনের সামনে সমগ্র সৃষ্টি অবনত।' },
  { id: 16, arabic: 'الوَهَّابُ', transliterationBn: 'আল-ওয়াহহাব', transliterationEn: 'Al-Wahhaab', meaningBn: 'মহা দানশীল ও প্রতিদানহীন দাতা', explanationBn: 'যিনি কোনো প্রতিদান ছাড়াই অফুরন্ত নিয়ামত দান করেন।' },
  { id: 17, arabic: 'الرَّزَّاقُ', transliterationBn: 'আর-রাযযাক্ব', transliterationEn: 'Ar-Razzaaq', meaningBn: 'রিযিকদাতা', explanationBn: 'যিনি বিশ্বজগতের প্রতিটি প্রাণের আহারের ব্যবস্থা করেন।' },
  { id: 18, arabic: 'الفَتَّاحُ', transliterationBn: 'আল-ফাত্তাহ', transliterationEn: 'Al-Fattaah', meaningBn: 'মহাবিজয় ও রহমতের পথ উন্মোচনকারী', explanationBn: 'যিনি বন্ধ পথ খুলে দেন এবং সত্য ও মিথ্যার ফয়সালা করেন।' },
  { id: 19, arabic: 'العَلِيمُ', transliterationBn: 'আল-আলীম', transliterationEn: 'Al-\'Aleem', meaningBn: 'সর্বজ্ঞানী', explanationBn: 'যাঁর কাছে দৃশ্য ও অদৃশ্যের কোনো কিছুই গোপন নয়।' },
  { id: 20, arabic: 'القَابِضُ', transliterationBn: 'আল-ক্বাবিদ্ব', transliterationEn: 'Al-Qaabid', meaningBn: 'সংকোচনকারী ও নিয়ন্ত্রণকারী', explanationBn: 'যিনি নিজ হিকমতে রিযিক বা জীবন সংকুচিত করেন।' },
  { id: 21, arabic: 'البَاسِطُ', transliterationBn: 'আল-বাসিত', transliterationEn: 'Al-Baasit', meaningBn: 'সম্প্রসারণকারী ও প্রশস্তকারী', explanationBn: 'যিনি বান্দাদের ওপর অফুরন্ত রিযিক ও রহমত প্রশস্ত করেন।' },
  { id: 22, arabic: 'الخَافِضُ', transliterationBn: 'আল-খাফিদ', transliterationEn: 'Al-Khaafid', meaningBn: 'অবনমিতকারী ও হীনকারী', explanationBn: 'যিনি অহংকারী ও জালিমদের মর্যাদা ভূলুণ্ঠিত করেন।' },
  { id: 23, arabic: 'الرَّافِعُ', transliterationBn: 'আর-রাফি\'', transliterationEn: 'Ar-Raafi\'', meaningBn: 'মর্যাদা দানকারী ও সমুন্নতকারী', explanationBn: 'যিনি সৎ বান্দা ও আলেমদের মর্যাদা উচ্চ করেন।' },
  { id: 24, arabic: 'المُعِزُّ', transliterationBn: 'আল-মু\'ইয্য', transliterationEn: 'Al-Mu\'izz', meaningBn: 'সম্মানদাতা', explanationBn: 'যিনি যাকে ইচ্ছা ইজ্জত ও সম্মান দান করেন।' },
  { id: 25, arabic: 'المُذِلُّ', transliterationBn: 'আল-মুযিল্ল', transliterationEn: 'Al-Mudhill', meaningBn: 'অপমানকারী ও লাঞ্ছিতকারী', explanationBn: 'যিনি বিদ্রোহীদের অপদস্থ ও লাঞ্ছিত করেন।' },
  { id: 26, arabic: 'السَّمِيعُ', transliterationBn: 'আস-সামী\'', transliterationEn: 'As-Samee\'', meaningBn: 'সর্বশ্রোতা', explanationBn: 'যিনি প্রতিটি ফিসফিসানি ও মনের নীরব আরজি শোনেন।' },
  { id: 27, arabic: 'البَصِيرُ', transliterationBn: 'আল-বাসীর', transliterationEn: 'Al-Baseer', meaningBn: 'সর্বদ্রষ্টা', explanationBn: 'যিনি অন্ধকার রাতের কালো পাথরের ওপর দিয়ে হেঁটে যাওয়া পিঁপড়ার চলাচলও দেখেন।' },
  { id: 28, arabic: 'الحَكَمُ', transliterationBn: 'আল-হাকাম', transliterationEn: 'Al-Hakam', meaningBn: 'পরম বিচারক', explanationBn: 'যাঁর ফয়সালা চূড়ান্ত, অকাট্য ও ন্যায়ভিত্তিক।' },
  { id: 29, arabic: 'العَدْلُ', transliterationBn: 'আল-আদল', transliterationEn: 'Al-\'Adl', meaningBn: 'ন্যায়পরায়ণ', explanationBn: 'যাঁর মধ্যে কোনো অবিচার বা যুলুমের লেশমাত্র নেই।' },
  { id: 30, arabic: 'اللَّطِيفُ', transliterationBn: 'আল-লাতীফ', transliterationEn: 'Al-Lateef', meaningBn: 'স্নেহশীল ও সূক্ষ্মদর্শী', explanationBn: 'যিনি অতি সংগোপনে বান্দার যাবতীয় কল্যাণ সাধন করেন।' },
  { id: 31, arabic: 'الخَبِيرُ', transliterationBn: 'আল-খাবীর', transliterationEn: 'Al-Khabeer', meaningBn: 'সর্ববিষয়ে সম্যক অবহিত', explanationBn: 'যিনি প্রতিটি বিষয়ের ভেতর ও বাইরের পূর্ণ খবর রাখেন।' },
  { id: 32, arabic: 'الحَلِيمُ', transliterationBn: 'আল-হালীম', transliterationEn: 'Al-Haleem', meaningBn: 'পরম ধৈর্যশীল ও সহনশীল', explanationBn: 'যিনি বান্দার পাপে সাথে সাথে শাস্তি না দিয়ে তওবার অবকাশ দেন।' },
  { id: 33, arabic: 'العَظِيمُ', transliterationBn: 'আল-আযীম', transliterationEn: 'Al-\'Azeem', meaningBn: 'মহান ও শ্রেষ্ঠ', explanationBn: 'যাঁর মর্যাদা ও মহিমা সবকিছুর ঊর্ধ্বে।' },
  { id: 34, arabic: 'الغَفُورُ', transliterationBn: 'আল-গাফূর', transliterationEn: 'Al-Ghafoor', meaningBn: 'পরম ক্ষমাশীল', explanationBn: 'যিনি তওবাকারীদের বিপুল গুনাহ মুছে ফেলেন।' },
  { id: 35, arabic: 'الشَّكُورُ', transliterationBn: 'আশ-শাকূর', transliterationEn: 'Ash-Shakoor', meaningBn: 'গুণগ্রাহী ও মূল্যায়নকারী', explanationBn: 'যিনি বান্দার সামান্য আমলেরও বিশাল প্রতিদান দান করেন।' },
  { id: 36, arabic: 'العَلِيُّ', transliterationBn: 'আল-আলী', transliterationEn: 'Al-\'Aliyy', meaningBn: 'সর্বোচ্চ ও সুউচ্চ', explanationBn: 'যাঁর স্থান, ক্ষমতা ও গুণাবলি সবার শীর্ষে।' },
  { id: 37, arabic: 'الكَبِيرُ', transliterationBn: 'আল-কাবীর', transliterationEn: 'Al-Kabeer', meaningBn: 'সবচেয়ে বড় ও বিরাট', explanationBn: 'সমগ্র মহাবিশ্ব যাঁর কুদরতের তুলনায় বিন্দুর মতো।' },
  { id: 38, arabic: 'الحَفِيظُ', transliterationBn: 'আল-হাফীয', transliterationEn: 'Al-Hafeez', meaningBn: 'মহা সংরক্ষণকারী', explanationBn: 'যিনি আসমান-জমিন ও বান্দার প্রতিটি আমল সংরক্ষণ করেন।' },
  { id: 39, arabic: 'المُقِيتُ', transliterationBn: 'আল-মুক্বীত', transliterationEn: 'Al-Muqeet', meaningBn: 'শক্তি ও আহার জোগাড়কারী', explanationBn: 'যিনি সমস্ত সৃষ্টির টিকে থাকার শক্তি জোগান।' },
  { id: 40, arabic: 'الحَسِيبُ', transliterationBn: 'আল-হাসীব', transliterationEn: 'Al-Haseeb', meaningBn: 'হিসাব গ্রহণকারী ও যথেষ্টকারী', explanationBn: 'বান্দার সব প্রয়োজনে তিনিই একমাত্র যথেষ্ট।' },
  { id: 41, arabic: 'الجَلِيلُ', transliterationBn: 'আল-জালীল', transliterationEn: 'Al-Jaleel', meaningBn: 'প্রতাপশালী ও মহিমাময়', explanationBn: 'যাঁর সমস্ত গুণাবলী পরম সৌন্দর্য ও সম্মানে ভরপুর।' },
  { id: 42, arabic: 'الكَرِيمُ', transliterationBn: 'আল-কারীম', transliterationEn: 'Al-Kareem', meaningBn: 'পরম দাতা ও সম্মানিত', explanationBn: 'যিনি অগণিত অনুগ্রহ বিনা হিসেবে দান করেন।' },
  { id: 43, arabic: 'الرَّقِيبُ', transliterationBn: 'আর-রাক্বীব', transliterationEn: 'Ar-Raqeeb', meaningBn: 'সজাগ দৃষ্টিদানকারী ও পর্যবেক্ষক', explanationBn: 'যাঁর দৃষ্টি থেকে একটি মুহূর্তের জন্যও কিছু হারায় না।' },
  { id: 44, arabic: 'المُجِيبُ', transliterationBn: 'আল-মুজীব', transliterationEn: 'Al-Mujeeb', meaningBn: 'প্রার্থনায় সাড়া দানকারী', explanationBn: 'যিনি অভাবগ্রস্ত ও আহ্বানকারী বান্দার ডাকে সাড়া দেন।' },
  { id: 45, arabic: 'الوَاسِعُ', transliterationBn: 'আল-ওয়াসি\'', transliterationEn: 'Al-Waasi\'', meaningBn: 'অসীম প্রাচুর্যময় ও প্রশস্ত', explanationBn: 'যাঁর রহমত ও জ্ঞান অনন্ত অসীম।' },
  { id: 46, arabic: 'الحَكِيمُ', transliterationBn: 'আল-হাকীম', transliterationEn: 'Al-Hakeem', meaningBn: 'মহাপ্রজ্ঞাময়', explanationBn: 'যাঁর প্রতিটি কাজের পেছনে নিখুঁত হিকমত ও তাৎপর্য বিদ্যমান।' },
  { id: 47, arabic: 'الوَدُودُ', transliterationBn: 'আল-ওয়াদূদ', transliterationEn: 'Al-Wadood', meaningBn: 'পরম প্রেমময় ও স্নেহশীল', explanationBn: 'যিনি তাঁর আনুগত্যশীল বান্দাদের গভীর ভালোবেসে থাকেন।' },
  { id: 48, arabic: 'المَجِيدُ', transliterationBn: 'আল-মাজীদ', transliterationEn: 'Al-Majeed', meaningBn: 'মহিমান্বিত ও প্রশংসনীয়', explanationBn: 'যাঁর শ্রেষ্ঠত্ব ও মর্যাদা অতুলনীয়।' },
  { id: 49, arabic: 'البَاعِثُ', transliterationBn: 'আল-বা\'ইস', transliterationEn: 'Al-Baa\'ith', meaningBn: 'পুনরুত্থানকারী ও নবী প্রেরণকারী', explanationBn: 'যিনি মৃত্যুর পর কিয়ামতের দিন সবাইকে পুনরুজ্জীবিত করবেন।' },
  { id: 50, arabic: 'الشَّهِيدُ', transliterationBn: 'আশ-শাহীদ', transliterationEn: 'Ash-Shaheed', meaningBn: 'প্রত্যক্ষদর্শী ও সাক্ষী', explanationBn: 'যিনি সব ঘটনার সরাসরি প্রত্যক্ষদর্শী।' },
  { id: 51, arabic: 'الحَقُّ', transliterationBn: 'আল-হাক্বক্ব', transliterationEn: 'Al-Haqq', meaningBn: 'চিরন্তন সত্য', explanationBn: 'যাঁর অস্তিত্ব ও ওয়াদা চিরন্তন সত্য ও অপরিবর্তনীয়।' },
  { id: 52, arabic: 'الوَكِيلُ', transliterationBn: 'আল-ওয়াকীল', transliterationEn: 'Al-Wakeel', meaningBn: 'পরম ভরসা ও দায়িত্ব গ্রহণকারী', explanationBn: 'যাঁর ওপর সম্পূর্ণ ভরসা করা যায়।' },
  { id: 53, arabic: 'القَوِيُّ', transliterationBn: 'আল-ক্ববীয়্য', transliterationEn: 'Al-Qawiyy', meaningBn: 'মহা শক্তিমান', explanationBn: 'যাঁর শক্তিতে কখনো কোনো ক্লান্তি আসে না।' },
  { id: 54, arabic: 'المَتِينُ', transliterationBn: 'আল-মাতীন', transliterationEn: 'Al-Mateen', meaningBn: 'সুদৃঢ় ও অনমনীয়', explanationBn: 'যাঁর শক্তিমত্তা চিরস্থায়ী ও অবিচল।' },
  { id: 55, arabic: 'الوَلِيُّ', transliterationBn: 'আল-ওয়ালী', transliterationEn: 'Al-Waliyy', meaningBn: 'অভিভাবক ও বন্ধু', explanationBn: 'যিনি মুমিন বান্দাদের একান্ত সাহায্যকারী ও হিতাকাঙ্ক্ষী।' },
  { id: 56, arabic: 'الحَمِيدُ', transliterationBn: 'আল-হামীদ', transliterationEn: 'Al-Hameed', meaningBn: 'প্রশংসার যোগ্য', explanationBn: 'যাঁর প্রতিটি গুণ ও কাজ প্রশংসাযোগ্য।' },
  { id: 57, arabic: 'المُحْصِي', transliterationBn: 'আল-মুহসী', transliterationEn: 'Al-Muhsee', meaningBn: 'হিসাব সংরক্ষণকারী', explanationBn: 'যিনি সৃষ্টির প্রতিটি বালুকণা ও সেকেন্ডের নির্ভুল হিসাব রাখেন।' },
  { id: 58, arabic: 'المُبْدِئُ', transliterationBn: 'আল-মুবদি\'', transliterationEn: 'Al-Mubdi\'', meaningBn: 'প্রথম সৃষ্টিকারী', explanationBn: 'যিনি কোনো উপাদান ছাড়াই সবকিছুর সূচনা করেছেন।' },
  { id: 59, arabic: 'المُعِيدُ', transliterationBn: 'আল-মু\'ঈদ', transliterationEn: 'Al-Mu\'eed', meaningBn: 'পুনরায় সৃষ্টিকারী', explanationBn: 'যিনি ধ্বংসের পর পুনরায় সৃষ্টিকে ফিরিয়ে আনবেন।' },
  { id: 60, arabic: 'المُحْيِي', transliterationBn: 'আল-মুহ্য়ী', transliterationEn: 'Al-Muhyee', meaningBn: 'জীবনদাতা', explanationBn: 'যিনি প্রাণহীন বস্তুর মধ্যে প্রাণের সঞ্চার করেন।' },
  { id: 61, arabic: 'المُمِيتُ', transliterationBn: 'আল-মুমীত', transliterationEn: 'Al-Mumeet', meaningBn: 'মৃত্যুদাতা', explanationBn: 'যিনি সমস্ত জীবিত বস্তুর জীবনাবসান ঘটান।' },
  { id: 62, arabic: 'الحَيُّ', transliterationBn: 'আল-হাইয়্য', transliterationEn: 'Al-Hayy', meaningBn: 'চিরঞ্জীব', explanationBn: 'যাঁর কোনো শুরু বা শেষ নেই, যিনি চিরকাল জীবিত।' },
  { id: 63, arabic: 'القَيُّومُ', transliterationBn: 'আল-ক্বাইয়্যূম', transliterationEn: 'Al-Qayyoom', meaningBn: 'সবকিছুর ধারক ও পরিচালক', explanationBn: 'যিনি সমগ্র সৃষ্টিকে তাঁর নিজস্ব শক্তিতে টিকিয়ে রেখেছেন।' },
  { id: 64, arabic: 'الوَاجِدُ', transliterationBn: 'আল-ওয়াজিদ', transliterationEn: 'Al-Waajid', meaningBn: 'সন্ধানকারী ও অভাবহীন', explanationBn: 'যিনি যা চান তাই পান, যাঁর কোনো অভাব নেই।' },
  { id: 65, arabic: 'المَاجِدُ', transliterationBn: 'আল-মাজিদ', transliterationEn: 'Al-Maajid', meaningBn: 'মর্যাদাবান ও মহিমান্বিত', explanationBn: 'যাঁর সম্মান অসীম ও সুমহান।' },
  { id: 66, arabic: 'الوَاحِدُ', transliterationBn: 'আল-ওয়াহিদ', transliterationEn: 'Al-Waahid', meaningBn: 'এক ও অদ্বিতীয়', explanationBn: 'যাঁর সমকক্ষ বা অংশীদার কেউ নেই।' },
  { id: 67, arabic: 'الأَحَدُ', transliterationBn: 'আল-আহাদ', transliterationEn: 'Al-Ahad', meaningBn: 'একক সত্তা', explanationBn: 'যিনি বিভক্ত বা তুলনাযোগ্য নন।' },
  { id: 68, arabic: 'الصَّمَدُ', transliterationBn: 'আস-সামাদ', transliterationEn: 'As-Samad', meaningBn: 'অমুখাপেক্ষী ও পরনির্ভরতাহীন', explanationBn: 'সবাই যাঁর মুখাপেক্ষী, কিন্তু তিনি কারো মুখাপেক্ষী নন।' },
  { id: 69, arabic: 'القَادِرُ', transliterationBn: 'আল-ক্বদির', transliterationEn: 'Al-Qaadir', meaningBn: 'সর্বশক্তিমান', explanationBn: 'যিনি যেকোনো কিছু করতে সক্ষম।' },
  { id: 70, arabic: 'المُقْتَدِرُ', transliterationBn: 'আল-মুক্বতাদির', transliterationEn: 'Al-Muqtadir', meaningBn: 'প্রভাবশালী ক্ষমতাধর', explanationBn: 'যাঁর শক্তির সামনে কোনো প্রতিকূলতা টিকতে পারে না।' },
  { id: 71, arabic: 'المُقَدِّمُ', transliterationBn: 'আল-মুকাদ্দিম', transliterationEn: 'Al-Muqaddim', meaningBn: 'অগ্রবর্তীকারী', explanationBn: 'যিনি যাকে চান এগিয়ে নেন।' },
  { id: 72, arabic: 'المُؤَخِّرُ', transliterationBn: 'আল-মুআখ্খির', transliterationEn: 'Al-Mu\'akhkhir', meaningBn: 'পশ্চাদবর্তীকারী', explanationBn: 'যিনি নিজ হিকমতে যাকে চান পিছিয়ে দেন।' },
  { id: 73, arabic: 'الأَوَّلُ', transliterationBn: 'আল-আউয়াল', transliterationEn: 'Al-Awwal', meaningBn: 'সর্বপ্রথম', explanationBn: 'সবকিছুর সৃষ্টির পূর্বেও যিনি ছিলেন।' },
  { id: 74, arabic: 'الآخِرُ', transliterationBn: 'আল-আখির', transliterationEn: 'Al-Aakhir', meaningBn: 'সর্বশেষ', explanationBn: 'সবকিছু ধ্বংস হওয়ার পরও যিনি চিরকাল থাকবেন।' },
  { id: 75, arabic: 'الظَّاهِرُ', transliterationBn: 'আয-যাহির', transliterationEn: 'Az-Zaahir', meaningBn: 'প্রকাশ্য', explanationBn: 'যাঁর কুদরত ও নিদর্শন স্পষ্ট দৃশ্যমান।' },
  { id: 76, arabic: 'البَاطِنُ', transliterationBn: 'আল-বাতিন', transliterationEn: 'Al-Baatin', meaningBn: 'গুপ্ত ও অন্তর্যামী', explanationBn: 'যিনি চর্মচক্ষুর অন্তরালে অসীম সূক্ষ্ম সত্তা।' },
  { id: 77, arabic: 'الوَالِي', transliterationBn: 'আল-ওয়ালী', transliterationEn: 'Al-Waali', meaningBn: 'প্রশাসক ও সার্বিক পরিচালক', explanationBn: 'যিনি বিশ্বজগতের প্রতিটি ব্যবস্থা পরিচালনা করেন।' },
  { id: 78, arabic: 'المُتَعَالِي', transliterationBn: 'আল-মুতা\'আলী', transliterationEn: 'Al-Muta\'aali', meaningBn: 'সুউচ্চ ও শ্রেষ্ঠ', explanationBn: 'যিনি সৃষ্টির প্রতিটি ধারণার ঊর্ধ্বে।' },
  { id: 79, arabic: 'البَرُّ', transliterationBn: 'আল-বার্র', transliterationEn: 'Al-Barr', meaningBn: 'পরম উপকারী ও কল্যাণময়', explanationBn: 'যাঁর দানে সৃষ্টি সর্বদা সিক্ত ও ধন্য।' },
  { id: 80, arabic: 'التَّوَّابُ', transliterationBn: 'আত-তাওয়াব', transliterationEn: 'At-Tawwaab', meaningBn: 'তওবা গ্রহণকারী', explanationBn: 'যিনি অনুতপ্ত বান্দার ক্ষমা চেয়ে ফেরার আকুলতায় সাড়া দেন।' },
  { id: 81, arabic: 'المُنْتَقِمُ', transliterationBn: 'আল-মুনতাক্বিম', transliterationEn: 'Al-Muntaqim', meaningBn: 'প্রতিশোধ গ্রহণকারী', explanationBn: 'যিনি অহংকারী অত্যাচারীদের উপযুক্ত শাস্তি দেন।' },
  { id: 82, arabic: 'العَفُوُّ', transliterationBn: 'আল-আফুউ', transliterationEn: 'Al-\'Afuww', meaningBn: 'মার্জনাকারী', explanationBn: 'যিনি বান্দার গুনাহের চিহ্ন পর্যন্ত ক্ষমা করে মুছে দেন।' },
  { id: 83, arabic: 'الرَّؤُوفُ', transliterationBn: 'আর-রাউফ', transliterationEn: 'Ar-Ra\'oof', meaningBn: 'স্নেহশীল ও কোমল হৃদয়', explanationBn: 'যাঁর দয়া ও মায়া অপার।' },
  { id: 84, arabic: 'مَالِكُ المُلْكِ', transliterationBn: 'মালিকুল মুলক', transliterationEn: 'Maalik-ul-Mulk', meaningBn: 'সার্বভৌম সাম্রাজ্যের একমাত্র অধিপতি', explanationBn: 'সমস্ত রাজত্বের চিরস্থায়ী মালিক।' },
  { id: 85, arabic: 'ذُو الجَلَالِ وَالإِكْرَامِ', transliterationBn: 'যুল জালালি ওয়াল ইকরাম', transliterationEn: 'Dhul-Jalaali wal-Ikraam', meaningBn: 'মহিমান্বিত ও পরম মর্যাদার অধিকারী', explanationBn: 'যিনি ভয় ও ভালোবাসার একমাত্র দাবিদার।' },
  { id: 86, arabic: 'المُقْسِطُ', transliterationBn: 'আল-মুক্বসিত', transliterationEn: 'Al-Muqsit', meaningBn: 'সুবিচারক', explanationBn: 'যিনি পূর্ণ সামঞ্জস্য ও সুবিচার নিশ্চিত করেন।' },
  { id: 87, arabic: 'الجَامِعُ', transliterationBn: 'আল-জামি\'', transliterationEn: 'Al-Jaami\'', meaningBn: 'একত্রকারী', explanationBn: 'যিনি কিয়ামতের দিন সমগ্র মানবজাতিকে সমবেত করবেন।' },
  { id: 88, arabic: 'الغَنِيُّ', transliterationBn: 'আল-গানী', transliterationEn: 'Al-Ghaniyy', meaningBn: 'ধনাঢ্য ও অমুখাপেক্ষী', explanationBn: 'যাঁর কোনো কিছুর প্রয়োজন নেই, তিনিই স্বয়ংসম্পূর্ণ।' },
  { id: 89, arabic: 'المُغْنِي', transliterationBn: 'আল-মুগনী', transliterationEn: 'Al-Mughni', meaningBn: 'ধনীকারী ও অভাবমোচনকারী', explanationBn: 'যিনি যাকে চান প্রাচুর্য দান করেন।' },
  { id: 90, arabic: 'المَانِعُ', transliterationBn: 'আল-মানি\'', transliterationEn: 'Al-Maani\'', meaningBn: 'প্রতিরোধকারী ও নিবৃত্তকারী', explanationBn: 'যাঁর অনুমতি ছাড়া কেউ কোনো কিছু বাধা দিতে বা গ্রহণ করতে পারে না।' },
  { id: 91, arabic: 'الضَّارُّ', transliterationBn: 'আদ-দার্র', transliterationEn: 'Ad-Daarr', meaningBn: 'ক্ষতিসাধনকারী', explanationBn: 'যিনি তাঁর অবাধ্যদের ওপর বিপদ পতিত করার ক্ষমতা রাখেন।' },
  { id: 92, arabic: 'النَّافِعُ', transliterationBn: 'আন-নাফি\'', transliterationEn: 'An-Naafi\'', meaningBn: 'উপকারী ও কল্যাণদাতা', explanationBn: 'যাঁর হাতেই সমস্ত মানুষের উন্নতি ও কল্যাণ।' },
  { id: 93, arabic: 'النُّورُ', transliterationBn: 'আন-নূর', transliterationEn: 'An-Noor', meaningBn: 'জ্যোতি ও আলোকময়', explanationBn: 'যিনি আকাশ ও পৃথিবীর আলোকবর্তিকা।' },
  { id: 94, arabic: 'الهَادِي', transliterationBn: 'আল-হাদী', transliterationEn: 'Al-Haadi', meaningBn: 'পথপ্রদর্শক', explanationBn: 'যিনি সত্য ও ন্যায়ের সরল পথে পরিচালিত করেন।' },
  { id: 95, arabic: 'البَدِيعُ', transliterationBn: 'আল-বাদী\'', transliterationEn: 'Al-Badee\'', meaningBn: 'অনুপম ও অপূর্ব স্রষ্টা', explanationBn: 'যিনি তুলনাহীন অভিনব সৃষ্টিজগৎ উপহার দিয়েছেন।' },
  { id: 96, arabic: 'البَاقِي', transliterationBn: 'আল-বাক্বী', transliterationEn: 'Al-Baaqi', meaningBn: 'চিরস্থায়ী ও অবিনশ্বর', explanationBn: 'যাঁর কখনোই ধ্বংস বা ক্ষয় নেই।' },
  { id: 97, arabic: 'الوَاثِثُ', transliterationBn: 'আল-ওয়ারিস', transliterationEn: 'Al-Waarith', meaningBn: 'চূড়ান্ত উত্তরাধিকারী', explanationBn: 'সবকিছুর বিলীন হওয়ার পরও যিনি একমাত্র অবশিষ্ট থাকবেন।' },
  { id: 98, arabic: 'الرَّشِيدُ', transliterationBn: 'আর-রাশীদ', transliterationEn: 'Ar-Rasheed', meaningBn: 'সঠিক পথের নির্দেশক ও বিচক্ষণ', explanationBn: 'যাঁর পরিকল্পনা ও পরিচালনা নির্ভুল।' },
  { id: 99, arabic: 'الصَّبُورُ', transliterationBn: 'আস-সাবূর', transliterationEn: 'As-Saboor', meaningBn: 'মহাধৈর্যশীল', explanationBn: 'যিনি অবাধ্যদের শাস্তিদানে দ্রুততা করেন না, পরম ধৈর্যশীল।' }
];

interface AsmaulHusnaViewProps {
  setActiveTab: (tab: string) => void;
}

export const AsmaulHusnaView: React.FC<AsmaulHusnaViewProps> = ({ setActiveTab }) => {
  const { language, activeThemeConfig } = useApp();
  const t = ASMA_LOCALES[language] || ASMA_LOCALES.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'memorized' | 'remaining'>('all');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [playingType, setPlayingType] = useState<'arabic' | 'meaning' | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [memorizedIds, setMemorizedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('asmaul_husna_memorized');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('asmaul_husna_memorized', JSON.stringify(memorizedIds));
  }, [memorizedIds]);

  const toggleMemorized = (id: number) => {
    if ('vibrate' in navigator) navigator.vibrate(20);
    setMemorizedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSpeak = (name: AllahName, type: 'arabic' | 'meaning' = 'arabic') => {
    if (playingId === name.id && playingType === type) {
      stopAllAudio();
      setPlayingId(null);
      setPlayingType(null);
      return;
    }

    setPlayingId(name.id);
    setPlayingType(type);

    const textToSpeak = type === 'arabic'
      ? name.arabic
      : `${name.transliterationBn}। অর্থ: ${name.meaningBn}`;

    const lang = type === 'arabic'
      ? 'ar'
      : (language === 'bn' ? 'bn' : (language === 'hi' ? 'hi' : 'en'));

    playAudioText(textToSpeak, lang, {
      onEnd: () => {
        setPlayingId(null);
        setPlayingType(null);
      },
      onError: () => {
        setPlayingId(null);
        setPlayingType(null);
      }
    });
  };

  const handleCopy = (name: AllahName) => {
    const text = `${name.arabic} (${name.transliterationBn})\nঅর্থ: ${name.meaningBn}\nতাৎপর্য: ${name.explanationBn}\n\n(আসমাউল হুসনা - আল-কুরআনুল কারীম)`;
    navigator.clipboard.writeText(text);
    setCopiedId(name.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNames = ALLAH_99_NAMES.filter(item => {
    const isMemorized = memorizedIds.includes(item.id);
    if (filterMode === 'memorized' && !isMemorized) return false;
    if (filterMode === 'remaining' && isMemorized) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      item.transliterationBn.toLowerCase().includes(q) ||
      item.meaningBn.toLowerCase().includes(q) ||
      item.transliterationEn.toLowerCase().includes(q) ||
      item.arabic.includes(q) ||
      item.explanationBn.toLowerCase().includes(q)
    );
  });

  const memorizedCount = memorizedIds.length;
  const memorizedPercent = Math.round((memorizedCount / 99) * 100);

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
              {t.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {t.subtitle}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-black rounded-full border border-amber-200/50">
          {t.badge}
        </span>
      </div>

      {/* Hero Banner with Hadith & Progress */}
      <div 
        className="rounded-[2.2rem] p-6 text-white shadow-xl relative overflow-hidden space-y-4"
        style={{
          background: `linear-gradient(135deg, ${activeThemeConfig.primaryColor}, #b45309)`
        }}
      >
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
              {t.hadithBadge}
            </span>
          </div>
          <h3 className="text-base font-black leading-snug">
            {t.hadithText}
          </h3>
          <p className="text-[11px] text-white/80 font-medium">
            {t.hadithRef}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="pt-2 border-t border-white/10 relative z-10 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-amber-200">{t.progressText}: {memorizedCount}/99</span>
            <span className="text-white font-black">{memorizedPercent}%</span>
          </div>
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${memorizedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            {t.clearText}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: `${t.allTab} (99)` },
          { id: 'memorized', label: `${t.memorizedTab} (${memorizedCount})` },
          { id: 'remaining', label: `${t.remainingTab} (${99 - memorizedCount})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterMode(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filterMode === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 99 Names Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredNames.map((name) => {
          const isMemorized = memorizedIds.includes(name.id);

          return (
            <motion.div
              key={name.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-[2rem] border transition-all space-y-3 relative group ${
                isMemorized
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/80 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/80 hover:shadow-md'
              }`}
            >
              {/* Card Header: Number & Actions */}
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black flex items-center justify-center">
                  {name.id}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeak(name, 'arabic')}
                    title="আরবি উচ্চারণ শুনুন"
                    className={`p-2 rounded-xl transition-all ${
                      playingId === name.id && playingType === 'arabic'
                        ? 'bg-emerald-600 text-white animate-pulse' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-emerald-600'
                    }`}
                  >
                    <Volume2 size={15} />
                  </button>

                  <button
                    onClick={() => handleSpeak(name, 'meaning')}
                    title="বাংলা অর্থ শুনুন"
                    className={`p-2 rounded-xl transition-all ${
                      playingId === name.id && playingType === 'meaning'
                        ? 'bg-amber-600 text-white animate-pulse' 
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/60 dark:border-amber-800/40'
                    }`}
                  >
                    <Languages size={15} />
                  </button>

                  <button
                    onClick={() => handleCopy(name)}
                    title={t.copyTooltip}
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-emerald-600 rounded-xl transition-colors"
                  >
                    {copiedId === name.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  </button>

                  <button
                    onClick={() => toggleMemorized(name.id)}
                    title={isMemorized ? t.memorizedDone : t.markMemorized}
                    className={`p-2 rounded-xl transition-all ${
                      isMemorized
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-emerald-600'
                    }`}
                  >
                    {isMemorized ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                </div>
              </div>

              {/* Calligraphy / Arabic Name */}
              <div className="text-center py-2 bg-slate-50/70 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/70">
                <p className="font-arabic text-3xl font-black text-amber-700 dark:text-amber-300 tracking-wide" dir="rtl">
                  {name.arabic}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                  {name.transliterationEn}
                </p>
              </div>

              {/* Bengali Name & Meaning */}
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100">
                  {language === 'bn' ? name.transliterationBn : name.transliterationEn}
                </h4>
                <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                  {t.meaningPrefix}{name.meaningBn}
                </p>
              </div>

              {/* Explanation */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {name.explanationBn}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
