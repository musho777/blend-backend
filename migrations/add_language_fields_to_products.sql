-- Add language-specific fields for Armenian and Russian to products table
ALTER TABLE products ADD COLUMN title_am VARCHAR(255) DEFAULT '';
ALTER TABLE products ADD COLUMN title_ru VARCHAR(255) DEFAULT '';
ALTER TABLE products ADD COLUMN description_am TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN description_ru TEXT DEFAULT '';
