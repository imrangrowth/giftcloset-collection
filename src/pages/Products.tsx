import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const Products = () => {
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
    {
      image: product1,
      name: "Premium Cookware Set",
      description: "Available in 8 days",
      price: "₦52,000",
    },
    {
      image: product2,
      name: "Desk Organization Kit",
      description: "Available in 6 days",
      price: "₦28,000",
    },
    {
      image: product3,
      name: "Living Room Accessories",
      description: "Available in 9 days",
      price: "₦65,000",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our Products
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our curated selection of quality imports from China. All products 
                undergo strict quality checks before shipping.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
