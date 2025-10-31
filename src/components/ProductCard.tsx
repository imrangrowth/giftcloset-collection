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
      <div className="relative overflow-hidden bg-secondary/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_15px_50px_rgb(0,0,0,0.2)] transition-all duration-500">
        <div className="aspect-[4/5] overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-md"
          />
        </div>
        
        <div className="p-6 bg-background space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight">{name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{description}</p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <p className="text-2xl font-bold">{price}</p>
            <Button 
              size="sm" 
              className="font-semibold"
            >
              Preorder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
