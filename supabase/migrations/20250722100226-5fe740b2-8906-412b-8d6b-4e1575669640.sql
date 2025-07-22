-- Add opportunity type column
ALTER TABLE public.opportunities 
ADD COLUMN opportunity_type TEXT NOT NULL DEFAULT 'project';

-- Update existing records to have a default type
UPDATE public.opportunities 
SET opportunity_type = 'project' 
WHERE opportunity_type IS NULL;