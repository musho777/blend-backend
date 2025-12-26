-- Add priority column to banners table for display ordering
-- Lower priority numbers appear first in the carousel
ALTER TABLE banners ADD COLUMN priority INT DEFAULT 1 NOT NULL;

-- Create an index for better query performance when sorting by priority
CREATE INDEX idx_banners_priority ON banners(priority);
