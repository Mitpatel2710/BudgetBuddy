/*
  # Update transaction type constraint

  1. Changes
    - Update the valid_type constraint to include 'refund' type
    - Ensures backward compatibility with existing data
*/

DO $$ 
BEGIN
  -- Drop the existing constraint
  ALTER TABLE transactions 
    DROP CONSTRAINT IF EXISTS valid_type;

  -- Add the new constraint with updated types
  ALTER TABLE transactions 
    ADD CONSTRAINT valid_type 
    CHECK (type IN ('income', 'expense', 'refund'));
END $$;