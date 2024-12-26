/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for reading, updating, and inserting profiles
*/

DO $$ 
BEGIN
  -- Create profiles table if it doesn't exist
  CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    first_name text NOT NULL,
    last_name text NOT NULL,
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

  -- Create new policies
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
END $$;