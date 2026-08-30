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
const whatsappOrderTemplateName = process.env.WHATSAPP_ORDER_TEMPLATE_NAME ?? "order_received";
const whatsappOrderTemplateLanguage = process.env.WHATSAPP_ORDER_TEMPLATE_LANGUAGE ?? "en";
const defaultCustomerCountryCode = process.env.DEFAULT_CUSTOMER_COUNTRY_CODE ?? "44";
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

  return `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

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
      };
    })
    .filter(Boolean);

const getCustomerName = (customer) =>
  `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || "there";

const getWhatsappOrderMessage = (order) => {
  const itemLines = order.items.map((item) => {
    const size = item.selectedSize ? ` (${item.selectedSize})` : "";
    return `- ${item.name}${size} x${item.quantity}`;
  });
  const customerName = getCustomerName(order.customer);
  const lines = [
    "Hi Chop Republic, I want to place this order:",
    "",
    `Order: ${order.orderNumber}`,
    "Items:",
    ...itemLines,
    "",
    `Total: ${formatPounds(order.total)}`,
    `Name: ${customerName}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
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

const normaliseWhatsappRecipient = (phone) => {
  const trimmed = String(phone ?? "").trim();
  if (trimmed.startsWith("+")) {
    return trimmed.replace(/[^\d]/g, "");
  }

  const digits = trimmed.replace(/[^\d]/g, "");
  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  if (digits.startsWith("0") && defaultCustomerCountryCode) {
    return `${defaultCustomerCountryCode}${digits.slice(1)}`;
  }

  return digits;
};

const getWhatsappOrderTemplateComponents = (order) => [
  {
    type: "body",
    parameters: [
      {
        type: "text",
        text: getCustomerName(order.customer),
      },
      {
        type: "text",
        text: order.orderNumber,
      },
      {
        type: "text",
        text: formatPounds(order.total),
      },
    ],
  },
];

const getOrderEmailHtml = (order) => `
  <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h2 style="margin: 0 0 16px; color: #a8000d;">New Chop Republic order</h2>
    <p><strong>Order:</strong> ${order.orderNumber}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Total:</strong> ${formatPounds(order.total)}</p>
    <p><strong>Name:</strong> ${getCustomerName(order.customer)}</p>
    <p><strong>Phone / WhatsApp:</strong> ${order.customer.phone}</p>
    <p><strong>Email:</strong> ${order.customer.email}</p>
    <p><strong>Address:</strong> ${order.customer.address}</p>
    <p><strong>Items:</strong></p>
    <ul>
      ${order.items
        .map((item) => {
          const size = item.selectedSize ? ` (${item.selectedSize})` : "";
          return `<li>${item.name}${size} x${item.quantity} - ${item.price}</li>`;
        })
        .join("")}
    </ul>
    <p><strong>Note:</strong><br>${order.customer.orderNote || "No extra note provided."}</p>
  </div>
`;

const getOrderEmailText = (order) =>
  [
    "New Chop Republic order",
    `Order: ${order.orderNumber}`,
    `Status: ${order.status}`,
    `Total: ${formatPounds(order.total)}`,
    `Name: ${getCustomerName(order.customer)}`,
    `Phone / WhatsApp: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Address: ${order.customer.address}`,
    "Items:",
    ...order.items.map((item) => {
      const size = item.selectedSize ? ` (${item.selectedSize})` : "";
      return `- ${item.name}${size} x${item.quantity} - ${item.price}`;
    }),
    `Note: ${order.customer.orderNote || "No extra note provided."}`,
  ].join("\n");

const getCustomerOrderEmailHtml = (order) => {
  const paidOnline = order.paymentMethod === "stripe" && order.status === "PAID_ONLINE";

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin: 0 0 16px; color: #a8000d;">${paidOnline ? "Your Chop Republic order is confirmed" : "Your Chop Republic order has been received"}</h2>
      <p>Hi ${getCustomerName(order.customer)},</p>
      <p>${
        paidOnline
          ? `Thanks for ordering from Chop Republic. Your payment has been confirmed and your order ${order.orderNumber} has been received.`
          : `Thanks for ordering from Chop Republic. Your order ${order.orderNumber} has been received. Our team will contact you to validate payment and next steps.`
      }</p>
      <p><strong>Order summary:</strong></p>
      <ul>
        ${order.items
          .map((item) => {
            const size = item.selectedSize ? ` (${item.selectedSize})` : "";
            return `<li>${item.name}${size} x${item.quantity} - ${item.price}</li>`;
          })
          .join("")}
      </ul>
      <p><strong>Total:</strong> ${formatPounds(order.total)}</p>
      <p>Chop Republic</p>
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

const getCustomerBookingEmailHtml = (enquiry) => `
  <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h2 style="margin: 0 0 16px; color: #a8000d;">Your Chop Republic booking enquiry has been received</h2>
    <p>Hi ${enquiry.name},</p>
    <p>Thanks for contacting Chop Republic. Your booking enquiry has been received and our team will be in touch to confirm availability, menu options and next steps.</p>
    <p><strong>Reference:</strong> ${enquiry.id}</p>
    <p><strong>Service:</strong> ${enquiry.service}</p>
    <p><strong>Guests:</strong> ${enquiry.guests}</p>
    <p><strong>Date:</strong> ${enquiry.date}</p>
    <p>Chop Republic</p>
  </div>
`;

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

const getCustomerContactEmailHtml = (message) => `
  <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h2 style="margin: 0 0 16px; color: #a8000d;">Thanks for contacting Chop Republic</h2>
    <p>Hi ${message.name},</p>
    <p>We have received your message and our team will be in touch shortly.</p>
    <p><strong>Reference:</strong> ${message.id}</p>
    <p>Chop Republic</p>
  </div>
`;

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

const getContactEmailHtml = (message) => `
  <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h2 style="margin: 0 0 16px; color: #a8000d;">New Chop Republic contact message</h2>
    <p><strong>Reference:</strong> ${message.id}</p>
    <p><strong>Name:</strong> ${message.name}</p>
    <p><strong>Email:</strong> ${message.email}</p>
    <p><strong>Phone:</strong> ${message.phone}</p>
    <p><strong>Message:</strong><br>${message.message}</p>
  </div>
`;

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

  const apiResponse = await fetch(
    `https://graph.facebook.com/${whatsappGraphApiVersion}/${whatsappPhoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${whatsappAccessToken}`,
        "Content-Type": "application/json",
      },
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
  );

  if (!apiResponse.ok) {
    const errorBody = await apiResponse.text();
    throw new Error(`WhatsApp send failed: ${apiResponse.status} ${errorBody}`);
  }

  return true;
};

