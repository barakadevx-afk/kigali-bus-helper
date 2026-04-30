import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { Search, MapPin, ArrowRightLeft, X } from 'lucide-react';
import { Route } from '../context/TransportContext';

interface SearchBarProps {
  onSearch: (results: Route[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { t, findRoute, routes } = useTransport();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const allStops = Array.from(new Set(routes.flatMap(r => r.stops))) as string[];

  const handleSearch = () => {
    const results = findRoute(origin, destination);
    onSearch(results);
  };

  const filteredOrigin = allStops.filter(s => 
    s.toLowerCase().includes(origin.toLowerCase()) && s !== origin
  );

  const filteredDest = allStops.filter(s => 
    s.toLowerCase().includes(destination.toLowerCase()) && s !== destination
  );

  return (
    <div className="glass p-6 rounded-3xl relative z-40">
      <div className="space-y-4">
        {/* Origin */}
        <div className="space-y-1.5 relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('select.origin')}</label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(25,118,210,0.5)]"></span>
            <input
              type="text"
              placeholder={t('search.origin')}
              className="w-full pl-8 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setShowOriginSuggestions(true);
              }}
              onFocus={() => setShowOriginSuggestions(true)}
            />
            {origin && (
              <button 
                onClick={() => setOrigin('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {showOriginSuggestions && origin && filteredOrigin.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 glass rounded-xl shadow-2xl z-50 overflow-hidden">
              {filteredOrigin.slice(0, 5).map(stop => (
                <button
                  key={stop}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50/50 transition-colors border-b border-white/10 last:border-none"
                  onClick={() => {
                    setOrigin(stop);
                    setShowOriginSuggestions(false);
                  }}
                >
                  {stop}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button (Vertical) */}
        <div className="flex justify-center -my-3 relative z-10">
          <button 
            onClick={() => {
              const temp = origin;
              setOrigin(destination);
              setDestination(temp);
            }}
            className="bg-white border border-slate-200 p-2 rounded-full shadow-lg text-slate-400 hover:text-brand-blue transform transition-transform hover:rotate-180 active:scale-95"
          >
            <ArrowRightLeft size={14} className="rotate-90" />
          </button>
        </div>

        {/* Destination */}
        <div className="space-y-1.5 relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('select.destination')}</label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(27,94,32,0.5)]"></span>
            <input
              type="text"
              placeholder={t('search.destination')}
              className="w-full pl-8 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowDestSuggestions(true);
              }}
              onFocus={() => setShowDestSuggestions(true)}
            />
            {destination && (
              <button 
                onClick={() => setDestination('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {showDestSuggestions && destination && filteredDest.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 glass rounded-xl shadow-2xl z-50 overflow-hidden">
              {filteredDest.slice(0, 5).map(stop => (
                <button
                  key={stop}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50/50 transition-colors border-b border-white/10 last:border-none"
                  onClick={() => {
                    setDestination(stop);
                    setShowDestSuggestions(false);
                  }}
                >
                  {stop}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="w-full py-4 bg-brand-green text-white rounded-xl font-bold shadow-xl shadow-brand-green/20 hover:bg-[#144417] transition-all flex items-center justify-center gap-2 mt-2 group active:scale-[0.98]"
        >
          <span>{t('search.button')}</span>
          <Search size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
