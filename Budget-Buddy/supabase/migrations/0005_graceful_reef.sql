/*
  # Add Custom Categories Support

  1. New Tables
    - `custom_categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `color` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on custom_categories table
    - Add policies for users to manage their own categories
*/

CREATE TABLE custom_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_category_name_per_user UNIQUE (user_id, name)
);

-- Enable RLS
ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own categories"
  ON custom_categories
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON custom_categories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON custom_categories
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON custom_categories
  FOR DELETE
  USING (auth.uid() = user_id);