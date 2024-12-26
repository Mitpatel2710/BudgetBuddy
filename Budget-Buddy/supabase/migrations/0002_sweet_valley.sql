/*
  # Add profiles table for user details

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to read/update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);