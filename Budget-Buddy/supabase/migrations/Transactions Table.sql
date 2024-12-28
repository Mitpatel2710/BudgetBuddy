/*
  # Create Transactions Table

  1. Purpose:
    - Store financial transactions
    - Track income, expenses, and refunds
    - Enable row level security

  2. Tables Created:
    - transactions
      - id (uuid)
      - user_id (uuid, references auth.users)
      - amount (numeric)
      - description (text)
      - category (text)
      - type (text: income/expense/refund)
      - date (date)
      - created_at (timestamptz)

  3. Security:
    - Row Level Security (RLS) enabled
    - Policies for transaction access
*/

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  amount numeric NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense', 'refund')),
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create access policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);