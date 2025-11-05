import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProductHighlights from "@/components/ProductHighlights";
import HowItWorks from "@/components/HowItWorks";
import AboutPreview from "@/components/AboutPreview";
import Reviews from "@/components/Reviews";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ProductHighlights />
      <HowItWorks />
      <AboutPreview />
      <Reviews />
      <WhatsAppCTA />
      <Footer />
    </div>
  );
};

export default Index;
