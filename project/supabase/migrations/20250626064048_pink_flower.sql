/*
  # Create progress tracking tables

  1. New Tables
    - `sacred_shifter_progress_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date)
      - `values_reflections` (integer)
      - `purpose_reflections` (integer)
      - `meditation_minutes` (integer)
      - `practices_completed` (integer)
      - `dreams_recorded` (integer)
      - `insights` (text[])
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `sacred_shifter_progress_data` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
*/

-- Create the sacred_shifter_progress_data table
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

-- Add unique constraint on user_id and date
CREATE UNIQUE INDEX sacred_shifter_progress_data_user_id_date_idx 
ON sacred_shifter_progress_data (user_id, date);

-- Enable Row Level Security
ALTER TABLE sacred_shifter_progress_data ENABLE ROW LEVEL SECURITY;

-- Policies for sacred_shifter_progress_data table
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