export const translations = {
  en: {
    nav: {
      learn: 'Learn',
      play: 'Play',
      connect: 'Connect',
      video: 'Video',
      parents: 'Parents'
    },
    learn: {
      greeting: 'Hello',
      subtitle: 'What would you like to learn today?',
      categories: 'Categories',
      weeklyProgress: 'Weekly Progress',
      math: 'Mathematics',
      language: 'Language',
      science: 'Science',
      history: 'History',
      minutes: 'min'
    },
    play: {
      title: 'Game Zone',
      subtitle: 'Fun learning games',
      locked: 'Locked',
      unlockAt: 'Unlock at Level',
      play: 'Play Now'
    },
    connect: {
      title: 'Study Buddies',
      subtitle: 'Connect with friends',
      online: 'Online',
      offline: 'Offline',
      message: 'Message',
      viewProfile: 'View Profile'
    },
    video: {
      title: 'Learning Videos',
      upNext: 'Up Next',
      nowPlaying: 'Now Playing',
      duration: 'Duration'
    },
    parents: {
      title: 'Parent Panel',
      enterPin: 'Enter PIN Code',
      screenTime: 'Screen Time Limit',
      interests: 'Interest Analytics',
      settings: 'Settings',
      language: 'Language',
      saveChanges: 'Save Changes',
      dailyLimit: 'Daily Limit (minutes)',
      timeSpent: 'Time Spent Today'
    },
    screenTimeExpired: {
      title: 'Screen Time Limit Reached',
      message: 'You have reached your daily screen time limit.',
      askParent: 'Please ask your parent to extend your time.'
    }
  },
  uz: {
    nav: {
      learn: 'O\'rganish',
      play: 'O\'yin',
      connect: 'Bog\'lanish',
      video: 'Video',
      parents: 'Ota-ona'
    },
    learn: {
      greeting: 'Salom',
      subtitle: 'Bugun nima o\'rganmoqchisiz?',
      categories: 'Kategoriyalar',
      weeklyProgress: 'Haftalik yutuqlar',
      math: 'Matematika',
      language: 'Til',
      science: 'Fan',
      history: 'Tarix',
      minutes: 'daq'
    },
    play: {
      title: 'O\'yin zonasi',
      subtitle: 'Qiziqarli o\'quv o\'yinlari',
      locked: 'Yopiq',
      unlockAt: 'Ochish darajasi',
      play: 'O\'ynash'
    },
    connect: {
      title: 'Do\'stlar',
      subtitle: 'Do\'stlar bilan bog\'lanish',
      online: 'Onlayn',
      offline: 'Oflayn',
      message: 'Xabar',
      viewProfile: 'Profilni ko\'rish'
    },
    video: {
      title: 'O\'quv videolar',
      upNext: 'Keyingisi',
      nowPlaying: 'Hozir ijro etilmoqda',
      duration: 'Davomiyligi'
    },
    parents: {
      title: 'Ota-ona paneli',
      enterPin: 'PIN kodni kiriting',
      screenTime: 'Ekran vaqti cheklovi',
      interests: 'Qiziqishlar tahlili',
      settings: 'Sozlamalar',
      language: 'Til',
      saveChanges: 'O\'zgarishlarni saqlash',
      dailyLimit: 'Kunlik chegara (daqiqa)',
      timeSpent: 'Bugun sarflangan vaqt'
    },
    screenTimeExpired: {
      title: 'Ekran vaqti tugadi',
      message: 'Siz kunlik ekran vaqti chegarasiga yetdingiz.',
      askParent: 'Iltimos, ota-onangizdan vaqtni uzaytirishni so\'rang.'
    }
  }
};

export type Language = 'en' | 'uz';
export type TranslationKeys = typeof translations.en;
