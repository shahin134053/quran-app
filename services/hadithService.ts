
import { AppLanguage } from '../types';

export interface HadithBook {
  id: string;
  name: string;
  arabicName: string;
  totalHadiths?: number;
}

export interface HadithData {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades: any[];
  reference: {
    book: number;
    hadith: number;
  };
}

export const HADITH_BOOKS: HadithBook[] = [
  { id: 'bukhari', name: 'Sahih al-Bukhari', arabicName: 'صحيح البخاري' },
  { id: 'muslim', name: 'Sahih Muslim', arabicName: 'صحيح مسلم' },
  { id: 'nasai', name: 'Sunan an-Nasa\'i', arabicName: 'سنن النسائي' },
  { id: 'abudawud', name: 'Sunan Abu Dawood', arabicName: 'سنن أبي داود' },
  { id: 'tirmidhi', name: 'Jami\' at-Tirmidhi', arabicName: 'جامع الترمذي' },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', arabicName: 'سنن ابن ماجه' },
  { id: 'malik', name: 'Muwatta Malik', arabicName: 'موطأ مالك' },
  { id: 'nawawi40', name: '40 Hadith Nawawi', arabicName: 'الأربعون النووية' },
];

const LANGUAGE_MAP: Record<AppLanguage, string> = {
  en: 'eng',
  bn: 'ben',
  hi: 'eng', // Fallback to English for Hindi as it's not widely available in this API
  ar: 'ara'
};

export const fetchHadiths = async (
  bookId: string,
  sectionId: number,
  language: AppLanguage
): Promise<HadithData[]> => {
  const langCode = LANGUAGE_MAP[language];
  // Special handling for Nawawi which might have different structure or ID
  // Actually, Nawawi is usually 'eng-nawawi'
  
  let edition = `${langCode}-${bookId}`;
  if (bookId === 'nawawi40') {
    edition = `${langCode}-nawawi`; // Check if this is correct, usually it is
  }

  try {
    // Try to fetch the section
    const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}/sections/${sectionId}.json`);
    if (!response.ok) {
      // If section 1 fails, maybe the book doesn't exist in this language
      if (sectionId === 1 && language !== 'en') {
        // Fallback to English
        return fetchHadiths(bookId, sectionId, 'en');
      }
      return [];
    }
    const data = await response.json();
    return data.hadiths;
  } catch (error) {
    console.error(`Failed to fetch hadiths for ${bookId} section ${sectionId}`, error);
    return [];
  }
};
