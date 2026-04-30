import React from 'react';
import { useTransport } from '../context/TransportContext';
import { Bus, Globe, Heart, Menu } from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, favorites } = useTransport();

  return (
    <nav className="glass border-none px-6 py-4 flex items-center justify-between sticky top-0 z-50 rounded-none shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-brand-green/10 p-2 rounded-xl text-brand-green">
          <Bus size={20} />
        </div>
        <h1 className="font-black text-lg text-slate-900 tracking-tight hidden sm:block">
          {t('app.name')}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-slate-100/50 p-1 rounded-xl flex">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
              language === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('rw')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
              language === 'rw' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            RW
          </button>
        </div>

        <button className="relative text-slate-600 hover:text-brand-blue transition-colors">
          <Heart size={20} className={favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-blue text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg shadow-brand-blue/20">
              {favorites.length}
            </span>
          )}
        </button>

        <button className="md:hidden text-slate-600">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};
