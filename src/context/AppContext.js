import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

// Daily plan: 3 videos + 3 games = 100% = coin reward
const DAILY_COINS_REWARD = 50;
const DAILY_STARS_REWARD = 30;

const generateBlocks = (subject, unlockedCount) => {
  const descriptions = {
    math: ['Counting 1-10','Addition basics','Subtraction','Multiplication','Division','Fractions','Decimals','Geometry','Algebra intro','Problem solving'],
    nature: ['Animals','Plants','Weather','Seasons','Ecosystems','Water cycle','Space','Earth','Rocks','Energy'],
    language: ['Alphabet','Vowels','Words','Sentences','Reading','Writing','Grammar','Spelling','Stories','Poetry'],
    lifeSkills: ['Self care','Emotions','Teamwork','Safety','Cooking','Gardening','Money basics','First aid','Time mgmt','Respect'],
  };
  const arr = descriptions[subject] || descriptions.math;
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    blockNumber: i + 1,
    title: arr[i % arr.length] + ` (${Math.floor(i / arr.length) + 1})`,
    locked: i >= unlockedCount,
    completed: i < unlockedCount - 1,
    current: i === unlockedCount - 1,
    stars: i < unlockedCount - 1 ? Math.floor(Math.random() * 3) + 1 : 0,
    gameType: ['quiz', 'matching', 'drag', 'puzzle'][i % 4],
  }));
};

const createChild = (name, age, gender) => ({
  id: Date.now().toString(),
  name, age, gender,
  avatar: gender === 'girl' ? '👧' : '👦',
  stars: 0, coins: 0, level: 1, streak: 0,
  plan: 'free', iq: 85,
  // Daily plan tracking
  dailyVideosWatched: 0,
  dailyGamesCompleted: 0,
  dailyGoalVideos: 3,
  dailyGoalGames: 3,
  dailyCompleted: false,
  subjects: {
    math: { unlockedBlocks: 1, totalBlocks: 100, stars: 0 },
    nature: { unlockedBlocks: 1, totalBlocks: 100, stars: 0 },
    language: { unlockedBlocks: 1, totalBlocks: 100, stars: 0 },
    lifeSkills: { unlockedBlocks: 1, totalBlocks: 100, stars: 0 },
  },
  weeklyProgress: { Math: 0, Reading: 0, Logic: 0, Skill: 0, Science: 0 },
  friends: [
    { id: 'f1', name: 'Bob', avatar: '👦', online: true },
    { id: 'f2', name: 'Sergio', avatar: '👦', online: false },
    { id: 'f3', name: 'Grace', avatar: '👧', online: true },
  ],
  collaborationProgress: 0, collaborationGoal: 74,
  aiReport: { trophies: 0, points: 0 },
  strengths: ['Matematika', "Zo'r boshlanish!"],
  improvements: ['Imlo', 'Davom eting!'],
  aiSuggestion: 'Kuniga 3 ta video ko\'ring!',
  // IQ history for chart
  iqHistory: [85, 85, 85, 85, 85],
});

const PLANS = [
  {
    id: 'free', name: "Free Plan", price: 0, priceLabel: "Bepul", icon: '🌱', color: '#3DB87A',
    features: ["2 ta fan (Math + Language)", "10 ta block", "Asosiy o'yinlar", "Haftalik 3 ta video", "Ota-ona paneli (cheklangan)"],
    locked: ["Nature, Life Skills fanlari", "50+ blocklar", "AI tahlil", "IQ darajasi"],
  },
  {
    id: 'premium', name: "Premium Plan", price: 9.99, priceLabel: "$9.99/oy", icon: '⭐', color: '#F59E0B', popular: true,
    features: ["Barcha 4 ta fan", "50 ta block", "Barcha o'yinlar", "Cheksiz video", "AI tahlil", "IQ darajasi", "Do'stlar bilan o'yin"],
    locked: ["50-100 blocklar", "Gold badges", "Live tutor"],
  },
  {
    id: 'gold', name: "Gold Plan", price: 19.99, priceLabel: "$19.99/oy", icon: '👑', color: '#F5C842',
    features: ["Barcha 4 ta fan", "100 ta block (to'liq)", "Exclusive games", "Chuqur AI tahlil", "Live tutor (4x/oy)", "Gold sertifikat", "Oila mode (3 farzand)"],
    locked: [],
  },
];

