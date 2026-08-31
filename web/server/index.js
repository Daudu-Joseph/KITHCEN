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
const publicBaseUrl = clientUrl.replace(/\/$/, "");
const emailLogoCid = "chop-republic-logo";
const emailLogoLightCid = "chop-republic-logo-light";
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
const orderInbox = process.env.ORDER_NOTIFICATION_TO_EMAIL ?? bookingInbox;
const contactInbox = process.env.CONTACT_MESSAGE_TO_EMAIL ?? bookingInbox;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const whatsappVerifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
const whatsappBusinessNumber = process.env.WHATSAPP_BUSINESS_NUMBER ?? "447990532631";
const whatsappGraphApiVersion = process.env.WHATSAPP_GRAPH_API_VERSION ?? "v20.0";
const bankAccountName = process.env.BANK_ACCOUNT_NAME ?? "Subtle innovative services Ltd";
const bankAccountNumber = process.env.BANK_ACCOUNT_NUMBER ?? "33220079";
const bankSortCode = process.env.BANK_SORT_CODE ?? "04-06-05";
const spreadsheetWebhookUrl = process.env.SPREADSHEET_WEBHOOK_URL;
const smtpConfigured =
  smtpHost &&
  smtpUser &&
  smtpPass &&
  !smtpHost.includes("your-email-provider") &&
  !smtpUser.includes("yourdomain.com") &&
  smtpPass !== "replace_me";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const emailLogoPath = path.join(publicDir, "assets", "brand", "logo-mark-email.png");
const emailLogoLightPath = path.join(publicDir, "assets", "brand", "logo-light.jpg");
const dataDir = path.join(__dirname, "data");
const bookingEnquiriesPath = path.join(dataDir, "booking-enquiries.json");
const contactMessagesPath = path.join(dataDir, "contact-messages.json");
const stripeOrdersPath = path.join(dataDir, "stripe-orders.json");
const whatsappOrdersPath = path.join(dataDir, "whatsapp-orders.json");
const whatsappConversationsPath = path.join(dataDir, "whatsapp-conversations.json");

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
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

if (!mailer) {
  console.warn("SMTP is not configured. Notifications will be saved but not emailed.");
}

if (!whatsappAccessToken || !whatsappPhoneNumberId || !whatsappVerifyToken) {
  console.warn("WhatsApp API is not fully configured. Order links will work, but bot replies need env credentials.");
}

