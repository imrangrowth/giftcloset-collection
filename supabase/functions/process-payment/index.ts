import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FLUTTERWAVE_SECRET_KEY = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, phone_number, amount, product_id, product_name, quantity } = await req.json();

    if (!FLUTTERWAVE_SECRET_KEY) {
      throw new Error("Flutterwave secret key not configured");
    }

    // Create payment with Flutterwave
    const paymentPayload = {
      tx_ref: `${product_id}-${Date.now()}`,
      amount: amount,
      currency: "NGN",
      redirect_url: `${req.headers.get("origin") || "http://localhost:8080"}/payment-success`,
      customer: {
        email: email,
        name: name,
        phonenumber: phone_number,
      },
      customizations: {
        title: "Product Purchase",
        description: `${product_name} x ${quantity}`,
        logo: "",
      },
      meta: {
        product_id: product_id,
        product_name: product_name,
        quantity: quantity,
      },
    };

    const response = await fetch(`${FLUTTERWAVE_BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();

    if (data.status === "success") {
      return new Response(
        JSON.stringify({ payment_link: data.data.link }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      throw new Error(data.message || "Failed to create payment");
    }
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
