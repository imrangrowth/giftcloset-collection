import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  price: string;
}

const PaymentDialog = ({ open, onOpenChange, productId, productName, price }: PaymentDialogProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!email || !name || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-payment", {
        body: {
          email,
          name,
          phone_number: phone,
          amount: parseFloat(price.replace(/[₦,]/g, "")) * parseInt(quantity),
          product_id: productId,
          product_name: productName,
          quantity: parseInt(quantity),
        },
      });

      if (error) throw error;

      // Redirect to Flutterwave payment page
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription className="space-y-1">
            <div>{productName} - {price}</div>
            <div className="text-xs italic pt-1">
              You will be contacted after successful payment to confirm your order details.
            </div>
          </DialogDescription>
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
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">
                ₦{(parseFloat(price.replace(/[₦,]/g, "")) * parseInt(quantity)).toLocaleString()}
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
