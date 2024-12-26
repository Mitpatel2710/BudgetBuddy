/*
  # Remove budget goals table if it exists
*/

DO $$ 
BEGIN
  DROP TABLE IF EXISTS budget_goals CASCADE;
END $$;