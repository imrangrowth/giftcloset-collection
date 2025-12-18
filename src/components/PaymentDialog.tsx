import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  price: string;
  stockQuantity: number;
}

const PaymentDialog = ({ open, onOpenChange, productId, productName, price, stockQuantity }: PaymentDialogProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePayment = async () => {
    if (!email || !name || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (deliveryMethod === "delivery" && !deliveryAddress.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    const qty = parseInt(quantity);
    if (stockQuantity > 0 && qty > stockQuantity) {
      toast.error(`Only ${stockQuantity} items available in stock`);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-payment", {
        body: {
          email,
          name,
          phone_number: phone,
          amount: parseFloat(price.replace(/[₦,]/g, "")) * qty,
          product_id: productId,
          product_name: productName,
          quantity: qty,
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === "delivery" ? deliveryAddress : null,
        },
      });

      if (error) throw error;

      if (data?.payment_link) {
        window.location.href = data.payment_link;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            {productName} - {price}
          </DialogDescription>
          <p className="text-xs text-muted-foreground italic mt-1">
            You will be contacted after successful payment to confirm your order details.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={stockQuantity > 0 ? stockQuantity : undefined}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {stockQuantity > 0 && (
              <p className="text-xs text-muted-foreground">{stockQuantity} available in stock</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <RadioGroup value={deliveryMethod} onValueChange={(value: "delivery" | "pickup") => setDeliveryMethod(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="cursor-pointer">Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="cursor-pointer">Pickup</Label>
              </div>
            </RadioGroup>
          </div>

          {deliveryMethod === "delivery" && (
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your full delivery address"
                rows={3}
              />
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">
                ₦{(parseFloat(price.replace(/[₦,]/g, "")) * parseInt(quantity || "1")).toLocaleString()}
              </span>
            </div>

            <Button 
              onClick={handlePayment} 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;