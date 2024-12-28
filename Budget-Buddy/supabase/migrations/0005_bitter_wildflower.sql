/*
  # Create User Profiles Table
  
  1. New Table
    - profiles
      - id (uuid, primary key, references auth.users)
      - first_name (text)
      - last_name (text)
      - email (text, unique)
      - updated_at (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;