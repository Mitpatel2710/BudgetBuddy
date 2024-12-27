/*
  # Recreate Delete User Function

  1. Purpose:
    - Safely delete all user data
    - Handle deletion in correct order (foreign key constraints)
    - Provide atomic operation for account deletion

  2. Function Created:
    - delete_user_data()
      - Deletes all user transactions
      - Deletes custom categories
      - Deletes user profile
      - Optionally deletes the user from auth.users

  3. Security:
    - SECURITY DEFINER to bypass RLS
    - Only authenticated users can execute
*/

-- Drop the function if it already exists
DROP FUNCTION IF EXISTS delete_user_data();

-- Recreate the function to safely delete all user data
CREATE OR REPLACE FUNCTION delete_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the ID of the authenticated user
  v_user_id := auth.uid();

  -- Raise an error if the user is not authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete all transactions for the authenticated user
  DELETE FROM transactions
  WHERE user_id = v_user_id;

  -- Delete all custom categories for the authenticated user
  DELETE FROM custom_categories
  WHERE user_id = v_user_id;

  -- Delete the user profile
  DELETE FROM profiles
  WHERE id = v_user_id;

  -- Optionally delete the user record from auth.users
  DELETE FROM auth.users
  WHERE id = v_user_id;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to delete user data: %', SQLERRM;
END;
$$;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION delete_user_data FROM PUBLIC;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_data TO authenticated;
