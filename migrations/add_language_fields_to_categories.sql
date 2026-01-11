-- Add language fields to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS title_am VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS title_ru VARCHAR(255) DEFAULT '';

-- Update existing records to have empty strings instead of NULL
UPDATE categories SET title_am = '' WHERE title_am IS NULL;
UPDATE categories SET title_ru = '' WHERE title_ru IS NULL;
