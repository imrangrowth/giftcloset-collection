import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  product_name: string;
  quantity: number;
  total_amount: string;
  status: string;
  delivery_method: string;
  delivery_address: string | null;
  created_at: string;
  payment_reference: string | null;
}

const TrackOrder = () => {
  const [reference, setReference] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!reference.trim()) {
      toast.error("Please enter a payment reference");
      return;
    }

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("orders")
      .select("id, product_name, quantity, total_amount, status, delivery_method, delivery_address, created_at, payment_reference")
      .eq("payment_reference", reference.trim())
      .maybeSingle();

    setLoading(false);

    if (error) {
      toast.error("Error searching for order");
      setOrder(null);
      return;
    }

    if (!data) {
      toast.error("No order found with this reference");
      setOrder(null);
      return;
    }

    setOrder(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "processing":
        return <Package className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your payment reference to check your order status
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter payment reference (e.g., FLW-xxxxx)"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Searching..." : "Track"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searched && order && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Order Details</CardTitle>
                    <CardDescription>Reference: {order.payment_reference}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">{order.product_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium">{order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Method</p>
                    <p className="font-medium capitalize">{order.delivery_method}</p>
                  </div>
                  {order.delivery_address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="font-medium">{order.delivery_address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {searched && !order && !loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No order found with this reference</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check the reference and try again
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
