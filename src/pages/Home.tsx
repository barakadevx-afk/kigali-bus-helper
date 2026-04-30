import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchBar } from '../components/SearchBar';
import { MapView } from '../components/MapView';
import { RouteCard } from '../components/RouteCard';
import { useTransport, Route } from '../context/TransportContext';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Map as MapIcon, ChevronRight, Info } from 'lucide-react';

export const Home: React.FC = () => {
  const { t, routes, favorites } = useTransport();
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [durationFilter, setDurationFilter] = useState<'all' | 'fast' | 'medium' | 'slow'>('all');

  const handleSearch = (results: Route[]) => {
    setSearchResults(results);
    setHasSearched(true);
    setDurationFilter('all');
    if (results.length > 0) {
      setSelectedRoute(results[0]);
    } else {
      setSelectedRoute(null);
    }
  };

  const filteredResults = searchResults.filter(route => {
    if (durationFilter === 'all') return true;
    if (durationFilter === 'fast') return route.estimatedTime <= 20;
    if (durationFilter === 'medium') return route.estimatedTime > 20 && route.estimatedTime <= 30;
    if (durationFilter === 'slow') return route.estimatedTime > 30;
    return true;
  });

  const favoriteRoutes = routes.filter(r => favorites.includes(r.id));

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar / List View */}
        <div 
          className={`w-full md:w-[400px] flex flex-col border-r border-slate-200 bg-white z-20 shadow-2xl transition-all duration-300 ${
            viewMode === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
              <MapIcon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">Kigali Bus</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Smart Assistant</p>
            </div>
          </div>

          <div className="p-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-10 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {hasSearched ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {filteredResults.length} Inzira Zibonetse
                      </h2>
                    </div>

                    <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                      {(['all', 'fast', 'medium', 'slow'] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setDurationFilter(f)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            durationFilter === f
                              ? 'bg-slate-900 text-white shadow-lg'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {t(`filter.${f}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredResults.length > 0 ? (
                    filteredResults.map(route => (
                      <RouteCard 
                        key={route.id} 
                        route={route} 
                        isSelected={selectedRoute?.id === route.id}
                        onSelect={setSelectedRoute}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 px-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <div className="bg-slate-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Info className="text-slate-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('no.results')}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-8 mt-2">
                  {favoriteRoutes.length > 0 && (
                    <div>
                      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        {t('favorites.title')}
                      </h2>
                      <div className="grid gap-4">
                        {favoriteRoutes.map(route => (
                          <RouteCard 
                            key={route.id} 
                            route={route} 
                            isSelected={selectedRoute?.id === route.id}
                            onSelect={setSelectedRoute}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      {t('sidebar.routes')}
                    </h2>
                    <div className="grid gap-4">
                      {routes.slice(0, 3).map(route => (
                        <RouteCard 
                          key={route.id} 
                          route={route} 
                          isSelected={selectedRoute?.id === route.id}
                          onSelect={setSelectedRoute}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-slate-100">
            <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-[10px] text-blue-700 font-black uppercase tracking-wider">{t('offline.mode')}</p>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className={`flex-1 relative transition-all duration-300 ${
          viewMode === 'list' ? 'hidden md:block' : 'block'
        }`}>
          <MapView selectedRoute={selectedRoute} />
          
          {/* Status Overlay Top Right */}
          <div className="absolute top-6 right-6 z-[1000] hidden sm:block">
            <div className="glass p-3 rounded-2xl flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Live Traffic</span>
                <span className="text-xs font-black text-brand-green uppercase tracking-wider">Low Congestion</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                 <Info size={18} />
              </div>
            </div>
          </div>

          {/* View Toggle Overlay */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="glass p-2 rounded-2xl flex gap-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <LayoutGrid size={14} /> <span>List</span>
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'map' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <MapIcon size={14} /> <span>Map</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Offline Banner if needed */}
      {!navigator.onLine && (
        <div className="bg-amber-500 text-white text-[10px] py-1 text-center font-bold absolute bottom-0 w-full z-[2000]">
          {t('offline.mode')}
        </div>
      )}
    </div>
  );
};
