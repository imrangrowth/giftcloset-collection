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
      // Fetch products with their images
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Fetch images for all products
      const productsWithImages: Product[] = await Promise.all(
        products.map(async (product) => {
          const { data: images, error: imagesError } = await supabase
            .from("product_images")
            .select("image_url")
            .eq("product_id", product.id)
            .order("display_order");

          if (imagesError) throw imagesError;

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            status: product.status as "pre_order" | "in_stock",
            images: images.map((img) => img.image_url),
          };
        })
      );

      return productsWithImages;
    },
  });
};
