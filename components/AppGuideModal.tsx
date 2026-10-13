import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, BookOpen, MapPin, Clock, Moon, Sparkles, 
  Share2, ShieldCheck, Activity, Calculator, 
  Settings, Search, ChevronRight, Compass,
  CheckCircle2, HelpCircle, Headphones, Quote, Brain, Bell
} from 'lucide-react';
import { AppIcon } from './AppIcon';
import { AppLanguage } from '../types';

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  language?: AppLanguage | string;
}

interface GuideSection {
  id: string;
  title: string;
  icon: any;
  color: string;
  badge: string;
  summary: string;
  details: string[];
  actionLabel: string;
  tabTarget: string;
}

const GUIDE_LOCALIZED_DATA: Record<string, {
  headerTitle: string;
  headerBadge: string;
  headerSubtitle: string;
  searchPlaceholder: string;
  clearBtn: string;
  tipTitle: string;
  tipBody: string;
  emptyTitle: (q: string) => string;
  viewAllBtn: string;
  footerTagline: string;
  closeBtn: string;
  sections: GuideSection[];
}> = {
  bn: {
    headerTitle: 'অ্যাপ ব্যবহার নির্দেশিকা ও গাইড',
    headerBadge: 'গাইডলাইন',
    headerSubtitle: 'কোন ফিচারে কি পাবেন ও কীভাবে ব্যবহার করবেন বিস্তারিত জেনে নিন',
    searchPlaceholder: 'যেকোনো ফিচার খুঁজুন (যেমন: মসজিদ, কার্ড, নামাজ, রমাদান, কুরআন, অডিও, হাদিস, গেমস)...',
    clearBtn: 'ক্লিয়ার',
    tipTitle: '💡 গুরুত্বপূর্ণ টিপস:',
    tipBody: 'হোম পেজের সবার উপরে অবস্থিত লোকেশন বাটনে (📍 বর্তমান অবস্থান • 🕌 কাছের মসজিদ) ক্লিক করলেই সরাসরি আশেপাশের ৩০০ কিলোমিটারের সকল মসজিদ দেখতে পাবেন।',
    emptyTitle: (q) => `"${q}" সম্পর্কিত কোনো ফিচার পাওয়া যায়নি।`,
    viewAllBtn: 'সব ফিচার দেখুন',
    footerTagline: 'আল- শাহিন ( Shahin) Quran • সদকায়ে জারিয়াহ',
    closeBtn: 'বুঝেছি / বন্ধ করুন',
    sections: [
      {
        id: 'quran',
        title: 'পবিত্র কুরআনুল কারীম তিলাওয়াত',
        icon: BookOpen,
        color: 'emerald',
        badge: 'মূল ফিচার',
        summary: '১১৪টি সূরা ও ৩০ পারা ভিত্তিক পূর্ণাঙ্গ কুরআন, আরবি তিলাওয়াত, বাংলা অর্থ ও তাফসির।',
        details: [
          'সূরার তালিকা অথবা পারা/জুয অনুযায়ী যেকোনো সূরা এক ক্লিকে পড়ুন।',
          'প্রতিটি আয়াতের আরবি হরফ, সহজ অনুবাদ ও তাফসির পড়ুন।',
          'আয়াত বুকমার্ক করে রাখুন অথবা সর্বশেষ পঠিত স্থানে এক ক্লিকে ফিরে আসুন।',
          'ইন্টারনেট ছাড়াই অফলাইনে সম্পূর্ণ কুরআন পড়ার সুবিধা।'
        ],
        actionLabel: 'কুরআনে যান',
        tabTarget: 'quran'
      },
      {
        id: 'social-card',
        title: 'সোশ্যাল মিডিয়া আয়াত শেয়ারিং কার্ড',
        icon: Share2,
        color: 'amber',
        badge: 'জনপ্রিয় ফিচার',
        summary: 'যেকোনো আয়াতের চমৎকার এইচডি ছবি কার্ড তৈরি করে সোশ্যাল মিডিয়ায় ইসলামের বার্তা ছড়িয়ে দিন।',
        details: [
          'কুরআনের যেকোনো আয়াতের নিচে "সোশ্যাল কার্ড" আইকনে ট্যাপ করুন।',
          '৮টি প্রিমিয়াম ইসলামিক কালার থিম (কাবার গিলাফ, মরকত জান্নাত, নূরানী মদিনা ইত্যাদি)।',
          '৩টি সাইজ: পোস্ট (৪:৫), স্টোরি/স্ট্যাটাস (৯:১৬) এবং বর্গাকার স্কয়ার (১:১)।',
          'সরাসরি এইচডি PNG ডাউনলোড, ক্লিপবোর্ডে কপি অথবা WhatsApp/Telegram-এ শেয়ার করুন।'
        ],
        actionLabel: 'কার্ড বানান',
        tabTarget: 'quran'
      },
      {
        id: 'nearby-mosques',
        title: 'কাছের মসজিদ খুঁজুন (৩০০ কিমি)',
        icon: MapPin,
        color: 'teal',
        badge: 'লোকেশন ফিচার',
        summary: 'হোম পেজের টপে আপনার লোকেশনে ট্যাপ করলেই ৩০০ কিমি দূরত্বের সকল মসজিদ খুঁজে পাবেন।',
        details: [
          'হোম পেজের শীর্ষে "📍 অবস্থান • 🕌 কাছের মসজিদ" বাটনে ক্লিক করুন।',
          'আপনার বর্তমান জিপিএস অবস্থান থেকে ৩০০ কিলোমিটারের ভেতরের সকল মসজিদ লোড হবে।',
          'প্রতিটি মসজিদের নাম, রিয়েল-টাইম দূরত্ব (কিমি) ও ইন-অ্যাপ নেভিগেশন সুবিধা।',
          'নাম দিয়ে নির্দিষ্ট মসজিদ দ্রুত সার্চ করার সুবিধা।'
        ],
        actionLabel: 'মসজিদ খুঁজুন',
        tabTarget: 'nearby-mosques'
      },
      {
        id: 'prayer',
        title: '৫ ওয়াক্ত নামাজের সময় ও হিজরি ক্যালেন্ডার',
        icon: Clock,
        color: 'blue',
        badge: 'দৈনন্দিন',
        summary: 'আপনার বর্তমান অবস্থানের নির্ভুল নামাজের সময়, পরবর্তী ওয়াক্তের কাউন্টডাউন।',
        details: [
          'ফজর, যোহর, আসর, মাগরিব ও ইশার শুরু ও শেষের সময়সূচি।',
          'পরবর্তী নামাজ শুরু হতে কত সময় বাকি লাইভ কাউন্টডাউন।',
          'সাহরি ও ইফতারের প্রতিদিনের সময় এবং ইসলামিক হিজরি তারিখ।'
        ],
        actionLabel: 'নামাজের সময়',
        tabTarget: 'prayer'
      },
      {
        id: 'ramadan',
        title: 'মাহে রমাদান বিশেষ হাব ও খতম প্ল্যানার',
        icon: Moon,
        color: 'amber',
        badge: 'বিশেষ হাব',
        summary: '৩০ দিনের রমাদান ক্যালেন্ডার, সেহরি-ইফতার কাউন্টডাউন ও কুরআন খতম ট্র্যাকার।',
        details: [
          'সম্পূর্ণ ৩০ দিনের সাহরি ও ইফতারের তালিকা এক নজরে দেখুন।',
          'রোজার নিয়ত, ইফতারের দোয়া, তারাবীহ ও শবে কদরের বিশেষ আমল।',
          '৩০ দিনে কুরআন খতম করার ব্যক্তিগত অগ্রগতি ট্র্যাকার।'
        ],
        actionLabel: 'রমাদান হাব',
        tabTarget: 'ramadan'
      },
      {
        id: 'duas',
        title: 'হিসনুল মুসলিম (দৈনন্দিন প্রয়োজনীয় দু\'আ)',
        icon: ShieldCheck,
        color: 'emerald',
        badge: 'দোয়া ভাণ্ডার',
        summary: 'সকাল-সন্ধ্যা, ঘুম, বিপদ-আপদ ও প্রতিদিনের জীবনের সহিহ হাদিসভিত্তিক দোয়াসমূহ।',
        details: [
          'ক্যাটাগরি ভিত্তিক বাছাইকৃত ১০০+ বিশুদ্ধ দোয়া।',
          'আরবি হরফ, বাংলা অর্থ, উচ্চারণ ও হাদিসের বিশুদ্ধ সনদ।',
          'এক ক্লিকে অডিও উচ্চারণ শোনার সুবিধা।'
        ],
        actionLabel: 'দু\'আ সমূহ',
        tabTarget: 'duas'
      },
      {
        id: 'tasbih',
        title: 'ডিজিটাল তাসবীহ কাউন্টার',
        icon: Activity,
        color: 'purple',
        badge: 'জিকির',
        summary: 'সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার পাঠের ভাইব্রেশন সুবিধাসহ তাসবীহ।',
        details: [
          'স্ক্রিনের যেকোনো জায়গায় ট্যাপ করে সহজে জিকির গণনা করুন।',
          '৩৩, ১০০ অথবা যেকোনো কাস্টম সংখ্যা লক্ষ্য নির্ধারণের সুবিধা।',
          'প্রতি ক্লিকে সূক্ষ্ম ভাইব্রেশন ফিডব্যাক যা আসল তাসবীহের অনুভূতি দেয়।'
        ],
        actionLabel: 'তাসবীহ শুরু',
        tabTarget: 'tasbih'
      },
      {
        id: 'jummah',
        title: 'পবিত্র জুমার আমল ও সূরা কাহাফ',
        icon: Sparkles,
        color: 'amber',
        badge: 'শুক্রবার',
        summary: 'জুমার দিনের ৮টি সুন্নাত চেকলিস্ট, দরূদ পাঠের আমল ও সূরা আল-কাহাফ তিলাওয়াত।',
        details: [
          'জুমার দিনের ৮টি গুরুত্বপূর্ণ সুন্নাত চেকলিস্ট পূরণ করুন।',
          'এক ক্লিকে সূরা আল-কাহাফ সরাসরি পাঠ ও তিলাওয়াত শোনার শর্টকাট।',
          'বেশি বেশি দরূদ শরীফ পাঠের বিশেষ আমল ও ফজিলত।'
        ],
        actionLabel: 'জুমার আমল',
        tabTarget: 'jummah'
      },
      {
        id: 'names99',
        title: 'আল্লাহর ৯৯টি পবিত্র নাম (আসমাউল হুসনা)',
        icon: Compass,
        color: 'yellow',
        badge: 'আসমাউল হুসনা',
        summary: 'মহান আল্লাহর ৯৯টি নামের আরবি রূপ, উচ্চারণ, অর্থ ও গভীর ফজিলত।',
        details: [
          'প্রতিটি নামের স্পষ্ট আরবি হরফ ও অর্থ।',
          'প্রতিটি নামের বিশেষ ফজিলত ও জিকিরের তাৎপর্য জানুন।',
          'সহজে নাম দিয়ে সার্চ ও ফিল্টার করার সুবিধা।'
        ],
        actionLabel: '৯৯ নাম দেখুন',
        tabTarget: 'names99'
      },
      {
        id: 'zakat',
        title: 'যাকাত ক্যালকুলেটর',
        icon: Calculator,
        color: 'emerald',
        badge: 'হিসাব',
        summary: 'স্বর্ণ, রৌপ্য, নগদ অর্থ ও ব্যবসায়িক সম্পদের নিসাব ও সঠিক যাকাত হিসাব করুন।',
        details: [
          'স্বর্ণ, রূপা, নগদ টাকা ও ঋণের পরিমাণ প্রবেশ করান।',
          'ইসলামিক শরিয়ত সম্মত নিসাব অনুযায়ী স্বয়ংক্রিয় ২.৫% যাকাত হিসাব।',
          'যাকাত কাদের দেওয়া যাবে এবং কাদের দেওয়া যাবে না তার বিস্তারিত নীতিমালা।'
        ],
        actionLabel: 'যাকাত হিসাব',
        tabTarget: 'zakat'
      },
      {
        id: 'audio',
        title: 'অডিও কুরআন ও কারী নির্বাচন',
        icon: Headphones,
        color: 'emerald',
        badge: 'অডিও',
        summary: 'বিশ্বখ্যাত কারীদের সুললিত কণ্ঠে পবিত্র কুরআন তিলাওয়াত শুনুন ও অফলাইনে ডাউনলোড করুন।',
        details: [
          'শায়খ আব্দুর রহমান আস-সুদাইস, মিশারি রশিদ আলাফাসি ও মাহের আল-মুয়াইকিলিসহ বিখ্যাত কারীগণ।',
          'ইন্টারনেট সংযোগ ছাড়াই অফলাইনে শোনার জন্য অডিও ও সূরা ডাউনলোড করুন।',
          'ব্যাকগ্রাউন্ড প্লেব্যাক ও প্লেলিস্ট পরিচালনার সুবিধা।'
        ],
        actionLabel: 'অডিও কুরআন',
        tabTarget: 'audio'
      },
      {
        id: 'hadis',
        title: 'সহিহ হাদিস ভাণ্ডার',
        icon: Quote,
        color: 'orange',
        badge: 'হাদিস',
        summary: 'সহিহ বুখারি, সহিহ মুসলিম ও অন্যান্য প্রামাণিক হাদিস গ্রন্থ থেকে সংকলিত হাদিস পড়ুন।',
        details: [
          'অধ্যায়ভিত্তিক প্রামাণিক হাদিস সংগ্রহ ও বাংলা অনুবাদ।',
          'হাদিসের আরবি মাতন ও বিশুদ্ধ সনদ যাচাই।',
          'প্রয়োজনীয় হাদিস দ্রুত খুঁজে পাওয়ার জন্য কিওয়ার্ড সার্চ।'
        ],
        actionLabel: 'হাদিস পড়ুন',
        tabTarget: 'hadis'
      },
      {
        id: 'games',
        title: 'ইসলামিক কুইজ ও লার্নিং গেমস',
        icon: Brain,
        color: 'indigo',
        badge: 'লার্নিং',
        summary: 'ইসলামিক ইতিহাস, নবীগণের জীবনী ও কুরআন সম্পর্কিত শিক্ষণীয় কুইজ গেম খেলুন।',
        details: [
          'নবীগণের ইতিহাস ও কুরআন সম্পর্কিত মাল্টিপল চয়েস কুইজ।',
          'টাইমলাইন সাজানো ও সূরা ম্যাচিং চ্যালেঞ্জ গেম।',
          'সঠিক উত্তর শেখার মাধ্যমে ইসলামিক জ্ঞান সমৃদ্ধ করুন।'
        ],
        actionLabel: 'গেমস খেলুন',
        tabTarget: 'games'
      },
      {
        id: 'broadcasts',
        title: 'ব্রডকাস্ট নোটিফিকেশন ও আপডেট ইনবক্স',
        icon: Bell,
        color: 'amber',
        badge: 'সিস্টেম',
        summary: 'অ্যাডমিন ঘোষণা, জরুরি নোটিফিকেশন ও অ্যাপ আপডেটের সমস্ত বার্তা এক জায়গায়।',
        details: [
          'রমাদান ঘোষণা, বিশেষ আমল ও জরুরি সিস্টেম নোটিফিকেশন।',
          'ইনবক্স থেকে যেকোনো সময় অতীতের গুরুত্বপূর্ণ ঘোষণাগুলো দেখে নিন।',
          'অ্যাপের নতুন সংস্করণ ও আপডেট চেক করার সুবিধা।'
        ],
        actionLabel: 'ইনবক্স দেখুন',
        tabTarget: 'home'
      },
      {
        id: 'settings',
        title: 'অ্যাপ কাস্টমাইজেশন ও থিম সেটিংস',
        icon: Settings,
        color: 'slate',
        badge: 'সেটিংস',
        summary: 'ফন্ট সাইজ ছোট/বড় করুন, ডার্ক মোড অন করুন এবং ৫টি কালার থিম নির্বাচন করুন।',
        details: [
          'আরবি ও অনুবাদের ফন্টের আকার নিজের সুবিধামতো পরিবর্তন করুন।',
          '৫টি নান্দনিক ইসলামিক থিম কালার (মরকত, অ্যাম্বার, পার্পল ইত্যাদি) বেছে নিন।',
          'রাতের বেলা চোখের আরামের জন্য অটোমেটিক ডার্ক মোড ব্যবহার করুন।',
          'অ্যাপের ভাষা পরিবর্তন ও অফলাইন ডেটা ম্যানেজ করার সুবিধা।'
        ],
        actionLabel: 'সেটিংস',
        tabTarget: 'settings'
      }
    ]
  },
  hi: {
    headerTitle: 'ऐप उपयोग निर्देशिका और मार्गदर्शिका',
    headerBadge: 'गाइड',
    headerSubtitle: 'जानें कि कौन से फीचर्स कहाँ हैं और उनका उपयोग कैसे करें',
    searchPlaceholder: 'किसी भी फीचर को खोजें (जैसे: मस्जिद, कार्ड, नमाज़, रमज़ान, क़ुरआन, ऑडियो, हदीस, गेम्स)...',
    clearBtn: 'साफ़ करें',
    tipTitle: '💡 महत्वपूर्ण सुझाव:',
    tipBody: 'होम स्क्रीन के शीर्ष पर स्थित लोकेशन बटन (📍 स्थान • 🕌 नजदीकी मस्जिद) पर टैप करके आप तुरंत 300 किमी के दायरे में सभी मस्जिदें देख सकते हैं।',
    emptyTitle: (q) => `"${q}" से संबंधित कोई सुविधा नहीं मिली।`,
    viewAllBtn: 'सभी फीचर्स देखें',
    footerTagline: 'अल-शाहिन (Shahin) क़ुरआन • सदक़ा-ए-जारिया',
    closeBtn: 'समझ गया / बंद करें',
    sections: [
      {
        id: 'quran',
        title: 'पवित्र क़ुरआनुल करीम पाठ',
        icon: BookOpen,
        color: 'emerald',
        badge: 'मुख्य',
        summary: '114 सूरह और 30 पारे, अरबी पाठ, अनुवाद और तफ़सीर के साथ।',
        details: [
          'सूरह सूची या पारे के अनुसार किसी भी सूरह को एक क्लिक में पढ़ें।',
          'प्रत्येक आयत का अरबी पाठ, सरल अनुवाद और तफ़सीर पढ़ें।',
          'आयतों को बुकमार्क करें या अंतिम पढ़े गए स्थान पर तुरंत लौटें।',
          'इंटरनेट के बिना ऑफ़लाइन क़ुरआन पढ़ने की पूरी सुविधा।'
        ],
        actionLabel: 'क़ुरआन पढ़ें',
        tabTarget: 'quran'
      },
      {
        id: 'social-card',
        title: 'सोशल मीडिया आयत शेयरिंग कार्ड',
        icon: Share2,
        color: 'amber',
        badge: 'नया फीचर',
        summary: 'सोशल मीडिया पर इस्लाम का संदेश फैलाने के लिए एचडी आयत कार्ड बनाएं।',
        details: [
          'किसी भी आयत के नीचे "सोशल कार्ड" आइकन पर टैप करें।',
          '8 शाही इस्लामिक रंग थीम।',
          '3 आकार: पोस्ट (4:5), स्टोरी/स्टेटस (9:16) और वर्ग (1:1)।',
          'सीधा एचडी पीएनजी डाउनलोड करें या व्हाट्सएप/टेलीग्राम पर शेयर करें।'
        ],
        actionLabel: 'कार्ड बनाएं',
        tabTarget: 'quran'
      },
      {
        id: 'nearby-mosques',
        title: 'नजदीकी मस्जिद खोजें (300 किमी)',
        icon: MapPin,
        color: 'teal',
        badge: 'स्थान',
        summary: 'शीर्ष पर लोकेशन बटन पर टैप करके 300 किमी के दायरे में सभी मस्जिदें खोजें।',
        details: [
          'होम स्क्रीन के शीर्ष पर "📍 स्थान • 🕌 नजदीकी मस्जिद" बटन दबाएं।',
          'जीपीएस के अनुसार 300 किमी की दूरी में सभी मस्जिदें लोड होंगी।',
          'प्रत्येक मस्जिद का नाम, दूरी और ऐप के अंदर दिशा-निर्देश देखें।',
          'नाम से किसी भी मस्जिद को आसानी से खोजें।'
        ],
        actionLabel: 'मस्जिद खोजें',
        tabTarget: 'nearby-mosques'
      },
      {
        id: 'prayer',
        title: '5 वक़्त नमाज़ का समय व हिजरी कैलेंडर',
        icon: Clock,
        color: 'blue',
        badge: 'दैनिक',
        summary: 'आपके स्थान के अनुसार सटीक 5 वक़्त नमाज़ के समय और अगला वक़्त काउंटडाउन।',
        details: [
          'फ़ज्र, ज़ुहर, अस्र, मग़रिब और इशा के समय।',
          'अगली नमाज़ शुरू होने में कितना समय शेष है उसका लाइव काउंटडाउन।',
          'सहरी और इफ्तार के समय और वर्तमान इस्लामी हिजरी तारीख।'
        ],
        actionLabel: 'नमाज़ का समय',
        tabTarget: 'prayer'
      },
      {
        id: 'ramadan',
        title: 'माहे रमज़ान विशेष हब व ख़त्म ट्रैकर',
        icon: Moon,
        color: 'amber',
        badge: 'विशेष',
        summary: '30 दिनों का रमज़ान कैलेंडर, सहरी-इफ्तार काउंटडाउन और ख़त्म ट्रैकर।',
        details: [
          'पूरे 30 दिनों की सहरी और इफ्तार सूची एक नज़र में देखें।',
          'रोज़े की नीयत, इफ्तार की दुआ और शबे क़द्र के विशेष अमल।',
          '30 दिनों में क़ुरआन मुकम्मल करने का व्यक्तिगत ट्रैकर।'
        ],
        actionLabel: 'रमज़ान हब',
        tabTarget: 'ramadan'
      },
      {
        id: 'duas',
        title: 'हिस्नुल मुस्लिम (दैनिक आवश्यक दुआएं)',
        icon: ShieldCheck,
        color: 'emerald',
        badge: 'दुआएं',
        summary: 'सुबह-शाम, सोने-जागने और दैनिक जीवन की प्रामाणिक हदीस दुआएं।',
        details: [
          'श्रेणियों में विभाजित 100+ प्रामाणिक दुआएं।',
          'अरबी पाठ, उच्चारण, अनुवाद और हदीस संदर्भ।',
          'एक क्लिक में ऑडियो उच्चारण सुनने की सुविधा।'
        ],
        actionLabel: 'दुआएं देखें',
        tabTarget: 'duas'
      },
      {
        id: 'tasbih',
        title: 'डिजिटल तस्बीह काउंटर',
        icon: Activity,
        color: 'purple',
        badge: 'ज़िक्र',
        summary: 'सुब्हानअल्लाह, अल्हम्दुलिल्लाह, अल्लाहु अकबर के लिए वाइब्रेशन युक्त तस्बीह।',
        details: [
          'स्क्रीन पर कहीं भी टैप करके आसानी से ज़िक्र गिनें।',
          '33, 100 या कोई भी कस्टम लक्ष्य निर्धारित करें।',
          'प्रत्येक क्लिक पर हल्का वाइब्रेशन वास्तविक तस्बीह का अनुभव कराता है।'
        ],
        actionLabel: 'तस्बीह शुरू करें',
        tabTarget: 'tasbih'
      },
      {
        id: 'jummah',
        title: 'पवित्र जुमा के अमल व सूरह कहफ़',
        icon: Sparkles,
        color: 'amber',
        badge: 'शुक्रवार',
        summary: 'जुमा के दिन की 8 सुन्नतें, दुरूद शरीफ़ और सूरह अल-कहफ़ पाठ।',
        details: [
          'जुमा के दिन की 8 महत्वपूर्ण सुन्नतों की चेकलिस्ट पूरी करें।',
          'एक क्लिक में सूरह अल-कहफ़ पढ़ने और सुनने का शॉर्टकट।',
          'अधिक से अधिक दुरूद शरीफ़ पढ़ने के फ़ज़ाइल।'
        ],
        actionLabel: 'जुमा हब',
        tabTarget: 'jummah'
      },
      {
        id: 'names99',
        title: 'अल्लाह के 99 पवित्र नाम (अस्माउल हुस्ना)',
        icon: Compass,
        color: 'yellow',
        badge: 'अस्माउल हुस्ना',
        summary: 'महान अल्लाह के 99 नामों का अरबी रूप, अर्थ और फ़ज़ीलत।',
        details: [
          'प्रत्येक नाम का स्पष्ट अरबी पाठ और अर्थ।',
          'प्रत्येक नाम की विशेष फ़ज़ीलत और आध्यात्मिक महत्व।',
          'नामों को आसानी से खोजने और फ़िल्टर करने की सुविधा।'
        ],
        actionLabel: '99 नाम देखें',
        tabTarget: 'names99'
      },
      {
        id: 'zakat',
        title: 'ज़कात कैलकुलेटर',
        icon: Calculator,
        color: 'emerald',
        badge: 'वित्त',
        summary: 'सोना, चांदी, नकद और व्यापारिक संपत्ति की सटीक ज़कात गणना करें।',
        details: [
          'सोना, चांदी, नकद और कर्ज़ की राशि दर्ज करें।',
          'इस्लामिक शरीयत निसा़ब के अनुसार स्वचालित 2.5% ज़कात गणना।',
          'ज़कात के पात्र लोगों के संबंध में दिशानिर्देश।'
        ],
        actionLabel: 'ज़कात गणना',
        tabTarget: 'zakat'
      },
      {
        id: 'audio',
        title: 'ऑडियो क़ुरआन और क़ारी',
        icon: Headphones,
        color: 'emerald',
        badge: 'ऑडियो',
        summary: 'प्रसिद्ध क़ारियों की आवाज़ में क़ुरआन सुनें और ऑफ़लाइन डाउनलोड करें।',
        details: [
          'शेख अब्दुर रहमान अल-सुदैस, मिशारी रशीद अलाफासी और अन्य।',
          'इंटरनेट के बिना सुनने के लिए ऑडियो डाउनलोड करें।',
          'बैकग्राउंड प्लेबैक की सुविधा।'
        ],
        actionLabel: 'ऑडियो क़ुरआन',
        tabTarget: 'audio'
      },
      {
        id: 'hadis',
        title: 'सहीह हदीस संग्रह',
        icon: Quote,
        color: 'orange',
        badge: 'हदीस',
        summary: 'सहीह बुखारी और सहीह मुस्लिम से प्रामाणिक हदीसें पढ़ें।',
        details: [
          'अध्याय-वार प्रामाणिक हदीस संग्रह।',
          'अरबी पाठ और स्पष्ट अनुवाद।',
          'त्वरित खोज सुविधा।'
        ],
        actionLabel: 'हदीस पढ़ें',
        tabTarget: 'hadis'
      },
      {
        id: 'games',
        title: 'इस्लामिक क्विज़ और गेम्स',
        icon: Brain,
        color: 'indigo',
        badge: 'गेम्स',
        summary: 'इस्लामिक इतिहास और क़ुरआन पर आधारित शिक्षाप्रद क्विज़ खेलें।',
        details: [
          'नबी और इतिहास पर आधारित बहुविकल्पीय प्रश्न।',
          'समयरेखा और सूरह मिलान चुनौती।',
          'ज्ञान बढ़ाएं और स्कोर ट्रैक करें।'
        ],
        actionLabel: 'गेम्स खेलें',
        tabTarget: 'games'
      },
      {
        id: 'broadcasts',
        title: 'ब्रॉडकास्ट और अपडेट इनबॉक्स',
        icon: Bell,
        color: 'amber',
        badge: 'सिस्टम',
        summary: 'व्यवस्थापक घोषणाएं और अपडेट संदेश एक ही स्थान पर।',
        details: [
          'रमज़ान घोषणाएं और महत्वपूर्ण सिस्टम संदेश।',
          'इनबॉक्स से पिछले संदेश देखें।',
          'ऐप अपडेट जांचें।'
        ],
        actionLabel: 'इनबॉक्स देखें',
        tabTarget: 'home'
      },
      {
        id: 'settings',
        title: 'ऐप कस्टमाइज़ेशन और थीम सेटिंग्स',
        icon: Settings,
        color: 'slate',
        badge: 'सेटिंग्स',
        summary: 'फ़ॉन्ट आकार बदलें, डार्क मोड सक्षम करें और 5 थीम रंग चुनें।',
        details: [
          'अरबी और अनुवाद के फ़ॉन्ट आकार को अपनी पसंद अनुसार बदलें।',
          '5 सुंदर इस्लामिक थीम रंग चुनें।',
          'आँखों के आराम के लिए डार्क मोड का उपयोग करें।',
          'भाषा बदलें और ऑफ़लाइन डेटा प्रबंधित करें।'
        ],
        actionLabel: 'सेटिंग्स खोलें',
        tabTarget: 'settings'
      }
    ]
  },
  es: {
    headerTitle: 'Guía de Usuario y Navegación de la App',
    headerBadge: 'Guía',
    headerSubtitle: 'Conoce todas las funciones y cómo navegar fácilmente',
    searchPlaceholder: 'Buscar cualquier función (ej: mezquitas, tarjetas, oración, ramadán, corán, audio, hadiz, juegos)...',
    clearBtn: 'Limpiar',
    tipTitle: '💡 Consejo Útil:',
    tipBody: 'Toca el botón de ubicación en la parte superior del inicio (📍 Ubicación • 🕌 Mezquitas Cercanas) para encontrar al instante mezquitas en un radio de 300 km.',
    emptyTitle: (q) => `No se encontraron funciones para "${q}".`,
    viewAllBtn: 'Ver todas las funciones',
    footerTagline: 'Al-Shahin (Shahin) Corán • Sadaqah Jariyah',
    closeBtn: 'Entendido / Cerrar',
    sections: [
      {
        id: 'quran',
        title: 'Recitación del Sagrado Corán',
        icon: BookOpen,
        color: 'emerald',
        badge: 'Principal',
        summary: '114 Surahs y 30 Juz con texto árabe, traducción y audio.',
        details: [
          'Navega por Surahs o Juz con un solo toque.',
          'Lee texto árabe, traducción clara y Tafsir para cada Ayah.',
          'Guarda marcadores o continúa leyendo desde tu última posición.',
          'Lectura sin conexión a internet disponible.'
        ],
        actionLabel: 'Ir al Corán',
        tabTarget: 'quran'
      },
      {
        id: 'social-card',
        title: 'Generador de Tarjetas de Ayah para Redes',
        icon: Share2,
        color: 'amber',
        badge: 'Destacado',
        summary: 'Crea hermosas tarjetas en HD para compartir versículos en redes sociales.',
        details: [
          'Toca el icono "Tarjeta Social" debajo de cualquier versículo.',
          '8 temas de color islámicos de alta definición.',
          '3 formatos: Post (4:5), Historia (9:16) y Cuadrado (1:1).',
          'Descarga directa en HD o comparte por WhatsApp y Telegram.'
        ],
        actionLabel: 'Crear Tarjeta',
        tabTarget: 'quran'
      },
      {
        id: 'nearby-mosques',
        title: 'Buscador de Mezquitas Cercanas (300 km)',
        icon: MapPin,
        color: 'teal',
        badge: 'Ubicación',
        summary: 'Localiza todas las mezquitas a menos de 300 km de tu ubicación.',
        details: [
          'Toca el botón superior "📍 Ubicación • 🕌 Mezquitas Cercanas".',
          'Carga mezquitas en base a tus coordenadas GPS en tiempo real.',
          'Muestra distancia en kilómetros y navegación integrada paso a paso.',
          'Búsqueda rápida por nombre.'
        ],
        actionLabel: 'Ver Mezquitas',
        tabTarget: 'nearby-mosques'
      },
      {
        id: 'prayer',
        title: 'Horarios de Oración y Calendario Hijri',
        icon: Clock,
        color: 'blue',
        badge: 'Diario',
        summary: 'Horarios exactos de las 5 oraciones con cuenta regresiva en vivo.',
        details: [
          'Horarios de Fajr, Dhuhr, Asr, Maghrib e Isha.',
          'Cuenta regresiva en vivo para la próxima oración.',
          'Horas de Sehri e Iftar y fecha del calendario Hijri.'
        ],
        actionLabel: 'Ver Horarios',
        tabTarget: 'prayer'
      },
      {
        id: 'ramadan',
        title: 'Centro Especial de Ramadán y Khatam',
        icon: Moon,
        color: 'amber',
        badge: 'Especial',
        summary: 'Calendario completo de 30 días, cuenta regresiva y seguimiento de Khatam.',
        details: [
          'Calendario de 30 días con Sehri e Iftar.',
          'Duas para el ayuno, el Iftar y la Noche del Decreto.',
          'Seguimiento personal del progreso del Corán en 30 días.'
        ],
        actionLabel: 'Ramadán',
        tabTarget: 'ramadan'
      },
      {
        id: 'duas',
        title: 'Hisnul Muslim (Súplicas Diarias)',
        icon: ShieldCheck,
        color: 'emerald',
        badge: 'Súplicas',
        summary: 'Súplicas auténticas para la mañana, noche y vida cotidiana.',
        details: [
          'Más de 100 duas auténticas organizadas por categorías.',
          'Texto en árabe, pronunciación, significado y referencias.',
          'Escucha la pronunciación en audio con un toque.'
        ],
        actionLabel: 'Ver Duas',
        tabTarget: 'duas'
      },
      {
        id: 'tasbih',
        title: 'Contador de Tasbih Digital',
        icon: Activity,
        color: 'purple',
        badge: 'Dhikr',
        summary: 'Contador inteligente con respuesta táctil y metas personalizables.',
        details: [
          'Toca cualquier parte de la pantalla para contar.',
          'Metas fijas de 33, 100 o conteo libre.',
          'Vibración háptica que simula un rosario tradicional.'
        ],
        actionLabel: 'Iniciar Tasbih',
        tabTarget: 'tasbih'
      },
      {
        id: 'jummah',
        title: 'Viernes Bendito (Jummah) y Surah Al-Kahf',
        icon: Sparkles,
        color: 'amber',
        badge: 'Viernes',
        summary: 'Lista de 8 Sunnahs del viernes, Durood y Surah Al-Kahf.',
        details: [
          'Lista interactiva de 8 actos de Sunnah para el viernes.',
          'Acceso directo para leer o escuchar Surah Al-Kahf.',
          'Virtudes de enviar bendiciones sobre el Profeta (ﷺ).'
        ],
        actionLabel: 'Jummah Hub',
        tabTarget: 'jummah'
      },
      {
        id: 'names99',
        title: 'Los 99 Nombres de Alá (Asmaul Husna)',
        icon: Compass,
        color: 'yellow',
        badge: 'Nombres',
        summary: 'Los 99 Bellos Nombres de Alá con caligrafía, significado y beneficios.',
        details: [
          'Texto árabe claro y significado para cada Nombre.',
          'Virtudes espirituales y beneficios de su recitación.',
          'Búsqueda rápida por nombre.'
        ],
        actionLabel: 'Ver 99 Nombres',
        tabTarget: 'names99'
      },
      {
        id: 'zakat',
        title: 'Calculadora de Zakat',
        icon: Calculator,
        color: 'emerald',
        badge: 'Finanzas',
        summary: 'Calcula tu Zakat exacto según el Nisab y tus bienes.',
        details: [
          'Ingresa oro, plata, efectivo y deudas.',
          'Cálculo automático del 2.5% de acuerdo a la Shariah.',
          'Pautas sobre quiénes son aptos para recibir el Zakat.'
        ],
        actionLabel: 'Calcular Zakat',
        tabTarget: 'zakat'
      },
      {
        id: 'audio',
        title: 'Corán en Audio y Recitadores',
        icon: Headphones,
        color: 'emerald',
        badge: 'Audio',
        summary: 'Escucha hermosas recitaciones de recitadores de renombre mundial.',
        details: [
          'Recitadores famosos como Al-Sudais, Alafasy y otros.',
          'Descarga audios para escuchar sin conexión.',
          'Reproducción en segundo plano.'
        ],
        actionLabel: 'Audio Corán',
        tabTarget: 'audio'
      },
      {
        id: 'hadis',
        title: 'Biblioteca de Hadices',
        icon: Quote,
        color: 'orange',
        badge: 'Hadiz',
        summary: 'Colecciones de Hadices auténticos de Sahih Al-Bukhari y Sahih Muslim.',
        details: [
          'Colecciones de Hadices organizadas por capítulos.',
          'Texto en árabe y traducciones claras.',
          'Búsqueda rápida de hadices.'
        ],
        actionLabel: 'Leer Hadices',
        tabTarget: 'hadis'
      },
      {
        id: 'games',
        title: 'Juegos Educativos Islámicos',
        icon: Brain,
        color: 'indigo',
        badge: 'Juegos',
        summary: 'Diviértete y aprende con cuestionarios sobre el Islam y los Profetas.',
        details: [
          'Cuestionarios de opción múltiple sobre historia profética.',
          'Desafíos de cronología y coincidencia de Surahs.',
          'Seguimiento de puntajes.'
        ],
        actionLabel: 'Jugar',
        tabTarget: 'games'
      },
      {
        id: 'broadcasts',
        title: 'Bandeja de Anuncios y Avisos',
        icon: Bell,
        color: 'amber',
        badge: 'Sistema',
        summary: 'Anuncios importantes y saludos de Ramadán en un solo lugar.',
        details: [
          'Mensajes oficiales y actualizaciones de la app.',
          'Acceso al historial de notificaciones.',
          'Verificación de nuevas versiones.'
        ],
        actionLabel: 'Ver Buzón',
        tabTarget: 'home'
      },
      {
        id: 'settings',
        title: 'Configuración y Temas',
        icon: Settings,
        color: 'slate',
        badge: 'Ajustes',
        summary: 'Ajusta el tamaño de letra, activa el Modo Oscuro y elige temas islámicos.',
        details: [
          'Personaliza el tamaño de la tipografía árabe y traducción.',
          '5 paletas de colores islámicos hermosos.',
          'Modo oscuro para descanso visual nocturno.',
          'Cambia de idioma y gestiona descargas sin conexión.'
        ],
        actionLabel: 'Configuración',
        tabTarget: 'settings'
      }
    ]
  },
  de: {
    headerTitle: 'App-Benutzerhandbuch & Navigation',
    headerBadge: 'Leitfaden',
    headerSubtitle: 'Erfahre, wo sich alle Funktionen befinden und wie du sie nutzt',
    searchPlaceholder: 'Funktion suchen (z. B. Moscheen, Karten, Gebet, Ramadan, Koran, Audio, Hadith, Spiele)...',
    clearBtn: 'Löschen',
    tipTitle: '💡 Wichtiger Tipp:',
    tipBody: 'Tippe oben im Startbereich auf die Standort-Schaltfläche (📍 Standort • 🕌 Moscheen in der Nähe), um sofort alle Moscheen im Umkreis von 300 km zu finden.',
    emptyTitle: (q) => `Keine Funktionen für "${q}" gefunden.`,
    viewAllBtn: 'Alle Funktionen anzeigen',
    footerTagline: 'Al-Shahin (Shahin) Koran • Sadaqah Jariyah',
    closeBtn: 'Verstanden / Schließen',
    sections: [
      {
        id: 'quran',
        title: 'Rezitation des Heiligen Korans',
        icon: BookOpen,
        color: 'emerald',
        badge: 'Kern',
        summary: 'Vollständige 114 Suren und 30 Juz mit arabischem Text, Übersetzung und Audio.',
        details: [
          'Suren oder Juz mit einem Klick durchsuchen.',
          'Arabische Schrift, verständliche Übersetzung und Tafsir für jeden Vers.',
          'Lesezeichen setzen oder an der zuletzt gelesenen Stelle fortfahren.',
          'Offline-Koranlesung ohne Internet möglich.'
        ],
        actionLabel: 'Zum Koran',
        tabTarget: 'quran'
      },
      {
        id: 'social-card',
        title: 'Social Media Vers-Bildkarten-Generator',
        icon: Share2,
        color: 'amber',
        badge: 'Neu',
        summary: 'Erstelle atemberaubende HD-Koran-Karten zum Teilen auf Social Media.',
        details: [
          'Tippe unter jedem Vers auf das Symbol "Social Card".',
          '8 edle islamische Farbpaletten.',
          '3 Formate: Post (4:5), Story (9:16) und Quadratisch (1:1).',
          'Direkter HD-PNG-Download oder Teilen über WhatsApp/Telegram.'
        ],
        actionLabel: 'Karte erstellen',
        tabTarget: 'quran'
      },
      {
        id: 'nearby-mosques',
        title: 'Moscheen-Finder (300 km Umkreis)',
        icon: MapPin,
        color: 'teal',
        badge: 'Standort',
        summary: 'Finde alle Moscheen innerhalb von 300 km um deinen Standort.',
        details: [
          'Tippe auf "📍 Standort • 🕌 Moscheen in der Nähe" im Header.',
          'Lädt Moscheen basierend auf deinen Live-GPS-Koordinaten.',
          'Echtzeit-Entfernung in km und In-App-Navigation.',
          'Schnellsuche nach Moscheenamen.'
        ],
        actionLabel: 'Moscheen anzeigen',
        tabTarget: 'nearby-mosques'
      },
      {
        id: 'prayer',
        title: 'Gebetszeiten & Hidschri-Kalender',
        icon: Clock,
        color: 'blue',
        badge: 'Täglich',
        summary: 'Präzise 5 Gebetszeiten für deinen Standort mit Countdown.',
        details: [
          'Fadschr, Zuhr, Asr, Maghrib und Ischa-Zeiten.',
          'Live-Countdown zum nächsten Gebet.',
          'Tägliche Sahur- und Iftar-Zeiten sowie islamisches Datum.'
        ],
        actionLabel: 'Gebetszeiten',
        tabTarget: 'prayer'
      },
      {
        id: 'ramadan',
        title: 'Ramadan-Spezial-Hub & Khatam-Tracker',
        icon: Moon,
        color: 'amber',
        badge: 'Spezial',
        summary: '30-Tage-Ramadan-Kalender, Sahur/Iftar-Zeiten und Koran-Khatam-Tracker.',
        details: [
          'Kompletter 30-Tage-Plan für Sahur und Iftar.',
          'Wichtige Bittgebete für Fasten, Iftar und Laylatul Qadr.',
          'Persönlicher Fortschrittstracker für 30 Tage Koran-Abschluss.'
        ],
        actionLabel: 'Ramadan-Hub',
        tabTarget: 'ramadan'
      },
      {
        id: 'duas',
        title: 'Hisnul Muslim (Tägliche Bittgebete)',
        icon: ShieldCheck,
        color: 'emerald',
        badge: 'Duas',
        summary: 'Authentische Bittgebete für Morgen, Abend und den Alltag.',
        details: [
          'Über 100 authentische Bittgebete nach Kategorien geordnet.',
          'Arabischer Text, Aussprache, Übersetzung und Hadith-Referenzen.',
          'Audio-Aussprache mit einem Klick anhören.'
        ],
        actionLabel: 'Bittgebete',
        tabTarget: 'duas'
      },
      {
        id: 'tasbih',
        title: 'Digitaler Tasbih-Zähler',
        icon: Activity,
        color: 'purple',
        badge: 'Dhikr',
        summary: 'Smarter Dhikr-Zähler mit Vibrations-Feedback und Zielvorgaben.',
        details: [
          'Tippe überall auf den Bildschirm, um zu zählen.',
          'Ziele für 33, 100 oder freies Zählen.',
          'Haptische Vibration wie bei einer echten Gebetskette.'
        ],
        actionLabel: 'Tasbih starten',
        tabTarget: 'tasbih'
      },
      {
        id: 'jummah',
        title: 'Freitags-Hub (Dschuma) & Sure Al-Kahf',
        icon: Sparkles,
        color: 'amber',
        badge: 'Freitag',
        summary: '8 Sunnahs für den Freitag, Segenswünsche und Sure Al-Kahf.',
        details: [
          'Interaktive Checkliste für 8 Freitags-Sunnahs.',
          'Direkter Schnellzugriff zum Lesen und Hören der Sure Al-Kahf.',
          'Segenswünsche (Durood) auf den Propheten (ﷺ).'
        ],
        actionLabel: 'Freitags-Hub',
        tabTarget: 'jummah'
      },
      {
        id: 'names99',
        title: '99 Namen Allahs (Asmaul Husna)',
        icon: Compass,
        color: 'yellow',
        badge: 'Namen',
        summary: 'Die 99 schönsten Namen Allahs mit Kalligraphie und Bedeutung.',
        details: [
          'Klare arabische Schrift und Bedeutung jedes Namens.',
          'Spirituelle Vorzüge und Rezitationsbedeutung.',
          'Einfache Such- und Filterfunktion.'
        ],
        actionLabel: '99 Namen ansehen',
        tabTarget: 'names99'
      },
      {
        id: 'zakat',
        title: 'Zakat-Rechner',
        icon: Calculator,
        color: 'emerald',
        badge: 'Finanzen',
        summary: 'Berechne deine exakte Zakat auf Gold, Silber, Bargeld und Vermögen.',
        details: [
          'Beträge für Gold, Silber, Bargeld und Verbindlichkeiten eingeben.',
          'Automatische 2,5 % Berechnung gemäß Scharia-Nisab.',
          'Richtlinien für berechtigte Zakat-Empfänger.'
        ],
        actionLabel: 'Zakat berechnen',
        tabTarget: 'zakat'
      },
      {
        id: 'audio',
        title: 'Audio-Koran & Rezitatoren',
        icon: Headphones,
        color: 'emerald',
        badge: 'Audio',
        summary: 'Höre wunderschöne Rezitationen weltbekannter Rezitatoren.',
        details: [
          'Bekannte Rezitatoren wie Al-Sudais, Alafasy und andere.',
          'Audios für die Offline-Nutzung herunterladen.',
          'Hintergrundwiedergabe.'
        ],
        actionLabel: 'Audio-Koran',
        tabTarget: 'audio'
      },
      {
        id: 'hadis',
        title: 'Hadith-Bibliothek',
        icon: Quote,
        color: 'orange',
        badge: 'Hadith',
        summary: 'Authentische Hadiths aus Sahih Al-Bukhari und Sahih Muslim.',
        details: [
          'Kapitelweise Hadith-Sammlungen.',
          'Arabischer Text und klare Übersetzung.',
          'Schnellsuche.'
        ],
        actionLabel: 'Hadithe lesen',
        tabTarget: 'hadis'
      },
      {
        id: 'games',
        title: 'Islamische Lernspiele',
        icon: Brain,
        color: 'indigo',
        badge: 'Spiele',
        summary: 'Lerne spielerisch mit Quizfragen zum Islam und den Propheten.',
        details: [
          'Multiple-Choice-Fragen zur islamischen Geschichte.',
          'Zeitleisten- und Suren-Zuordnungsspiele.',
          'Punkteverfolgung.'
        ],
        actionLabel: 'Spielen',
        tabTarget: 'games'
      },
      {
        id: 'broadcasts',
        title: 'Benachrichtigungs-Posteingang',
        icon: Bell,
        color: 'amber',
        badge: 'System',
        summary: 'Wichtige Mitteilungen und Admin-Ansagen an einem Ort.',
        details: [
          'Ramadan-Grüße und Systemmeldungen.',
          'Verlauf vergangener Benachrichtigungen.',
          'Auf Updates prüfen.'
        ],
        actionLabel: 'Posteingang',
        tabTarget: 'home'
      },
      {
        id: 'settings',
        title: 'App-Einstellungen & Themen',
        icon: Settings,
        color: 'slate',
        badge: 'Einstellungen',
        summary: 'Schriftgrößen anpassen, Dunkelmodus aktivieren und Farben wählen.',
        details: [
          'Arabische und Übersetzungsschriftgröße individuell einstellen.',
          '5 ansprechende islamische Farbthemen.',
          'Angenehmer Dunkelmodus für die Augen.',
          'Sprache wechseln und Offline-Inhalte verwalten.'
        ],
        actionLabel: 'Einstellungen',
        tabTarget: 'settings'
      }
    ]
  },
  ar: {
    headerTitle: 'دليل استخدام التطبيق والتنقل',
    headerBadge: 'الدليل',
    headerSubtitle: 'تعرف على كل ميزات التطبيق وكيفية استخدامها بسهولة',
    searchPlaceholder: 'ابحث عن أي ميزة (مثال: المساجد، البطاقات، الصلاة، رمضان، القرآن، الصوت، الأحاديث، الألعاب)...',
    clearBtn: 'مسح',
    tipTitle: '💡 نصيحة مهمة:',
    tipBody: 'انقر على زر الموقع في أعلى الصفحة الرئيسية (📍 الموقع • 🕌 أقرب المساجد) لعرض جميع المساجد في نطاق 300 كم فوراً.',
    emptyTitle: (q) => `لم يتم العثور على أي نتائج لـ "${q}".`,
    viewAllBtn: 'عرض جميع الميزات',
    footerTagline: 'قرآن الشاهين • صدقة جارية',
    closeBtn: 'فهمت / إغلاق',
    sections: [
      {
        id: 'quran',
        title: 'تلاوة القرآن الكريم كاملاً',
        icon: BookOpen,
        color: 'emerald',
        badge: 'الأساس',
        summary: '114 سورة و 30 جزءاً بالرسم العثماني مع التلاوة الصوتية والتفسير.',
        details: [
          'تصفح بالسور أو الأجزاء بنقرة واحدة.',
          'الرسم العثماني الواضح مع التفسير الميسر لكل آية.',
          'حفظ العلامات المرجعية والعودة لآخر موضع قراءة.',
          'قراءة القرآن بدون إنترنت (أوفلاين).'
        ],
        actionLabel: 'فتح القرآن',
        tabTarget: 'quran'
      },
      {
        id: 'social-card',
        title: 'صانع بطاقات الآيات لمواقع التواصل',
        icon: Share2,
        color: 'amber',
        badge: 'مميز',
        summary: 'أنشئ بطاقات قرآنية عالية الدقة لمشاركتها على وسائل التواصل.',
        details: [
          'انقر على أيقونة "البطاقة الاجتماعية" أسفل أي آية.',
          '8 ثيمات إسلامية ملكية.',
          '3 مقاسات: منشور (4:5)، قصة/ستوري (9:16)، مربع (1:1).',
          'تحميل مباشر بدقة HD أو مشاركة فورية عبر واتساب وتيليجرام.'
        ],
        actionLabel: 'إنشاء بطاقة',
        tabTarget: 'quran'
      },
      {
        id: 'nearby-mosques',
        title: 'أقرب المساجد (ضمن 300 كم)',
        icon: MapPin,
        color: 'teal',
        badge: 'الموقع',
        summary: 'ابحث عن جميع المساجد القريبة منك ضمن نطاق 300 كيلومتر.',
        details: [
          'اضغط على زر الموقع أعلى الصفحة الرئيسية.',
          'تحميل جميع المساجد بدقة حسب موقع GPS المباشر.',
          'عرض المسافة بالكيلومترات والتنقل المباشر خطوة بخطوة داخل التطبيق.',
          'البحث السريع عن أي مسجد بالاسم.'
        ],
        actionLabel: 'عرض المساجد',
        tabTarget: 'nearby-mosques'
      },
      {
        id: 'prayer',
        title: 'مواقيت الصلاة والتقويم الهجري',
        icon: Clock,
        color: 'blue',
        badge: 'يومي',
        summary: 'مواقيت دقيقة للصلوات الخمس حسب موقعك مع عد تنازلي مباشر.',
        details: [
          'مواقيت الفجر، الظهر، العصر، المغرب والعشاء.',
          'عد تنازلي مباشر لموعد الصلاة القادمة.',
          'أوقات السحور والإفطار والتاريخ الهجري المبارك.'
        ],
        actionLabel: 'مواقيت الصلاة',
        tabTarget: 'prayer'
      },
      {
        id: 'ramadan',
        title: 'مركز شهر رمضان ومتابع الختمة',
        icon: Moon,
        color: 'amber',
        badge: 'خاص',
        summary: 'إمساكية 30 يوماً لرمضان، عداد السحور والإفطار، وخطة ختم القرآن.',
        details: [
          'جدول كامل لأوقات الإمساك والإفطار لـ 30 يوماً.',
          'أدعية الصيام، الإفطار، وأعمال ليلة القدر المباركة.',
          'متابعة إنجاز ختمة القرآن خلال الشهر الكريم.'
        ],
        actionLabel: 'مركز رمضان',
        tabTarget: 'ramadan'
      },
      {
        id: 'duas',
        title: 'حصن المسلم (الأذكار والأدعية اليومية)',
        icon: ShieldCheck,
        color: 'emerald',
        badge: 'أذكار',
        summary: 'أذكار الصباح والمساء، النوم، والأدعية النبوية الصحيحة.',
        details: [
          'أكثر من 100 دعاء صحيح مقسمة حسب المناسبات.',
          'النص العربي الموثق مع ذكر المصدر من كتب السنة.',
          'الاستماع الصوتي للدعاء بنقرة واحدة.'
        ],
        actionLabel: 'عرض الأدعية',
        tabTarget: 'duas'
      },
      {
        id: 'tasbih',
        title: 'المسبحة الإلكترونية الرقمية',
        icon: Activity,
        color: 'purple',
        badge: 'ذكر',
        summary: 'مسبحة ذكية بعداد رقمي واهتزاز تفاعلي وأهداف محددة.',
        details: [
          'انقر في أي مكان على الشاشة لزيادة التسبيح.',
          'أهداف محددة (33، 100) أو عد حر غير محدود.',
          'اهتزاز تفاعلي يمنحك شعور المسبحة الحقيقية.'
        ],
        actionLabel: 'بدء التسبيح',
        tabTarget: 'tasbih'
      },
      {
        id: 'jummah',
        title: 'مركز يوم الجمعة المبارك وسورة الكهف',
        icon: Sparkles,
        color: 'amber',
        badge: 'الجمعة',
        summary: 'سنن يوم الجمعة الثمان، الصلاة على النبي (ﷺ)، وقراءة سورة الكهف.',
        details: [
          'قائمة تفاعلية لسنن يوم الجمعة المبارك.',
          'اختصار مباشر لقراءة والاستماع لسورة الكهف.',
          'فضل الإكثار من الصلاة على الحبيب المصطفى (ﷺ).'
        ],
        actionLabel: 'أعمال الجمعة',
        tabTarget: 'jummah'
      },
      {
        id: 'names99',
        title: 'أسماء الله الحسنى (99 اسماً)',
        icon: Compass,
        color: 'yellow',
        badge: 'الأسماء',
        summary: 'أسماء الله الحسنى بالخط العربي مع المعاني والفوائد الروحانية.',
        details: [
          'الخط العربي الجميل وبيان معاني كل اسم جليل.',
          'فضائل وبركات التعبد بأسماء الله الحسنى.',
          'بحث سريع وسهل عن الأسماء.'
        ],
        actionLabel: 'عرض الأسماء',
        tabTarget: 'names99'
      },
      {
        id: 'zakat',
        title: 'حاسبة الزكاة الشرعية',
        icon: Calculator,
        color: 'emerald',
        badge: 'مالية',
        summary: 'احسب زكاتك بدقة بناءً على نصاب الذهب والفضة والأموال النقدية.',
        details: [
          'إدخال قيم الذهب، الفضة، النقد والديون.',
          'حساب تلقائي لنسبة 2.5% وفق الضوابط الشرعية.',
          'إرشادات حول مصارف الزكاة المستحقة.'
        ],
        actionLabel: 'حساب الزكاة',
        tabTarget: 'zakat'
      },
      {
        id: 'audio',
        title: 'القرآن الصوتي وقراء القرآن',
        icon: Headphones,
        color: 'emerald',
        badge: 'صوتي',
        summary: 'استمع إلى تلاوات عطرة بأصوات أشهر القراء في العالم الإسلامي.',
        details: [
          'قراء مثل السديس، العفاسي وغيرهم.',
          'تحميل التلاوات للاستماع بدون إنترنت.',
          'تشغيل في الخلفية.'
        ],
        actionLabel: 'القرآن الصوتي',
        tabTarget: 'audio'
      },
      {
        id: 'hadis',
        title: 'مكتبة الأحاديث الصحيحة',
        icon: Quote,
        color: 'orange',
        badge: 'حديث',
        summary: 'أحاديث نبوية صحيحة من صحيح البخاري ومسلم.',
        details: [
          'مجموعات حديثية مرتبة حسب الأبواب.',
          'النص العربي وترجمات واضحة.',
          'بحث سريع.'
        ],
        actionLabel: 'قراءة الأحاديث',
        tabTarget: 'hadis'
      },
      {
        id: 'games',
        title: 'الألعاب والمسابقات الإسلامية',
        icon: Brain,
        color: 'indigo',
        badge: 'ألعاب',
        summary: 'اختبر معلوماتك الإسلامية بمسابقات ممتعة عن الأنبياء والقرآن.',
        details: [
          'أسئلة اختيار من متعدد في السيرة والتاريخ.',
          'تحديات التسلسل الزمني وتطابق السور.',
          'تتبع النتائج.'
        ],
        actionLabel: 'العب الآن',
        tabTarget: 'games'
      },
      {
        id: 'broadcasts',
        title: 'صندوق الإشعارات والإعلانات',
        icon: Bell,
        color: 'amber',
        badge: 'النظام',
        summary: 'الإعلانات والرسائل الرسمية من إدارة التطبيق في مكان واحد.',
        details: [
          'إشعارات رمضان وتنبيهات النظام.',
          'سجل الرسائل السابقة.',
          'التحقق من التحديثات.'
        ],
        actionLabel: 'عرض البريد',
        tabTarget: 'home'
      },
      {
        id: 'settings',
        title: 'إعدادات التطبيق وتخصيص المظهر',
        icon: Settings,
        color: 'slate',
        badge: 'الإعدادات',
        summary: 'تعديل حجم الخطوط، تفعيل الوضع الليلي، واختيار ألوان الثيمات الإسلامية.',
        details: [
          'تعديل حجم الخط العربي والترجمة حسب راحتك.',
          '5 ثيمات إسلامية بألوان راقية.',
          'الوضع الليلي لحماية العين أثناء القراءة.',
          'تغيير اللغة وإدارة التخزين في وضع عدم الاتصال.'
        ],
        actionLabel: 'فتح الإعدادات',
        tabTarget: 'settings'
      }
    ]
  },
  en: {
    headerTitle: 'App User Guide & Navigation',
    headerBadge: 'Guide',
    headerSubtitle: 'Discover what each feature does and how to use the entire app',
    searchPlaceholder: 'Search any feature (e.g. mosques, cards, prayer, ramadan, quran, audio, hadith, games)...',
    clearBtn: 'Clear',
    tipTitle: '💡 Important Tip:',
    tipBody: 'Tap the location button at the very top of the Home page (📍 Location • 🕌 Nearby Mosques) to view all mosques within 300 km of your live coordinates.',
    emptyTitle: (q) => `No features found matching "${q}".`,
    viewAllBtn: 'View All Features',
    footerTagline: 'Al-Shahin (Shahin) Quran • Sadaqah Jariyah',
    closeBtn: 'Got it / Close',
    sections: [
      {
        id: 'quran',
        title: 'Holy Quran Recitation',
        icon: BookOpen,
        color: 'emerald',
        badge: 'Core',
        summary: 'Complete 114 Surahs and 30 Juz with Arabic text, translations and audio.',
        details: [
          'Browse by Surahs or Juz in a single tap.',
          'Read Arabic script, translation and Tafsir for every single Ayah.',
          'Bookmark verses or easily resume from your last read position.',
          'Offline Quran reading with full local cache.'
        ],
        actionLabel: 'Open Quran',
        tabTarget: 'quran'
      },
      {
        id: 'social-card',
        title: 'Social Media Ayah Card Generator',
        icon: Share2,
        color: 'amber',
        badge: 'Highlight',
        summary: 'Generate stunning HD Quran cards for Instagram, Facebook, and WhatsApp.',
        details: [
          'Tap the "Social Card" button below any Ayah.',
          '8 royal Islamic color themes including Kiswah Kaaba and Emerald.',
          '3 aspect ratios: Post (4:5), Story/Status (9:16), and Square (1:1).',
          'Direct HD PNG download, clipboard copy, or share to WhatsApp.'
        ],
        actionLabel: 'Create Card',
        tabTarget: 'quran'
      },
      {
        id: 'nearby-mosques',
        title: 'Nearby Mosques Finder (300 km)',
        icon: MapPin,
        color: 'teal',
        badge: 'Location',
        summary: 'Tap your detected location at the top of the Home page to find all mosques within 300 km.',
        details: [
          'Click the "📍 Location • 🕌 Nearby Mosques" header button.',
          'Loads all mosques within 300 km of your live GPS coordinates.',
          'Shows real-time distance in km, walking/vehicle ETA, and in-app navigation.',
          'Quick search by mosque name.'
        ],
        actionLabel: 'Find Mosques',
        tabTarget: 'nearby-mosques'
      },
      {
        id: 'prayer',
        title: '5 Daily Prayer Times & Hijri Calendar',
        icon: Clock,
        color: 'blue',
        badge: 'Daily',
        summary: 'Accurate prayer times for your coordinates with live countdown to next prayer.',
        details: [
          'Fajr, Dhuhr, Asr, Maghrib, and Isha prayer timings.',
          'Live countdown showing exact hours and minutes remaining.',
          'Daily Sehri, Iftar timings and current Islamic Hijri date.'
        ],
        actionLabel: 'Prayer Times',
        tabTarget: 'prayer'
      },
      {
        id: 'ramadan',
        title: 'Ramadan Special Hub & Khatam Tracker',
        icon: Moon,
        color: 'amber',
        badge: 'Special',
        summary: 'Full 30-day Ramadan calendar, countdown, duas and Khatam progress tracker.',
        details: [
          'Complete 30-day Sehri and Iftar timetable at a glance.',
          'Essential Ramadan duas for Fasting, Iftar, and Laylatul Qadr.',
          'Track your personal 30-day Quran Khatam progress easily.'
        ],
        actionLabel: 'Ramadan Hub',
        tabTarget: 'ramadan'
      },
      {
        id: 'duas',
        title: 'Hisnul Muslim (Fortress of the Muslim)',
        icon: ShieldCheck,
        color: 'emerald',
        badge: 'Supplications',
        summary: 'Authentic morning, evening, sleep and daily life supplications from Sahih Hadith.',
        details: [
          'Categorized collection of 100+ authentic Islamic duas.',
          'Arabic script, transliteration, English meaning, and references.',
          'One-tap audio pronunciation playback.'
        ],
        actionLabel: 'View Duas',
        tabTarget: 'duas'
      },
      {
        id: 'tasbih',
        title: 'Digital Tasbih Counter',
        icon: Activity,
        color: 'purple',
        badge: 'Dhikr',
        summary: 'Smart dhikr counter with haptic vibration feedback and preset target counts.',
        details: [
          'Tap anywhere on the card or screen to increment your count.',
          'Preset targets for 33, 100, or unlimited count.',
          'Subtle haptic vibration gives you the feel of physical prayer beads.'
        ],
        actionLabel: 'Start Tasbih',
        tabTarget: 'tasbih'
      },
      {
        id: 'jummah',
        title: 'Friday Jummah Hub & Surah Kahf',
        icon: Sparkles,
        color: 'amber',
        badge: 'Friday',
        summary: '8 Sunnah acts checklist, Durood Sharif counter, and Surah Al-Kahf recitation.',
        details: [
          'Interactive checklist for 8 Friday Sunnah acts.',
          'One-tap shortcut to recite or listen to Surah Al-Kahf.',
          'Durood Sharif virtues and recitation guide.'
        ],
        actionLabel: 'Jummah Hub',
        tabTarget: 'jummah'
      },
      {
        id: 'names99',
        title: '99 Beautiful Names of Allah (Asmaul Husna)',
        icon: Compass,
        color: 'yellow',
        badge: 'Names',
        summary: 'The 99 Divine Names with Arabic calligraphy, English meaning, and virtues.',
        details: [
          'Clear Arabic script and detailed translation for each Name.',
          'Spiritual virtues and benefits of reciting each divine attribute.',
          'Instant search and filter by name.'
        ],
        actionLabel: 'View 99 Names',
        tabTarget: 'names99'
      },
      {
        id: 'zakat',
        title: 'Zakat Calculator',
        icon: Calculator,
        color: 'emerald',
        badge: 'Finance',
        summary: 'Calculate your exact Zakat based on gold, silver, cash, and business assets.',
        details: [
          'Enter amounts for gold, cash, investments, and liabilities.',
          'Automatic 2.5% calculation according to Shariah Nisab.',
          'Guidelines on eligible recipients of Zakat.'
        ],
        actionLabel: 'Calculate Zakat',
        tabTarget: 'zakat'
      },
      {
        id: 'audio',
        title: 'Audio Quran & Reciters',
        icon: Headphones,
        color: 'emerald',
        badge: 'Audio',
        summary: 'Listen to sublime Quran recitations by world-renowned reciters.',
        details: [
          'Famous reciters including Al-Sudais, Alafasy, and Maher Al-Muaiqly.',
          'Download audio files for offline listening without internet.',
          'Background playback support.'
        ],
        actionLabel: 'Audio Quran',
        tabTarget: 'audio'
      },
      {
        id: 'hadis',
        title: 'Sahih Hadith Library',
        icon: Quote,
        color: 'orange',
        badge: 'Hadith',
        summary: 'Authentic Hadiths from Sahih Al-Bukhari, Sahih Muslim and more.',
        details: [
          'Chapter-wise authentic Hadith collections.',
          'Arabic text with clear translations.',
          'Quick search functionality.'
        ],
        actionLabel: 'Read Hadiths',
        tabTarget: 'hadis'
      },
      {
        id: 'games',
        title: 'Islamic Educational Games',
        icon: Brain,
        color: 'indigo',
        badge: 'Games',
        summary: 'Test your knowledge with fun quizzes on Islamic history and Prophets.',
        details: [
          'Multiple choice quizzes on prophetic history.',
          'Timeline and Surah matching challenges.',
          'Score tracking and learning feedback.'
        ],
        actionLabel: 'Play Games',
        tabTarget: 'games'
      },
      {
        id: 'broadcasts',
        title: 'Broadcast & Notification Inbox',
        icon: Bell,
        color: 'amber',
        badge: 'System',
        summary: 'Important announcements and admin messages in one inbox.',
        details: [
          'Ramadan announcements and system alerts.',
          'Review past announcements anytime.',
          'Check for app version updates.'
        ],
        actionLabel: 'View Inbox',
        tabTarget: 'home'
      },
      {
        id: 'settings',
        title: 'App Customization & Theme Settings',
        icon: Settings,
        color: 'slate',
        badge: 'Settings',
        summary: 'Adjust font sizes, switch to Dark Mode, and choose between 5 Islamic themes.',
        details: [
          'Adjust Arabic and translation font sizes to your preference.',
          'Switch between 5 aesthetic Islamic theme color palettes.',
          'Comfortable eye-friendly Dark Mode.',
          'Change display language and manage offline downloads.'
        ],
        actionLabel: 'Open Settings',
        tabTarget: 'settings'
      }
    ]
  }
};

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate,
  language = 'bn' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentLang = (typeof language === 'string' && GUIDE_LOCALIZED_DATA[language]) ? language : 'bn';
  const data = GUIDE_LOCALIZED_DATA[currentLang] || GUIDE_LOCALIZED_DATA.en;

  const filteredSections = data.sections.filter(sec => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return sec.title.toLowerCase().includes(q) || 
           sec.summary.toLowerCase().includes(q) ||
           sec.details.some(d => d.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-transparent shrink-0">
          <div className="flex items-center gap-3.5">
            <AppIcon size={44} animated={false} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-800 dark:text-slate-100">
                  {data.headerTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-white shadow-xs">
                  {data.headerBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {data.headerSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={data.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-14 py-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                {data.clearBtn}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Guide Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-grow no-scrollbar">
          {/* Quick Tip Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div className="text-xs">
              <h4 className="font-black text-emerald-900 dark:text-emerald-200 mb-0.5">
                {data.tipTitle}
              </h4>
              <p className="text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed">
                {data.tipBody}
              </p>
            </div>
          </div>

          {filteredSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div 
                key={sec.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm sm:text-base text-slate-800 dark:text-slate-100">
                          {sec.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {sec.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {sec.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="pl-3 border-l-2 border-emerald-500/30 space-y-1.5 py-1">
                  {sec.details.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate(sec.tabTarget);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-black hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all active:scale-95"
                  >
                    <span>{sec.actionLabel}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <HelpCircle size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-bold text-slate-500">
                {data.emptyTitle(searchQuery)}
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {data.viewAllBtn}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
          <p className="text-[11px] font-bold text-slate-400">
            {data.footerTagline}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black active:scale-95 transition-transform"
          >
            {data.closeBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AppGuideModal;
