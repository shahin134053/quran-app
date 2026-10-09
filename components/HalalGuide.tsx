import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, MapPin, Navigation, Search, RefreshCw, ArrowLeft, ExternalLink, Star } from 'lucide-react';

interface Restaurant {
  title: string;
  uri: string;
}

const HalalGuide: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findHalalFood = async () => {
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
      // Searching for restaurants with halal tag or general restaurants in Muslim-majority areas
      const query = `
        [out:json];
        (
          nwr(around:5000, ${latitude}, ${longitude})[amenity=restaurant][cuisine=halal];
          nwr(around:5000, ${latitude}, ${longitude})[amenity=restaurant]["diet:halal"=yes];
          nwr(around:5000, ${latitude}, ${longitude})[amenity=fast_food][cuisine=halal];
        );
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
        const found = data.elements.map((el: any) => {
          const lat = el.lat || (el.center && el.center.lat);
          const lon = el.lon || (el.center && el.center.lon);
          return {
            title: el.tags?.name || "Halal Restaurant",
            uri: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
          };
        });
        setRestaurants(found);
      } else {
        setError("No halal-tagged restaurants found in a 5km radius.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to find restaurants. Please ensure location permissions are granted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findHalalFood();
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
        <h2 className="text-2xl font-black tracking-tight">Halal Food Guide</h2>
      </div>

      <div className="bg-orange-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Utensils size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Eat Halal, Stay Blessed</h3>
          <p className="text-orange-100 text-sm font-medium opacity-90">Discover certified halal dining options in your vicinity.</p>
          <button 
            onClick={findHalalFood}
            disabled={loading}
            className="mt-6 px-6 py-3 bg-white text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-50 transition-colors disabled:opacity-50"
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
        {restaurants.map((place, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-orange-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center text-orange-600">
                <Utensils size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-slate-100">{place.title}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} className="text-amber-500" fill="currentColor" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Halal Certified</span>
                </div>
              </div>
            </div>
            <a 
              href={place.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-orange-500 transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          </motion.div>
        ))}

        {!loading && restaurants.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-400 font-bold text-sm">Tap refresh to find halal food near you.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HalalGuide;
