# KidUply 📚🎮

Bolalar uchun interaktiv ta'lim ilovasi — React Native (Expo)

## 🚀 O'rnatish va ishga tushirish

```bash
# 1. Klonlash
git clone https://github.com/SIZNING_USERNAME/kiduply.git
cd kiduply

# 2. Paketlarni o'rnatish
npm install

# 3. Ishga tushirish
npx expo start

# Telefonda test qilish
# → Expo Go app yuklab → QR code skaner
```

## 📱 APK qurish (EAS Build)

```bash
# EAS CLI o'rnatish
npm install -g eas-cli

# Login
eas login

# Loyihani bog'lash (bir marta)
eas init

# APK qurish (test uchun)
npm run build:apk

# Production APK
npm run build:prod
```

## 📁 Loyiha tuzilmasi

```
KidUply/
├── App.js                          # Entry point
├── app.json                        # Expo config
├── eas.json                        # EAS Build config
├── package.json
├── babel.config.js
├── assets/                         # Icon, splash (o'z rasmingizni qo'ying!)
│   └── README.md
└── src/
    ├── context/AppContext.js       # Global state
    ├── navigation/AppNavigator.js  # Tab + Stack navigator
    ├── theme/index.js              # Design system
    ├── components/
    │   ├── AppHeader.js
    │   └── AddChildModal.js
    └── screens/
        ├── OnboardingScreen.js     # Kirish + PIN + bola ma'lumot
        ├── ParentsPinScreen.js     # PIN kiritish
        ├── LearnScreen.js          # Asosiy ekran
        ├── SubjectBlocksScreen.js  # 100 blok piramidasi
        ├── BlockLessonScreen.js    # Video + O'yin
        ├── PlayScreen.js
        ├── ConnectScreen.js
        ├── ParentsScreen.js        # Ota-ona dashboard
        └── PlansScreen.js          # Tariflar
```

## ⚠️ Assets haqida

`assets/` papkasiga quyidagi rasmlarni qo'shish kerak:
- `icon.png` — 1024×1024px (app icon)
- `splash.png` — 1284×2778px (splash screen)  
- `adaptive-icon.png` — 1024×1024px (Android adaptive icon)
- `favicon.png` — 48×48px

## 🔮 Keyingi qadam — Supabase Backend

```bash
# Supabase client o'rnatish
npm install @supabase/supabase-js

# .env fayl yaratish
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 📋 MVP Checklist

- [x] Onboarding (ota-ona ismi + PIN + bola ma'lumot)
- [x] 4 ta fan (Math, Nature, Language, Life Skills)
- [x] 100 blok piramidasi (Duolingo uslub)
- [x] Video → O'yin → Unlock flow
- [x] Kunlik reja (3 video + 3 o'yin = 100% = coin)
- [x] Ota-ona paneli (PIN himoya)
- [x] IQ ball (Premium)
- [x] Multi-child support
- [x] Free / Premium / Gold tariflar
- [ ] Supabase backend
- [ ] Haqiqiy video player
- [ ] Push notifications
- [ ] Play Store chiqarish
