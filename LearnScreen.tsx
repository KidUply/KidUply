'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface LearnScreenProps {
  userName: string;
  userXP: number;
  userLevel: number;
}

export default function LearnScreen({ userName, userXP, userLevel }: LearnScreenProps) {
  const { t } = useLanguage();

  const weeklyData = [
    { day: 'Mon', minutes: 25 },
    { day: 'Tue', minutes: 40 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 55 },
    { day: 'Fri', minutes: 45 },
    { day: 'Sat', minutes: 35 },
    { day: 'Sun', minutes: 50 }
  ];

  const categories = [
    { name: t.learn.math, color: '#4A80F0', icon: '🔢', progress: 75 },
    { name: t.learn.language, color: '#22C55E', icon: '📚', progress: 60 },
    { name: t.learn.science, color: '#F59E0B', icon: '🔬', progress: 45 },
    { name: t.learn.history, color: '#EC4899', icon: '📜', progress: 30 }
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-[#4A80F0] to-[#3B5FBF] rounded-[32px] p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t.learn.greeting}, {userName}! 👋
            </h1>
            <p className="text-white/80 text-lg">{t.learn.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <Award size={20} />
              <span className="text-2xl font-bold">Level {userLevel}</span>
            </div>
            <p className="text-white/80 text-sm">{userXP} XP</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-[#4A80F0]" />
          <h2 className="text-xl font-bold text-gray-800">{t.learn.weeklyProgress}</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#4A80F0"
              strokeWidth={3}
              dot={{ fill: '#4A80F0', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">{t.learn.categories}</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-3">{category.name}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${category.progress}%`,
                    backgroundColor: category.color
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{category.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
