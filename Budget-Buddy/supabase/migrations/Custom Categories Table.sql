/*
  # Create Custom Categories Table

  1. Purpose:
    - Allow users to create custom transaction categories
    - Store category colors for UI
    - Enable row level security

  2. Tables Created:
    - custom_categories
      - id (uuid)
      - user_id (uuid, references auth.users)
      - name (text)
      - color (text, hex color)
      - created_at (timestamptz)

  3. Security:
    - Row Level Security (RLS) enabled
    - Policies for category access
    - Unique constraint on category names per user
*/

-- Create custom categories table
CREATE TABLE custom_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  color text NOT NULL CHECK (color ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_category_name_per_user UNIQUE (user_id, name)
);

-- Enable RLS
ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;

-- Create access policies
CREATE POLICY "Users can view their own categories"
  ON custom_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON custom_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON custom_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON custom_categories FOR DELETE
  USING (auth.uid() = user_id);