/*
  # Create budget goals table

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
    - Enable RLS on `budget_goals` table
    - Add policies for authenticated users to manage their own budget goals
*/

CREATE TABLE IF NOT EXISTS budget_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  category text NOT NULL,
  amount numeric NOT NULL,
  spent numeric NOT NULL DEFAULT 0,
  month text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_month_format CHECK (month ~ '^\d{4}-\d{2}$')
);

ALTER TABLE budget_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own budget goals"
  ON budget_goals
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);