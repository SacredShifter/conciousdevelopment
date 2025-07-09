/*
  # Create user settings table

  1. New Tables
    - `sacred_shifter_user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `theme` (text)
      - `energy_level` (integer)
      - `consciousness_level` (text)
      - `active_principle` (text)
      - `chakra_alignment` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `sacred_shifter_user_settings` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
*/

-- Create the sacred_shifter_user_settings table
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

-- Add unique constraint on user_id
ALTER TABLE sacred_shifter_user_settings 
ADD CONSTRAINT sacred_shifter_user_settings_user_id_key UNIQUE (user_id);

-- Enable Row Level Security
ALTER TABLE sacred_shifter_user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for sacred_shifter_user_settings table
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