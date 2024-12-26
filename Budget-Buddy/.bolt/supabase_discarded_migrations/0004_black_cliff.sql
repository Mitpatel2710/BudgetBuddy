/*
  # Update Transaction Table RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies for transactions table:
      - View own transactions
      - Create own transactions
  
  2. Security
    - Enable RLS
    - Policies ensure users can only access their own data
*/

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
  DROP POLICY IF EXISTS "Users can create their own transactions" ON transactions;

  -- Enable RLS (if not already enabled)
  ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

  -- Create new policies
  CREATE POLICY "Users can view their own transactions"
    ON transactions
    FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can create their own transactions"
    ON transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

END $$;