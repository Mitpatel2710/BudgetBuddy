/*
  # Remove budget goals table

  This migration removes the budget_goals table if it exists.
*/

DO $$ 
BEGIN
  DROP TABLE IF EXISTS budget_goals CASCADE;
END $$;