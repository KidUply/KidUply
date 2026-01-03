'use client';

import { BookOpen, Gamepad2, Users, Video, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'learn', icon: BookOpen, label: t.nav.learn },
    { id: 'play', icon: Gamepad2, label: t.nav.play },
    { id: 'connect', icon: Users, label: t.nav.connect },
    { id: 'video', icon: Video, label: t.nav.video },
    { id: 'parents', icon: Lock, label: t.nav.parents }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 z-50">
      <div className="flex items-center justify-around h-20 max-w-7xl mx-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                isActive ? 'text-[#4A80F0]' : 'text-gray-400'
              }`}
            >
              <div className={`relative transition-all duration-300 ${
                isActive ? 'scale-110' : 'scale-100'
              }`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#4A80F0] rounded-full" />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-60'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
