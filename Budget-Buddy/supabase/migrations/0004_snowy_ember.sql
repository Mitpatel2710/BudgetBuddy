/*
  # Add Custom Categories Table
  
  1. New Table
    - custom_categories
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - name (text)
      - color (text, hex color validation)
      - created_at (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for CRUD operations if they don't exist
    - Ensure unique category names per user
*/

-- Create custom categories table
CREATE TABLE IF NOT EXISTS custom_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  color text NOT NULL CHECK (color ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_category_name_per_user UNIQUE (user_id, name)
);

-- Enable RLS
ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;

-- Safely create policies
DO $$ 
BEGIN
  -- Check and create SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'custom_categories' 
    AND policyname = 'Users can view their own categories'
  ) THEN
    CREATE POLICY "Users can view their own categories"
      ON custom_categories FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  -- Check and create INSERT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'custom_categories' 
    AND policyname = 'Users can create their own categories'
  ) THEN
    CREATE POLICY "Users can create their own categories"
      ON custom_categories FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check and create UPDATE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'custom_categories' 
    AND policyname = 'Users can update their own categories'
  ) THEN
    CREATE POLICY "Users can update their own categories"
      ON custom_categories FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  -- Check and create DELETE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'custom_categories' 
    AND policyname = 'Users can delete their own categories'
  ) THEN
    CREATE POLICY "Users can delete their own categories"
      ON custom_categories FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;