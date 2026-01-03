'use client';

import { useEffect, useState } from 'react';
import { Lock, Play } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

interface Game {
  id: string;
  title_en: string;
  title_uz: string;
  description_en: string;
  description_uz: string;
  thumbnail_url: string;
  is_locked: boolean;
  required_level: number;
  category: string;
}

interface PlayScreenProps {
  userLevel: number;
}

export default function PlayScreen({ userLevel }: PlayScreenProps) {
  const { t, language } = useLanguage();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'game')
        .order('required_level', { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-[32px] p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{t.play.title} 🎮</h1>
        <p className="text-white/80 text-lg">{t.play.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {games.map((game) => {
          const isLocked = game.is_locked || game.required_level > userLevel;
          const title = language === 'en' ? game.title_en : game.title_uz;
          const description = language === 'en' ? game.description_en : game.description_uz;

          return (
            <div
              key={game.id}
              className={`bg-white/80 backdrop-blur-xl rounded-[24px] overflow-hidden border border-gray-200/50 transition-all duration-300 ${
                isLocked ? 'opacity-60' : 'hover:shadow-lg hover:scale-105 cursor-pointer'
              }`}
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={game.thumbnail_url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                {isLocked && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock size={32} className="mx-auto mb-2" />
                      <p className="text-sm font-semibold">{t.play.locked}</p>
                      <p className="text-xs mt-1">
                        {t.play.unlockAt} {game.required_level}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-3">{description}</p>
                {!isLocked && (
                  <button className="w-full bg-[#22C55E] text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#16A34A] transition-colors">
                    <Play size={16} />
                    {t.play.play}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading games...</div>
      )}
    </div>
  );
}
