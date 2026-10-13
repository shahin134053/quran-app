export interface MosqueItem {
  id: string | number;
  name: string;
  nameBn?: string;
  lat: number;
  lon: number;
  distanceKm: number;
  distanceDisplay?: string;
  distanceYards?: number;
  isWithin350Yards?: boolean;
  address: string;
  walkingMins: number;
  transportMins: number;
  isNearest?: boolean;
  isFurthest?: boolean;
  phone?: string;
  website?: string;
  tags?: Record<string, any>;
}

/**
 * Calculates geographic distance in kilometers using the accurate Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
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
 * Calculates realistic walking and driving travel times
 */
export function getTravelTimes(distanceKm: number): { walkingMins: number; transportMins: number } {
  // Average walking speed ~4.8 km/h = 12.5 mins per km (minimum 1 minute)
  const walkingMins = Math.max(1, Math.round(distanceKm * 12.5));
  // Urban driving speed ~25 km/h = 2.4 mins per km + 2 min buffer
  const transportMins = Math.max(1, Math.round(distanceKm * 2.4 + 2));
  return { walkingMins, transportMins };
}

/**
 * Formats distance display nicely (e.g. "120 মিটার" or "1.5 কিমি")
 */
export function formatDistanceDisplay(distanceKm: number, isBn: boolean): string {
  if (distanceKm < 1) {
    const meters = Math.max(10, Math.round(distanceKm * 1000));
    return isBn ? `${meters} মিটার` : `${meters} meters`;
  }
  return isBn ? `${distanceKm.toFixed(1)} কিমি` : `${distanceKm.toFixed(1)} km`;
}

/**
 * Clean and filter mosque name from OpenStreetMap tags
 */
export function cleanMosqueName(rawName: string, isBn: boolean): { name: string; nameBn: string } {
  const name = rawName.trim();
  let nameBn = name;

  // If name is already in Bengali
  if (/[\u0980-\u09FF]/.test(name)) {
    return { name, nameBn: name };
  }

  // Common English to Bengali mosque translations
  if (name.toLowerCase().includes('jame mosque') || name.toLowerCase().includes('jame masjid')) {
    nameBn = name.replace(/jame mosque/gi, 'জামে মসজিদ').replace(/jame masjid/gi, 'জামে মসজিদ');
  } else if (name.toLowerCase().includes('central mosque')) {
    nameBn = name.replace(/central mosque/gi, 'কেন্দ্রীয় জামে মসজিদ');
  } else if (name.toLowerCase().includes('islamic center')) {
    nameBn = name.replace(/islamic center/gi, 'ইসলামিক সেন্টার');
  } else if (name.toLowerCase().includes('mosque')) {
    nameBn = name.replace(/mosque/gi, 'মসজিদ');
  } else if (name.toLowerCase().includes('masjid')) {
    nameBn = name.replace(/masjid/gi, 'মসজিদ');
  }

  return { name, nameBn };
}

/**
 * World-famous historical Islamic sanctuaries
 * (ONLY added if user is physically within their actual vicinity, e.g. Makkah, Madinah, Jerusalem)
 */
const HISTORICAL_HOLY_SANCTUARIES = [
  {
    id: 'holy-haram',
    name: 'Masjid al-Haram (পবিত্র মসজিদুল হারাম)',
    nameBn: 'পবিত্র মসজিদুল হারাম (কাবা শরীফ)',
    lat: 21.4225,
    lon: 39.8262,
    address: 'Al Haram, Makkah 24231, Saudi Arabia'
  },
  {
    id: 'holy-nabawi',
    name: 'Al-Masjid an-Nabawi (পবিত্র মসজিদে নববী)',
    nameBn: 'পবিত্র মসজিদে নববী (মদিনা শরীফ)',
    lat: 24.5247,
    lon: 39.5692,
    address: 'Al Haram, Madinah 42311, Saudi Arabia'
  },
  {
    id: 'holy-aqsa',
    name: 'Al-Aqsa Mosque (বায়তুল মুকাদ্দাস)',
    nameBn: 'পবিত্র বায়তুল মুকাদ্দাস (আল-আকসা)',
    lat: 31.7761,
    lon: 35.2358,
    address: 'Old City, Jerusalem'
  }
];

/**
 * Queries OpenStreetMap Nominatim for mosques in a bounding box around (lat, lon)
 * 100% Free, open-source, global coverage.
 */
