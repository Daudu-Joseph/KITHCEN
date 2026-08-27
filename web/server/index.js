import cors from "cors";
import "dotenv/config";
import express from "express";
import Stripe from "stripe";

const app = express();
const port = Number(process.env.SERVER_PORT ?? 4242);
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";
const localOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = (process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(",")
  : [clientUrl, ...localOrigins]
)
  .map((origin) => origin.trim())
  .filter(Boolean);
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set. Checkout session creation will fail until you add it.");
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const parseMoneyToPence = (price) => {
  const match = String(price ?? "").match(/[\d,.]+/);
  if (!match) return 0;
  return Math.round(Number(match[0].replace(/,/g, "")) * 100);
};

const normaliseCartItem = (item) => {
  const quantity = Number(item.quantity);
  const unitAmount = parseMoneyToPence(item.price);

  if (!item.name || !Number.isInteger(quantity) || quantity < 1 || unitAmount < 1) {
    return null;
  }

  return {
    price_data: {
      currency: "gbp",
      product_data: {
        name: item.selectedSize ? `${item.name} - ${item.selectedSize}` : item.name,
      },
      unit_amount: unitAmount,
    },
    quantity,
  };
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
  }),
);

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/create-checkout-session", express.json(), async (request, response) => {
  if (!stripe) {
    response.status(500).json({ error: "Stripe is not configured on the server." });
    return;
  }

  const lineItems = Array.isArray(request.body?.items)
    ? request.body.items.map(normaliseCartItem).filter(Boolean)
    : [];

  if (!lineItems.length) {
    response.status(400).json({ error: "No valid cart items were provided." });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: request.body?.customer?.email || undefined,
      success_url: `${clientUrl}/checkout?payment=stripe-success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/checkout?payment=stripe-cancelled`,
      metadata: {
        orderSource: "chop-republic-web",
      },
    });

    response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session failed:", error);
    response.status(500).json({ error: "Unable to create checkout session." });
  }
});

const handleStripeWebhook = async (request, response) => {
  if (!stripe || !webhookSecret) {
    response.status(500).send("Stripe webhook is not configured.");
    return;
  }

  const signature = request.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, signature, webhookSecret);
  } catch (error) {
    response.status(400).send(`Webhook signature verification failed: ${error.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Payment completed:", session.id);
    // TODO: Save paid order to the database and notify the restaurant.
  }

  response.json({ received: true });
};

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
app.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

app.listen(port, () => {
  console.log(`Stripe backend listening on http://127.0.0.1:${port}`);
});