if (!spreadsheetWebhookUrl) {
  console.warn("SPREADSHEET_WEBHOOK_URL is not set. Notifications will be saved but not sent to a spreadsheet.");
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

const formatPounds = (value) => {
  const amount = Number(value) || 0;
  const decimals = Number.isInteger(amount) ? 0 : 2;

  return `\u00a3${amount.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getPublicAssetUrl = (src) => {
  const value = String(src ?? "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return "";

  return `${publicBaseUrl}${value}`;
};

const emailShell = ({ title, subtitle, children, footer = "Fresh Nigerian food, made with care." }) => `
  <div style="margin:0; padding:0; background:#f5f1ed; font-family:Arial, sans-serif; color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background:#f5f1ed;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; border-collapse:collapse; background:#ffffff; border:1px solid #eadfd8;">
            <tr>
              <td style="background:#a8000d; padding:22px 26px; color:#ffffff;">
                <img src="cid:${emailLogoLightCid}" width="86" alt="Chop Republic" style="display:block; width:86px; max-width:86px; height:auto; margin:0 0 14px;">
                <div style="font-size:12px; letter-spacing:1.8px; text-transform:uppercase; font-weight:700;">Chop Republic</div>
                <h1 style="margin:10px 0 4px; font-size:26px; line-height:1.2; font-weight:800;">${escapeHtml(title)}</h1>
                <p style="margin:0; color:#ffe8cf; font-size:14px; line-height:1.5;">${escapeHtml(subtitle)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px;">
                ${children}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 26px; background:#111827; color:#f9fafb; font-size:13px; line-height:1.5;">
                <img src="cid:${emailLogoLightCid}" width="62" alt="Chop Republic" style="display:block; width:62px; max-width:62px; height:auto; margin:0 0 8px;">
                <strong>Chop Republic</strong><br>
                <span style="color:#d1d5db;">${escapeHtml(footer)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

const detailsTable = (rows) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin:18px 0; border:1px solid #ece7e2;">
    ${rows
      .filter((row) => row.value !== undefined && row.value !== null && row.value !== "")
      .map(
        (row) => `
          <tr>
            <td style="padding:12px 14px; width:38%; background:#faf7f3; border-bottom:1px solid #ece7e2; color:#6b7280; font-size:13px; font-weight:700;">${escapeHtml(row.label)}</td>
            <td style="padding:12px 14px; border-bottom:1px solid #ece7e2; color:#111827; font-size:14px;">${escapeHtml(row.value)}</td>
          </tr>
        `,
      )
      .join("")}
  </table>
`;

const nextStepBox = (heading, body) => `
  <div style="margin-top:18px; padding:14px 16px; background:#fff7ed; border-left:4px solid #f59e0b; color:#111827;">
    <strong style="display:block; margin-bottom:4px;">${escapeHtml(heading)}</strong>
    <span style="font-size:14px; line-height:1.5;">${escapeHtml(body)}</span>
  </div>
`;

const orderItemsTable = (items) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin:18px 0; border:1px solid #ece7e2;">
    <tr>
      <th align="left" style="padding:12px 14px; background:#111827; color:#ffffff; font-size:12px; text-transform:uppercase;">Item</th>
      <th align="center" style="padding:12px 14px; background:#111827; color:#ffffff; font-size:12px; text-transform:uppercase;">Qty</th>
      <th align="right" style="padding:12px 14px; background:#111827; color:#ffffff; font-size:12px; text-transform:uppercase;">Price</th>
    </tr>
    ${items
      .map((item) => {
        const size = item.selectedSize ? ` (${item.selectedSize})` : "";
        return `
          <tr>
            <td style="padding:13px 14px; border-bottom:1px solid #ece7e2; font-size:14px; color:#111827;">${escapeHtml(`${item.name}${size}`)}</td>
            <td align="center" style="padding:13px 14px; border-bottom:1px solid #ece7e2; font-size:14px; color:#111827;">${escapeHtml(item.quantity)}</td>
            <td align="right" style="padding:13px 14px; border-bottom:1px solid #ece7e2; font-size:14px; color:#111827;">${escapeHtml(item.price)}</td>
          </tr>
        `;
      })
      .join("")}
  </table>
`;

const customerOrderItemsRows = (items) =>
  items
    .map((item) => {
      const size = item.selectedSize ? ` (${item.selectedSize})` : "";
      const imageUrl = getPublicAssetUrl(item.image);
      return `
        <tr>
          <td style="padding:11px 0; border-bottom:1px solid #e5e7eb;">
            <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              <tr>
                ${
                  imageUrl
                    ? `<td style="padding-right:12px; vertical-align:top;"><img src="${escapeHtml(
                        imageUrl,
                      )}" width="46" height="46" alt="${escapeHtml(
                        item.name,
                      )}" style="display:block; width:46px; height:46px; object-fit:cover; border-radius:3px; border:1px solid #eee1d8;"></td>`
                    : ""
                }
                <td style="vertical-align:top;">
                  <div style="color:#111827; font-size:13px; font-weight:700; line-height:1.35;">${escapeHtml(
                    `${item.name}${size}`,
                  )}</div>
                  <div style="margin-top:3px; color:#6b7280; font-size:12px;">Qty ${escapeHtml(item.quantity)}</div>
                </td>
              </tr>
            </table>
          </td>
          <td align="right" style="padding:11px 0; border-bottom:1px solid #e5e7eb; color:#111827; font-size:13px; font-weight:700; vertical-align:top;">${escapeHtml(
            item.price,
          )}</td>
        </tr>
      `;
    })
    .join("");

const getOrderNumber = () => `ORD-${String(Date.now()).slice(-6)}`;

const readJsonArray = async (filePath) => {
  try {
    const value = JSON.parse(await readFile(filePath, "utf8"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const writeJsonArray = async (filePath, items) => {
  await mkdir(dataDir, { recursive: true });
  await writeFile(filePath, JSON.stringify(items, null, 2));
};

const saveJsonRecord = async (filePath, record) => {
  const records = await readJsonArray(filePath);
  records.unshift(record);
  await writeJsonArray(filePath, records);
};

const sendNotificationEmail = async ({ html, replyTo, subject, text, to }) => {
  if (!mailer) {
    return false;
  }

  await mailer.sendMail({
    from: bookingFromEmail,
    to,
    replyTo,
    subject,
    text,
    html,
    attachments: [
      {
        filename: "chop-republic-logo.png",
        path: emailLogoPath,
        cid: emailLogoCid,
      },
      {
        filename: "chop-republic-logo-light.jpg",
        path: emailLogoLightPath,
        cid: emailLogoLightCid,
      },
    ],
  });

  return true;
};

const sendToSpreadsheet = async (type, payload) => {
  if (!spreadsheetWebhookUrl) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const sheetResponse = await fetch(spreadsheetWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller.signal,
    body: JSON.stringify({
      type,
      createdAt: new Date().toISOString(),
      payload,
    }),
  }).finally(() => clearTimeout(timeout));

  if (!sheetResponse.ok) {
    const body = await sheetResponse.text();
    throw new Error(`Spreadsheet webhook failed: ${sheetResponse.status} ${body}`);
  }

  return true;
};

const safeNotifySpreadsheet = async (type, payload) => {
  try {
    return await sendToSpreadsheet(type, payload);
  } catch (error) {
    console.error(`${type} spreadsheet notification failed:`, error);
    return false;
  }
};

const normaliseCustomer = (customer = {}) => ({
  phone: sanitizeText(customer.phone, 80),
  email: sanitizeText(customer.email, 160),
  country: sanitizeText(customer.country, 80),
  firstName: sanitizeText(customer.firstName, 80),
  lastName: sanitizeText(customer.lastName, 80),
  address: sanitizeText(customer.address, 260),
  fulfillmentMethod: sanitizeText(customer.fulfillmentMethod, 40),
  deliveryAddress: sanitizeText(customer.deliveryAddress, 320),
  deliveryFee: Number(customer.deliveryFee) || 0,
  orderNote: sanitizeText(customer.orderNote, 1200),
});

const normaliseOrderItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => {
      const quantity = Number(item.quantity);
      if (!item.name || !Number.isInteger(quantity) || quantity < 1) return null;

      return {
        name: sanitizeText(item.name, 120),
        price: sanitizeText(item.price, 80),
        quantity,
        selectedSize: sanitizeText(item.selectedSize, 120),
        image: sanitizeText(item.image, 260),
      };
    })
    .filter(Boolean);

const getCustomerName = (customer) =>
  `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || "there";

const getWhatsappOrderMessage = (order) => {
  const itemLines = order.items.map((item) => {
    const size = item.selectedSize ? ` (${item.selectedSize})` : "";
    return `${item.quantity}x - *${item.name}${size}*`;
  });
  const customerName = getCustomerName(order.customer);
  const lines = [
    "Hello, here's my order details:",
    "",
    `*Total Products*: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}`,
    "",
    ...itemLines,
    "",
    `*Total:*`,
    `${formatPounds(order.total)}`,
    "",
    `*Payment method:*`,
    "WhatsApp Checkout",
    "",
    `*Customer Details*`,
    customerName,
    order.customer.address,
    order.customer.country,
    "",
    order.customer.phone,
    order.customer.email,
    "",
    `Order: ${order.orderNumber}`,
    "",
    `(${new Intl.DateTimeFormat("en-GB", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(order.createdAt))})`,
  ];

  if (order.customer.orderNote) {
    lines.push(`Notes: ${order.customer.orderNote}`);
  }

  return lines.join("\n");
};

const getWhatsappCustomerOrderReply = (order) => {
  const customerName = getCustomerName(order.customer);
  const itemLines = order.items.map((item) => {
    const size = item.selectedSize ? ` (${item.selectedSize})` : "";
    return `- ${item.name}${size} x${item.quantity}`;
  });

  return [
    `Hi ${customerName}, thanks for ordering from Chop Republic.`,
    "",
    `Your order ${order.orderNumber} has been received.`,
    "",
    "Order summary:",
    ...itemLines,
    `Total: ${formatPounds(order.total)}`,
    "",
    "Please confirm:",
    "1. Any allergy information",
    "2. Your spice preference",
    "3. Pickup or delivery",
    "",
    "Please make payment by bank transfer:",
    "",
    `Account Name: ${bankAccountName}`,
    `Account Number: ${bankAccountNumber}`,
    `Sort Code: ${bankSortCode}`,
    `Reference: ${order.orderNumber}`,
    "",
    "After payment, send your payment confirmation here. A Chop Republic team member will verify it before your order is confirmed.",
    "",
    "For pickup details or delivery fee, a team member will continue with you here.",
  ].join("\n");
};

const getWhatsappBotReply = (order) => {
  const customerName = getCustomerName(order.customer);

  return [
    `Hi ${customerName}, thanks for ordering from Chop Republic.`,
    "",
    `Your order ${order.orderNumber} has been received.`,
    "",
    "Please confirm:",
    "1. Any allergy information",
    "2. Your spice preference",
    "3. Pickup or delivery",
    "",
    "Please make payment by bank transfer:",
    "",
    `Account Name: ${bankAccountName}`,
    `Account Number: ${bankAccountNumber}`,
    `Sort Code: ${bankSortCode}`,
    `Reference: ${order.orderNumber}`,
    "",
    "After payment, send your payment confirmation here. A Chop Republic team member will verify it before your order is confirmed.",
    "",
    "For pickup details or delivery fee, a team member will continue with you here.",
  ].join("\n");
};

const getOrderEmailHtml = (order) =>
  emailShell({
    title: "New order received",
    subtitle: `${order.orderNumber} - ${formatPounds(order.total)}`,
    footer: "This customer order was sent from the Chop Republic website.",
    children: `
      <p style="margin:0 0 14px; font-size:15px; line-height:1.6;">A new ${escapeHtml(
        order.paymentMethod === "stripe" ? "paid online" : "WhatsApp",
      )} order has been placed.</p>
      ${detailsTable([
        { label: "Order", value: order.orderNumber },
        { label: "Status", value: order.status },
        { label: "Payment", value: order.paymentMethod === "stripe" ? "Paid online" : "WhatsApp / bank transfer" },
        { label: "Fulfilment", value: order.customer.fulfillmentMethod },
        { label: "Name", value: getCustomerName(order.customer) },
        { label: "Phone / WhatsApp", value: order.customer.phone },
        { label: "Email", value: order.customer.email },
        { label: "Billing address", value: order.customer.address },
        { label: "Delivery address", value: order.customer.deliveryAddress },
        {
          label: "Delivery fee",
          value: order.customer.deliveryFee ? formatPounds(order.customer.deliveryFee) : "",
        },
      ])}
      ${orderItemsTable(order.items)}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin:8px 0 18px;">
        <tr>
          <td align="right" style="padding:10px 0; color:#6b7280; font-size:14px;">Total</td>
          <td align="right" style="padding:10px 0; color:#a8000d; font-size:20px; font-weight:800; width:130px;">${escapeHtml(formatPounds(order.total))}</td>
        </tr>
      </table>
      ${nextStepBox("Customer note", order.customer.orderNote || "No extra note provided.")}
    `,
  });

const getOrderEmailText = (order) =>
  [
    "New Chop Republic order",
    `Order: ${order.orderNumber}`,
    `Status: ${order.status}`,
    `Total: ${formatPounds(order.total)}`,
    `Name: ${getCustomerName(order.customer)}`,
    `Phone / WhatsApp: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Billing address: ${order.customer.address}`,
    `Fulfilment: ${order.customer.fulfillmentMethod || "Not specified"}`,
    `Delivery address: ${order.customer.deliveryAddress || "Not specified"}`,
    `Delivery fee: ${order.customer.deliveryFee ? formatPounds(order.customer.deliveryFee) : formatPounds(0)}`,
    "Items:",
    ...order.items.map((item) => {
      const size = item.selectedSize ? ` (${item.selectedSize})` : "";
      return `- ${item.name}${size} x${item.quantity} - ${item.price}`;
    }),
    `Note: ${order.customer.orderNote || "No extra note provided."}`,
  ].join("\n");

const getCustomerOrderEmailHtml = (order) => {
  const paidOnline = order.paymentMethod === "stripe" && order.status === "PAID_ONLINE";

  const title = paidOnline ? "Your order is confirmed" : "Your order has been received";
  const intro = paidOnline
    ? "Your payment has been confirmed and your Chop Republic order is now being processed."
    : "Your Chop Republic order has been received. Our team will validate payment and next steps with you.";
  const nextStep = paidOnline
    ? "We will prepare your order and contact you for pickup or delivery."
    : "Please continue on WhatsApp to confirm allergies, spice preference, pickup or delivery, and payment confirmation.";

  return `
    <div style="margin:0; padding:0; background:#f5f1ed; font-family:Arial, sans-serif; color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background:#f5f1ed;">
        <tr>
          <td align="center" style="padding:24px 12px 30px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px; border-collapse:collapse; background:#ffffff; border:1px solid #eadfd8;">
              <tr>
                <td align="center" style="background:#ffffff; padding:22px 24px 18px;">
                  <img src="cid:${emailLogoCid}" width="82" alt="Chop Republic" style="display:block; width:82px; max-width:82px; height:auto; margin:0 auto 10px;">
                  <div style="font-size:12px; line-height:1; font-weight:800; letter-spacing:.5px; color:#a8000d;">CHOP REPUBLIC</div>
                  <div style="height:3px; background:#a8000d; margin:15px auto 18px; width:100%;"></div>
                  <h1 style="margin:0; color:#111827; font-size:24px; line-height:1.18; font-weight:800;">${escapeHtml(
                    title,
                  )}, ${escapeHtml(getCustomerName(order.customer))}</h1>
                  <p style="margin:6px 0 18px; color:#6b7280; font-size:12px; line-height:1.5;">Thanks for ordering from Chop Republic.</p>
                  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 16px; border-collapse:collapse;">
                    <tr>
                      <td align="center" style="width:166px; height:118px; background:#fff1f2; border-radius:90px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                          <tr>
                            <td style="padding-top:18px;">
                              <div style="width:88px; height:76px; background:#ffffff; border:3px solid #111827; border-radius:7px 7px 12px 12px;">
                                <div style="height:22px; border-bottom:3px solid #111827; margin:0 17px;"></div>
                                <div style="padding-top:16px; text-align:center; font-size:12px; font-weight:800; color:#a8000d;">CR</div>
                              </div>
                            </td>
                            <td style="padding-left:8px; vertical-align:top; padding-top:12px;">
                              <div style="width:38px; height:38px; border-radius:38px; background:#a8000d; color:#ffffff; font-size:25px; line-height:38px; text-align:center; font-weight:800;">&#10003;</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 28px 8px;">
                  <p style="margin:0 0 18px; color:#374151; font-size:13px; line-height:1.6;">${escapeHtml(intro)}</p>
                  <h2 style="margin:0 0 12px; text-align:center; color:#111827; font-size:18px; line-height:1.3;">Order Details</h2>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom:14px;">
                    <tr>
                      <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:12px;">Order Number</td>
                      <td align="right" style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#111827; font-size:12px; font-weight:700;">${escapeHtml(
                        order.orderNumber,
                      )}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:12px;">Payment</td>
                      <td align="right" style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#111827; font-size:12px; font-weight:700;">${escapeHtml(
                        paidOnline ? "Paid online" : "Awaiting validation",
                      )}</td>
                    </tr>
                    ${
                      order.customer.fulfillmentMethod
                        ? `<tr>
                            <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:12px;">Fulfilment</td>
                            <td align="right" style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#111827; font-size:12px; font-weight:700;">${escapeHtml(
                              order.customer.fulfillmentMethod,
                            )}</td>
                          </tr>`
                        : ""
                    }
                    ${
                      order.customer.deliveryAddress
                        ? `<tr>
                            <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:12px;">Delivery address</td>
                            <td align="right" style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#111827; font-size:12px; font-weight:700;">${escapeHtml(
                              order.customer.deliveryAddress,
                            )}</td>
                          </tr>`
                        : ""
                    }
                    ${customerOrderItemsRows(order.items)}
                    ${
                      order.customer.deliveryFee
                        ? `<tr>
                            <td style="padding:10px 0; border-bottom:1px solid #e5e7eb; color:#111827; font-size:13px; font-weight:700;">Delivery fee</td>
                            <td align="right" style="padding:10px 0; border-bottom:1px solid #e5e7eb; color:#111827; font-size:13px; font-weight:700;">${escapeHtml(
                              formatPounds(order.customer.deliveryFee),
                            )}</td>
                          </tr>`
                        : ""
                    }
                    <tr>
                      <td style="padding:14px 0 4px; color:#111827; font-size:15px; font-weight:800;">Total</td>
                      <td align="right" style="padding:14px 0 4px; color:#111827; font-size:15px; font-weight:800;">${escapeHtml(
                        formatPounds(order.total),
                      )}</td>
                    </tr>
                  </table>
                  <div style="margin:18px 0; padding-top:16px; border-top:1px solid #d1d5db; text-align:center; color:#374151; font-size:13px; line-height:1.6;">
                    ${escapeHtml(nextStep)}
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="background:#a8000d; padding:18px 24px;">
                  <img src="cid:${emailLogoCid}" width="66" alt="Chop Republic" style="display:block; width:66px; max-width:66px; height:auto; margin:0 auto 8px;">
                  <div style="font-size:12px; font-weight:800; color:#ffffff;">Chop Republic</div>
                  <div style="margin-top:5px; color:#ffe8cf; font-size:11px;">Fresh Nigerian food, made with care.</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
};

const getCustomerOrderEmailText = (order) => {
  const paidOnline = order.paymentMethod === "stripe" && order.status === "PAID_ONLINE";

  return [
    paidOnline ? "Your Chop Republic order is confirmed" : "Your Chop Republic order has been received",
    "",
    `Hi ${getCustomerName(order.customer)},`,
    "",
    paidOnline
      ? `Thanks for ordering from Chop Republic. Your payment has been confirmed and your order ${order.orderNumber} has been received.`
      : `Thanks for ordering from Chop Republic. Your order ${order.orderNumber} has been received. Our team will contact you to validate payment and next steps.`,
    "",
    `Fulfilment: ${order.customer.fulfillmentMethod || "Not specified"}`,
    order.customer.deliveryAddress ? `Delivery address: ${order.customer.deliveryAddress}` : "",
    order.customer.deliveryFee ? `Delivery fee: ${formatPounds(order.customer.deliveryFee)}` : "",
    "",
    "Order summary:",
    ...order.items.map((item) => {
      const size = item.selectedSize ? ` (${item.selectedSize})` : "";
      return `- ${item.name}${size} x${item.quantity} - ${item.price}`;
    }),
    "",
    `Total: ${formatPounds(order.total)}`,
    "",
    "Chop Republic",
  ].join("\n");
};

const getCustomerBookingEmailHtml = (enquiry) =>
  emailShell({
    title: "Booking enquiry received",
    subtitle: `Reference ${enquiry.id}`,
    children: `
      <p style="margin:0 0 14px; font-size:15px; line-height:1.6;">Hi ${escapeHtml(enquiry.name)},</p>
      <p style="margin:0 0 14px; font-size:15px; line-height:1.6;">Thanks for contacting Chop Republic. Your booking enquiry has been received.</p>
      ${detailsTable([
        { label: "Reference", value: enquiry.id },
        { label: "Service", value: enquiry.service },
        { label: "Guests", value: enquiry.guests },
        { label: "Date", value: enquiry.date },
        { label: "Message", value: enquiry.message || "No extra message provided." },
      ])}
      ${nextStepBox("What happens next", "Our team will be in touch to confirm availability, menu options and next steps.")}
    `,
  });

const getCustomerBookingEmailText = (enquiry) =>
  [
    "Your Chop Republic booking enquiry has been received",
    "",
    `Hi ${enquiry.name},`,
    "",
    "Thanks for contacting Chop Republic. Your booking enquiry has been received and our team will be in touch to confirm availability, menu options and next steps.",
    "",
    `Reference: ${enquiry.id}`,
    `Service: ${enquiry.service}`,
    `Guests: ${enquiry.guests}`,
    `Date: ${enquiry.date}`,
    "",
    "Chop Republic",
  ].join("\n");

const getCustomerContactEmailHtml = (message) =>
  emailShell({
    title: "Thanks for contacting us",
    subtitle: `Reference ${message.id}`,
    children: `
      <p style="margin:0 0 14px; font-size:15px; line-height:1.6;">Hi ${escapeHtml(message.name)},</p>
      <p style="margin:0 0 14px; font-size:15px; line-height:1.6;">We have received your message and our team will be in touch shortly.</p>
      ${detailsTable([
        { label: "Reference", value: message.id },
        { label: "Message", value: message.message },
      ])}
      ${nextStepBox("What happens next", "A member of our team will reply as soon as possible.")}
    `,
  });

const getCustomerContactEmailText = (message) =>
  [
    "Thanks for contacting Chop Republic",
    "",
    `Hi ${message.name},`,
    "",
    "We have received your message and our team will be in touch shortly.",
    "",
    `Reference: ${message.id}`,
    "",
    "Chop Republic",
  ].join("\n");

const notifyOrder = async (order) => {
  const sheeted = await safeNotifySpreadsheet("whatsapp_order", order);
  let emailed = false;
  let customerEmailed = false;

  try {
    emailed = await sendNotificationEmail({
      to: orderInbox,
      replyTo: order.customer.email,
      subject: `${order.paymentMethod === "stripe" ? "Paid online" : "WhatsApp"} order ${order.orderNumber} - ${getCustomerName(order.customer)}`,
      text: getOrderEmailText(order),
      html: getOrderEmailHtml(order),
    });
  } catch (error) {
    console.error("Order email notification failed:", error);
  }

  if (order.customer.email) {
    try {
      customerEmailed = await sendNotificationEmail({
        to: order.customer.email,
        replyTo: orderInbox,
        subject:
          order.paymentMethod === "stripe" && order.status === "PAID_ONLINE"
            ? `Your Chop Republic order ${order.orderNumber} is confirmed`
            : `Your Chop Republic order ${order.orderNumber} has been received`,
        text: getCustomerOrderEmailText(order),
        html: getCustomerOrderEmailHtml(order),
      });
    } catch (error) {
      console.error("Customer order email failed:", error);
    }
  }

  return { customerEmailed, emailed, sheeted };
};

const updateOrderRecord = async (filePath, orderNumber, updater) => {
  const orders = await readJsonArray(filePath);
  const index = orders.findIndex((order) => order.orderNumber === orderNumber);

  if (index === -1) return null;

  const updatedOrder = updater(orders[index]);
  orders[index] = updatedOrder;
  await writeJsonArray(filePath, orders);

  return updatedOrder;
};

const findStripeOrderBySession = async (sessionId) => {
  const orders = await readJsonArray(stripeOrdersPath);
  return orders.find((order) => order.stripeSessionId === sessionId) ?? null;
};

const markStripeOrderPaid = async (session) => {
  const sessionId = session.id;
  const existingOrder =
    (await findStripeOrderBySession(sessionId)) ||
    (session.metadata?.orderNumber
      ? (await readJsonArray(stripeOrdersPath)).find(
          (order) => order.orderNumber === session.metadata.orderNumber,
        )
      : null);

  if (!existingOrder) {
    throw new Error(`No saved Stripe order found for session ${sessionId}.`);
  }

  let notified = false;
  let notifications = {
    emailed: false,
    sheeted: false,
  };

  const paidOrder = {
    ...existingOrder,
    status: "PAID_ONLINE",
    stripePaymentStatus: session.payment_status,
    stripeSessionId: sessionId,
    updatedAt: new Date().toISOString(),
  };

  if (!existingOrder.notifiedAt) {
    notifications = await notifyOrder(paidOrder);
    paidOrder.notifiedAt = new Date().toISOString();
    notified = true;
  }

  await updateOrderRecord(stripeOrdersPath, existingOrder.orderNumber, () => paidOrder);

  return { order: paidOrder, notified, notifications };
};

const getContactEmailHtml = (message) =>
  emailShell({
    title: "New contact message",
    subtitle: `Reference ${message.id}`,
    footer: "This message was sent from the Chop Republic contact form.",
    children: `
      ${detailsTable([
        { label: "Reference", value: message.id },
        { label: "Name", value: message.name },
        { label: "Email", value: message.email },
        { label: "Phone", value: message.phone },
        { label: "Message", value: message.message },
      ])}
      ${nextStepBox("Follow up", "Reply to this email to respond directly to the customer.")}
    `,
  });

const getContactEmailText = (message) =>
  [
    "New Chop Republic contact message",
    `Reference: ${message.id}`,
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Phone: ${message.phone}`,
    `Message: ${message.message}`,
  ].join("\n");

