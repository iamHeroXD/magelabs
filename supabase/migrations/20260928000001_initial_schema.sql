-- MageLabs Production Database Schema Migration
-- Defines profiles, experiment catalog, collaborative rooms, session records, and experimental measurements.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Experiments Table
CREATE TABLE IF NOT EXISTS public.experiments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  subject TEXT NOT NULL CHECK (subject IN ('physics', 'chemistry', 'biology')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('introductory', 'intermediate', 'advanced')),
  estimated_duration TEXT NOT NULL,
  description TEXT NOT NULL,
  objectives JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Collaborative Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY, -- e.g. 'LAB-482'
  name TEXT NOT NULL,
  experiment_id TEXT REFERENCES public.experiments(id),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  max_participants INT DEFAULT 8,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Room Members Table
CREATE TABLE IF NOT EXISTS public.room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_name TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Experiment Sessions / Progress
CREATE TABLE IF NOT EXISTS public.experiment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  experiment_id TEXT REFERENCES public.experiments(id),
  room_id TEXT REFERENCES public.rooms(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  challenges_completed JSONB DEFAULT '[]'::jsonb,
  state_snapshot JSONB,
  notes TEXT
);

-- 6. Saved Experimental Measurements (Notebook records)
CREATE TABLE IF NOT EXISTS public.saved_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.experiment_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  experiment_id TEXT NOT NULL,
  data_point JSONB NOT NULL, -- { voltage, current, resistance }
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_measurements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are readable by authenticated users" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Rooms are readable by everyone" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "Users can create rooms" ON public.rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own sessions" ON public.experiment_sessions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own sessions" ON public.experiment_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