export const AppProvider = ({ children }) => {
  const [onboardingStep, setOnboardingStep] = useState('welcome');
  const [parentName, setParentNameState] = useState('');
  const [parentPin, setParentPin] = useState(null); // 4-digit PIN
  const [childList, setChildList] = useState([]);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [blocks, setBlocks] = useState({});
  const [currentPlan, setCurrentPlan] = useState('free');

  const activeChild = childList[activeChildIndex] || null;

  const finishOnboarding = (pName, pPin, firstChild) => {
    setParentNameState(pName);
    setParentPin(pPin);
    const child = createChild(firstChild.name, firstChild.age, firstChild.gender);
    setChildList([child]);
    setBlocks({
      [child.id]: {
        math: generateBlocks('math', 1),
        nature: generateBlocks('nature', 1),
        language: generateBlocks('language', 1),
        lifeSkills: generateBlocks('lifeSkills', 1),
      }
    });
    setActiveChildIndex(0);
    setOnboardingStep('done');
  };

  const verifyPin = (pin) => pin === parentPin;

  const addChild = (name, age, gender) => {
    const child = createChild(name, age, gender);
    setChildList(prev => [...prev, child]);
    setBlocks(prev => ({
      ...prev,
      [child.id]: {
        math: generateBlocks('math', 1),
        nature: generateBlocks('nature', 1),
        language: generateBlocks('language', 1),
        lifeSkills: generateBlocks('lifeSkills', 1),
      }
    }));
  };

  const removeChild = (childId) => {
    setChildList(prev => prev.filter(c => c.id !== childId));
    setActiveChildIndex(0);
  };

  const completeBlock = (subject, blockId) => {
    if (!activeChild) return;
    const cid = activeChild.id;

    // Update blocks
    setBlocks(prev => {
      const childBlocks = { ...prev[cid] };
      const updated = [...childBlocks[subject]];
      const idx = updated.findIndex(b => b.id === blockId);
      if (idx !== -1) {
        updated[idx] = { ...updated[idx], completed: true, stars: 3, current: false };
        if (idx + 1 < updated.length) updated[idx + 1] = { ...updated[idx + 1], locked: false, current: true };
      }
      return { ...prev, [cid]: { ...childBlocks, [subject]: updated } };
    });

    // Update child stats + IQ + daily progress
    setChildList(prev => prev.map((c, i) => {
      if (i !== activeChildIndex) return c;
      const newGames = c.dailyGamesCompleted + 1;
      const newVideos = c.dailyVideosWatched; // videos tracked separately
      const dailyPct = calcDailyPercent(newVideos, newGames, c.dailyGoalVideos, c.dailyGoalGames);
      const dailyDone = dailyPct >= 100 && !c.dailyCompleted;
      const iqBoost = Math.random() > 0.5 ? 1 : 0;
      const newIq = Math.min(150, c.iq + iqBoost);
      const newIqHistory = [...(c.iqHistory || []), newIq].slice(-7);

      // Update weeklyProgress
      const subjectKey = { math: 'Math', nature: 'Science', language: 'Reading', lifeSkills: 'Skill' }[subject] || 'Math';
      const newWeekly = { ...c.weeklyProgress, [subjectKey]: Math.min(100, (c.weeklyProgress[subjectKey] || 0) + 5) };

      return {
        ...c,
        stars: c.stars + 10 + (dailyDone ? DAILY_STARS_REWARD : 0),
        coins: c.coins + 5 + (dailyDone ? DAILY_COINS_REWARD : 0),
        dailyGamesCompleted: newGames,
        dailyCompleted: c.dailyCompleted || dailyDone,
        iq: newIq,
        iqHistory: newIqHistory,
        weeklyProgress: newWeekly,
      };
    }));
  };

  const watchVideo = () => {
    if (!activeChild) return;
    setChildList(prev => prev.map((c, i) => {
      if (i !== activeChildIndex) return c;
      const newVideos = c.dailyVideosWatched + 1;
      const dailyPct = calcDailyPercent(newVideos, c.dailyGamesCompleted, c.dailyGoalVideos, c.dailyGoalGames);
      const dailyDone = dailyPct >= 100 && !c.dailyCompleted;
      return {
        ...c,
        dailyVideosWatched: newVideos,
        dailyCompleted: c.dailyCompleted || dailyDone,
        stars: c.stars + (dailyDone ? DAILY_STARS_REWARD : 0),
        coins: c.coins + (dailyDone ? DAILY_COINS_REWARD : 0),
      };
    }));
  };

  const calcDailyPercent = (videos, games, goalV, goalG) => {
    const vPct = Math.min(1, videos / goalV);
    const gPct = Math.min(1, games / goalG);
    return Math.round(((vPct + gPct) / 2) * 100);
  };

  const getDailyPercent = () => {
    if (!activeChild) return 0;
    return calcDailyPercent(
      activeChild.dailyVideosWatched,
      activeChild.dailyGamesCompleted,
      activeChild.dailyGoalVideos,
      activeChild.dailyGoalGames,
    );
  };

  const upgradePlan = (planId) => {
    setCurrentPlan(planId);
    setChildList(prev => prev.map(c => ({ ...c, plan: planId })));
  };

  const activeBlocks = activeChild ? (blocks[activeChild.id] || {}) : {};

  return (
    <AppContext.Provider value={{
      onboardingStep, setOnboardingStep,
      parentName, parentPin, setParentPin,
      verifyPin, finishOnboarding,
      childList, activeChild, activeChildIndex, setActiveChildIndex,
      addChild, removeChild,
      blocks: activeBlocks, completeBlock, watchVideo,
      getDailyPercent, calcDailyPercent,
      plans: PLANS, currentPlan, upgradePlan,
    }}>
      {children}
    </AppContext.Provider>
  );
};
