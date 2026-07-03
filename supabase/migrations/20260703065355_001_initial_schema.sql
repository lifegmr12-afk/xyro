/*
# PromptVerse AI Initial Schema

A comprehensive schema for an AI Prompt Library platform with user authentication,
community features, collections, ratings, and subscription management.

## Tables Created:
1. `profiles` - User profiles extending Supabase auth
2. `categories` - Prompt categories (ChatGPT, Gemini, etc.)
3. `prompts` - Core prompt content
4. `prompt_comments` - User comments on prompts
5. `prompt_ratings` - User ratings (1-5 stars)
6. `prompt_favorites` - User favorites/bookmarks
7. `collections` - User-created collections/folders
8. `collection_prompts` - Junction table for prompts in collections
9. `subscriptions` - Premium subscriptions
10. `newsletter_subscribers` - Newsletter signups
11. `user_achievements` - Gamification badges

## Security:
- RLS enabled on all tables
- Owner-scoped CRUD for user data
- Public read for prompts, categories (with anon access for browsing)
- Authenticated-only write operations
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  username text UNIQUE,
  avatar_url text,
  bio text,
  website text,
  is_premium boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon text,
  description text,
  prompt_count integer DEFAULT 0,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  prompt_text text NOT NULL,
  example_output text,
  platform text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  views_count integer DEFAULT 0,
  copies_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  rating_avg numeric(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prompt comments
CREATE TABLE IF NOT EXISTS prompt_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prompt ratings
CREATE TABLE IF NOT EXISTS prompt_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(prompt_id, user_id)
);

-- Prompt favorites
CREATE TABLE IF NOT EXISTS prompt_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(prompt_id, user_id)
);

-- Collections (user folders)
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  prompts_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collection prompts junction
CREATE TABLE IF NOT EXISTS collection_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, prompt_id)
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status text NOT NULL DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achieved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_platform ON prompts(platform);
CREATE INDEX IF NOT EXISTS idx_prompts_author ON prompts(author_id);
CREATE INDEX IF NOT EXISTS idx_prompts_featured ON prompts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_prompts_created ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON prompts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_comments_prompt ON prompt_comments(prompt_id);
CREATE INDEX IF NOT EXISTS idx_ratings_prompt ON prompt_ratings(prompt_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON prompt_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Categories policies (public read, admin write)
DROP POLICY IF EXISTS "categories_select" ON categories;
CREATE POLICY "categories_select" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "categories_insert" ON categories;
CREATE POLICY "categories_insert" ON categories FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "categories_update" ON categories;
CREATE POLICY "categories_update" ON categories FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)) 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Prompts policies (public read for published, authenticated write)
DROP POLICY IF EXISTS "prompts_select" ON prompts;
CREATE POLICY "prompts_select" ON prompts FOR SELECT
  TO anon, authenticated USING (is_published = true OR author_id = auth.uid());

DROP POLICY IF EXISTS "prompts_insert" ON prompts;
CREATE POLICY "prompts_insert" ON prompts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "prompts_update" ON prompts;
CREATE POLICY "prompts_update" ON prompts FOR UPDATE
  TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "prompts_delete" ON prompts;
CREATE POLICY "prompts_delete" ON prompts FOR DELETE
  TO authenticated USING (auth.uid() = author_id);

-- Comments policies
DROP POLICY IF EXISTS "comments_select" ON prompt_comments;
CREATE POLICY "comments_select" ON prompt_comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert" ON prompt_comments;
CREATE POLICY "comments_insert" ON prompt_comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_update" ON prompt_comments;
CREATE POLICY "comments_update" ON prompt_comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_delete" ON prompt_comments;
CREATE POLICY "comments_delete" ON prompt_comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Ratings policies
DROP POLICY IF EXISTS "ratings_select" ON prompt_ratings;
CREATE POLICY "ratings_select" ON prompt_ratings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "ratings_insert" ON prompt_ratings;
CREATE POLICY "ratings_insert" ON prompt_ratings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_update" ON prompt_ratings;
CREATE POLICY "ratings_update" ON prompt_ratings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_delete" ON prompt_ratings;
CREATE POLICY "ratings_delete" ON prompt_ratings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Favorites policies
DROP POLICY IF EXISTS "favorites_select" ON prompt_favorites;
CREATE POLICY "favorites_select" ON prompt_favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_insert" ON prompt_favorites;
CREATE POLICY "favorites_insert" ON prompt_favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_delete" ON prompt_favorites;
CREATE POLICY "favorites_delete" ON prompt_favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Collections policies
DROP POLICY IF EXISTS "collections_select" ON collections;
CREATE POLICY "collections_select" ON collections FOR SELECT
  TO anon, authenticated USING (is_public = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "collections_insert" ON collections;
CREATE POLICY "collections_insert" ON collections FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "collections_update" ON collections;
CREATE POLICY "collections_update" ON collections FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "collections_delete" ON collections;
CREATE POLICY "collections_delete" ON collections FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Collection prompts policies
DROP POLICY IF EXISTS "collection_prompts_select" ON collection_prompts;
CREATE POLICY "collection_prompts_select" ON collection_prompts FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_prompts.collection_id AND (is_public = true OR user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "collection_prompts_insert" ON collection_prompts;
CREATE POLICY "collection_prompts_insert" ON collection_prompts FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "collection_prompts_delete" ON collection_prompts;
CREATE POLICY "collection_prompts_delete" ON collection_prompts FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
  );

-- Subscriptions policies (user can only see their own)
DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_insert" ON subscriptions;
CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_update" ON subscriptions;
CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Newsletter subscribers (anyone can subscribe)
DROP POLICY IF EXISTS "newsletter_select" ON newsletter_subscribers;
CREATE POLICY "newsletter_select" ON newsletter_subscribers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "newsletter_insert" ON newsletter_subscribers;
CREATE POLICY "newsletter_insert" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- User achievements (user can see own)
DROP POLICY IF EXISTS "achievements_select" ON user_achievements;
CREATE POLICY "achievements_select" ON user_achievements FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "achievements_insert" ON user_achievements;
CREATE POLICY "achievements_insert" ON user_achievements FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('ChatGPT', 'chatgpt', 'Prompts for ChatGPT by OpenAI', 1),
('Gemini', 'gemini', 'Prompts for Google Gemini', 2),
('Claude', 'claude', 'Prompts for Anthropic Claude', 3),
('DeepSeek', 'deepseek', 'Prompts for DeepSeek AI', 4),
('Grok', 'grok', 'Prompts for xAI Grok', 5),
('Midjourney', 'midjourney', 'Image generation prompts for Midjourney', 6),
('Flux', 'flux', 'Image generation prompts for Flux', 7),
('Stable Diffusion', 'stable-diffusion', 'Image generation prompts for Stable Diffusion', 8),
('DALL·E', 'dalle', 'Image generation prompts for DALL·E', 9),
('Runway', 'runway', 'Video generation prompts for Runway', 10),
('Veo', 'veo', 'Video generation prompts for Google Veo', 11),
('Sora', 'sora', 'Video generation prompts for OpenAI Sora', 12),
('Coding', 'coding', 'Programming and development prompts', 13),
('Marketing', 'marketing', 'Marketing and growth prompts', 14),
('Business', 'business', 'Business strategy and operations prompts', 15),
('SEO', 'seo', 'Search engine optimization prompts', 16),
('YouTube', 'youtube', 'YouTube content creation prompts', 17),
('Writing', 'writing', 'Creative and professional writing prompts', 18),
('Education', 'education', 'Educational and learning prompts', 19),
('Productivity', 'productivity', 'Productivity and workflow prompts', 20),
('Design', 'design', 'UI/UX and graphic design prompts', 21),
('Gaming', 'gaming', 'Game development and gaming prompts', 22),
('Anime', 'anime', 'Anime and manga style prompts', 23),
('Social Media', 'social-media', 'Social media content prompts', 24),
('Excel', 'excel', 'Excel and spreadsheet prompts', 25),
('Finance', 'finance', 'Financial analysis and planning prompts', 26),
('Resume', 'resume', 'Resume and career development prompts', 27),
('Interview', 'interview', 'Interview preparation prompts', 28),
('Email', 'email', 'Email writing and communication prompts', 29),
('Sales', 'sales', 'Sales and persuasion prompts', 30),
('Customer Support', 'customer-support', 'Customer service and support prompts', 31)
ON CONFLICT (slug) DO NOTHING;