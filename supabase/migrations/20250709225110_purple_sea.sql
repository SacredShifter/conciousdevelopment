-- First drop potentially existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own settings" ON sacred_shifter_user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON sacred_shifter_user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON sacred_shifter_user_settings;

DROP POLICY IF EXISTS "Users can view their own progress data" ON sacred_shifter_progress_data;
DROP POLICY IF EXISTS "Users can insert their own progress data" ON sacred_shifter_progress_data;
DROP POLICY IF EXISTS "Users can update their own progress data" ON sacred_shifter_progress_data;

DROP POLICY IF EXISTS "Users can view their own milestones" ON sacred_shifter_milestones;
DROP POLICY IF EXISTS "Users can insert their own milestones" ON sacred_shifter_milestones;
DROP POLICY IF EXISTS "Users can update their own milestones" ON sacred_shifter_milestones;

-- Create tables with IF NOT EXISTS to avoid errors
CREATE TABLE IF NOT EXISTS sacred_shifter_user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'cosmic',
  energy_level integer DEFAULT 7,
  consciousness_level text DEFAULT 'awakening',
  active_principle text DEFAULT 'vibration',
  chakra_alignment text DEFAULT 'heart',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS sacred_shifter_user_settings_user_id_idx ON sacred_shifter_user_settings(user_id);

CREATE TABLE IF NOT EXISTS sacred_shifter_progress_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  values_reflections integer DEFAULT 0,
  purpose_reflections integer DEFAULT 0,
  meditation_minutes integer DEFAULT 0,
  practices_completed integer DEFAULT 0,
  dreams_recorded integer DEFAULT 0,
  insights text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS sacred_shifter_progress_data_user_date_idx ON sacred_shifter_progress_data(user_id, date);

CREATE TABLE IF NOT EXISTS sacred_shifter_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target integer NOT NULL,
  current integer DEFAULT 0,
  category text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sacred_shifter_milestones_user_id_idx ON sacred_shifter_milestones(user_id);

-- Enable Row Level Security using a safer method
DO $$ 
BEGIN
  -- Only enable RLS if it's not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'sacred_shifter_user_settings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE sacred_shifter_user_settings ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'sacred_shifter_progress_data' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE sacred_shifter_progress_data ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'sacred_shifter_milestones' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE sacred_shifter_milestones ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for sacred_shifter_user_settings
CREATE POLICY "Users can view their own settings"
  ON sacred_shifter_user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON sacred_shifter_user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON sacred_shifter_user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for sacred_shifter_progress_data
CREATE POLICY "Users can view their own progress data"
  ON sacred_shifter_progress_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress data"
  ON sacred_shifter_progress_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress data"
  ON sacred_shifter_progress_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for sacred_shifter_milestones
CREATE POLICY "Users can view their own milestones"
  ON sacred_shifter_milestones
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones"
  ON sacred_shifter_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
  ON sacred_shifter_milestones
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);