const findWhatsappOrderByText = async (text) => {
  const match = String(text ?? "").match(/ORD-\d{6,}/i);
  if (!match) return null;

  const orders = await readJsonArray(whatsappOrdersPath);
  return orders.find((order) => order.orderNumber.toLowerCase() === match[0].toLowerCase()) ?? null;
};

const appendWhatsappConversation = async (entry) => {
  await saveJsonRecord(whatsappConversationsPath, {
    id: `MSG-${String(Date.now()).slice(-8)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  });
};

const sendWhatsappText = async (to, body) => {
  if (!whatsappAccessToken || !whatsappPhoneNumberId) {
    console.warn("Skipped WhatsApp reply because credentials are missing.");
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const apiResponse = await fetch(
    `https://graph.facebook.com/${whatsappGraphApiVersion}/${whatsappPhoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${whatsappAccessToken}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          preview_url: false,
          body,
        },
      }),
    },
  ).finally(() => clearTimeout(timeout));

  if (!apiResponse.ok) {
    const errorBody = await apiResponse.text();
    throw new Error(`WhatsApp send failed: ${apiResponse.status} ${errorBody}`);
  }

  return true;
};

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
  await saveJsonRecord(bookingEnquiriesPath, enquiry);
};

const getBookingEmailHtml = (enquiry) =>
  emailShell({
    title: "New booking enquiry",
    subtitle: `${enquiry.service} - ${enquiry.date}`,
    footer: "This booking enquiry was sent from the Chop Republic website.",
    children: `
      ${detailsTable([
        { label: "Reference", value: enquiry.id },
        { label: "Name", value: enquiry.name },
        { label: "Phone / WhatsApp", value: enquiry.phone },
        { label: "Email", value: enquiry.email },
        { label: "Service", value: enquiry.service },
        { label: "Guests", value: enquiry.guests },
        { label: "Date", value: enquiry.date },
        { label: "Message", value: enquiry.message || "No extra message provided." },
      ])}
      ${nextStepBox("Follow up", "Reply to this email to confirm availability, menu options and next steps.")}
    `,
  });

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
    const sheeted = await safeNotifySpreadsheet("booking_enquiry", enquiry);
    let emailed = false;
    let customerEmailed = false;

    if (mailer) {
      try {
        emailed = await sendNotificationEmail({
          to: bookingInbox,
          replyTo: enquiry.email,
          subject: `Booking enquiry: ${enquiry.service} - ${enquiry.name}`,
          text: getBookingEmailText(enquiry),
          html: getBookingEmailHtml(enquiry),
        });
      } catch (error) {
        console.error("Booking email notification failed:", error);
      }
    }

    try {
      customerEmailed = await sendNotificationEmail({
        to: enquiry.email,
        replyTo: bookingInbox,
        subject: "Your Chop Republic booking enquiry has been received",
        text: getCustomerBookingEmailText(enquiry),
        html: getCustomerBookingEmailHtml(enquiry),
      });
    } catch (error) {
      console.error("Customer booking email failed:", error);
    }

    response.json({
      ok: true,
      id: enquiry.id,
      customerEmailed,
      emailed,
      sheeted,
    });
  } catch (error) {
    console.error("Booking enquiry failed:", error);
    response.status(500).json({ error: "Unable to send booking enquiry." });
  }
});

