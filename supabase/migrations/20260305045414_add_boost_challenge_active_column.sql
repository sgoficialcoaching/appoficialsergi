/*
  # Add boost_challenge_active column to user_profiles

  Adds a boolean flag to track whether the user has explicitly activated the
  Boost 3-Month Challenge from the dashboard banner.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'boost_challenge_active'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN boost_challenge_active boolean DEFAULT false;
  END IF;
END $$;
