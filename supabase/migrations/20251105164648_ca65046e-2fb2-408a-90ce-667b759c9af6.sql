-- Add INSERT, UPDATE, and DELETE policies for product_images table
CREATE POLICY "Anyone can insert product images"
ON product_images
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update product images"
ON product_images
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete product images"
ON product_images
FOR DELETE
USING (true);

-- Add INSERT, UPDATE, and DELETE policies for products table
CREATE POLICY "Anyone can insert products"
ON products
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update products"
ON products
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete products"
ON products
FOR DELETE
USING (true);