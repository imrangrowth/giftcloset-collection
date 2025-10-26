import { useState } from "react";
import ProductCard from "./ProductCard";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const ProductHighlights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const products = [
    {
      image: product1,
      name: "Classy Chafing Dish",
      description: "MOQ: 2 pieces",
      price: "₦85,000",
    },
    {
      image: product2,
      name: "Men's Crocs",
      description: "MOQ: 20 pairs",
      price: "₦28,000",
    },
    {
      image: product3,
      name: "Classy Plate Rack",
      description: "Available for preorder",
      price: "₦35,000",
    },
    {
      image: product1,
      name: "600L LG Ice Maker Fridge",
      description: "Premium-grade with ice maker",
      price: "₦1,150,000",
    },
    {
      image: product2,
      name: "Quality & Modern Compress Sofa",
      description: "Space-saving & stylish",
      price: "₦450,000",
    },
    {
      image: product3,
      name: "Ice Maker Machine",
      description: "Fast-performing",
      price: "₦240,000",
    },
    {
      image: product1,
      name: "Industrial Tiger Nut Processing Machine",
      description: "Efficient industrial machine",
      price: "₦250,000",
    },
    {
      image: product2,
      name: "6L Chafing Dish",
      description: "Ideal for small events",
      price: "₦120,000",
    },
    {
      image: product3,
      name: "Wholesale Drinks Import Deal (1 Ton)",
      description: "40 cartons - bulk preorder",
      price: "₦2,000,000",
    },
    {
      image: product1,
      name: "Wholesale Drinks Import Deal (Half Ton)",
      description: "20 cartons - bulk preorder",
      price: "₦1,000,000",
    },
    {
      image: product2,
      name: "6L Luxury Arabic Chafing Dish",
      description: "Gold-finish with Arabic design",
      price: "₦70,000",
    },
    {
      image: product3,
      name: "Vacuum Sealing Machine",
      description: "MOQ: 50 pieces",
      price: "₦25,000",
    },
    {
      image: product1,
      name: "16-Piece Complete Dinner Set",
      description: "Elegant porcelain dinnerware",
      price: "₦25,000",
    },
    {
      image: product2,
      name: "Luxury Kids 2-Piece Set",
      description: "MOQ: 30 sets",
      price: "₦20,000",
    },
    {
      image: product3,
      name: "300W Mobile Power Supply",
      description: "Portable & reliable",
      price: "₦125,000",
    },
    {
      image: product1,
      name: "Bamboo Spice Jar Complete Set",
      description: "Eco-friendly storage",
      price: "₦28,000",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="section-padding section-spacing bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Preorders
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No products found matching your search.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductHighlights;
