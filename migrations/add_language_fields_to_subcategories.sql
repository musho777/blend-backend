-- Add language fields to subcategories table
ALTER TABLE subcategories
ADD COLUMN IF NOT EXISTS title_am VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS title_ru VARCHAR(255) DEFAULT '';

-- Update existing records to have empty strings instead of NULL
UPDATE subcategories SET title_am = '' WHERE title_am IS NULL;
UPDATE subcategories SET title_ru = '' WHERE title_ru IS NULL;