async function fetchNominatimQueries(
  lat: number,
  lon: number,
  radiusKm: number,
  isBn: boolean
): Promise<MosqueItem[]> {
  const deltaLat = Math.min(radiusKm, 25) / 111.0;
  const deltaLon = Math.min(radiusKm, 25) / (111.0 * Math.max(0.1, Math.cos((lat * Math.PI) / 180)));

  const minLat = lat - deltaLat;
  const maxLat = lat + deltaLat;
  const minLon = lon - deltaLon;
  const maxLon = lon + deltaLon;
  // Nominatim viewbox format: left,top,right,bottom (minLon, maxLat, maxLon, minLat)
  const viewbox = `${minLon.toFixed(4)},${maxLat.toFixed(4)},${maxLon.toFixed(4)},${minLat.toFixed(4)}`;

  // Determine query parameters based on geographical location:
  // - South Asia (Bangladesh, India, Pakistan): amenity=place_of_worship, q=মসজিদ, q=masjid
  // - North America / Europe: q=Islamic+Center, q=Mosque, q=Masjid, amenity=place_of_worship
  // - Middle East: q=مسجد, amenity=place_of_worship
  const isSouthAsia = lat >= 20 && lat <= 30 && lon >= 80 && lon <= 95;
  const isWest = lon < -30 || lon > 110 || lat > 35;
  const isMiddleEast = lat >= 15 && lat <= 35 && lon >= 35 && lon <= 65;

  const queryStrings: string[] = [];

  if (isSouthAsia) {
    queryStrings.push('amenity=place_of_worship');
    queryStrings.push(`q=${encodeURIComponent('মসজিদ')}`);
    queryStrings.push(`q=${encodeURIComponent('masjid')}`);
    queryStrings.push(`q=${encodeURIComponent('mosque')}`);
  } else if (isWest) {
    queryStrings.push(`q=${encodeURIComponent('Islamic Center')}`);
    queryStrings.push(`q=${encodeURIComponent('Mosque')}`);
    queryStrings.push(`q=${encodeURIComponent('Masjid')}`);
    queryStrings.push('amenity=place_of_worship');
  } else if (isMiddleEast) {
    queryStrings.push(`q=${encodeURIComponent('مسجد')}`);
    queryStrings.push(`q=${encodeURIComponent('جامع')}`);
    queryStrings.push('amenity=place_of_worship');
  } else {
    queryStrings.push('amenity=place_of_worship');
    queryStrings.push(`q=${encodeURIComponent('mosque')}`);
    queryStrings.push(`q=${encodeURIComponent('masjid')}`);
  }

  const itemsMap = new Map<string, MosqueItem>();

  const fetchSingleQuery = async (queryParam: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const url = `https://nominatim.openstreetmap.org/search?format=json&${queryParam}&viewbox=${viewbox}&bounded=1&limit=50&addressdetails=1&accept-language=${isBn ? 'bn,en' : 'en,bn'}`;

      // NOTE: Do NOT set User-Agent header in browser fetch as it causes "Refused to set unsafe header"
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      for (const item of data) {
        const itemLat = parseFloat(item.lat);
        const itemLon = parseFloat(item.lon);
        if (isNaN(itemLat) || isNaN(itemLon)) continue;

        const rawName = (item.name || item.display_name?.split(',')[0] || '').trim();
        if (!rawName) continue;
        const nameLower = rawName.toLowerCase();

        // Strict Exclusion: Roads, Lanes, Golies, Ponds, Housing societies
        if (
          nameLower.includes('road') ||
          nameLower.includes('সড়ক') ||
          nameLower.includes('সড়কে') ||
          nameLower.includes('রোড') ||
          nameLower.includes('goli') ||
          nameLower.includes('গলি') ||
          nameLower.includes('lane') ||
          nameLower.includes('লেন') ||
          nameLower.includes('housing') ||
          nameLower.includes('হাউজিং') ||
          nameLower.includes('pukur') ||
          nameLower.includes('pond') ||
          nameLower.includes('bus stop') ||
          nameLower.includes('বাস স্টপ') ||
          nameLower.includes('school') ||
          nameLower.includes('college')
        ) {
          // If the item itself is tagged as a road / highway / transit, skip it completely
          if (item.class === 'highway' || item.class === 'railway' || item.type === 'residential' || item.type === 'service') {
            continue;
          }
          // If the name is literally "Mosque Road" or "মসজিদ সড়ক", skip it
          if (
            nameLower.startsWith('mosque road') ||
            nameLower.startsWith('masjid road') ||
            rawName.startsWith('মসজিদ সড়ক') ||
            rawName.startsWith('মসজিদ রোড') ||
            rawName.endsWith('রোড') ||
            rawName.endsWith('সড়ক') ||
            rawName.endsWith('road')
          ) {
            continue;
          }
        }

        // Strict Exclusion: Non-Muslim places of worship (temples, churches, mandirs, synagogues)
        if (
          nameLower.includes('mandir') ||
          nameLower.includes('mondir') ||
          rawName.includes('মন্দির') ||
          nameLower.includes('temple') ||
          nameLower.includes('church') ||
          rawName.includes('গির্জা') ||
          rawName.includes('গীর্জা') ||
          nameLower.includes('puja') ||
          rawName.includes('পূজা') ||
          nameLower.includes('synagogue') ||
          nameLower.includes('cathedral') ||
          nameLower.includes('chapel') ||
          nameLower.includes('ashram') ||
          rawName.includes('আশ্রম') ||
          nameLower.includes('pagoda') ||
          rawName.includes('প্যাগোডা')
        ) {
          continue;
        }

        // Must be a religious mosque / Islamic center or have Islamic keywords
        const isAmenityMosque = item.class === 'amenity' && (item.type === 'place_of_worship' || item.type === 'mosque');
        const hasIslamicKeywords =
          nameLower.includes('mosque') ||
          nameLower.includes('masjid') ||
          nameLower.includes('moshjid') ||
          nameLower.includes('islamic') ||
          nameLower.includes('jame') ||
          nameLower.includes('jama') ||
          nameLower.includes('bait') ||
          nameLower.includes('bayt') ||
          rawName.includes('মসজিদ') ||
          rawName.includes('মশজিদ') ||
          rawName.includes('জামে') ||
          rawName.includes('বাইতুল') ||
          rawName.includes('বায়তুল') ||
          rawName.includes('ঈদগাহ') ||
          rawName.includes('মাদ্রাসা') ||
          rawName.includes('মারকাজ');

        // If not in South Asia / Arab world, allow Islamic Center or Mosque
        if (!isAmenityMosque && !hasIslamicKeywords) {
          continue;
        }

        // Calculate exact distance from user's coordinates
        const dist = calculateDistance(lat, lon, itemLat, itemLon);
        if (dist > radiusKm * 1.6) continue;

        const { name, nameBn } = cleanMosqueName(rawName, isBn);
        const { walkingMins, transportMins } = getTravelTimes(dist);

        // Build clean address
        const addrObj = item.address || {};
        const road = addrObj.road || addrObj.street || addrObj.pedestrian || '';
        const suburb = addrObj.suburb || addrObj.neighbourhood || addrObj.residential || addrObj.quarter || '';
        const city = addrObj.city || addrObj.town || addrObj.county || '';
        const cleanAddress = [road, suburb, city].filter(Boolean).join(', ') ||
          item.display_name?.split(',').slice(1, 4).join(',').trim() ||
          (isBn ? 'নিকটস্থ এলাকা' : 'Neighborhood Area');

        // Deduplicate key by micro-coordinates (rounded to 3 decimals ~100m)
        const key = `${itemLat.toFixed(3)}_${itemLon.toFixed(3)}`;
        if (!itemsMap.has(key)) {
          itemsMap.set(key, {
            id: item.place_id || `nom-${itemLat}-${itemLon}`,
            name: name || (isBn ? 'স্থানীয় জামে মসজিদ' : 'Local Mosque'),
            nameBn: nameBn || name || (isBn ? 'স্থানীয় জামে মসজিদ' : 'Local Mosque'),
            lat: itemLat,
            lon: itemLon,
            distanceKm: Number(dist.toFixed(3)),
            distanceDisplay: formatDistanceDisplay(dist, isBn),
            address: cleanAddress,
            walkingMins,
            transportMins,
            tags: item
          });
        }
      }
    } catch {
      // Individual query error ignored
    }
  };

  // Run queries sequentially and break early to avoid hitting Nominatim rate limits
  for (const q of queryStrings) {
    await fetchSingleQuery(q);
    if (itemsMap.size >= 15) break;
  }

  return Array.from(itemsMap.values());
}

