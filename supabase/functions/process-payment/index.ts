import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FLUTTERWAVE_SECRET_KEY = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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

    const txRef = `${product_id}-${Date.now()}`;

    // Create payment with Flutterwave
    const paymentPayload = {
      tx_ref: txRef,
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

    console.log("Creating Flutterwave payment:", JSON.stringify(paymentPayload));

    const response = await fetch(`${FLUTTERWAVE_BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();
    console.log("Flutterwave response:", JSON.stringify(data));

    if (data.status === "success") {
      // Create order in database
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        const { error: orderError } = await supabase.from("orders").insert({
          customer_name: name,
          customer_email: email,
          customer_phone: phone_number,
          product_id: product_id,
          product_name: product_name,
          quantity: quantity,
          total_amount: `₦${amount.toLocaleString()}`,
          status: "pending",
          payment_reference: txRef,
        });

        if (orderError) {
          console.error("Error creating order:", orderError);
        } else {
          console.log("Order created successfully with reference:", txRef);
        }
      }

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
