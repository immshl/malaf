-- Add portfolio page feature flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_portfolio_page boolean DEFAULT false;

-- Create portfolio_items table for storing portfolio works
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  cover_image text NOT NULL,
  additional_images text[] DEFAULT '{}',
  video_links text[] DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on portfolio_items
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view published portfolio items
CREATE POLICY "Anyone can view published portfolio items"
ON portfolio_items FOR SELECT
USING (is_published = true);

-- Allow profile owners to manage their portfolio items
CREATE POLICY "Profile owners can manage their portfolio items"
ON portfolio_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = portfolio_items.profile_id
    AND profiles.user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_portfolio_items_profile_id ON portfolio_items(profile_id);
CREATE INDEX idx_portfolio_items_display_order ON portfolio_items(profile_id, display_order);

-- Add trigger for updated_at
CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON portfolio_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();