const normaliseContactMessage = (body) => {
  const message = {
    id: `CON-${String(Date.now()).slice(-8)}`,
    createdAt: new Date().toISOString(),
    name: sanitizeText(body?.name, 120),
    phone: sanitizeText(body?.phone, 80),
    email: sanitizeText(body?.email, 160),
    message: sanitizeText(body?.message, 1200),
  };
  const required = ["name", "email", "message"];
  const missing = required.filter((field) => !message[field]);

  return { message, missing };
};

app.post("/api/contact-messages", express.json(), async (request, response) => {
  const { message, missing } = normaliseContactMessage(request.body);

  if (missing.length) {
    response.status(400).json({ error: "Missing required contact fields.", missing });
    return;
  }

  try {
    await saveJsonRecord(contactMessagesPath, message);
    const sheeted = await safeNotifySpreadsheet("contact_message", message);
    let emailed = false;
    let customerEmailed = false;

    try {
      emailed = await sendNotificationEmail({
        to: contactInbox,
        replyTo: message.email,
        subject: `Contact message: ${message.name}`,
        text: getContactEmailText(message),
        html: getContactEmailHtml(message),
      });
    } catch (error) {
      console.error("Contact email notification failed:", error);
    }

    try {
      customerEmailed = await sendNotificationEmail({
        to: message.email,
        replyTo: contactInbox,
        subject: "Thanks for contacting Chop Republic",
        text: getCustomerContactEmailText(message),
        html: getCustomerContactEmailHtml(message),
      });
    } catch (error) {
      console.error("Customer contact email failed:", error);
    }

    response.json({
      ok: true,
      id: message.id,
      customerEmailed,
      emailed,
      sheeted,
    });
  } catch (error) {
    console.error("Contact message failed:", error);
    response.status(500).json({ error: "Unable to send contact message." });
  }
});

