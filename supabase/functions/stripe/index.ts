// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from 'npm:stripe@12.0.0';

// supabase functions serve stripe --no-verify-jwt
// Use your Stripe secret key from .env or Supabase secrets
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2024-06-20',
});

console.log('Stripe Payment Intent Function booted!');

Deno.serve(async (request) => {
    try {
        // Use an existing Customer ID if this is a returning customer.
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customer.id},
            {apiVersion: '2025-08-27.basil'}
        );

        // Expecting JSON body like: { "amount": 1000 }
        const { amount } = await request.json();

        if (!amount) {
            return new Response(JSON.stringify({ error: 'Amount is required' }), { status: 400 });
        }

        // Create the payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            customer: customer.id,
            automatic_payment_methods: { enabled: true },
        });

        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY'),
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaXN2cGV4aW1pdGlwZnNpem15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5OTM5MzAsImV4cCI6MjA3MTU2OTkzMH0.tAuG9qxAHrA6sSHU78DlbGUaxuHcJQEAGo_kR-FEGWw' \
    --header 'Content-Type: application/json' \
    --data '{"amount":1000}'

*/
