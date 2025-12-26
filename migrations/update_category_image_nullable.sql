-- Make category image column nullable to allow creating categories without images
ALTER TABLE categories MODIFY COLUMN image VARCHAR(255) DEFAULT '';