'use client';

import { useState, useEffect } from 'react';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import BottomNav from '@/components/BottomNav';
import LearnScreen from '@/components/screens/LearnScreen';
import PlayScreen from '@/components/screens/PlayScreen';
import ConnectScreen from '@/components/screens/ConnectScreen';
import VideoScreen from '@/components/screens/VideoScreen';
import ParentsScreen from '@/components/screens/ParentsScreen';
import ScreenTimeLimitOverlay from '@/components/ScreenTimeLimitOverlay';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [activeTab, setActiveTab] = useState('learn');
  const [showScreenTimeLimitOverlay, setShowScreenTimeLimitOverlay] = useState(false);
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [userData, setUserData] = useState({
    id: 'demo-user-id',
    userName: 'Alex',
    userXP: 1250,
    userLevel: 5
  });
  const [screenTimeLimit, setScreenTimeLimit] = useState(120);
  const [timeSpentToday, setTimeSpentToday] = useState(0);

  useEffect(() => {
    initializeUser();
    const interval = setInterval(() => {
      setTimeSpentToday(prev => {
        const newTime = prev + 1;
        if (newTime >= screenTimeLimit && !isParentUnlocked) {
          setShowScreenTimeLimitOverlay(true);
        }
        return newTime;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [screenTimeLimit, isParentUnlocked]);

  const initializeUser = async () => {
    try {
      const { data, error } = await supabase
        .from('parent_settings')
        .select('screen_time_limit')
        .eq('user_id', userData.id)
        .maybeSingle();

      if (data) {
        setScreenTimeLimit(data.screen_time_limit);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleParentAccess = () => {
    setActiveTab('parents');
    setShowScreenTimeLimitOverlay(false);
  };

  const handleParentUnlock = () => {
    setIsParentUnlocked(true);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'learn':
        return (
          <LearnScreen
            userName={userData.userName}
            userXP={userData.userXP}
            userLevel={userData.userLevel}
          />
        );
      case 'play':
        return <PlayScreen userLevel={userData.userLevel} />;
      case 'connect':
        return <ConnectScreen />;
      case 'video':
        return <VideoScreen />;
      case 'parents':
        return (
          <ParentsScreen
            userId={userData.id}
            onUnlock={handleParentUnlock}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LanguageProvider>
      <main className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div
            className="transition-all duration-500 ease-in-out"
            style={{
              opacity: 1,
              transform: 'translateY(0)'
            }}
          >
            {renderScreen()}
          </div>
        </div>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {showScreenTimeLimitOverlay && (
          <ScreenTimeLimitOverlay onParentAccess={handleParentAccess} />
        )}
      </main>
    </LanguageProvider>
  );
}
