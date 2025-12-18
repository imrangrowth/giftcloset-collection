-- Add stock_quantity to products table
ALTER TABLE public.products 
ADD COLUMN stock_quantity integer NOT NULL DEFAULT 0;

-- Add delivery fields to orders table
ALTER TABLE public.orders 
ADD COLUMN delivery_method text NOT NULL DEFAULT 'delivery',
ADD COLUMN delivery_address text;