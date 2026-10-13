import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Sparkles, BookOpen, CheckCircle2, Circle, 
  Clock, Heart, Volume2, RefreshCw, ChevronRight, Award, 
  ShieldCheck, Sun, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLanguage } from '../types';

interface FridaySunnahItem {
  id: string;
  titles: Record<AppLanguage, string>;
  hadiths: Record<AppLanguage, string>;
  rewards: Record<AppLanguage, string>;
}

const FRIDAY_SUNNAHS: FridaySunnahItem[] = [
  {
    id: 'ghusl',
    titles: {
      bn: 'উত্তমরূপে জুমার গোসল করা',
      en: 'Performing Ghusl (Full Bath) on Friday',
      hi: 'जुमे के दिन उत्तम रीति से ग़ुस्ल (स्नान) करना',
      es: 'Realizar el Gusl (baño completo) el viernes',
      ar: 'الاغتسال يوم الجمعة',
      de: 'Das Freitagsbad (Ghusl) vollziehen'
    },
    hadiths: {
      bn: 'রাসুলুল্লাহ (ﷺ) বলেছেন: "জুমার দিনে গোসল করা প্রতিটি প্রাপ্তবয়স্ক ব্যক্তির ওপর ওয়াজিব সদৃশ আবশ্যক।" (সহীহ বুখারী: ৮৭৭)',
      en: 'The Prophet (ﷺ) said: "Taking a bath on Friday is essential for every adult person." (Sahih Bukhari: 877)',
      hi: 'रसूलुल्लाह (ﷺ) ने फ़रमाया: "जुमे के दिन ग़ुस्ल करना हर बालिग़ पर लाज़िम है।" (सहीह बुख़ारी: 877)',
      es: 'El Profeta (ﷺ) dijo: "Bañarse el viernes es un deber para todo adulto." (Sahih Al-Bujari: 877)',
      ar: 'قال رسول الله ﷺ: "غُسْلُ يَوْمِ الجُمُعَةِ وَاجِبٌ عَلَى كُلِّ مُحْتَلِمٍ" (صحيح البخاري: 877)',
      de: 'Der Prophet (ﷺ) sagte: "Das Freitagsbad ist für jeden Erwachsenen Pflicht." (Sahih Al-Bukhari: 877)'
    },
    rewards: {
      bn: 'সপ্তাহের সগীরা গুনাহসমূহের কাফফারা হয়ে যায়।',
      en: 'Expiation for minor sins of the past week.',
      hi: 'सप्ताह के छोटे गुनाहों का कफ़्फ़ारा हो जाता है।',
      es: 'Expiación de los pecados menores de la semana.',
      ar: 'كفارة لصغائر ذنوب الأسبوع.',
      de: 'Sühne für die kleinen Sünden der vergangenen Woche.'
    }
  },
  {
    id: 'miswak',
    titles: {
      bn: 'মিসওয়াক করা বা দাঁত পরিষ্কার করা',
      en: 'Using Miswak and Cleaning Teeth',
      hi: 'मिस्वाक करना या दाँतों की सफ़ाई करना',
      es: 'Usar el Miswak y limpiar los dientes',
      ar: 'استعمال السواك وتطهير الفم',
      de: 'Den Siwak benutzen und Zähne reinigen'
    },
    hadiths: {
      bn: 'রাসুলুল্লাহ (ﷺ) জুমার দিন মিসওয়াক করার প্রতি বিশেষ তাগিদ দিয়েছেন। (সহীহ বুখারী: ৮৮৭)',
      en: 'The Messenger of Allah (ﷺ) urged using the Siwak on Friday. (Sahih Bukhari: 887)',
      hi: 'रसूलुल्लाह (ﷺ) ने जुमे के दिन मिस्वाक करने पर विशेष ज़ोर दिया। (सहीह बुख़ारी: 887)',
      es: 'El Mensajero de Alá (ﷺ) enfatizó el uso del miswak los viernes. (Sahih Al-Bujari: 887)',
      ar: 'حثّ رسول الله ﷺ على استعمال السواك يوم الجمعة. (صحيح البخاري: 887)',
      de: 'Der Gesandte Allahs (ﷺ) betonte die Benutzung des Siwak am Freitag. (Sahih Al-Bukhari: 887)'
    },
    rewards: {
      bn: 'মুখের পবিত্রতা ও আল্লাহর সন্তুষ্টি অর্জন।',
      en: 'Purification of mouth and pleasing to Allah.',
      hi: 'मुख की पवित्रता और अल्लाह की रज़ा हासिल होती है।',
      es: 'Purificación de la boca y complacencia de Alá.',
      ar: 'مطهرة للفم مرضاة للرب.',
      de: 'Reinigung des Mundes und Wohlgefallen Allahs.'
    }
  },
  {
    id: 'attar',
    titles: {
      bn: 'সুগন্ধি বা আতর ও তেল ব্যবহার করা',
      en: 'Applying Perfume (Attar) and Grooming Hair',
      hi: 'इत्र या ख़ुशबू और तेल लगाना',
      es: 'Aplicar perfume (Attar) y acicalarse',
      ar: 'التطيب واستعمال الطيب والدهن',
      de: 'Parfüm (Attar) auftragen und Haare pflegen'
    },
    hadiths: {
      bn: 'রাসুলুল্লাহ (ﷺ) বলেছেন: "যদি ঘরে সুগন্ধি থাকে তবে যেন তা স্পর্শ করে।" (সহীহ বুখারী: ৮৮০)',
      en: 'The Prophet (ﷺ) said: "And touch some perfume if available at home." (Sahih Bukhari: 880)',
      hi: 'रसूलुल्लाह (ﷺ) ने फ़रमाया: "यदि घर में ख़ुशबू हो तो उसे स्पर्श करे।" (सहीह बुख़ारी: 880)',
      es: 'El Profeta (ﷺ) dijo: "Y que se aplique perfume si lo tiene en casa." (Sahih Al-Bujari: 880)',
      ar: 'قال رسول الله ﷺ: "وَيَمَسَّ مِنْ طِيبٍ إِنْ كَانَ عِنْدَهُ" (صحيح البخاري: 880)',
      de: 'Der Prophet (ﷺ) sagte: "Und sich mit Wohlgeruch parfümieren, wenn vorhanden." (Sahih Al-Bukhari: 880)'
    },
    rewards: {
      bn: 'ফেরেশতাদের প্রিয় ও মসজিদের আদব রক্ষা।',
      en: 'Beloved to angels and maintaining mosque etiquette.',
      hi: 'फ़रिश्तों का प्रिय और मस्जिद के आदाब की रक्षा।',
      es: 'Amado por los ángeles y etiqueta de la mezquita.',
      ar: 'محبة الملائكة وحسن أدب المسجد.',
      de: 'Von den Engeln geliebt und gute Moschee-Etikette.'
    }
  },
  {
    id: 'clean_clothes',
    titles: {
      bn: 'উত্তম ও পরিষ্কার-পরিচ্ছন্ন (সাদা) পোশাক পরিধান',
      en: 'Wearing Clean & Best (White) Clothes',
      hi: 'सर्वोत्तम और साफ़-सुथरे (सफ़ेद) कपड़े पहनना',
      es: 'Vestir ropa limpia y excelente (blanca)',
      ar: 'لبس أحسن الثياب وأنظفها',
      de: 'Die besten und saubersten (weißen) Kleider anziehen'
    },
    hadiths: {
      bn: 'নবীজী (ﷺ) জুমার জন্য সাধারণ দিনের পোশাক ছাড়াও বিশেষ পোশাক পছন্দ করতেন। (আবু দাউদ: ১০৭৮)',
      en: 'The Prophet (ﷺ) kept a special pair of garments for Friday besides daily clothes. (Abu Dawud: 1078)',
      hi: 'नबी (ﷺ) जुमे के लिए सामान्य दिनों के अतिरिक्त विशेष कपड़े पसंद फ़रमाते थे। (अबू दाऊद: 1078)',
      es: 'El Profeta (ﷺ) reservaba vestiduras especiales para el viernes. (Abu Dawud: 1078)',
      ar: 'كان للنبي ﷺ ثوبان خاصان للجمعة سوى ثياب مهنته. (أبو داود: 1078)',
      de: 'Der Prophet (ﷺ) besaß besondere Kleidung für das Freitagsgebet. (Abu Dawud: 1078)'
    },
    rewards: {
      bn: 'জুমার দিনের সৌন্দর্য ও মর্যাদা বৃদ্ধি।',
      en: 'Enhances the dignity and beauty of Jummah.',
      hi: 'जुमे के दिन की शोभा और सम्मान में वृद्धि।',
      es: 'Realza la dignidad y belleza del Yumu\'ah.',
      ar: 'إظهار نعمة الله وشرف يوم الجمعة.',
      de: 'Erhöht die Würde und Schönheit des Freitags.'
    }
  },
  {
    id: 'nails',
    titles: {
      bn: 'নখ কাটা ও গোঁফ বা চুল পরিপাটি করা',
      en: 'Clipping Nails and Trimming Moustache',
      hi: 'नाखून काटना और मूंछें तरशवाना',
      es: 'Cortarse las uñas y recortarse el bigote',
      ar: 'قص الأظافر وتقليم الشارب',
      de: 'Nägel schneiden und Schnurrbart stutzen'
    },
    hadiths: {
      bn: 'রাসুলুল্লাহ (ﷺ) জুমার সালাতে যাওয়ার পূর্বে নখ ও গোঁফ ছাঁটতেন। (বায়হাকী)',
      en: 'The Prophet (ﷺ) used to clip his nails and trim his moustache before Friday prayer. (Bayhaqi)',
      hi: 'रसूलुल्लाह (ﷺ) जुमे की नमाज़ जाने से पहले नाखून और मूंछें तराशते थे। (बैहक़ी)',
      es: 'El Profeta (ﷺ) solía cortarse las uñas antes de la oración del viernes. (Bayhaqi)',
      ar: 'كان رسول الله ﷺ يقص أظافره ويأخذ من شاربه يوم الجمعة. (البيهقي)',
      de: 'Der Prophet (ﷺ) pflegte seine Nägel vor dem Freitagsgebet zu schneiden. (Bayhaqi)'
    },
    rewards: {
      bn: 'ফিতরাতের ওপর অটল থাকা ও পরিচ্ছন্নতা।',
      en: 'Adhering to natural purity (Fitrah).',
      hi: 'फ़ितरत पर क़ायम रहना और शुद्धता।',
      es: 'Seguir la pureza natural (Fitrah).',
      ar: 'اتباع سنن الفطرة والنظافة.',
      de: 'Befolgen der natürlichen Reinheit (Fitrah).'
    }
  },
  {
    id: 'early_mosque',
    titles: {
      bn: 'মসজিদে সকাল সকাল উপস্থিত হওয়া',
      en: 'Going to the Mosque Early',
      hi: 'मस्जिद में सुबह जल्दी उपस्थित होना',
      es: 'Llegar temprano a la mezquita',
      ar: 'التبكير إلى المسجد لصلاة الجمعة',
      de: 'Frühzeitig zur Moschee gehen'
    },
    hadiths: {
      bn: '"যে প্রথম প্রহরে গেল সে যেন একটি উট কুরবানি করল, দ্বিতীয় প্রহরে গেলে একটি গরু..." (সহীহ বুখারী: ৮৮১)',
      en: '"Whoever goes in the first hour is like one who offered a camel in sacrifice..." (Sahih Bukhari: 881)',
      hi: '"जो पहली घड़ी में गया मानो उसने ऊँट की क़ुरबानी की, दूसरी घड़ी में गाय..." (सहीह बुख़ारी: 881)',
      es: '"Quien va en la primera hora es como si hubiera sacrificado un camello..." (Sahih Al-Bujari: 881)',
      ar: '«مَنِ اغْتَسَلَ يَوْمَ الجُمُعَةِ غُسْلَ الجَنَابَةِ ثُمَّ رَاحَ، فَكَأَنَّمَا قَرَّبَ بَدَنَةً...» (صحيح البخاري: 881)',
      de: '"Wer in der ersten Stunde geht, ist wie einer, der ein Kamel opfert..." (Sahih Al-Bukhari: 881)'
    },
    rewards: {
      bn: 'উট বা গরু কুরবানি করার সমপরিমাণ অসীম সওয়াব।',
      en: 'Immense reward equivalent to sacrificing a camel.',
      hi: 'ऊँट या गाय की क़ुरबानी के बराबर असीम सवाब।',
      es: 'Inmensa recompensa equivalente a sacrificar un camello.',
      ar: 'أجر عظيم يعادل التصدق ببدنة أو بقرة.',
      de: 'Enorme Belohnung wie die Opferung eines Kamels.'
    }
  },
  {
    id: 'khutbah',
    titles: {
      bn: 'ইমামের খুতবা গভীর মনোযোগ দিয়ে শোনা ও চুপ থাকা',
      en: 'Listening Attentively to the Khutbah and Remaining Silent',
      hi: 'इमाम के ख़ुत्बे को ध्यानपूर्वक सुनना और चुप रहना',
      es: 'Escuchar atentamente la Jutba y permanecer en silencio',
      ar: 'الإنصات لخطبة الجمعة وتجنب اللغو',
      de: 'Der Freitagspredigt (Khutbah) aufmerksam und schweigend lauschen'
    },
    hadiths: {
      bn: 'খুতবার সময় সঙ্গীকে "চুপ কর" বললেও অনর্থক কাজ হিসেবে গণ্য হয়। (সহীহ বুখারী: ৯৩৪)',
      en: 'Telling your companion "Listen" during the Khutbah is deemed idle speech. (Sahih Bukhari: 934)',
      hi: 'ख़ुत्बे के दौरान साथी को "चुप रहो" कहना भी अनर्थक बात मानी जाती है। (सहीह बुख़ारी: 934)',
      es: 'Decir a tu compañero "guarda silencio" durante la Jutba anula la recompensa. (Sahih Al-Bujari: 934)',
      ar: 'إذا قلتَ لصاحبكَ يومَ الجمعةِ: أنصت، والإمامُ يخطبُ، فقد لغوتَ. (صحيح البخاري: 934)',
      de: 'Selbst das Sagen von "Sei still" während der Khutba gilt als unbedachte Rede. (Sahih Al-Bukhari: 934)'
    },
    rewards: {
      bn: 'জুমার পূর্ণাঙ্গ সওয়াব প্রাপ্তি নিশ্চিত হয়।',
      en: 'Guarantees the complete reward of Friday prayer.',
      hi: 'जुमे का पूर्ण सवाब मिलना सुनिश्चित होता है।',
      es: 'Garantiza la recompensa íntegra del rezo del viernes.',
      ar: 'ضمان الأجر الكامل لصلاة الجمعة.',
      de: 'Garantiert den vollständigen Lohn des Freitagsgebets.'
    }
  },
  {
    id: 'saat_ijabah',
    titles: {
      bn: 'আসর থেকে মাগরিবের মধ্যবর্তী সময়ে বেশি বেশি দু\'আ করা',
      en: 'Making Frequent Supplications between Asr and Maghrib',
      hi: 'अस्र और मग़रिब के बीच अधिक से अधिक दुआ करना',
      es: 'Suplicar intensamente entre Asr y Magrib (Hora de Aceptación)',
      ar: 'تحري ساعة الإجابة بين العصر والمغرب',
      de: 'Vermehrt Bittgebete sprechen zwischen Asr und Maghrib'
    },
    hadiths: {
      bn: '"জুমার দিনে এমন একটি মুহূর্ত আছে যাতে কোনো মুসলিম বান্দা আল্লাহর কাছে যা প্রার্থনা করে, তিনি তা দান করেন।" (সহীহ বুখারী: ৯৩৫)',
      en: '"There is a moment on Friday wherein if any Muslim asks Allah for good, He gives it to him." (Sahih Bukhari: 935)',
      hi: '"जुमे के दिन एक ऐसा क्षण है जिसमें कोई भी मुस्लिम जो भी भलाई माँगता है, अल्लाह उसे प्रदान करता है।" (सहीह बुख़ारी: 935)',
      es: '"Hay una hora el viernes en que cualquier petición que haga un musulmán a Alá, le será concedida." (Sahih Al-Bujari: 935)',
      ar: '«فِيهِ سَاعَةٌ لاَ يُوَافِقُهَا عَبْدٌ مُسْلِمٌ، وَهْوَ قَائِمٌ يُصَلِّي، يَسْأَلُ اللَّهَ تَعَالَى شَيْئًا إِلاَّ أَعْطَاهُ إِيَّاهُ» (صحيح البخاري: 935)',
      de: '"Am Freitag gibt es eine Stunde, in der Allah dem Muslim jede gute Bitte gewährt." (Sahih Al-Bukhari: 935)'
    },
    rewards: {
      bn: 'নিশ্চিত দু\'আ কবুলের পরম মাহেন্দ্রক্ষণ।',
      en: 'The golden moment of guaranteed answered prayers.',
      hi: 'दुआ क़बूलियत का स्वर्णिम अवसर।',
      es: 'El momento dorado de súplica aceptada.',
      ar: 'ساعة إجابة الدعاء المحققة.',
      de: 'Der goldene Moment der Gebetserhörung.'
    }
  }
];

