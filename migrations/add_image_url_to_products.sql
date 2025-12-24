-- Add image_urls JSON column to products table to store multiple images
ALTER TABLE products ADD COLUMN image_urls JSON DEFAULT '[]';