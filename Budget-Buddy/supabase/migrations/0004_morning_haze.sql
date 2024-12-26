/*
  # Add Custom Categories Support

  1. Changes
    - Creates custom_categories table for user-defined transaction categories
    - Adds foreign key relationship to auth.users
    - Implements row level security
    - Adds policies for CRUD operations

  2. Security
    - Enables RLS
    - Creates policies for user-specific access
    - Ensures users can only access their own categories

  3. Constraints
    - Ensures unique category names per user
    - Validates color format
*/

DO $$ 
BEGIN
  -- Check if the table doesn't exist
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'custom_categories'
  ) THEN
    -- Create the custom_categories table
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
  END IF;
END $$;