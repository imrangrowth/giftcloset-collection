import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ProductCardProps {
  images: string[];
  name: string;
  description: string;
  price: string;
}

const ProductCard = ({ images, name, description, price }: ProductCardProps) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden bg-background transition-all duration-500">
        <div className="aspect-[4/3] overflow-hidden bg-muted/30">
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
          >
            Preorder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