const sendWhatsappTemplate = async (to, templateName, languageCode, components) => {
  if (!whatsappAccessToken || !whatsappPhoneNumberId) {
    console.warn("Skipped WhatsApp template because credentials are missing.");
    return false;
  }

  const apiResponse = await fetch(
    `https://graph.facebook.com/${whatsappGraphApiVersion}/${whatsappPhoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${whatsappAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
          components,
        },
      }),
    },
  );

  if (!apiResponse.ok) {
    const errorBody = await apiResponse.text();
    throw new Error(`WhatsApp template failed: ${apiResponse.status} ${errorBody}`);
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
    const recipient = normaliseWhatsappRecipient(customer.phone);

    try {
      whatsappSent = await sendWhatsappTemplate(
        recipient,
        whatsappOrderTemplateName,
        whatsappOrderTemplateLanguage,
        getWhatsappOrderTemplateComponents(order),
      );
      order.status = "WHATSAPP_TEMPLATE_SENT";
      order.updatedAt = new Date().toISOString();

      const orders = await readJsonArray(whatsappOrdersPath);
      const nextOrders = orders.map((savedOrder) =>
        savedOrder.orderNumber === order.orderNumber ? order : savedOrder,
      );
      await writeJsonArray(whatsappOrdersPath, nextOrders);

      await appendWhatsappConversation({
        from: whatsappPhoneNumberId ?? "chop-republic",
        to: recipient,
        matchedOrderNumber: order.orderNumber,
        outgoingText: `Template: ${whatsappOrderTemplateName}`,
        source: "checkout-template-send",
      });
    } catch (error) {
      whatsappError = error.message;
      console.error("Initial WhatsApp customer template failed:", error);
    }

    const notifications = await notifyOrder({
      ...order,
      customerReply,
      whatsappSent,
      whatsappError,
    });
    order.notifiedAt = new Date().toISOString();

    response.json({
      ok: true,
      order,
      message,
      customerReply,
      emailed: notifications.emailed,
      customerEmailed: notifications.customerEmailed,
      sheeted: notifications.sheeted,
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

    for (const entry of entries) {
      const changes = Array.isArray(entry?.changes) ? entry.changes : [];

      for (const change of changes) {
        const messages = Array.isArray(change?.value?.messages) ? change.value.messages : [];

        for (const message of messages) {
          const from = sanitizeText(message.from, 80);
          const text = sanitizeText(message.text?.body, 3000);

          if (!from || !text) continue;

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
