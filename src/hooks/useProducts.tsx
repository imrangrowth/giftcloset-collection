import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  status: "pre_order" | "in_stock";
  images: string[];
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Fetch products with their images in a single query using join
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          status,
          product_images (
            image_url,
            display_order
          )
        `)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Transform the data to match our Product interface
      const productsWithImages: Product[] = products.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status as "pre_order" | "in_stock",
        images: (product.product_images || [])
          .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
          .map((img: any) => img.image_url),
      }));

      return productsWithImages;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
