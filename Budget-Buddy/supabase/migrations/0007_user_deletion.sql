/*
  # Account Deletion Function
  
  1. Changes
    - Creates a secure function to handle user account deletion
    - Function deletes all user data in correct order
    - Maintains referential integrity
  
  2. Security
    - Function runs with SECURITY DEFINER
    - Limited to authenticated users only
    - Proper schema search path set
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS delete_user_data();

-- Create function to delete user data
CREATE OR REPLACE FUNCTION delete_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the ID of the authenticated user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete data in a specific order to maintain referential integrity
  DELETE FROM transactions
  WHERE user_id = v_user_id;

  DELETE FROM custom_categories
  WHERE user_id = v_user_id;

  DELETE FROM profiles
  WHERE id = v_user_id;

  -- Delete the auth user
  DELETE FROM auth.users
  WHERE id = v_user_id;
END;
$$;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION delete_user_data FROM PUBLIC;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION delete_user_data TO authenticated;