app.post("/api/whatsapp-orders", express.json(), async (request, response) => {
  const customer = normaliseCustomer(request.body?.customer);
  const items = normaliseOrderItems(request.body?.items);
  const total = Number(request.body?.total) || 0;
  const requiredCustomerFields = ["phone", "email", "firstName", "lastName", "address"];
  const missing = requiredCustomerFields.filter((field) => !customer[field]);

  if (!items.length) {
    missing.push("items");
  }

  if (!total) {
    missing.push("total");
  }

  if (missing.length) {
    response.status(400).json({ error: "Missing required WhatsApp order fields.", missing });
    return;
  }

  const order = {
    id: `WA-${String(Date.now()).slice(-8)}`,
    createdAt: new Date().toISOString(),
    orderNumber: getOrderNumber(),
    customer,
    items,
    total,
    status: "WAITING_FOR_WHATSAPP_MESSAGE",
    paymentMethod: "whatsapp",
  };
  const message = getWhatsappOrderMessage(order);
  const customerReply = getWhatsappCustomerOrderReply(order);
  const whatsappUrl = `https://wa.me/${whatsappBusinessNumber}?text=${encodeURIComponent(message)}`;

  try {
    await saveJsonRecord(whatsappOrdersPath, order);
    let whatsappSent = false;
    let whatsappError = null;
    console.info("WhatsApp checkout created. Customer must tap Send Order Details:", {
      orderNumber: order.orderNumber,
      to: whatsappBusinessNumber,
    });

    const notificationOrder = {
      ...order,
      customerReply,
      whatsappSent,
      whatsappError,
    };

    void notifyOrder(notificationOrder)
      .then((notifications) => {
        console.info("WhatsApp checkout notifications processed:", {
          orderNumber: order.orderNumber,
          ...notifications,
        });
      })
      .catch((error) => {
        console.error("WhatsApp checkout notifications failed:", error);
      });

    response.json({
      ok: true,
      order,
      message,
      customerReply,
      emailed: false,
      customerEmailed: false,
      sheeted: false,
      notificationsQueued: true,
      whatsappSent,
      whatsappError,
      whatsappUrl,
    });
  } catch (error) {
    console.error("WhatsApp order creation failed:", error);
    response.status(500).json({ error: "Unable to create WhatsApp order." });
  }
});

