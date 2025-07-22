-- Add emoji column for opportunity icons
ALTER TABLE public.opportunities 
ADD COLUMN emoji TEXT DEFAULT NULL;

-- Add some sample emojis to existing opportunities
UPDATE public.opportunities 
SET emoji = CASE 
  WHEN opportunity_type = 'job' AND title ILIKE '%مطور%' THEN '💻'
  WHEN opportunity_type = 'project' AND title ILIKE '%تصميم%' THEN '🎨'
  ELSE NULL
END;