-- Create admin user (run this in Supabase SQL editor)
-- Replace 'admin@example.com' with your actual admin email
-- This will set the role to 'admin' in the users table

INSERT INTO users (id, email, role)
SELECT
  au.id,
  au.email,
  'admin'
FROM auth.users au
WHERE au.email = 'admin@example.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin';

-- Also update the user metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@example.com';