/**
 * Queries OpenStreetMap Overpass API for mosques worldwide.
 * 100% Free, high-speed fallback for rural or international areas.
 */
async function fetchOverpassQueries(
  lat: number,
  lon: number,
  radiusKm: number,
  isBn: boolean
): Promise<MosqueItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const radiusMeters = Math.min(Math.round(radiusKm * 1000), 15000);

    const query = `[out:json][timeout:10];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lon});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lon});
);
out center 40;`;

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !Array.isArray(data.elements)) return [];

    const items: MosqueItem[] = [];
    for (const el of data.elements) {
      const itemLat = el.lat || el.center?.lat;
      const itemLon = el.lon || el.center?.lon;
      if (typeof itemLat !== 'number' || typeof itemLon !== 'number') continue;

      const rawName = el.tags?.name || el.tags?.['name:en'] || el.tags?.['name:bn'] || el.tags?.['name:ar'] || '';
      const fallbackDefaultName = isBn ? 'স্থানীয় মসজিদ' : 'Local Mosque';
      const cleanNameStr = rawName ? rawName.trim() : fallbackDefaultName;

      const dist = calculateDistance(lat, lon, itemLat, itemLon);
      const { name, nameBn } = cleanMosqueName(cleanNameStr, isBn);
      const { walkingMins, transportMins } = getTravelTimes(dist);

      items.push({
        id: `op-${el.id}`,
        name: name || fallbackDefaultName,
        nameBn: nameBn || name || fallbackDefaultName,
        lat: itemLat,
        lon: itemLon,
        distanceKm: Number(dist.toFixed(3)),
        distanceDisplay: formatDistanceDisplay(dist, isBn),
        address: el.tags?.['addr:street'] || el.tags?.['addr:suburb'] || (isBn ? 'নিকটস্থ এলাকা' : 'Neighborhood Area'),
        walkingMins,
        transportMins
      });
    }
    return items;
  } catch {
    return [];
  }
}

