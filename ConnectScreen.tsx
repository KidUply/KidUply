'use client';

import { MessageCircle, User } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Buddy {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  isOnline: boolean;
}

export default function ConnectScreen() {
  const { t } = useLanguage();

  const buddies: Buddy[] = [
    { id: '1', name: 'Sarah Johnson', avatar: '👧', level: 5, xp: 1250, isOnline: true },
    { id: '2', name: 'Michael Chen', avatar: '👦', level: 4, xp: 980, isOnline: true },
    { id: '3', name: 'Emma Davis', avatar: '👧', level: 6, xp: 1450, isOnline: false },
    { id: '4', name: 'Alex Kumar', avatar: '👦', level: 3, xp: 720, isOnline: true },
    { id: '5', name: 'Sophia Lee', avatar: '👧', level: 5, xp: 1180, isOnline: false }
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] rounded-[32px] p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{t.connect.title} 🤝</h1>
        <p className="text-white/80 text-lg">{t.connect.subtitle}</p>
      </div>

      <div className="space-y-3">
        {buddies.map((buddy) => (
          <div
            key={buddy.id}
            className="bg-white/80 backdrop-blur-xl rounded-[24px] p-5 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4A80F0] to-[#EC4899] rounded-2xl flex items-center justify-center text-3xl">
                  {buddy.avatar}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    buddy.isOnline ? 'bg-[#22C55E]' : 'bg-gray-400'
                  }`}
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">{buddy.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-600">Level {buddy.level}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{buddy.xp} XP</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {buddy.isOnline ? t.connect.online : t.connect.offline}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button className="bg-[#4A80F0] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3B5FBF] transition-colors flex items-center gap-2">
                  <MessageCircle size={16} />
                  {t.connect.message}
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <User size={16} />
                  {t.connect.viewProfile}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