const LOCALES: Record<AppLanguage, {
  headerTitle: string;
  headerSubtitle: string;
  todayFridayBadge: string;
  prepFridayBadge: string;
  sayyidulAyyam: string;
  heroQuote: string;
  heroSub: string;
  sunnahCompleted: string;
  daroodCount: string;
  kahfBadge: string;
  kahfTitle: string;
  kahfDesc: string;
  startKahfBtn: string;
  daroodSectionTitle: string;
  daroodHadith: string;
  daroodCountBtn: string;
  resetTooltip: string;
  resetSunnahs: string;
  checklistTitle: string;
  allDoneMsg: string;
}> = {
  bn: {
    headerTitle: 'জুমার বিশেষ আমল ও রিমাইন্ডার',
    headerSubtitle: 'সাপ্তাহিক ঈদের দিন • সাইয়্যিদুল আইয়্যাম',
    todayFridayBadge: '🕌 আজ পবিত্র জুমার দিন!',
    prepFridayBadge: 'জুমার প্রস্তুতি',
    sayyidulAyyam: 'সাইয়্যিদুল আইয়্যাম • দিনসমূহের সর্দার',
    heroQuote: '"দিনগুলোর মধ্যে শ্রেষ্ঠতম দিন হলো জুমার দিন..."',
    heroSub: 'এ দিনে হযরত আদম (আ.) সৃষ্টি হয়েছিলেন, এ দিনেই তাঁর তওবা কবুল হয়েছিল এবং এ দিনেই কিয়ামত সংঘটিত হবে।',
    sunnahCompleted: 'সুন্নাত সম্পন্ন',
    daroodCount: 'দরূদ শরিফ',
    kahfBadge: 'জুমার বিশেষ তিলাওয়াত • সূরা #১৮',
    kahfTitle: 'সূরা আল-কাহাফ (Surah Al-Kahf)',
    kahfDesc: '"যে ব্যক্তি জুমার দিনে সূরা আল-কাহাফ তিলাওয়াত করবে, তার জন্য দুই জুমার মধ্যবর্তী সময় নূর দ্বারা আলোকিত হবে এবং দাজ্জালের ফিতনা থেকে নিরাপদ থাকবে।"',
    startKahfBtn: 'সূরা আল-কাহাফ পড়তে শুরু করুন',
    daroodSectionTitle: 'জুমার দিনে দরূদ শরীফ পাঠের আমল',
    daroodHadith: 'রাসুলুল্লাহ (ﷺ) বলেছেন: "জুমার দিনে তোমরা আমার ওপর অধিক পরিমাণে দরূদ পাঠ করো; কারণ তোমাদের দরূদ আমার সামনে পেশ করা হয়।" (আবু দাউদ: ১০৪৭)',
    daroodCountBtn: 'দরূদ গণনা করুন (+১)',
    resetTooltip: 'রিসেট',
    resetSunnahs: 'সুন্নাত চেকলিস্ট রিসেট',
    checklistTitle: '৮টি জুমার সুন্নাত চেকলিস্ট',
    allDoneMsg: 'মাশাআল্লাহ! আপনি সকল সুন্নাত সম্পন্ন করেছেন।'
  },
  en: {
    headerTitle: 'Friday (Jummah) Special Hub',
    headerSubtitle: 'Weekly Day of Eid • Sayyidul Ayyam',
    todayFridayBadge: '🕌 Blessed Friday Today!',
    prepFridayBadge: 'Friday Preparation',
    sayyidulAyyam: 'Sayyidul Ayyam • Best of Days',
    heroQuote: '"The best day on which the sun has risen is Friday..."',
    heroSub: 'On it Adam was created, on it he was admitted to Paradise, and on it the Day of Judgment will occur.',
    sunnahCompleted: 'Sunnahs Completed',
    daroodCount: 'Salawat / Durood',
    kahfBadge: 'Special Jummah Recitation • Surah #18',
    kahfTitle: 'Surah Al-Kahf (The Cave)',
    kahfDesc: '"Whoever reads Surah Al-Kahf on Friday will have light shining between two Fridays and safety from the trial of Dajjal."',
    startKahfBtn: 'Start Reading Surah Al-Kahf',
    daroodSectionTitle: 'Sending Salawat (Durood) on the Prophet',
    daroodHadith: 'The Prophet (ﷺ) said: "Increase your blessings upon me on Friday, for your blessings are presented to me." (Abu Dawud: 1047)',
    daroodCountBtn: 'Count Durood (+1)',
    resetTooltip: 'Reset',
    resetSunnahs: 'Reset Sunnah Checklist',
    checklistTitle: '8 Friday Sunnah Practices',
    allDoneMsg: 'MashaAllah! You have completed all Friday Sunnahs.'
  },
  hi: {
    headerTitle: 'जुमा विशेष अमल और अनुस्मारक',
    headerSubtitle: 'साप्ताहिक ईद का दिन • सय्यिदुल अय्याम',
    todayFridayBadge: '🕌 आज पवित्र जुमा का दिन है!',
    prepFridayBadge: 'जुमे की तैयारी',
    sayyidulAyyam: 'सय्यिदुल अय्याम • दिनों का सरदार',
    heroQuote: '"दिनों में सबसे उत्तम दिन जुमा का दिन है..."',
    heroSub: 'इसी दिन हज़रत आदम (अ.) को पैदा किया गया, और इसी दिन क़ियामत क़ायम होगी।',
    sunnahCompleted: 'सुन्नतें पूर्ण',
    daroodCount: 'दुरूद शरीफ़',
    kahfBadge: 'जुमा की विशेष तिलावत • सूरह #18',
    kahfTitle: 'सूरह अल-कहफ़ (Surah Al-Kahf)',
    kahfDesc: '"जो व्यक्ति जुमे के दिन सूरह अल-कहफ़ पढ़ेगा, उसके लिए दो जुमों के बीच नूर चमकेगा और वह दज्जाल के फ़ितने से सुरक्षित रहेगा।"',
    startKahfBtn: 'सूरह अल-कहफ़ पढ़ना शुरू करें',
    daroodSectionTitle: 'जुमे के दिन दुरूद शरीफ़ पढ़ने का अमल',
    daroodHadith: 'रसूलुल्लाह (ﷺ) ने फ़रमाया: "जुमे के दिन मुझ पर अधिक दुरूद भेजा करो; क्योंकि तुम्हारा दुरूद मेरे सामने पेश किया जाता है।" (अबू दाऊद: 1047)',
    daroodCountBtn: 'दुरूद गिनें (+1)',
    resetTooltip: 'रीसेट',
    resetSunnahs: 'सुन्नत चेकलिस्ट रीसेट करें',
    checklistTitle: '8 जुमा सुन्नत चेकलिस्ट',
    allDoneMsg: 'माशाअल्लाह! आपने जुमे की सभी सुन्नतें पूरी कर ली हैं।'
  },
  es: {
    headerTitle: 'Centro Especial de Yumu\'ah (Viernes)',
    headerSubtitle: 'Día de Eid Semanal • Sayyidul Ayyam',
    todayFridayBadge: '🕌 ¡Bendito Viernes Hoy!',
    prepFridayBadge: 'Preparación de Viernes',
    sayyidulAyyam: 'Sayyidul Ayyam • El Mejor de los Días',
    heroQuote: '"El mejor día en el que sale el sol es el viernes..."',
    heroSub: 'En él Adán fue creado, en él entró al Paraíso, y en él ocurrirá el Día del Juicio.',
    sunnahCompleted: 'Sunnahs Completadas',
    daroodCount: 'Durood / Salawat',
    kahfBadge: 'Recitación Especial de Viernes • Sura #18',
    kahfTitle: 'Sura Al-Kahf (La Caverna)',
    kahfDesc: '"Quien lea la Sura Al-Kahf el viernes tendrá una luz que iluminará entre los dos viernes y protección contra el Dayyal."',
    startKahfBtn: 'Comenzar a leer Sura Al-Kahf',
    daroodSectionTitle: 'Enviar Bendiciones (Salawat) al Profeta',
    daroodHadith: 'El Profeta (ﷺ) dijo: "Aumentad las bendiciones sobre mí los viernes, pues me son presentadas." (Abu Dawud: 1047)',
    daroodCountBtn: 'Contar Salawat (+1)',
    resetTooltip: 'Reiniciar',
    resetSunnahs: 'Reiniciar Lista Sunnah',
    checklistTitle: '8 Prácticas Sunnah del Viernes',
    allDoneMsg: '¡MashaAlá! Has completado todas las Sunnahs del viernes.'
  },
  ar: {
    headerTitle: 'واحة الجمعة المباركة',
    headerSubtitle: 'عيد الأسبوع • سيد الأيام',
    todayFridayBadge: '🕌 اليوم جمعة مباركة!',
    prepFridayBadge: 'الاستعداد للجمعة',
    sayyidulAyyam: 'سيد الأيام • خير يوم طلعت عليه الشمس',
    heroQuote: '«خيرُ يومٍ طلعت فيهِ الشَّمسُ يومُ الجمعةِ...»',
    heroSub: 'فيه خُلِقَ آدم وفيه أُدخل الجنة وفيه تَقُومُ السَّاعَةُ.',
    sunnahCompleted: 'السنن المنجزة',
    daroodCount: 'الصلاة على النبي',
    kahfBadge: 'تلاوة الجمعة الخاصة • سورة رقم ١٨',
    kahfTitle: 'سورة الكهف',
    kahfDesc: '«من قرأ سورةَ الكهفِ في يومِ الجمعةِ أضاء له من النورِ ما بين الجمعتينِ»',
    startKahfBtn: 'ابدأ قراءة سورة الكهف',
    daroodSectionTitle: 'الإكثار من الصلاة على النبي ﷺ',
    daroodHadith: 'قال رسول الله ﷺ: «أَكْثِرُوا عَلَيَّ مِنَ الصَّلَاةِ يَوْمَ الْجُمُعَةِ فَإِنَّ صَلَاتَكُمْ مَعْرُوضَةٌ عَلَيَّ» (أبو داود: ١٠٤٧)',
    daroodCountBtn: 'تسجيل الصلاة (+١)',
    resetTooltip: 'إعادة ضبط',
    resetSunnahs: 'إعادة ضبط السنن',
    checklistTitle: '٨ سنن نبوية ليوم الجمعة',
    allDoneMsg: 'ما شاء الله! أتممت جميع سنن الجمعة.'
  },
  de: {
    headerTitle: 'Freitags (Dschum\'ah) Zentrum',
    headerSubtitle: 'Wöchentliches Fest • Sayyidul Ayyam',
    todayFridayBadge: '🕌 Gesegneter Freitag heute!',
    prepFridayBadge: 'Freitagsvorbereitung',
    sayyidulAyyam: 'Sayyidul Ayyam • Der beste aller Tage',
    heroQuote: '"Der beste Tag, an dem die Sonne aufgeht, ist der Freitag..."',
    heroSub: 'An ihm wurde Adam erschaffen, ins Paradies eingelassen und die Stunde wird anbrechen.',
    sunnahCompleted: 'Sunnahs Erfüllt',
    daroodCount: 'Segenswünsche (Durood)',
    kahfBadge: 'Besondere Freitagstrezitation • Sure #18',
    kahfTitle: 'Sure Al-Kahf (Die Höhle)',
    kahfDesc: '"Wer am Freitag die Sure Al-Kahf liest, dem wird ein Licht zwischen den beiden Freitagen leuchten."',
    startKahfBtn: 'Sure Al-Kahf jetzt lesen',
    daroodSectionTitle: 'Segenswünsche auf den Propheten ﷺ senden',
    daroodHadith: 'Der Prophet (ﷺ) sagte: "Vermehrert die Segenswünsche auf mich am Freitag, denn sie werden mir vorgelegt." (Abu Dawud: 1047)',
    daroodCountBtn: 'Durood zählen (+1)',
    resetTooltip: 'Zurücksetzen',
    resetSunnahs: 'Sunnah-Liste zurücksetzen',
    checklistTitle: '8 Freitags-Sunnahs',
    allDoneMsg: 'MaschaAllah! Du hast alle Freitags-Sunnahs abgeschlossen.'
  }
};

