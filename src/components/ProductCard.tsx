import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
}

const ProductCard = ({ image, name, description, price }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden bg-card border-border/50 hover:shadow-lg transition-shadow duration-300 group">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 blur-md"
        />
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary">{price}</p>
          <Button 
            size="sm" 
            className="rounded-full font-medium"
          >
            Preorder
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
