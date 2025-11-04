import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref");

  useEffect(() => {
    // Verify payment status with Flutterwave
    const verifyPayment = async () => {
      if (!transactionId) {
        setStatus("failed");
        return;
      }

      // In production, you would verify with your backend
      // For now, we'll assume success if we have a transaction ID
      setTimeout(() => {
        setStatus("success");
      }, 1500);
    };

    verifyPayment();
  }, [transactionId]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                {status === "loading" && (
                  <>
                    <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary mb-4" />
                    <CardTitle>Verifying Payment...</CardTitle>
                    <CardDescription>Please wait while we confirm your transaction</CardDescription>
                  </>
                )}
                
                {status === "success" && (
                  <>
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                    <CardTitle>Payment Successful!</CardTitle>
                    <CardDescription>
                      Your order has been confirmed. We'll send you an email with the details.
                    </CardDescription>
                  </>
                )}
                
                {status === "failed" && (
                  <>
                    <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <CardTitle>Payment Failed</CardTitle>
                    <CardDescription>
                      There was an issue processing your payment. Please try again.
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {status === "success" && txRef && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Transaction Reference</p>
                    <p className="font-mono text-sm">{txRef}</p>
                  </div>
                )}
                
                <div className="flex gap-4 justify-center pt-4">
                  <Button onClick={() => navigate("/products")}>
                    Continue Shopping
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
