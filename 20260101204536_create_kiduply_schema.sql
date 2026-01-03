/*
  # KidUply Education App Database Schema

  ## Overview
  Creates the complete database schema for the KidUply education app including
  user profiles, activity tracking, parent settings, and educational content.

  ## Tables Created
  
  1. **users**
     - id (uuid, primary key)
     - username (text)
     - email (text, unique)
     - xp (integer) - Total experience points
     - level (integer) - Current user level
     - avatar_url (text) - Profile picture
     - created_at (timestamptz)
  
  2. **activities**
     - id (uuid, primary key)
     - user_id (uuid, foreign key)
     - category (text) - learn, play, connect, video
     - duration_minutes (integer)
     - activity_date (date)
     - created_at (timestamptz)
  
  3. **parent_settings**
     - id (uuid, primary key)
     - user_id (uuid, foreign key, unique)
     - pin_code (text) - 4-digit PIN
     - screen_time_limit (integer) - Daily limit in minutes
     - language (text) - en or uz
     - created_at (timestamptz)
     - updated_at (timestamptz)
  
  4. **content**
     - id (uuid, primary key)
     - type (text) - video, game, lesson
     - title_en (text)
     - title_uz (text)
     - description_en (text)
     - description_uz (text)
     - category (text)
     - thumbnail_url (text)
     - content_url (text)
     - is_locked (boolean)
     - required_level (integer)
     - created_at (timestamptz)
  
  5. **study_buddies**
     - id (uuid, primary key)
     - user_id (uuid, foreign key)
     - buddy_id (uuid, foreign key)
     - status (text) - pending, accepted, blocked
     - created_at (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies restrict access to authenticated users
  - Users can only access their own data
  - Study buddies have reciprocal access
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  email text UNIQUE NOT NULL,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create parent_settings table
CREATE TABLE IF NOT EXISTS parent_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pin_code text NOT NULL DEFAULT '1234',
  screen_time_limit integer DEFAULT 120,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE parent_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON parent_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON parent_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON parent_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title_en text NOT NULL,
  title_uz text NOT NULL,
  description_en text,
  description_uz text,
  category text NOT NULL,
  thumbnail_url text,
  content_url text,
  is_locked boolean DEFAULT false,
  required_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view content"
  ON content FOR SELECT
  TO authenticated
  USING (true);

-- Create study_buddies table
CREATE TABLE IF NOT EXISTS study_buddies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  buddy_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, buddy_id)
);

ALTER TABLE study_buddies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own buddy connections"
  ON study_buddies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = buddy_id);

CREATE POLICY "Users can create buddy requests"
  ON study_buddies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update buddy status"
  ON study_buddies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = buddy_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = buddy_id);

-- Insert sample content
INSERT INTO content (type, title_en, title_uz, description_en, description_uz, category, thumbnail_url, is_locked, required_level) VALUES
  ('lesson', 'Math Basics', 'Matematika asoslari', 'Learn basic math operations', 'Asosiy matematik amallarni o''rganing', 'math', 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=400', false, 1),
  ('lesson', 'English ABCs', 'Ingliz alifbosi', 'Master the English alphabet', 'Ingliz alifbosini o''rganing', 'language', 'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=400', false, 1),
  ('game', 'Number Quest', 'Raqamlar sarguzashti', 'Fun math puzzle game', 'Qiziqarli matematik o''yin', 'math', 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400', false, 1),
  ('game', 'Word Builder', 'So''z quruvchi', 'Build words and learn spelling', 'So''zlar yasang va imlo o''rganing', 'language', 'https://images.pexels.com/photos/278887/pexels-photo-278887.jpeg?auto=compress&cs=tinysrgb&w=400', true, 3),
  ('video', 'Science Fun', 'Qiziqarli fan', 'Explore the world of science', 'Fan dunyosini o''rganing', 'science', 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400', false, 1),
  ('video', 'History Tales', 'Tarix hikoyalari', 'Journey through time', 'Tarix sayohati', 'history', 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400', false, 2);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
CREATE INDEX IF NOT EXISTS idx_study_buddies_user ON study_buddies(user_id);
