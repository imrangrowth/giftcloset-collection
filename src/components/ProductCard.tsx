import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PaymentDialog from "./PaymentDialog";

interface ProductCardProps {
  id: string;
  images: string[];
  name: string;
  description: string;
  price: string;
  status: "pre_order" | "in_stock";
}

const ProductCard = ({ id, images, name, description, price, status }: ProductCardProps) => {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-background transition-all duration-500">
        <div className="aspect-[4/3] overflow-hidden bg-muted/30 relative">
          <Badge 
            className="absolute top-4 right-4 z-10"
            variant={status === "pre_order" ? "default" : "secondary"}
          >
            {status === "pre_order" ? "Pre-Order" : "In Stock"}
          </Badge>
          <Carousel className="w-full h-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <img 
                    src={image} 
                    alt={`${name} - Image ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>
        
        <div className="py-8 space-y-4 text-center">
          <h3 className="text-3xl font-light tracking-wide">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xl font-semibold pt-2">{price}</p>
          <Button 
            variant="outline"
            size="sm" 
            className="mt-4"
            onClick={() => setShowPayment(true)}
          >
            {status === "pre_order" ? "Preorder Now" : "Buy Now"}
          </Button>
        </div>
      </div>
      
      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        productId={id}
        productName={name}
        price={price}
      />
    </div>
  );
};

export default ProductCard;
