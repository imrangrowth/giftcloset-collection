import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WhatsAppCTA = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/2347038929042", "_blank");
  };

  return (
    <section className="section-padding section-spacing bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <MessageCircle className="w-16 h-16 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Stay Updated on Every Shipment
          </h2>
          <p className="text-lg md:text-xl opacity-95">
            Get instant preorder updates and exclusive discounts. Join our WhatsApp community today.
          </p>
        </div>

        <Button 
          size="lg"
          onClick={handleWhatsAppClick}
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Join Our WhatsApp Channel
        </Button>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
