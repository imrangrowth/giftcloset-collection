import { useState } from "react";
import ProductCard from "./ProductCard";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const ProductHighlights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [], isLoading } = useProducts();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="section-padding section-spacing bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Featured Preorders
          </h2>
          <p className="text-muted-foreground text-base mb-6">
            Quality products delivered directly from China to your doorstep
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">
                No products found matching your search.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductHighlights;
