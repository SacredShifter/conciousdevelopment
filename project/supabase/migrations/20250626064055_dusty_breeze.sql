/*
  # Create milestones table

  1. New Tables
    - `sacred_shifter_milestones`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `description` (text)
      - `target` (integer)
      - `current` (integer)
      - `category` (text)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `sacred_shifter_milestones` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
*/

-- Create the sacred_shifter_milestones table
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

-- Create index on user_id
CREATE INDEX sacred_shifter_milestones_user_id_idx 
ON sacred_shifter_milestones (user_id);

-- Enable Row Level Security
ALTER TABLE sacred_shifter_milestones ENABLE ROW LEVEL SECURITY;

-- Policies for sacred_shifter_milestones table
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