/**
 * Main Function: Fetches authentic, hyper-local mosques strictly sorted by proximity.
 * - Multi-tier search: ALWAYS searches immediate walking vicinity (1.5 km) first,
 *   so neighborhood mosques within 100m-1500m are NEVER crowded out by famous distant mosques.
 * - 350 Yards Guideline: Highlight & tag mosques within 350 yards (~320m)
 * - Strict Haversine Proximity Sorting (Closest mosque is GUARANTEED to be #1)
 * - 100% Free & Open Source (Zero Paid APIs)
 * - Zero Fake/Hardcoded Fallbacks (No misleading info!)
 */
export async function getMosquesForLocation(
  lat: number,
  lon: number,
  radiusKm: number = 3,
  isBn: boolean = true
): Promise<MosqueItem[]> {
  const cacheKey = `almuneer_mosques_v6_${lat.toFixed(3)}_${lon.toFixed(3)}_${radiusKm}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // Tier 1: ALWAYS query immediate walking radius (1.5 km) first to guarantee local neighborhood mosques
  const immediateRadius = Math.min(radiusKm, 1.8);
  const immediateMosques = await fetchNominatimQueries(lat, lon, immediateRadius, isBn);

  let results: MosqueItem[] = [...immediateMosques];

  // Tier 2: If user requested wider radius OR fewer than 3 mosques found, search broader radius
  if (radiusKm > immediateRadius || results.length < 3) {
    const broaderRadius = results.length < 2 ? Math.max(radiusKm, 8) : radiusKm;
    const broaderMosques = await fetchNominatimQueries(lat, lon, broaderRadius, isBn);
    results.push(...broaderMosques);
  }

  // Tier 3: If still sparse (e.g. rural area / overseas), trigger Overpass API global fallback
  if (results.length < 3) {
    const opMosques = await fetchOverpassQueries(lat, lon, Math.max(radiusKm, 5), isBn);
    results.push(...opMosques);
  }

  // Step 3: Check if near any holy sanctuaries (only if physically within radius)
  for (const holy of HISTORICAL_HOLY_SANCTUARIES) {
    const dist = calculateDistance(lat, lon, holy.lat, holy.lon);
    if (dist <= radiusKm * 1.5) {
      const { walkingMins, transportMins } = getTravelTimes(dist);
      results.push({
        id: holy.id,
        name: holy.name,
        nameBn: holy.nameBn,
        lat: holy.lat,
        lon: holy.lon,
        distanceKm: Number(dist.toFixed(3)),
        distanceDisplay: formatDistanceDisplay(dist, isBn),
        address: holy.address,
        walkingMins,
        transportMins
      });
    }
  }

  // Step 4: Deduplicate mosques within 40 meters of each other
  const deduplicated: MosqueItem[] = [];
  for (const item of results) {
    const exists = deduplicated.some(existing => {
      const d = calculateDistance(existing.lat, existing.lon, item.lat, item.lon);
      return d < 0.04; // less than 40 meters apart
    });
    if (!exists) {
      // Calculate distance in yards (1 km = 1093.61 yards)
      const yards = Math.round(item.distanceKm * 1093.61);
      item.distanceYards = yards;
      // Tag if within 350 yards (~320 meters) guideline
      item.isWithin350Yards = yards <= 350 || item.distanceKm <= 0.32;
      deduplicated.push(item);
    }
  }

  // Step 5: STRICT PROXIMITY SORTING (Closest mosque ALWAYS first)
  deduplicated.sort((a, b) => a.distanceKm - b.distanceKm);

  // Filter within effective radius (or keep closest 20 if sparse)
  let finalResults = deduplicated.filter(m => m.distanceKm <= Math.max(radiusKm, 2.5));
  if (finalResults.length === 0 && deduplicated.length > 0) {
    finalResults = deduplicated.slice(0, 20);
  }

  // Assign nearest and furthest tags
  if (finalResults.length > 0) {
    finalResults[0].isNearest = true;
    if (finalResults.length > 1) {
      finalResults[finalResults.length - 1].isFurthest = true;
    }
  }

  try {
    if (finalResults.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(finalResults));
    }
  } catch {}

  return finalResults;
}