app.get("/api/whatsapp/webhook", (request, response) => {
  const mode = request.query["hub.mode"];
  const token = request.query["hub.verify_token"];
  const challenge = request.query["hub.challenge"];

  if (mode === "subscribe" && token === whatsappVerifyToken) {
    response.status(200).send(challenge);
    return;
  }

  response.sendStatus(403);
});

app.post("/api/whatsapp/webhook", express.json(), async (request, response) => {
  response.sendStatus(200);

  try {
    const entries = Array.isArray(request.body?.entry) ? request.body.entry : [];
    console.info("WhatsApp webhook received:", { entries: entries.length });

    for (const entry of entries) {
      const changes = Array.isArray(entry?.changes) ? entry.changes : [];

      for (const change of changes) {
        const messages = Array.isArray(change?.value?.messages) ? change.value.messages : [];

        for (const message of messages) {
          const from = sanitizeText(message.from, 80);
          const text = sanitizeText(message.text?.body, 3000);

          if (!from || !text) continue;
          console.info("WhatsApp message received:", {
            from,
            preview: text.slice(0, 90),
          });

          const order = await findWhatsappOrderByText(text);
          let reply =
            "Thanks for messaging Chop Republic. A team member will continue with you here shortly.";

          if (order) {
            reply = getWhatsappBotReply(order);
            order.status = "WAITING_FOR_CUSTOMER_CONFIRMATION";
            order.lastMessageFrom = from;
            order.updatedAt = new Date().toISOString();

            const orders = await readJsonArray(whatsappOrdersPath);
            const nextOrders = orders.map((savedOrder) =>
              savedOrder.orderNumber === order.orderNumber ? order : savedOrder,
            );
            await writeJsonArray(whatsappOrdersPath, nextOrders);
          } else if (/\b(delivery|deliver)\b/i.test(text)) {
            reply =
              "Delivery may include an additional fee depending on your location. A Chop Republic team member will confirm the delivery fee and next steps with you shortly.";
          } else if (/\b(pickup|pick up|collect|collection)\b/i.test(text)) {
            reply =
              "Thanks. A Chop Republic team member will confirm pickup details with you shortly.";
          } else if (/\b(paid|payment|transfer|receipt)\b/i.test(text)) {
            reply =
              "Thanks, we have received your payment confirmation. Our team will verify it now before confirming your order.";
          }

          await appendWhatsappConversation({
            from,
            incomingText: text,
            matchedOrderNumber: order?.orderNumber ?? null,
            reply,
          });

          await sendWhatsappText(from, reply);
        }
      }
    }
  } catch (error) {
    console.error("WhatsApp webhook handling failed:", error);
  }
});

