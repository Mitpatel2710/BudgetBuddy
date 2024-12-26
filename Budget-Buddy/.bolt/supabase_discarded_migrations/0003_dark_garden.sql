/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric)
      - `description` (text)
      - `category` (text)
      - `type` (text, check constraint for 'income' or 'expense')
      - `date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for viewing and creating transactions
*/

DO $$ 
BEGIN
  -- Drop existing table and policies if they exist
  DROP TABLE IF EXISTS transactions CASCADE;

  -- Create the transactions table
  CREATE TABLE transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    amount numeric NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    type text NOT NULL,
    date date NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT valid_type CHECK (type IN ('income', 'expense'))
  );

  -- Enable RLS
  ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Users can view their own transactions"
    ON transactions
    FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can create their own transactions"
    ON transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

END $$;