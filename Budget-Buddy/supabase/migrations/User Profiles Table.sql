/*
  # Create Profiles Table

  1. Purpose:
    - Store user profile information
    - Link profiles to auth.users
    - Enable row level security

  2. Tables Created:
    - profiles
      - id (uuid, references auth.users)
      - first_name (text)
      - last_name (text)
      - updated_at (timestamptz)

  3. Security:
    - Row Level Security (RLS) enabled
    - Policies for user data access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create access policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);