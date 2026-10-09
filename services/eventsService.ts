
export interface IslamicEvent {
  id: number;
  title_en: string;
  title_bn: string;
  date_hijri: string;
  description_en: string;
  description_bn: string;
  importance: 'high' | 'medium' | 'low';
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 1,
    title_en: "Ramadan Begins",
    title_bn: "রমজান শুরু",
    date_hijri: "1 Ramadan",
    description_en: "The month of fasting begins.",
    description_bn: "সিয়াম সাধনার মাস শুরু।",
    importance: 'high'
  },
  {
    id: 2,
    title_en: "Laylat al-Qadr",
    title_bn: "লাইলাতুল কদর",
    date_hijri: "27 Ramadan",
    description_en: "The Night of Power, better than a thousand months.",
    description_bn: "হাজার মাসের চেয়েও উত্তম রাত।",
    importance: 'high'
  },
  {
    id: 3,
    title_en: "Eid al-Fitr",
    title_bn: "ঈদুল ফিতর",
    date_hijri: "1 Shawwal",
    description_en: "Festival of breaking the fast.",
    description_bn: "রোজা শেষ হওয়ার আনন্দ উৎসব।",
    importance: 'high'
  },
  {
    id: 4,
    title_en: "Day of Arafah",
    title_bn: "আরাফাতের দিন",
    date_hijri: "9 Dhul-Hijjah",
    description_en: "The most important day of Hajj.",
    description_bn: "হজ্জের সবচেয়ে গুরুত্বপূর্ণ দিন।",
    importance: 'high'
  },
  {
    id: 5,
    title_en: "Eid al-Adha",
    title_bn: "ঈদুল আযহা",
    date_hijri: "10 Dhul-Hijjah",
    description_en: "Festival of Sacrifice.",
    description_bn: "কুরবানির ঈদ।",
    importance: 'high'
  },
  {
    id: 6,
    title_en: "Islamic New Year",
    title_bn: "ইসলামি নববর্ষ",
    date_hijri: "1 Muharram",
    description_en: "First day of the Hijri calendar.",
    description_bn: "হিজরি সনের প্রথম দিন।",
    importance: 'medium'
  },
  {
    id: 7,
    title_en: "Ashura",
    title_bn: "আশুরা",
    date_hijri: "10 Muharram",
    description_en: "Day of fasting and remembrance.",
    description_bn: "১০ই মহরমের ফজিলতপূর্ণ দিন।",
    importance: 'high'
  }
];
