-- Add status column to track opportunity states
ALTER TABLE public.opportunities 
ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

-- Update existing active opportunities
UPDATE public.opportunities 
SET status = CASE 
  WHEN is_active = true THEN 'active'
  ELSE 'inactive'
END;

-- Add constraint for valid status values
ALTER TABLE public.opportunities 
ADD CONSTRAINT opportunities_status_check 
CHECK (status IN ('active', 'inactive', 'completed', 'expired'));