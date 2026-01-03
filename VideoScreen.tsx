'use client';

import { useEffect, useState } from 'react';
import { Play, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

interface Video {
  id: string;
  title_en: string;
  title_uz: string;
  description_en: string;
  description_uz: string;
  thumbnail_url: string;
  category: string;
}

export default function VideoScreen() {
  const { t, language } = useLanguage();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'video')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
      if (data && data.length > 0) {
        setCurrentVideo(data[0]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTitle = currentVideo
    ? language === 'en'
      ? currentVideo.title_en
      : currentVideo.title_uz
    : '';

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-[32px] p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{t.video.title} 📺</h1>
        <p className="text-white/80 text-lg">{t.video.nowPlaying}</p>
      </div>

      {currentVideo && (
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden border border-gray-200/50">
          <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <img
              src={currentVideo.thumbnail_url}
              alt={currentTitle}
              className="w-full h-full object-cover opacity-60"
            />
            <button className="absolute inset-0 flex items-center justify-center group">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={32} className="text-[#4A80F0] ml-1" fill="#4A80F0" />
              </div>
            </button>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentTitle}</h2>
            <p className="text-gray-600">
              {language === 'en' ? currentVideo.description_en : currentVideo.description_uz}
            </p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 px-2">{t.video.upNext}</h3>
        <div className="space-y-3">
          {videos
            .filter((v) => v.id !== currentVideo?.id)
            .map((video) => {
              const title = language === 'en' ? video.title_en : video.title_uz;
              const description = language === 'en' ? video.description_en : video.description_uz;

              return (
                <div
                  key={video.id}
                  onClick={() => setCurrentVideo(video)}
                  className="bg-white/80 backdrop-blur-xl rounded-[24px] p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex gap-4"
                >
                  <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail_url}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play size={20} className="text-white" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading videos...</div>
      )}
    </div>
  );
}
