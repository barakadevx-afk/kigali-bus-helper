import React from 'react';
import { Route, useTransport } from '../context/TransportContext';
import { Clock, Banknote, Users, MapPin, Heart, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface RouteCardProps {
  route: Route;
  isSelected?: boolean;
  onSelect?: (route: Route) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, isSelected, onSelect }) => {
  const { t, toggleFavorite, favorites } = useTransport();
  const isFav = favorites.includes(route.id);

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'high': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-5 rounded-3xl border transition-all cursor-pointer ${
        isSelected 
          ? 'glass ring-2 ring-brand-blue/30 border-white/50' 
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
      }`}
      onClick={() => onSelect?.(route)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-brand-blue' : 'bg-slate-300'}`}></span>
            <h3 className="font-black text-lg text-slate-900 tracking-tight">{route.routeName}</h3>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">
            via {route.stops[1]} & {route.stops[route.stops.length - 2]}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(route.id);
          }}
          className={`p-2 rounded-xl transition-all ${
            isFav 
              ? 'bg-rose-50 text-rose-500 shadow-sm' 
              : 'bg-slate-50 text-slate-400 hover:text-rose-400'
          }`}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className={`p-3 rounded-2xl border border-slate-100 shadow-sm ${isSelected ? 'bg-white/60' : 'bg-slate-50/50'}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('route.time')}</p>
          <div className="flex items-center gap-1.5 font-black text-slate-800">
            <Clock size={12} className="text-slate-400" />
            <span className="text-sm">{route.estimatedTime}m</span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl border border-slate-100 shadow-sm ${isSelected ? 'bg-white/60' : 'bg-slate-50/50'}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('route.fare')}</p>
          <div className="flex items-center gap-0.5 font-black text-brand-green">
            <span className="text-sm">{route.fare}</span>
            <span className="text-[8px] uppercase">Rwf</span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl border border-slate-100 shadow-sm ${isSelected ? 'bg-white/60' : 'bg-slate-50/50'}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('route.crowd')}</p>
          <div className="flex items-center gap-1.5 font-black text-slate-800">
            <div className={`w-2 h-2 rounded-full ${
              route.crowdLevel === 'low' ? 'bg-emerald-500' : 
              route.crowdLevel === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></div>
            <span className="text-sm">{t(`crowd.${route.crowdLevel}`)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex -space-x-1.5">
          {route.stops.slice(0, 4).map((stop, i) => (
            <div key={i} title={stop} className="w-7 h-7 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
              {stop[0]}
            </div>
          ))}
          {route.stops.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500 shadow-sm">
              +{route.stops.length - 4}
            </div>
          )}
        </div>
        <motion.div 
          whileHover={{ x: 3 }}
          className="text-brand-blue flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
        >
          {isSelected ? 'Viewing Path' : 'View Details'} <ChevronRight size={14} />
        </motion.div>
      </div>
    </motion.div>
  );
};
