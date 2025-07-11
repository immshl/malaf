-- Update the function to make username search case insensitive
CREATE OR REPLACE FUNCTION public.get_user_email_by_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
BEGIN
    -- Get the email from auth.users table using the user_id from profiles
    -- Make the search case insensitive by converting both to lowercase
    SELECT au.email INTO user_email
    FROM public.profiles p
    JOIN auth.users au ON au.id = p.user_id
    WHERE LOWER(p.username) = LOWER(username_input);
    
    RETURN user_email;
END;
$$;