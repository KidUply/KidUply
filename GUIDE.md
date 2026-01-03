# KidUply Education App - Complete Guide

## Overview
KidUply is a modern, full-stack educational application for children built with Next.js 14 and Supabase. It features dual language support (English/Uzbek), gamification elements, screen time management, and a comprehensive parent control panel.

## Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with glassmorphism design
- **Components**: React with TypeScript
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime (optional)
- **Authentication**: Ready for Supabase Auth integration

## Features

### 1. Learn Screen
- Personalized greeting with user level and XP
- Weekly progress chart showing daily learning minutes
- Category cards for Math, Language, Science, and History
- Progress bars for each category

### 2. Play Screen
- Grid of educational games
- Lock/unlock mechanism based on user level
- Sample games with thumbnails from Pexels
- "Play Now" buttons for unlocked games

### 3. Connect Screen
- Study buddies list
- Online/offline status indicators
- Message and view profile buttons
- User avatars with level and XP display

### 4. Video Screen
- Main video player interface
- "Up Next" playlist sidebar
- Video thumbnails with play buttons
- Click-to-play functionality

### 5. Parents Panel
- 4-digit PIN protection (default: 1234)
- Screen time limit slider (30-300 minutes)
- Interest analytics bar chart
- Language switcher (English/Uzbek)
- Time spent today display
- Save settings functionality

### 6. Screen Time Management
- Automatic time tracking
- Overlay blocks app when limit reached
- Parent access option from overlay
- Configurable daily limits

## Database Schema

### Tables

#### users
- id (uuid)
- username (text)
- email (text)
- xp (integer)
- level (integer)
- avatar_url (text)
- created_at (timestamp)

#### activities
- id (uuid)
- user_id (uuid)
- category (text)
- duration_minutes (integer)
- activity_date (date)
- created_at (timestamp)

#### parent_settings
- id (uuid)
- user_id (uuid)
- pin_code (text)
- screen_time_limit (integer)
- language (text)
- created_at (timestamp)
- updated_at (timestamp)

#### content
- id (uuid)
- type (text)
- title_en (text)
- title_uz (text)
- description_en (text)
- description_uz (text)
- category (text)
- thumbnail_url (text)
- content_url (text)
- is_locked (boolean)
- required_level (integer)
- created_at (timestamp)

#### study_buddies
- id (uuid)
- user_id (uuid)
- buddy_id (uuid)
- status (text)
- created_at (timestamp)

## How to Use

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Navigation
- Use the bottom navigation bar to switch between screens
- 5 tabs: Learn, Play, Connect, Video, Parents
- Smooth transitions between screens

### Parent Controls
1. Click the "Parents" tab
2. Enter PIN code (default: 1234)
3. Adjust settings:
   - Screen time limit slider
   - Language preference
4. Click "Save Changes" to apply

### Customization

#### Change Default PIN
Update in the database:
```sql
UPDATE parent_settings
SET pin_code = 'YOUR_NEW_PIN'
WHERE user_id = 'demo-user-id';
```

#### Add New Content
Insert into content table:
```sql
INSERT INTO content (type, title_en, title_uz, description_en, description_uz, category, thumbnail_url, is_locked, required_level)
VALUES ('game', 'New Game', 'Yangi o''yin', 'Description', 'Tavsif', 'math', 'https://example.com/image.jpg', false, 1);
```

#### Modify Screen Time Limit
Default is 120 minutes (2 hours). Change in:
- Parent Panel UI
- Database directly
- app/page.tsx (initial state)

## Design System

### Colors
- **Primary Blue**: #4A80F0
- **Success Green**: #22C55E
- **Warning Orange**: #F59E0B
- **Error Red**: #EC4899
- **Background**: #F8FAFC to #E2E8F0 gradient

### Typography
- System fonts for optimal performance
- Font weights: 400 (normal), 600 (semibold), 700 (bold)
- Responsive sizing

### Layout
- Bento box style with rounded corners (32px)
- Glassmorphism effect (backdrop-blur-xl)
- Consistent spacing using Tailwind scale
- Fixed bottom navigation (80px height)

## API Integration

### Supabase Client
Located at `lib/supabase.ts`:
```typescript
import { supabase } from '@/lib/supabase';

// Example: Fetch user data
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .maybeSingle();
```

### Language Context
Use the i18n context:
```typescript
import { useLanguage } from '@/lib/i18n/LanguageContext';

const { t, language, setLanguage } = useLanguage();
// Access translations: t.learn.greeting
```

## Development Tips

### Adding New Screens
1. Create component in `components/screens/`
2. Add to `app/page.tsx` in `renderScreen()` switch
3. Add tab to `components/BottomNav.tsx`
4. Add translations to `lib/i18n/translations.ts`

### Modifying Translations
Edit `lib/i18n/translations.ts`:
```typescript
export const translations = {
  en: { /* English translations */ },
  uz: { /* Uzbek translations */ }
};
```

### Styling Components
- Use Tailwind utility classes
- Follow glassmorphism pattern:
  ```jsx
  className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-gray-200/50"
  ```
- Add hover effects:
  ```jsx
  className="hover:shadow-lg hover:scale-105 transition-all duration-300"
  ```

## Security Notes

### Row Level Security (RLS)
All tables have RLS enabled:
- Users can only access their own data
- Study buddies have reciprocal access
- Content is accessible to all authenticated users

### PIN Protection
- Parent panel requires 4-digit PIN
- Default PIN: 1234
- Change via parent panel or database

## Performance Optimization

### Images
- Using Pexels stock photos (external links)
- Consider implementing Next.js Image component for better performance
- Lazy loading implemented automatically

### Code Splitting
- Each screen is a separate component
- Automatic code splitting by Next.js
- Dynamic imports for heavy components

## Troubleshooting

### Build Issues
If you encounter Recharts type errors:
- TypeScript errors are ignored in build (next.config.js)
- Charts work correctly at runtime

### Database Connection
- Ensure .env file has correct Supabase credentials
- Check NEXT_PUBLIC_SUPABASE_URL
- Check NEXT_PUBLIC_SUPABASE_ANON_KEY

### Screen Not Updating
- Check browser console for errors
- Verify Supabase connection
- Clear browser cache

## Future Enhancements

### Suggested Features
1. Real user authentication with Supabase Auth
2. Push notifications for achievements
3. Multiplayer game modes
4. Video streaming integration
5. Progress reports for parents
6. Reward system with virtual badges
7. Social features (chat, study groups)
8. Offline mode support
9. Mobile app (React Native)
10. AI-powered learning recommendations

## Support

For issues or questions:
1. Check this guide
2. Review database migrations
3. Check browser console for errors
4. Verify Supabase connection

## Credits

- **Stock Photos**: Pexels.com
- **Icons**: Lucide React
- **Charts**: Recharts
- **Framework**: Next.js
- **Backend**: Supabase
- **Styling**: Tailwind CSS

---

**Version**: 1.0.0
**Last Updated**: January 2026
