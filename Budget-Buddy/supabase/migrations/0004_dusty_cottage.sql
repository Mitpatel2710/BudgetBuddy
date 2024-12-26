/*
  # Remove Email Functionality
  
  This migration removes the email-related functionality while keeping the core transaction features.
*/

-- Drop email preferences if it exists
DROP TABLE IF EXISTS email_preferences CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS calculate_monthly_totals CASCADE;
DROP FUNCTION IF EXISTS get_category_breakdown CASCADE;
DROP FUNCTION IF EXISTS generate_monthly_report CASCADE;
DROP TYPE IF EXISTS monthly_report_data CASCADE;