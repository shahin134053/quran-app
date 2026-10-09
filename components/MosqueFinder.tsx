import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';

interface Mosque {
  title: string;
  uri: string;
  address?: string;
}

const MosqueFinder: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findMosques = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!("geolocation" in navigator)) {
        throw new Error("Geolocation is not supported by your browser.");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });

      const { latitude, longitude } = position.coords;
      
      // Use Overpass API (OpenStreetMap) - Completely free and open source
      const query = `
        [out:json];
        nwr(around:5000, ${latitude}, ${longitude})[amenity=place_of_worship][religion=muslim];
        out center;
      `;
      
      let response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`
      });
      
      if (!response.ok) {
        // Fallback to lz4 server if main server is busy
        response = await fetch('https://lz4.overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `data=${encodeURIComponent(query)}`
        });
      }
      
      if (!response.ok) throw new Error("Failed to fetch data from OpenStreetMap.");
      
      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const foundMosques = data.elements.map((el: any) => {
          const lat = el.lat || (el.center && el.center.lat);
          const lon = el.lon || (el.center && el.center.lon);
          return {
            title: el.tags?.name || "Masjid",
            uri: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
            address: el.tags?.['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}` : undefined
          };
        });
        setMosques(foundMosques);
      } else {
        setError("No mosques found in a 5km radius.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to find mosques. Please ensure location permissions are granted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findMosques();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black tracking-tight">Mosque Finder</h2>
      </div>

      <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MapPin size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Find Nearby Masjids</h3>
          <p className="text-emerald-100 text-sm font-medium opacity-90">Locate the nearest place of worship for your prayers.</p>
          <button 
            onClick={findMosques}
            disabled={loading}
            className="mt-6 px-6 py-3 bg-white text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Navigation size={16} />}
            {loading ? "Searching..." : "Refresh Location"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-[2rem] border border-red-100 dark:border-red-900/30 text-center">
          <p className="text-red-600 dark:text-red-400 font-bold text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {mosques.map((mosque, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-600">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-slate-100">{mosque.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nearby Masjid</p>
              </div>
            </div>
            <a 
              href={mosque.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-emerald-500 transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          </motion.div>
        ))}

        {!loading && mosques.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-400 font-bold text-sm">Tap refresh to find mosques near you.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MosqueFinder;
