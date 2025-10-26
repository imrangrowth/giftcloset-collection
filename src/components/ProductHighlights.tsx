import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const ProductHighlights = () => {
  const products = [
    {
      image: product1,
      name: "Kitchen Essentials Set",
      description: "Available in 7 days",
      price: "₦45,000",
    },
    {
      image: product2,
      name: "Office Supplies Bundle",
      description: "Available in 5 days",
      price: "₦32,000",
    },
    {
      image: product3,
      name: "Home Decor Collection",
      description: "Available in 10 days",
      price: "₦58,000",
    },
  ];

  return (
    <section className="section-padding section-spacing bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Preorders
          </h2>
          <p className="text-muted-foreground text-lg">
            Quality products delivered directly from China to your doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;
