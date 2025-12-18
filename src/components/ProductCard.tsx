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
  stockQuantity: number;
}

const ProductCard = ({ id, images, name, description, price, status, stockQuantity }: ProductCardProps) => {
  const [showPayment, setShowPayment] = useState(false);

  const isOutOfStock = status === "in_stock" && stockQuantity === 0;

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-background transition-all duration-500">
        <div className="overflow-hidden relative">
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Badge 
              variant={status === "pre_order" ? "default" : isOutOfStock ? "destructive" : "secondary"}
            >
              {isOutOfStock ? "Out of Stock" : status === "pre_order" ? "Pre-Order" : "In Stock"}
            </Badge>
            {status === "in_stock" && stockQuantity > 0 && (
              <Badge variant="outline" className="bg-background/80">
                {stockQuantity} left
              </Badge>
            )}
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <img 
                    src={image} 
                    alt={`${name} - Image ${index + 1}`} 
                    loading="lazy"
                    className="w-full h-[320px] object-contain bg-muted rounded-md"
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
        
        <div className="py-5 space-y-3 text-center">
          <h3 className="text-lg font-semibold tracking-wide">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <p className="text-lg font-semibold pt-1">{price}</p>
          {status === "pre_order" && (
            <p className="text-xs text-muted-foreground italic">
              Delivery in 90 days
            </p>
          )}
          <Button 
            variant="outline"
            size="sm" 
            className="mt-4"
            onClick={() => setShowPayment(true)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : status === "pre_order" ? "Preorder Now" : "Buy Now"}
          </Button>
        </div>
      </div>
      
      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        productId={id}
        productName={name}
        price={price}
        stockQuantity={stockQuantity}
      />
    </div>
  );
};

export default ProductCard;