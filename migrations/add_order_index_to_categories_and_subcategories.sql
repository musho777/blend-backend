-- Add order_index column to categories table for custom ordering
-- Lower order_index numbers appear first in the list
ALTER TABLE categories ADD COLUMN order_index INT DEFAULT 0 NOT NULL;

-- Add order_index column to subcategories table for custom ordering
-- Lower order_index numbers appear first in the list
ALTER TABLE subcategories ADD COLUMN order_index INT DEFAULT 0 NOT NULL;

-- Create indexes for better query performance when sorting by order_index
CREATE INDEX idx_categories_order_index ON categories(order_index);
CREATE INDEX idx_subcategories_order_index ON subcategories(order_index);
