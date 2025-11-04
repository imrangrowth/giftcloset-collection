-- Add status column to products table to distinguish pre-order from in-stock
ALTER TABLE products 
ADD COLUMN status text NOT NULL DEFAULT 'in_stock' CHECK (status IN ('pre_order', 'in_stock'));

-- Add index for better query performance
CREATE INDEX idx_products_status ON products(status);