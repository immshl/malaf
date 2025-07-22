-- Drop the problematic policies
DROP POLICY IF EXISTS "Admin can manage opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Admin can view all applications" ON public.opportunity_applications;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'iimmshl@gmail.com'
  );
$$;

-- Create new admin policy using the function
CREATE POLICY "Admin can manage opportunities" 
ON public.opportunities 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admin can view all applications" 
ON public.opportunity_applications 
FOR SELECT 
USING (public.is_admin());