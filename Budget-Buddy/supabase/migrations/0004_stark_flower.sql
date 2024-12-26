/*
  # Add Budget Goals Feature

  1. New Tables
    - `budget_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `category` (text)
      - `amount` (numeric)
      - `spent` (numeric)
      - `month` (text, YYYY-MM format)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on budget_goals table
    - Add policy for users to manage their own budget goals

  3. Constraints
    - Foreign key to auth.users
    - Month format validation (YYYY-MM)
    - Default values for spent and created_at
*/

DO $$ 
BEGIN
  -- Create budget_goals table if it doesn't exist
  CREATE TABLE IF NOT EXISTS budget_goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    category text NOT NULL,
    amount numeric NOT NULL CHECK (amount >= 0),
    spent numeric NOT NULL DEFAULT 0 CHECK (spent >= 0),
    month text NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_month_format CHECK (month ~ '^\d{4}-\d{2}$'),
    CONSTRAINT unique_user_category_month UNIQUE (user_id, category, month)
  );

  -- Enable RLS
  ALTER TABLE budget_goals ENABLE ROW LEVEL SECURITY;

  -- Create policies for authenticated users
  CREATE POLICY "Users can view their own budget goals"
    ON budget_goals
    FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can create their own budget goals"
    ON budget_goals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own budget goals"
    ON budget_goals
    FOR UPDATE
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own budget goals"
    ON budget_goals
    FOR DELETE
    USING (auth.uid() = user_id);

  -- Create index for better query performance
  CREATE INDEX IF NOT EXISTS idx_budget_goals_user_month 
    ON budget_goals (user_id, month);

END $$;