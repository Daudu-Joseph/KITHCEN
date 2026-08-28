import cors from "cors";
import "dotenv/config";
import express from "express";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
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
const bookingInbox = process.env.BOOKING_ENQUIRY_TO_EMAIL ?? "choprepublic@subtleinnovsvcs.org";
const bookingFromEmail = process.env.BOOKING_ENQUIRY_FROM_EMAIL ?? bookingInbox;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpConfigured =
  smtpHost &&
  smtpUser &&
  smtpPass &&
  !smtpHost.includes("your-email-provider") &&
  !smtpUser.includes("yourdomain.com") &&
  smtpPass !== "replace_me";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const bookingEnquiriesPath = path.join(dataDir, "booking-enquiries.json");

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set. Checkout session creation will fail until you add it.");
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const mailer =
  smtpConfigured
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

if (!mailer) {
  console.warn("SMTP is not configured. Booking enquiries will be saved but not emailed.");
}

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

const sanitizeText = (value, maxLength = 500) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const normaliseBookingEnquiry = (body) => {
  const enquiry = {
    id: `ENQ-${String(Date.now()).slice(-8)}`,
    createdAt: new Date().toISOString(),
    name: sanitizeText(body?.name, 120),
    phone: sanitizeText(body?.phone, 80),
    email: sanitizeText(body?.email, 160),
    service: sanitizeText(body?.service, 120),
    guests: sanitizeText(body?.guests, 80),
    date: sanitizeText(body?.date, 40),
    message: sanitizeText(body?.message, 1200),
  };

  const required = ["name", "phone", "email", "service", "guests", "date"];
  const missing = required.filter((field) => !enquiry[field]);

  return { enquiry, missing };
};

const saveBookingEnquiry = async (enquiry) => {
  await mkdir(dataDir, { recursive: true });

  let enquiries = [];
  try {
    enquiries = JSON.parse(await readFile(bookingEnquiriesPath, "utf8"));
  } catch {
    enquiries = [];
  }

  enquiries.unshift(enquiry);
  await writeFile(bookingEnquiriesPath, JSON.stringify(enquiries, null, 2));
};

const getBookingEmailHtml = (enquiry) => `
  <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h2 style="margin: 0 0 16px; color: #a8000d;">New Chop Republic booking enquiry</h2>
    <p><strong>Reference:</strong> ${enquiry.id}</p>
    <p><strong>Name:</strong> ${enquiry.name}</p>
    <p><strong>Phone / WhatsApp:</strong> ${enquiry.phone}</p>
    <p><strong>Email:</strong> ${enquiry.email}</p>
    <p><strong>Service:</strong> ${enquiry.service}</p>
    <p><strong>Guests:</strong> ${enquiry.guests}</p>
    <p><strong>Date:</strong> ${enquiry.date}</p>
    <p><strong>Message:</strong><br>${enquiry.message || "No extra message provided."}</p>
  </div>
`;

const getBookingEmailText = (enquiry) => [
  "New Chop Republic booking enquiry",
  `Reference: ${enquiry.id}`,
  `Name: ${enquiry.name}`,
  `Phone / WhatsApp: ${enquiry.phone}`,
  `Email: ${enquiry.email}`,
  `Service: ${enquiry.service}`,
  `Guests: ${enquiry.guests}`,
  `Date: ${enquiry.date}`,
  `Message: ${enquiry.message || "No extra message provided."}`,
].join("\n");

app.post("/api/booking-enquiries", express.json(), async (request, response) => {
  const { enquiry, missing } = normaliseBookingEnquiry(request.body);

  if (missing.length) {
    response.status(400).json({ error: "Missing required enquiry fields.", missing });
    return;
  }

  try {
    await saveBookingEnquiry(enquiry);

    if (mailer) {
      await mailer.sendMail({
        from: bookingFromEmail,
        to: bookingInbox,
        replyTo: enquiry.email,
        subject: `Booking enquiry: ${enquiry.service} - ${enquiry.name}`,
        text: getBookingEmailText(enquiry),
        html: getBookingEmailHtml(enquiry),
      });
    }

    response.json({
      ok: true,
      id: enquiry.id,
      emailed: Boolean(mailer),
    });
  } catch (error) {
    console.error("Booking enquiry failed:", error);
    response.status(500).json({ error: "Unable to send booking enquiry." });
  }
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
