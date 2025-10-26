import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/2347038929042", "_blank");
  };

  const handlePreorderClick = () => {
    window.location.href = "/products";
  };

  return (
    <section className="relative min-h-[90vh] flex items-center section-padding pt-32 pb-16">
      <div className="absolute inset-0 -z-10 opacity-5">
        <img 
          src={heroImage} 
          alt="Gift Closet Products" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Shop Smarter.{" "}
          <span className="text-primary">Quality Assurance.</span>{" "}
          Delivering Beyond Borders.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your trusted China procurement agent for household, office, and lifestyle imports.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="lg" 
            onClick={handlePreorderClick}
            className="w-full sm:w-auto text-base px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Preorder Now
          </Button>
          
          <Button 
            size="lg" 
            variant="default"
            onClick={handleWhatsAppClick}
            className="w-full sm:w-auto text-base px-8 py-6 rounded-full font-semibold bg-accent hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Join Our WhatsApp Channel
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
