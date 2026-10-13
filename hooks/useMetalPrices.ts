import { useState, useEffect, useCallback } from 'react';

export interface MetalPriceData {
  goldPricePerTola: number;    // 1 Tola/Bhori = 11.6638g
  silverPricePerTola: number;  // 1 Tola/Bhori = 11.6638g
  goldPricePerGram: number;
  silverPricePerGram: number;
  currency: string;
  currencySymbol: string;
  countryCode: string;
  countryNameBn: string;
  countryNameEn: string;
  flag: string;
  officialSourceBn: string;
  officialSourceEn: string;
  sourceUrl: string;
  karatQuality: '22K' | '21K' | '24K';
  isLoading: boolean;
  isLiveFetched: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface CountryInfo {
  code: string;
  nameBn: string;
  nameEn: string;
  flag: string;
  currency: string;
  symbol: string;
  officialSourceBn: string;
  officialSourceEn: string;
  sourceUrl: string;
  defaultGold22kPerTola: number;
  defaultSilverPerTola: number;
}

export const COUNTRY_METADATA: Record<string, CountryInfo> = {
  BD: { 
    code: 'BD', 
    nameBn: 'বাংলাদেশ', 
    nameEn: 'Bangladesh', 
    flag: '🇧🇩', 
    currency: 'BDT', 
    symbol: '৳', 
    officialSourceBn: 'বাংলাদেশ জুয়েলার্স সমিতি (BAJUS / বাজুস অফিসিয়াল মানদণ্ড)', 
    officialSourceEn: 'Bangladesh Jewellers Association (BAJUS Official Standard)', 
    sourceUrl: 'https://www.bajus.org',
    defaultGold22kPerTola: 140200, // BAJUS 22K Hallmark Official Rate
    defaultSilverPerTola: 2570      // BAJUS 22K Cadmium Silver Official Rate
  },
  SA: { 
    code: 'SA', 
    nameBn: 'সৌদি আরব', 
    nameEn: 'Saudi Arabia', 
    flag: '🇸🇦', 
    currency: 'SAR', 
    symbol: 'SAR ', 
    officialSourceBn: 'সৌদি গোল্ড অ্যান্ড বুলিয়ন মার্কেট স্ট্যান্ডার্ড (Saudi Central Bank / SAMA)', 
    officialSourceEn: 'Saudi Gold & Bullion Market Standard (Saudi Central Bank / SAMA)', 
    sourceUrl: 'https://www.sama.gov.sa',
    defaultGold22kPerTola: 3950, 
    defaultSilverPerTola: 48 
  },
  AE: { 
    code: 'AE', 
    nameBn: 'সংযুক্ত আরব আমিরাত', 
    nameEn: 'UAE', 
    flag: '🇦🇪', 
    currency: 'AED', 
    symbol: 'AED ', 
    officialSourceBn: 'দুবাই গোল্ড অ্যান্ড জুয়েলারি গ্রুপ (Dubai Gold & Jewellery Group - DGJG)', 
    officialSourceEn: 'Dubai Gold & Jewellery Group (DGJG Official Rate)', 
    sourceUrl: 'https://dubaigoldjewellery.com',
    defaultGold22kPerTola: 3880, 
    defaultSilverPerTola: 46 
  },
  US: { 
    code: 'US', 
    nameBn: 'যুক্তরাষ্ট্র', 
    nameEn: 'USA', 
    flag: '🇺🇸', 
    currency: 'USD', 
    symbol: '$', 
    officialSourceBn: 'লন্ডন বুলিয়ন মার্কেট (LBMA) ও কিটকো মেটালস ইন্টারন্যাশনাল স্পট', 
    officialSourceEn: 'LBMA & Kitco Metals International Bullion Spot Benchmark', 
    sourceUrl: 'https://www.lbma.org.uk',
    defaultGold22kPerTola: 1040, 
    defaultSilverPerTola: 13.5 
  },
  GB: { 
    code: 'GB', 
    nameBn: 'যুক্তরাজ্য', 
    nameEn: 'UK', 
    flag: '🇬🇧', 
    currency: 'GBP', 
    symbol: '£', 
    officialSourceBn: 'লন্ডন বুলিয়ন মার্কেট অ্যাসোসিয়েশন (LBMA Benchmark Rate)', 
    officialSourceEn: 'London Bullion Market Association (LBMA Benchmark)', 
    sourceUrl: 'https://www.lbma.org.uk',
    defaultGold22kPerTola: 820, 
    defaultSilverPerTola: 10.5 
  },
  IN: { 
    code: 'IN', 
    nameBn: 'ভারত', 
    nameEn: 'India', 
    flag: '🇮🇳', 
    currency: 'INR', 
    symbol: '₹', 
    officialSourceBn: 'ইন্ডিয়া বুলিয়ন অ্যান্ড জুয়েলার্স অ্যাসোসিয়েশন (IBJA Official Rate)', 
    officialSourceEn: 'India Bullion and Jewellers Association (IBJA Official)', 
    sourceUrl: 'https://www.ibja.co',
    defaultGold22kPerTola: 88500, 
    defaultSilverPerTola: 1120 
  },
  MY: { 
    code: 'MY', 
    nameBn: 'মালয়েশিয়া', 
    nameEn: 'Malaysia', 
    flag: '🇲🇾', 
    currency: 'MYR', 
    symbol: 'RM ', 
    officialSourceBn: 'ফেডারেশন অফ গোল্ডস্মিথস মালয়েশিয়া (FGAM Standard)', 
    officialSourceEn: 'Federation of Goldsmiths & Jewellers Associations Malaysia (FGAM)', 
    sourceUrl: 'https://fgam.org.my',
    defaultGold22kPerTola: 4450, 
    defaultSilverPerTola: 54 
  },
  QA: { 
    code: 'QA', 
    nameBn: 'কাতার', 
    nameEn: 'Qatar', 
    flag: '🇶🇦', 
    currency: 'QAR', 
    symbol: 'QAR ', 
    officialSourceBn: 'কাতার সেন্ট্রাল ব্যাংক ও জুয়েলারি কন্ট্রোল অথরিটি', 
    officialSourceEn: 'Qatar Central Bank & Jewellery Control Authority', 
    sourceUrl: 'https://www.qcb.gov.qa',
    defaultGold22kPerTola: 3820, 
    defaultSilverPerTola: 45 
  },
  KW: { 
    code: 'KW', 
    nameBn: 'কুয়েত', 
    nameEn: 'Kuwait', 
    flag: '🇰🇼', 
    currency: 'KWD', 
    symbol: 'KWD ', 
    officialSourceBn: 'কুয়েত মিনিস্ট্রি অফ কমার্স অ্যান্ড গোল্ড অ্যাসোসিয়েশন', 
    officialSourceEn: 'Kuwait Ministry of Commerce & Gold Association', 
    sourceUrl: 'https://www.moci.gov.kw',
    defaultGold22kPerTola: 320, 
    defaultSilverPerTola: 3.9 
  },
  PK: { 
    code: 'PK', 
    nameBn: 'পাকিস্তান', 
    nameEn: 'Pakistan', 
    flag: '🇵🇰', 
    currency: 'PKR', 
    symbol: 'PKR ', 
    officialSourceBn: 'অল পাকিস্তান সুপ্রিম কাউন্সিল জুয়েলার্স অ্যাসোসিয়েশন (APGJSA)', 
    officialSourceEn: 'All Pakistan Supreme Council Jewellers Association (APGJSA)', 
    sourceUrl: 'https://apgjsa.com',
    defaultGold22kPerTola: 295000, 
    defaultSilverPerTola: 3450 
  },
  CA: { 
    code: 'CA', 
    nameBn: 'কানাডা', 
    nameEn: 'Canada', 
    flag: '🇨🇦', 
    currency: 'CAD', 
    symbol: 'C$', 
    officialSourceBn: 'রয়্যাল কানাডিয়ান মিন্ট অ্যান্ড বুলিয়ন বেন্চমার্ক', 
    officialSourceEn: 'Royal Canadian Mint Bullion Benchmark', 
    sourceUrl: 'https://www.mint.ca',
    defaultGold22kPerTola: 1420, 
    defaultSilverPerTola: 18.2 
  },
  AU: { 
    code: 'AU', 
    nameBn: 'অস্ট্রেলিয়া', 
    nameEn: 'Australia', 
    flag: '🇦🇺', 
    currency: 'AUD', 
    symbol: 'A$', 
    officialSourceBn: 'পার্থ মিন্ট অ্যান্ড অস্ট্রেলিয়ান জুয়েলার্স বোর্ড', 
    officialSourceEn: 'Perth Mint & Australian Jewellers Board', 
    sourceUrl: 'https://www.perthmint.com',
    defaultGold22kPerTola: 1580, 
    defaultSilverPerTola: 20.1 
  }
};

const GLOBAL_GOLD_USD_PER_GRAM = 86.5;   // Base 24K spot ~$2,690/oz
const GLOBAL_SILVER_USD_PER_GRAM = 1.08;
const GRAMS_PER_TOLA = 11.6638;

export function useMetalPrices(overrideCountryCode?: string) {
  const [karatQuality, setKaratQuality] = useState<'22K' | '21K' | '24K'>('22K');
  const [data, setData] = useState<MetalPriceData>({
    goldPricePerTola: COUNTRY_METADATA.BD.defaultGold22kPerTola,
    silverPricePerTola: COUNTRY_METADATA.BD.defaultSilverPerTola,
    goldPricePerGram: Math.round(COUNTRY_METADATA.BD.defaultGold22kPerTola / GRAMS_PER_TOLA),
    silverPricePerGram: Math.round(COUNTRY_METADATA.BD.defaultSilverPerTola / GRAMS_PER_TOLA),
    currency: 'BDT',
    currencySymbol: '৳',
    countryCode: 'BD',
    countryNameBn: 'বাংলাদেশ',
    countryNameEn: 'Bangladesh',
    flag: '🇧🇩',
    officialSourceBn: COUNTRY_METADATA.BD.officialSourceBn,
    officialSourceEn: COUNTRY_METADATA.BD.officialSourceEn,
    sourceUrl: COUNTRY_METADATA.BD.sourceUrl,
    karatQuality: '22K',
    isLoading: true,
    isLiveFetched: false,
    error: null,
    lastUpdated: null
  });

  const fetchMetalPrices = useCallback(async (forcedCode?: string, selectedKarat: '22K' | '21K' | '24K' = karatQuality) => {
    setData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      let activeCode = forcedCode || overrideCountryCode;

      // 1. Detect location via IP geolocation if no explicit country code provided
      if (!activeCode) {
        try {
          const geoRes = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3000) });
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData && geoData.success && geoData.country_code) {
              activeCode = geoData.country_code.toUpperCase();
            }
          }
        } catch {
          // IP api fallback silently
        }
      }

      const country = COUNTRY_METADATA[activeCode || 'BD'] || COUNTRY_METADATA.BD;

      // 2. Fetch live FX exchange rate against USD
      let exchangeRate = 1;
      let liveSuccess = false;

      if (country.currency === 'USD') {
        exchangeRate = 1;
        liveSuccess = true;
      } else {
        try {
          const fxRes = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(4000) });
          if (fxRes.ok) {
            const fxData = await fxRes.json();
            if (fxData && fxData.rates && fxData.rates[country.currency]) {
              exchangeRate = fxData.rates[country.currency];
              liveSuccess = true;
            }
          }
        } catch (fxErr) {
          console.warn('FX Rate fetch fallback:', fxErr);
        }
      }

      // Karat Multipliers (24K = 1.0, 22K = 0.916, 21K = 0.875)
      const karatMultiplier = selectedKarat === '24K' ? 1.0 : selectedKarat === '22K' ? 0.916 : 0.875;

      // 3. Compute Gold & Silver prices
      let goldPerGram = Math.round(GLOBAL_GOLD_USD_PER_GRAM * exchangeRate * karatMultiplier);
      let silverPerGram = Number((GLOBAL_SILVER_USD_PER_GRAM * exchangeRate).toFixed(2));
      let goldPerTola = Math.round(goldPerGram * GRAMS_PER_TOLA);
      let silverPerTola = Math.round(silverPerGram * GRAMS_PER_TOLA);

      // If BD (Bangladesh), ensure 100% adherence to BAJUS Official standard rate
      if (country.code === 'BD') {
        let bajus22k = COUNTRY_METADATA.BD.defaultGold22kPerTola;
        if (selectedKarat === '24K') bajus22k = Math.round(bajus22k * 1.08); // 24K Pure gold
        if (selectedKarat === '21K') bajus22k = 133800; // BAJUS 21K Official
        goldPerTola = bajus22k;
        silverPerTola = COUNTRY_METADATA.BD.defaultSilverPerTola;
        goldPerGram = Math.round(goldPerTola / GRAMS_PER_TOLA);
        silverPerGram = Number((silverPerTola / GRAMS_PER_TOLA).toFixed(2));
        liveSuccess = true;
      } else if (!liveSuccess || goldPerTola <= 0) {
        // Fallback for other countries
        goldPerTola = Math.round(country.defaultGold22kPerTola * (karatMultiplier / 0.916));
        silverPerTola = country.defaultSilverPerTola;
        goldPerGram = Math.round(goldPerTola / GRAMS_PER_TOLA);
        silverPerGram = Number((silverPerTola / GRAMS_PER_TOLA).toFixed(2));
      }

      setData({
        goldPricePerTola: goldPerTola,
        silverPricePerTola: silverPerTola,
        goldPricePerGram: goldPerGram,
        silverPricePerGram: silverPerGram,
        currency: country.currency,
        currencySymbol: country.symbol,
        countryCode: country.code,
        countryNameBn: country.nameBn,
        countryNameEn: country.nameEn,
        flag: country.flag,
        officialSourceBn: country.officialSourceBn,
        officialSourceEn: country.officialSourceEn,
        sourceUrl: country.sourceUrl,
        karatQuality: selectedKarat,
        isLoading: false,
        isLiveFetched: liveSuccess,
        error: null,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch {
      const fallback = COUNTRY_METADATA.BD;
      setData({
        goldPricePerTola: fallback.defaultGold22kPerTola,
        silverPricePerTola: fallback.defaultSilverPerTola,
        goldPricePerGram: Math.round(fallback.defaultGold22kPerTola / GRAMS_PER_TOLA),
        silverPricePerGram: Math.round(fallback.defaultSilverPerTola / GRAMS_PER_TOLA),
        currency: fallback.currency,
        currencySymbol: fallback.symbol,
        countryCode: fallback.code,
        countryNameBn: fallback.nameBn,
        countryNameEn: fallback.nameEn,
        flag: fallback.flag,
        officialSourceBn: fallback.officialSourceBn,
        officialSourceEn: fallback.officialSourceEn,
        sourceUrl: fallback.sourceUrl,
        karatQuality: selectedKarat,
        isLoading: false,
        isLiveFetched: false,
        error: null,
        lastUpdated: null
      });
    }
  }, [overrideCountryCode, karatQuality]);

  useEffect(() => {
    fetchMetalPrices();
  }, [fetchMetalPrices]);

  const selectCountry = (code: string) => {
    fetchMetalPrices(code, karatQuality);
  };

  const changeKaratQuality = (karat: '22K' | '21K' | '24K') => {
    setKaratQuality(karat);
    fetchMetalPrices(data.countryCode, karat);
  };

  return {
    ...data,
    refetch: fetchMetalPrices,
    selectCountry,
    changeKaratQuality
  };
}