app.post("/api/create-checkout-session", express.json(), async (request, response) => {
  if (!stripe) {
    response.status(500).json({ error: "Stripe is not configured on the server." });
    return;
  }

  const customer = normaliseCustomer(request.body?.customer);
  const items = normaliseOrderItems(request.body?.items);
  const lineItems = Array.isArray(request.body?.items)
    ? request.body.items.map(normaliseCartItem).filter(Boolean)
    : [];
  const deliveryFee = Math.max(0, Number(request.body?.deliveryFee) || 0);
  const deliveryFeePence = Math.round(deliveryFee * 100);
  if (deliveryFeePence > 0) {
    lineItems.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name: "Delivery fee",
        },
        unit_amount: deliveryFeePence,
      },
      quantity: 1,
    });
  }
  const total =
    Number(request.body?.total) ||
    lineItems.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity) / 100, 0);

  if (!items.length || !lineItems.length) {
    response.status(400).json({ error: "No valid cart items were provided." });
    return;
  }

  try {
    const order = {
      id: `ST-${String(Date.now()).slice(-8)}`,
      createdAt: new Date().toISOString(),
      orderNumber: getOrderNumber(),
      customer,
      items,
      total,
      status: "WAITING_FOR_STRIPE_PAYMENT",
      paymentMethod: "stripe",
    };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email || undefined,
      success_url: `${clientUrl}/checkout?payment=stripe-success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/checkout?payment=stripe-cancelled`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderSource: "chop-republic-web",
      },
    });
    const savedOrder = {
      ...order,
      stripeSessionId: session.id,
      stripePaymentStatus: session.payment_status,
    };

    await saveJsonRecord(stripeOrdersPath, savedOrder);

    response.json({ order: savedOrder, url: session.url });
  } catch (error) {
    console.error("Stripe checkout session failed:", error);
    response.status(500).json({ error: "Unable to create checkout session." });
  }
});

app.post("/api/stripe-orders/confirm", express.json(), async (request, response) => {
  if (!stripe) {
    response.status(500).json({ error: "Stripe is not configured on the server." });
    return;
  }

  const sessionId = sanitizeText(request.body?.sessionId, 160);

  if (!sessionId) {
    response.status(400).json({ error: "Stripe session ID is required." });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      response.status(409).json({
        error: "Stripe payment is not paid yet.",
        paymentStatus: session.payment_status,
      });
      return;
    }

    const result = await markStripeOrderPaid(session);
    response.json({ ok: true, ...result });
  } catch (error) {
    console.error("Stripe order confirmation failed:", error);
    response.status(500).json({ error: "Unable to confirm Stripe order." });
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
    await markStripeOrderPaid(session);
    console.log("Payment completed:", session.id);
  }

  response.json({ received: true });
};

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
app.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

const server = app.listen(port, () => {
  console.log(`Chop Republic backend listening on http://127.0.0.1:${port}`);
});

server.on("error", (error) => {
  console.error("Backend server failed:", error);
});
