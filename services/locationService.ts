export interface LocationItem {
  id: string;
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
  category: 'division' | 'holy' | 'district' | 'international';
  country?: string;
  countryCode?: string;
  flag?: string;
}

export const INTERNATIONAL_TEST_PRESETS: LocationItem[] = [
  // USA (United States)
  { id: 'nyc', nameBn: 'নিউ ইয়র্ক (যুক্তরাষ্ট্র)', nameEn: 'New York City, USA', lat: 40.7128, lng: -74.0060, category: 'international', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  { id: 'la', nameBn: 'লস অ্যাঞ্জেলেস (যুক্তরাষ্ট্র)', nameEn: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, category: 'international', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  { id: 'chicago', nameBn: 'শিকাগো (যুক্তরাষ্ট্র)', nameEn: 'Chicago, USA', lat: 41.8781, lng: -87.6298, category: 'international', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  { id: 'houston', nameBn: 'হিউস্টন (যুক্তরাষ্ট্র)', nameEn: 'Houston, USA', lat: 29.7604, lng: -95.3698, category: 'international', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  { id: 'dallas', nameBn: 'ডালাস (যুক্তরাষ্ট্র)', nameEn: 'Dallas, USA', lat: 32.7767, lng: -96.7970, category: 'international', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  { id: 'dc', nameBn: 'ওয়াশিংটন ডিসি (যুক্তরাষ্ট্র)', nameEn: 'Washington D.C., USA', lat: 38.9072, lng: -77.0369, category: 'international', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  { id: 'paterson', nameBn: 'প্যাটারসন, নিউ জার্সি (যুক্তরাষ্ট্র)', nameEn: 'Paterson, NJ, USA', lat: 40.9168, lng: -74.1718, category: 'international', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  
  // UK & Europe
  { id: 'london', nameBn: 'লন্ডন (যুক্তরাজ্য)', nameEn: 'London, UK', lat: 51.5074, lng: -0.1278, category: 'international', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧' },
  { id: 'birmingham', nameBn: 'বার্মিংহাম (যুক্তরাজ্য)', nameEn: 'Birmingham, UK', lat: 52.4862, lng: -1.8904, category: 'international', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧' },
  { id: 'paris', nameBn: 'প্যারিস (ফ্রান্স)', nameEn: 'Paris, France', lat: 48.8566, lng: 2.3522, category: 'international', country: 'France', countryCode: 'FR', flag: '🇫🇷' },
  { id: 'istanbul', nameBn: 'ইস্তাম্বুল (তুরস্ক)', nameEn: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, category: 'international', country: 'Turkey', countryCode: 'TR', flag: '🇹🇷' },

  // Canada & Australia
  { id: 'toronto', nameBn: 'টরন্টো (কানাডা)', nameEn: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, category: 'international', country: 'Canada', countryCode: 'CA', flag: '🇨🇦' },
  { id: 'sydney', nameBn: 'সিডনি (অস্ট্রেলিয়া)', nameEn: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, category: 'international', country: 'Australia', countryCode: 'AU', flag: '🇦🇺' },

  // Middle East & Asia
  { id: 'mecca_int', nameBn: 'মক্কা মুকাররমা (সৌদি আরব)', nameEn: 'Makkah, Saudi Arabia', lat: 21.4225, lng: 39.8262, category: 'international', country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦' },
  { id: 'medina_int', nameBn: 'মদিনা মুনাওয়ারা (সৌদি আরব)', nameEn: 'Madinah, Saudi Arabia', lat: 24.5247, lng: 39.5692, category: 'international', country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦' },
  { id: 'riyadh', nameBn: 'রিয়াদ (সৌদি আরব)', nameEn: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753, category: 'international', country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦' },
  { id: 'dubai', nameBn: 'দুবাই (সংযুক্ত আরব আমিরাত)', nameEn: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, category: 'international', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪' },
  { id: 'kl', nameBn: 'কুয়ালালামপুর (মালয়েশিয়া)', nameEn: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, category: 'international', country: 'Malaysia', countryCode: 'MY', flag: '🇲🇾' },

  // Bangladesh Key Cities
  { id: 'dhaka_int', nameBn: 'ঢাকা (বাংলাদেশ)', nameEn: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125, category: 'international', country: 'Bangladesh', countryCode: 'BD', flag: '🇧🇩' },
  { id: 'ctg_int', nameBn: 'চট্টগ্রাম (বাংলাদেশ)', nameEn: 'Chattogram, Bangladesh', lat: 22.3569, lng: 91.7832, category: 'international', country: 'Bangladesh', countryCode: 'BD', flag: '🇧🇩' },
  { id: 'sylhet_int', nameBn: 'সিলেট (বাংলাদেশ)', nameEn: 'Sylhet, Bangladesh', lat: 24.8949, lng: 91.8687, category: 'international', country: 'Bangladesh', countryCode: 'BD', flag: '🇧🇩' },
];

export const KNOWN_LOCATIONS: LocationItem[] = [
  // 8 Divisions of Bangladesh
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', lat: 23.8103, lng: 90.4125, category: 'division', country: 'Bangladesh' },
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', lat: 22.3569, lng: 91.7832, category: 'division', country: 'Bangladesh' },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lng: 91.8687, category: 'division', country: 'Bangladesh' },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3636, lng: 88.6241, category: 'division', country: 'Bangladesh' },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lng: 89.5403, category: 'division', country: 'Bangladesh' },
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', lat: 22.7010, lng: 90.3535, category: 'division', country: 'Bangladesh' },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', lat: 25.7439, lng: 89.2752, category: 'division', country: 'Bangladesh' },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', lat: 24.7471, lng: 90.4203, category: 'division', country: 'Bangladesh' },

  // Holy Islamic Sanctuaries
  { id: 'mecca', nameBn: 'মক্কা মুকাররমা', nameEn: 'Mecca, SA', lat: 21.4225, lng: 39.8262, category: 'holy', country: 'Saudi Arabia' },
  { id: 'medina', nameBn: 'মদিনা মুনাওয়ারা', nameEn: 'Medina, SA', lat: 24.5247, lng: 39.5692, category: 'holy', country: 'Saudi Arabia' },
  { id: 'jerusalem', nameBn: 'বায়তুল মুকাদ্দাস', nameEn: 'Al-Quds (Jerusalem)', lat: 31.7683, lng: 35.2137, category: 'holy', country: 'Palestine' },

  // Major Districts of Bangladesh
  { id: 'cumilla', nameBn: 'কুমিল্লা', nameEn: 'Cumilla', lat: 23.4682, lng: 91.1788, category: 'district', country: 'Bangladesh' },
  { id: 'bogura', nameBn: 'বগুড়া', nameEn: 'Bogura', lat: 24.8465, lng: 89.3777, category: 'district', country: 'Bangladesh' },
  { id: 'coxsbazar', nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", lat: 21.4272, lng: 91.9702, category: 'district', country: 'Bangladesh' },
  { id: 'gazipur', nameBn: 'গাজীপুর', nameEn: 'Gazipur', lat: 23.9999, lng: 90.4203, category: 'district', country: 'Bangladesh' },
  { id: 'narayanganj', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', lat: 23.6238, lng: 90.5000, category: 'district', country: 'Bangladesh' },
  { id: 'feni', nameBn: 'ফেনী', nameEn: 'Feni', lat: 23.0159, lng: 91.3976, category: 'district', country: 'Bangladesh' },
  { id: 'noakhali', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', lat: 22.8695, lng: 91.0993, category: 'district', country: 'Bangladesh' },
  { id: 'jashore', nameBn: 'যশোর', nameEn: 'Jashore', lat: 23.1664, lng: 89.2081, category: 'district', country: 'Bangladesh' },
  { id: 'tangail', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', lat: 24.2513, lng: 89.9167, category: 'district', country: 'Bangladesh' },

  // USA & Global Presets for Global Geocoding matching
  ...INTERNATIONAL_TEST_PRESETS
];

/**
 * Calculates geographic distance in kilometers using the Haversine formula
 */
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Resolves a human-friendly city/division name based on coordinates.
 * Falls back to "বর্তমান অবস্থান" (in Bengali) or "Current Location" (in English).
 * Never returns the raw generic string "Detected Location".
 */
export function resolveFriendlyLocationName(lat: number, lng: number, language: string = 'bn'): string {
  let closest: LocationItem | null = null;
  let minDistance = Infinity;

  for (const loc of KNOWN_LOCATIONS) {
    const dist = getDistanceKm(lat, lng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  // If within 85 km of a known city/division/international city, return its clean localized name
  if (closest && minDistance <= 85) {
    return language === 'bn' ? closest.nameBn : closest.nameEn;
  }

  // If outside known boundaries, return a clean localized fallback
  return language === 'bn' ? 'বর্তমান অবস্থান' : 'Current Location';
}

/**
 * Searches for known coordinates by location name or alias
 */
export function getCoordinatesForLocationName(name: string): { lat: number; lng: number; item?: LocationItem } | null {
  if (!name) return null;
  const clean = name.toLowerCase().trim();

  for (const loc of KNOWN_LOCATIONS) {
    if (
      loc.nameBn.toLowerCase().includes(clean) ||
      loc.nameEn.toLowerCase().includes(clean) ||
      clean.includes(loc.nameBn.toLowerCase()) ||
      clean.includes(loc.nameEn.toLowerCase())
    ) {
      return { lat: loc.lat, lng: loc.lng, item: loc };
    }
  }

  // Common quick matching aliases
  if (clean.includes('los angeles') || clean.includes('লস অ্যাঞ্জেলেস') || clean.includes('la')) {
    return { lat: 34.0522, lng: -118.2437 };
  }
  if (clean.includes('new york') || clean.includes('নিউ ইয়র্ক') || clean.includes('nyc')) {
    return { lat: 40.7128, lng: -74.0060 };
  }
  if (clean.includes('chicago') || clean.includes('শিকাগো')) {
    return { lat: 41.8781, lng: -87.6298 };
  }
  if (clean.includes('dhaka') || clean.includes('ঢাকা')) {
    return { lat: 23.8103, lng: 90.4125 };
  }

  return null;
}

/**
 * Asynchronously detects friendly location details from GPS coordinates
 * using 100% free, cost-free client APIs with zero paid keys.
 */
export async function detectLocationFromGPS(
  lat: number,
  lng: number,
  language: string = 'bn'
): Promise<{ name: string; nameBn: string; nameEn: string; city?: string; country?: string }> {
  // 1. First attempt OpenStreetMap Nominatim reverse geocoding for neighborhood-level accuracy
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1&accept-language=${
        language === 'bn' ? 'bn,en' : 'en,bn'
      }`,
      {
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const neighborhood = addr.neighbourhood || addr.suburb || addr.residential || addr.quarter || '';
      const city = addr.city || addr.town || addr.county || '';
      const state = addr.state || '';
      const country = addr.country || '';

      const parts = [neighborhood, city || state].filter(Boolean);
      if (parts.length > 0) {
        const full = parts.join(', ');
        return {
          name: full,
          nameBn: full,
          nameEn: full,
          city: city || neighborhood,
          country
        };
      }
    }
  } catch {
    // fallback below
  }

  // 2. Query BigDataCloud client reverse geocoding (100% free fallback)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${
        language === 'bn' ? 'bn' : 'en'
      }`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.city || '';
      const country = data.countryName || '';

      if (locality) {
        const full = [locality, country].filter(Boolean).join(', ');
        return {
          name: full,
          nameBn: full,
          nameEn: full,
          city: locality,
          country
        };
      }
    }
  } catch {
    // fallback below
  }

  // 3. Fallback to local catalog
  let closest: LocationItem | null = null;
  let minDistance = Infinity;

  for (const loc of KNOWN_LOCATIONS) {
    const dist = getDistanceKm(lat, lng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  if (closest && minDistance <= 85) {
    return {
      name: language === 'bn' ? closest.nameBn : closest.nameEn,
      nameBn: closest.nameBn,
      nameEn: closest.nameEn,
      city: closest.nameEn,
      country: closest.country
    };
  }

  const fallbackName = language === 'bn' ? 'বর্তমান অবস্থান' : 'Current Location';
  return {
    name: fallbackName,
    nameBn: fallbackName,
    nameEn: 'Current Location'
  };
}

/**
 * 100% Free IP Geolocation fallback when GPS is denied or taking too long.
 * Uses ipwho.is (zero cost, zero keys, global).
 */
export async function detectLocationFromIP(language: string = 'bn'): Promise<{
  name: string;
  lat: number;
  lng: number;
  city?: string;
  country?: string;
} | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const city = data.city || data.region || '';
        const country = data.country || '';
        const rawName = [city, country].filter(Boolean).join(', ');
        const friendly = resolveFriendlyLocationName(data.latitude, data.longitude, language);
        return {
          name: friendly !== 'বর্তমান অবস্থান' && friendly !== 'Current Location' ? friendly : rawName,
          lat: data.latitude,
          lng: data.longitude,
          city,
          country
        };
      }
    }
  } catch {
    // fallback gracefully
  }
  return null;
}