interface FridayJummahHubProps {
  setActiveTab: (tab: string) => void;
  onReadSurahKahf: () => void;
}

export const FridayJummahHub: React.FC<FridayJummahHubProps> = ({ setActiveTab, onReadSurahKahf }) => {
  const { language, activeThemeConfig } = useApp();
  const t = LOCALES[language] || LOCALES.en;
  const isTodayFriday = new Date().getDay() === 5;

  const [completedSunnahs, setCompletedSunnahs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('friday_completed_sunnahs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [daroodCount, setDaroodCount] = useState<number>(() => {
    const saved = localStorage.getItem('friday_darood_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('friday_completed_sunnahs', JSON.stringify(completedSunnahs));
  }, [completedSunnahs]);

  useEffect(() => {
    localStorage.setItem('friday_darood_count', daroodCount.toString());
  }, [daroodCount]);

  const toggleSunnah = (id: string) => {
    if ('vibrate' in navigator) navigator.vibrate(15);
    setCompletedSunnahs(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleIncrementDarood = () => {
    if ('vibrate' in navigator) navigator.vibrate(15);
    setDaroodCount(prev => prev + 1);
  };

  const handleResetDarood = () => {
    setDaroodCount(0);
  };

  const handleResetSunnahs = () => {
    setCompletedSunnahs([]);
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
              {t.headerTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {t.headerSubtitle}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 text-xs font-black rounded-full border ${
          isTodayFriday 
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 animate-pulse'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200'
        }`}>
          {isTodayFriday ? t.todayFridayBadge : t.prepFridayBadge}
        </span>
      </div>

      {/* Hero Banner */}
      <div 
        className="rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden space-y-4"
        style={{
          background: `linear-gradient(135deg, ${activeThemeConfig.primaryColor}, #b45309)`
        }}
      >
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
              {t.sayyidulAyyam}
            </span>
          </div>
          <h3 className="text-xl font-black leading-snug">
            {t.heroQuote}
          </h3>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            {t.heroSub}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 relative z-10 flex items-center justify-between text-xs font-bold">
          <span className="text-emerald-200">{t.sunnahCompleted}: {completedSunnahs.length}/{FRIDAY_SUNNAHS.length}</span>
          <span className="text-amber-300 font-black">{t.daroodCount}: {daroodCount}</span>
        </div>
      </div>

      {/* Surah Al-Kahf Action Card (Direct 1-Click Launch) */}
      <div className="p-5 rounded-[2.2rem] bg-gradient-to-r from-teal-700 via-emerald-800 to-teal-900 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
              {t.kahfBadge}
            </span>
            <h3 className="text-lg font-black">{t.kahfTitle}</h3>
            <p className="text-xs text-teal-100/90 leading-relaxed font-medium">
              {t.kahfDesc}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <BookOpen size={24} className="text-amber-300" />
          </div>
        </div>

        <div className="pt-2 relative z-10">
          <button
            onClick={onReadSurahKahf}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{t.startKahfBtn}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Darood Sharif Dedicated Counter */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.2rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-pink-500" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
              {t.daroodSectionTitle}
            </h4>
          </div>

          {daroodCount > 0 && (
            <button
              onClick={handleResetDarood}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
              title={t.resetTooltip}
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-900/60 border border-amber-200/40 dark:border-slate-700/60 text-center space-y-2">
          <p className="font-arabic text-xl font-bold text-slate-800 dark:text-amber-100" dir="rtl">
            اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
            "Allahumma Salli Ala Muhammadin Wa Ala Aali Muhammad"
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {t.daroodHadith}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              {t.daroodCount}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {daroodCount}
            </span>
          </div>

          <button
            onClick={handleIncrementDarood}
            className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs rounded-2xl shadow-md shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Heart size={16} className="fill-white" />
            <span>{t.daroodCountBtn}</span>
          </button>
        </div>
      </div>

      {/* Sunnahs Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-emerald-600" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
              {t.checklistTitle}
            </h3>
          </div>

          {completedSunnahs.length > 0 && (
            <button
              onClick={handleResetSunnahs}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 underline"
            >
              {t.resetSunnahs}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {FRIDAY_SUNNAHS.map((item, index) => {
            const isCompleted = completedSunnahs.includes(item.id);
            const title = item.titles[language] || item.titles.en;
            const hadith = item.hadiths[language] || item.hadiths.en;
            const reward = item.rewards[language] || item.rewards.en;

            return (
              <motion.div
                key={item.id}
                onClick={() => toggleSunnah(item.id)}
                className={`p-4 rounded-[2rem] border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isCompleted
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle size={22} className="text-slate-300 dark:text-slate-600" />
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-black flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <h4 className={`text-sm font-black transition-colors ${
                      isCompleted 
                        ? 'text-emerald-900 dark:text-emerald-200 line-through decoration-emerald-500/50' 
                        : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {title}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {hadith}
                  </p>

                  <div className="pt-1">
                    <span className="inline-block text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
                      ★ {reward}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
