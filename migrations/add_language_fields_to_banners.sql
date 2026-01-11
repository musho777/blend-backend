-- Add language-specific fields for Armenian and Russian to banners table
ALTER TABLE banners ADD COLUMN text_am VARCHAR(200) DEFAULT '';
ALTER TABLE banners ADD COLUMN text_ru VARCHAR(200) DEFAULT '';
