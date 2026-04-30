import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import routesData from '../data/routes.json';

export interface Route {
  id: string;
  routeName: string;
  stops: string[];
  fare: number;
  estimatedTime: number;
  coordinates: [number, number][];
  crowdLevel: 'low' | 'medium' | 'high';
}

interface TransportContextType {
  routes: Route[];
  favorites: string[];
  language: 'en' | 'rw';
  searchResult: Route | null;
  toggleFavorite: (id: string) => void;
  setLanguage: (lang: 'en' | 'rw') => void;
  findRoute: (origin: string, destination: string) => Route[];
  t: (key: string) => string;
}

const translations = {
  en: {
    'app.name': 'Kigali Bus Helper',
    'search.origin': 'Origin (e.g. Nyabugogo)',
    'search.destination': 'Destination (e.g. Remera)',
    'search.button': 'Find Route',
    'route.fare': 'Fare',
    'route.time': 'Est. Time',
    'route.stops': 'Stops',
    'route.crowd': 'Crowd',
    'crowd.low': 'Fast',
    'crowd.medium': 'Busy',
    'crowd.high': 'Full',
    'favorites.title': 'My Favorites',
    'sidebar.routes': 'Suggested Routes',
    'no.results': 'No routes found. Try another search.',
    'select.origin': 'Select Origin',
    'select.destination': 'Select Destination',
    'offline.mode': 'Offline Mode Active',
    'filter.duration': 'Duration',
    'filter.all': 'All',
    'filter.fast': 'Fastest',
    'filter.medium': 'Medium',
    'filter.slow': 'Slow'
  },
  rw: {
    'app.name': 'Kigali Bus Helper',
    'search.origin': 'Aho uvuye (urugero: Nyabugogo)',
    'search.destination': 'Aho ujya (urugero: Remera)',
    'search.button': 'Shaka Inzira',
    'route.fare': 'Igiciro',
    'route.time': 'Igihe',
    'route.stops': 'Ibyapa',
    'route.crowd': 'Abantu',
    'crowd.low': 'Irimo ubusa',
    'crowd.medium': 'Irimo abantu',
    'crowd.high': 'Yuzuye',
    'favorites.title': 'Ibyo nkunze',
    'sidebar.routes': 'Inzira zagufasha',
    'no.results': 'Nta nzira ibonetse. Ongera ugerageze.',
    'select.origin': 'Hitamo aho uvuye',
    'select.destination': 'Hitamo aho ujya',
    'offline.mode': 'Muri kure ya interineti',
    'filter.duration': 'Igihe',
    'filter.all': 'Byose',
    'filter.fast': 'Vuba',
    'filter.medium': 'Hagati',
    'filter.slow': 'Gahoro'
  }
};

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export const TransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes] = useState<Route[]>(routesData as Route[]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [language, setLanguage] = useState<'en' | 'rw'>(() => {
    const saved = localStorage.getItem('language');
    return (saved as 'en' | 'rw') || 'en';
  });
  const [searchResult, setSearchResult] = useState<Route | null>(null);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const findRoute = (origin: string, destination: string): Route[] => {
    if (!origin || !destination) return [];
    
    return routes.filter(route => {
      const stops = route.stops.map(s => s.toLowerCase());
      const oIdx = stops.indexOf(origin.toLowerCase());
      const dIdx = stops.indexOf(destination.toLowerCase());
      return oIdx !== -1 && dIdx !== -1 && oIdx < dIdx;
    });
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <TransportContext.Provider value={{
      routes,
      favorites,
      language,
      searchResult,
      toggleFavorite,
      setLanguage,
      findRoute,
      t
    }}>
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (context === undefined) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
};
