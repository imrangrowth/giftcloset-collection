import { Button } from "@/components/ui/button";

interface ProductCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
}

const ProductCard = ({ image, name, description, price }: ProductCardProps) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden bg-background transition-all duration-500">
        <div className="aspect-[4/3] overflow-hidden bg-muted/30">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 blur-md"
          />
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
