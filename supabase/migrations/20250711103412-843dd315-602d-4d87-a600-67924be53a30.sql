-- Create a function to get user email by username for login
CREATE OR REPLACE FUNCTION public.get_user_email_by_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
BEGIN
    -- Get the email from auth.users table using the user_id from profiles
    SELECT au.email INTO user_email
    FROM public.profiles p
    JOIN auth.users au ON au.id = p.user_id
    WHERE p.username = username_input;
    
    RETURN user_email;
END;
$$;