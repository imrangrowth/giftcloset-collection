import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WhatsAppCTA = () => {
  const handleWhatsAppClick = () => {
    window.open("https://chat.whatsapp.com/LOzISmHehixCiYon4yM1np?mode=wwt", "_blank");
  };

  return (
    <section className="section-padding section-spacing bg-primary text-primary-foreground">
      <div className="container-max text-center space-y-5">
        <div className="space-y-2">
          <MessageCircle className="w-12 h-12 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold">
            Stay Updated on Every Shipment
          </h2>
          <p className="text-base md:text-lg opacity-95">
            Get instant preorder updates and exclusive discounts. Join our WhatsApp community today.
          </p>
        </div>

        <Button 
          size="lg"
          onClick={handleWhatsAppClick}
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm px-6 py-5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Join Our WhatsApp Channel
        </Button>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
