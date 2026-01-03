'use client';

import { useState, useEffect } from 'react';
import { Lock, Save, Clock, BarChart3, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

interface ParentsScreenProps {
  userId: string;
  onUnlock: () => void;
}

export default function ParentsScreen({ userId, onUnlock }: ParentsScreenProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [settings, setSettings] = useState({
    screenTimeLimit: 120,
    pin_code: '1234',
    language: 'en'
  });
  const [timeSpentToday, setTimeSpentToday] = useState(0);

  useEffect(() => {
    if (isUnlocked) {
      loadSettings();
      loadTodayActivity();
    }
  }, [isUnlocked, userId]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('parent_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setSettings({
          screenTimeLimit: data.screen_time_limit,
          pin_code: data.pin_code,
          language: data.language
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadTodayActivity = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('activities')
        .select('duration_minutes')
        .eq('user_id', userId)
        .eq('activity_date', today);

      if (data) {
        const total = data.reduce((sum, activity) => sum + activity.duration_minutes, 0);
        setTimeSpentToday(total);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    }
  };

  const handlePinSubmit = () => {
    if (pin === settings.pin_code) {
      setIsUnlocked(true);
      onUnlock();
    } else {
      alert('Incorrect PIN');
      setPin('');
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === settings.pin_code) {
            setIsUnlocked(true);
            onUnlock();
          } else {
            alert('Incorrect PIN');
            setPin('');
          }
        }, 300);
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('parent_settings')
        .upsert({
          user_id: userId,
          screen_time_limit: settings.screenTimeLimit,
          pin_code: settings.pin_code,
          language: settings.language,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setLanguage(settings.language as 'en' | 'uz');
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const activityData = [
    { category: 'Math', minutes: 45 },
    { category: 'Language', minutes: 30 },
    { category: 'Games', minutes: 25 },
    { category: 'Videos', minutes: 20 }
  ];

  if (!isUnlocked) {
    return (
      <div className="space-y-6 pb-24">
        <div className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-[32px] p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Lock size={32} />
            <h1 className="text-3xl font-bold">{t.parents.title}</h1>
          </div>
          <p className="text-white/80 text-lg">{t.parents.enterPin}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 border border-gray-200/50">
          <div className="max-w-sm mx-auto">
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-bold transition-all ${
                    pin.length > i
                      ? 'border-[#4A80F0] bg-[#4A80F0] text-white'
                      : 'border-gray-300 bg-white text-gray-300'
                  }`}
                >
                  {pin.length > i ? '●' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((num, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (num === '⌫') {
                      setPin(pin.slice(0, -1));
                    } else if (num !== '') {
                      handlePinInput(num.toString());
                    }
                  }}
                  disabled={num === ''}
                  className={`h-16 rounded-2xl text-2xl font-bold transition-all ${
                    num === ''
                      ? 'bg-transparent cursor-default'
                      : 'bg-gray-100 hover:bg-gray-200 active:scale-95'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-[32px] p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Lock size={32} />
          <h1 className="text-3xl font-bold">{t.parents.title}</h1>
        </div>
        <p className="text-white/80 text-lg">{t.parents.settings}</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-[#4A80F0]" />
          <h2 className="text-xl font-bold text-gray-800">{t.parents.screenTime}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-2">
              {t.parents.dailyLimit}
            </label>
            <input
              type="range"
              min="30"
              max="300"
              step="15"
              value={settings.screenTimeLimit}
              onChange={(e) =>
                setSettings({ ...settings, screenTimeLimit: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4A80F0]"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>30 min</span>
              <span className="font-bold text-[#4A80F0]">{settings.screenTimeLimit} min</span>
              <span>300 min</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              {t.parents.timeSpent}: <span className="font-bold text-[#4A80F0]">{timeSpentToday} min</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-[#22C55E]" />
          <h2 className="text-xl font-bold text-gray-800">{t.parents.interests}</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar dataKey="minutes" fill="#22C55E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={20} className="text-[#F59E0B]" />
          <h2 className="text-xl font-bold text-gray-800">{t.parents.language}</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSettings({ ...settings, language: 'en' })}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              settings.language === 'en'
                ? 'bg-[#4A80F0] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSettings({ ...settings, language: 'uz' })}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              settings.language === 'uz'
                ? 'bg-[#4A80F0] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            O&apos;zbekcha
          </button>
        </div>
      </div>

      <button
        onClick={handleSaveSettings}
        className="w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white py-4 rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
      >
        <Save size={20} />
        {t.parents.saveChanges}
      </button>
    </div>
  );
}
