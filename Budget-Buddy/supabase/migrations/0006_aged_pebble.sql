/*
  # Create Transactions Table
  
  1. New Table
    - transactions
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - amount (numeric)
      - description (text)
      - category (text)
      - type (text: income, expense, refund)
      - date (date)
      - created_at (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
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

-- Create policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can view own transactions'
  ) THEN
    CREATE POLICY "Users can view own transactions"
      ON transactions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can create own transactions'
  ) THEN
    CREATE POLICY "Users can create own transactions"
      ON transactions FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can delete own transactions'
  ) THEN
    CREATE POLICY "Users can delete own transactions"
      ON transactions FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;