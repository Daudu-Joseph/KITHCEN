import { HouseIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ReceiptPrinter } from "../components/ReceiptPrinter";
import { TactileButton } from "../components/TactileButton";
import { useUi } from "../context/UiContext";

const parsePrice = (price) => {
  const match = price.match(/[\d,.]+/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
};

const formatPrice = (value) => {
  const price = Number(value);
  const decimals = Number.isInteger(price) ? 0 : 2;

  return `£${price.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

const initialForm = {
  phone: "",
  email: "",
  country: "United Kingdom",
  firstName: "",
  lastName: "",
  address: "",
  addNote: false,
  orderNote: "",
};

const getOrderNumber = () => `ORD-${String(Date.now()).slice(-6)}`;

const formatOrderDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const savedOrderKey = "chopRepublicLastOrder";
const pendingStripeOrderKey = "chopRepublicPendingStripeOrder";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4242";

const getSavedOrder = () => {
  try {
    const savedOrder = window.localStorage.getItem(savedOrderKey);
    return savedOrder ? JSON.parse(savedOrder) : null;
  } catch {
    return null;
  }
};

const getReturnedStripeOrder = () => {
  try {
    const payment = new URLSearchParams(window.location.search).get("payment");
    if (payment !== "stripe-success") return null;

    const pendingOrder = window.localStorage.getItem(pendingStripeOrderKey);
    return pendingOrder ? JSON.parse(pendingOrder) : null;
  } catch {
    return null;
  }
};

const getInitialReceipt = (hasActiveCart) => {
  const returnedStripeOrder = getReturnedStripeOrder();
  if (returnedStripeOrder) {
    return {
      order: { ...returnedStripeOrder, paymentMethod: "stripe" },
      stage: "processing",
    };
  }

  const savedOrder = hasActiveCart ? null : getSavedOrder();
  return {
    order: savedOrder,
    stage: savedOrder ? "complete" : "processing",
  };
};

export default function CheckoutPage() {
  const { cartItems, clearCart, openCart } = useUi();
  const [searchParams] = useSearchParams();
  const processedStripeReturnRef = useRef(false);
  const initialReceipt = getInitialReceipt(cartItems.length > 0);
  const [form, setForm] = useState(initialForm);
  const [order, setOrder] = useState(() => initialReceipt.order);
  const [receiptStage, setReceiptStage] = useState(() => initialReceipt.stage);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [checkoutAlert, setCheckoutAlert] = useState(() =>
    searchParams.get("payment") === "stripe-cancelled"
      ? {
          message: "Payment was cancelled.",
          tone: "warning",
        }
      : null,
  );
  const [stripeError, setStripeError] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [cartItems],
  );

  const requiredFields = [
    "phone",
    "email",
    "country",
    "firstName",
    "lastName",
    "address",
  ];
  const canPlaceOrder =
    cartItems.length > 0 && requiredFields.every((field) => String(form[field]).trim().length > 0);
  const canSubmitOrder = canPlaceOrder && Boolean(paymentMethod);

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildOrderSnapshot = (method = paymentMethod) => ({
    customer: { ...form },
    date: new Date().toISOString(),
    items: cartItems.map((item) => ({ ...item })),
    orderNumber: getOrderNumber(),
    paymentMethod: method,
    total: subtotal,
  });

  const placeOrder = (event) => {
    event.preventDefault();
    if (!canSubmitOrder) return;
    const placedOrder = buildOrderSnapshot("whatsapp");

    setOrder(placedOrder);
    window.localStorage.setItem(savedOrderKey, JSON.stringify(placedOrder));
    setReceiptStage("processing");
    clearCart();
  };

  const submitSelectedPayment = (event) => {
    event.preventDefault();
    if (!canSubmitOrder) return;

    if (paymentMethod === "stripe") {
      startStripeCheckout();
      return;
    }

    placeOrder(event);
  };

  const startStripeCheckout = async () => {
    if (!canSubmitOrder || stripeLoading) return;

    const pendingOrder = buildOrderSnapshot("stripe");
    setStripeError("");
    setStripeLoading(true);
    window.localStorage.setItem(pendingStripeOrderKey, JSON.stringify(pendingOrder));

    try {
      const response = await fetch(`${apiBaseUrl}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          items: cartItems.map(({ name, price, quantity, selectedSize }) => ({
            name,
            price,
            quantity,
            selectedSize,
          })),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.url) {
        console.error("Stripe checkout server error:", data.error);
        throw new Error("Online payment is temporarily unavailable. Please try again or choose WhatsApp Checkout.");
      }

      window.location.assign(data.url);
    } catch (error) {
      window.localStorage.removeItem(pendingStripeOrderKey);
      console.error("Stripe checkout could not start:", error);
      setStripeError(
        error instanceof TypeError
          ? "Online payment is temporarily unavailable. Please try again or choose WhatsApp Checkout."
          : error.message ?? "Online payment is temporarily unavailable. Please try again or choose WhatsApp Checkout.",
      );
      setStripeLoading(false);
    }
  };

  const downloadReceipt = () => {
    window.print();
  };

  useEffect(() => {
    if (!order) return undefined;

    if (receiptStage === "complete") return undefined;

    const printingTimer =
      receiptStage === "processing"
        ? window.setTimeout(() => setReceiptStage("printing"), 650)
        : undefined;
    const completeTimer = window.setTimeout(
      () => setReceiptStage("complete"),
      receiptStage === "printing" ? 1850 : 2600,
    );

    return () => {
      if (printingTimer) window.clearTimeout(printingTimer);
      window.clearTimeout(completeTimer);
    };
  }, [order, receiptStage]);

  useEffect(() => {
    if (
      processedStripeReturnRef.current ||
      searchParams.get("payment") !== "stripe-success" ||
      !order
    ) {
      return;
    }

    try {
      processedStripeReturnRef.current = true;
      const paidOrder = { ...order, paymentMethod: "stripe" };
      window.localStorage.setItem(savedOrderKey, JSON.stringify(paidOrder));
      window.localStorage.removeItem(pendingStripeOrderKey);
      window.history.replaceState(null, "", "/checkout");
      clearCart();
    } catch {
      window.localStorage.removeItem(pendingStripeOrderKey);
    }
  }, [clearCart, order, searchParams]);

  useEffect(() => {
    if (processedStripeReturnRef.current || searchParams.get("payment") !== "stripe-cancelled") {
      return;
    }

    processedStripeReturnRef.current = true;
    window.history.replaceState(null, "", "/checkout");
  }, [searchParams]);

  const orderCustomerName = order
    ? `${order.customer.firstName} ${order.customer.lastName}`.trim()
    : "";
  const orderItemCount = order
    ? order.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const receiptScreenTitle =
    order && order.items.length === 1 ? order.items[0].name : "Chop Republic order";
  const receiptScreenSubtitle = `${orderItemCount} ${orderItemCount === 1 ? "item" : "items"} ${
    order?.paymentMethod === "stripe" ? "payment confirmed" : "ready for payment"
  }`;
  const orderStatusTitle = order?.paymentMethod === "stripe" ? "Payment confirmed" : "Order placed";
  const orderStatusMessage =
    order?.paymentMethod === "stripe"
      ? "Your payment was successful. We'll contact you to validate your order."
      : "We'll contact you to validate your order and confirm payment.";
  const checkoutNotice = stripeError
    ? {
        title: "Online payment unavailable",
        message: stripeError,
        tone: "error",
      }
    : null;
  const whatsappNotice =
    paymentMethod === "whatsapp"
      ? {
          title: "WhatsApp number required",
          message:
            "Ensure you add a valid WhatsApp number so we can contact you to validate the order and payment.",
          tone: "info",
        }
      : null;

  return (
    <main className="checkout-page">
      {checkoutAlert ? (
        <div className={`checkout-alert checkout-alert-${checkoutAlert.tone}`} role="alert">
          <WarningIcon aria-hidden="true" size={22} />
          <span>{checkoutAlert.message}</span>
          <button
            aria-label="Dismiss alert"
            onClick={() => setCheckoutAlert(null)}
            type="button"
          >
            <XIcon aria-hidden="true" size={20} />
          </button>
        </div>
      ) : null}
      <section className="checkout-section">
        <div className="container">
          {order ? (
            <div className="checkout-status">
              <ReceiptPrinter.Root stage={receiptStage}>
                <ReceiptPrinter.Machine>
                  <ReceiptPrinter.Header>
                    <div className="receipt-brand-mark" aria-hidden="true">
                      CR
                    </div>
                    <TactileButton depth="shallow" href="/" size="sm">
                      <HouseIcon aria-hidden="true" size={13} weight="fill" />
                      Home
                    </TactileButton>
                  </ReceiptPrinter.Header>

                  <ReceiptPrinter.Screen>
                    <div className="receipt-screen-content">
                      <div className="receipt-screen-row">
                        <div>
                          <p>{receiptScreenTitle}</p>
                          <p>{receiptScreenSubtitle}</p>
                        </div>
                        <strong>
                          <span>Total</span>
                          {formatPrice(order.total)}
                        </strong>
                      </div>
                      <ReceiptPrinter.Status />
                    </div>
                  </ReceiptPrinter.Screen>
                </ReceiptPrinter.Machine>

                <ReceiptPrinter.Output>
                  <ReceiptPrinter.Paper>
                    <div className="printed-receipt-logo">CR</div>
                    <div className="printed-receipt-rule"></div>
                    <h2>Order receipt</h2>

                    <div className="printed-receipt-items">
                      {order.items.map((item) => {
                        const itemPrice = parsePrice(item.price);

                        return (
                          <div className="printed-receipt-item" key={item.cartKey ?? item.slug}>
                            <div>
                              <strong>{item.name}</strong>
                              {item.selectedSize ? <em>{item.selectedSize}</em> : null}
                              <span>
                                Qty {item.quantity} x {formatPrice(itemPrice)}
                              </span>
                            </div>
                            <b>{formatPrice(itemPrice * item.quantity)}</b>
                          </div>
                        );
                      })}
                    </div>

                    <div className="printed-receipt-rule"></div>
                    <dl className="printed-receipt-total">
                      <div>
                        <dt>Total</dt>
                        <dd>{formatPrice(order.total)}</dd>
                      </div>
                    </dl>
                    <div className="printed-receipt-rule"></div>
                    <dl className="printed-receipt-meta">
                      <div>
                        <dt>Order</dt>
                        <dd>{order.orderNumber}</dd>
                      </div>
                      <div>
                        <dt>Name</dt>
                        <dd>{orderCustomerName}</dd>
                      </div>
                      <div>
                        <dt>Phone</dt>
                        <dd>{order.customer.phone}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{order.customer.email}</dd>
                      </div>
                      <div>
                        <dt>Address</dt>
                        <dd>{order.customer.address}</dd>
                      </div>
                      {order.customer.orderNote.trim() ? (
                        <div>
                          <dt>Note</dt>
                          <dd>{order.customer.orderNote}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt>Date</dt>
                        <dd>{formatOrderDate(order.date)}</dd>
                      </div>
                    </dl>
                    <div className="printed-receipt-barcode" aria-hidden="true"></div>
                    <p className="printed-receipt-code">{order.orderNumber.replace("-", " ")}</p>
                  </ReceiptPrinter.Paper>
                </ReceiptPrinter.Output>
              </ReceiptPrinter.Root>

              <div className="checkout-status-message">
                <h1>{orderStatusTitle}</h1>
                <p>{orderStatusMessage}</p>
              </div>

              <div className="checkout-status-actions">
                <button className="checkout-status-download" type="button" onClick={downloadReceipt}>
                  Download Receipt
                </button>
              </div>
            </div>
          ) : (
            <form className="checkout-layout" onSubmit={submitSelectedPayment}>
              <div className="checkout-form">
                <h2>Contact information</h2>
                <input
                  name="phone"
                  onChange={updateField}
                  placeholder="WhatsApp phone number"
                  required
                  type="tel"
                  value={form.phone}
                />
                <input
                  name="email"
                  onChange={updateField}
                  placeholder="Email address"
                  required
                  type="email"
                  value={form.email}
                />

                <h2>Billing address</h2>
                <label className="checkout-select">
                  <span>Country/Region</span>
                  <select name="country" onChange={updateField} required value={form.country}>
                    <option>United Kingdom</option>
                  </select>
                </label>

                <div className="checkout-two-col">
                  <input
                    name="firstName"
                    onChange={updateField}
                    placeholder="First name"
                    required
                    value={form.firstName}
                  />
                  <input
                    name="lastName"
                    onChange={updateField}
                    placeholder="Last name"
                    required
                    value={form.lastName}
                  />
                </div>

                <input
                  name="address"
                  onChange={updateField}
                  placeholder="Address"
                  required
                  value={form.address}
                />

                <h2>Payment options</h2>
                <button
                  aria-pressed={paymentMethod === "whatsapp"}
                  className={`checkout-payment checkout-payment-option${
                    paymentMethod === "whatsapp" ? " is-selected" : ""
                  }`}
                  onClick={() => {
                    setPaymentMethod("whatsapp");
                    setStripeError("");
                  }}
                  type="button"
                >
                  <span className="checkout-payment-check" aria-hidden="true"></span>
                  <span>
                    <strong>WhatsApp Checkout</strong>
                    <small>Place order and pay via WhatsApp</small>
                  </span>
                </button>
                {whatsappNotice ? (
                  <div className={`checkout-notice checkout-notice-${whatsappNotice.tone}`}>
                    <span aria-hidden="true"></span>
                    <div>
                      <strong>{whatsappNotice.title}</strong>
                      <p>{whatsappNotice.message}</p>
                    </div>
                  </div>
                ) : null}
                <button
                  aria-pressed={paymentMethod === "stripe"}
                  className={`checkout-payment checkout-payment-option${
                    paymentMethod === "stripe" ? " is-selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("stripe")}
                  type="button"
                >
                  <span className="checkout-payment-check" aria-hidden="true"></span>
                  <span>
                    <strong>Pay Online</strong>
                    <small>Pay securely by card, Apple Pay, or Google Pay</small>
                  </span>
                </button>
                {checkoutNotice ? (
                  <div className={`checkout-notice checkout-notice-${checkoutNotice.tone}`}>
                    <span aria-hidden="true"></span>
                    <div>
                      <strong>{checkoutNotice.title}</strong>
                      <p>{checkoutNotice.message}</p>
                    </div>
                  </div>
                ) : null}

                <label className="checkout-note">
                  <input
                    checked={form.addNote}
                    name="addNote"
                    onChange={updateField}
                    type="checkbox"
                  />
                  <span>Add a note to your order</span>
                </label>
                {form.addNote ? (
                  <textarea
                    name="orderNote"
                    onChange={updateField}
                    placeholder="Type your order note here"
                    rows="4"
                    value={form.orderNote}
                  />
                ) : null}

                <p className="checkout-terms">
                  By proceeding with your purchase you agree to our{" "}
                  <Link to="/terms">Terms and Conditions</Link> and{" "}
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </p>

                <div className="checkout-actions">
                  <button className="checkout-return-cart" type="button" onClick={openCart}>
                    <i className="fa fa-arrow-left"></i>
                    Return to Cart
                  </button>
                  <button disabled={!canSubmitOrder || stripeLoading} type="submit">
                    {stripeLoading ? <span className="checkout-button-spinner" aria-hidden="true"></span> : null}
                    {!paymentMethod ? "Select Payment" : paymentMethod === "stripe" ? "Pay Online" : "Place Order"}
                  </button>
                </div>
              </div>

              <aside className="checkout-summary">
                <h2>Order summary</h2>
                {cartItems.length === 0 ? (
                  <p className="checkout-empty">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => {
                    const itemPrice = parsePrice(item.price);

                    return (
                      <div className="checkout-summary-item" key={item.cartKey ?? item.slug}>
                        <div className="checkout-summary-image">
                          <img src={item.image} alt={item.name} />
                          <span>{item.quantity}</span>
                        </div>
                        <div>
                          <h3>{item.name}</h3>
                          {item.selectedSize ? <small>{item.selectedSize}</small> : null}
                          <p>{formatPrice(itemPrice)}</p>
                        </div>
                        <strong>{formatPrice(itemPrice * item.quantity)}</strong>
                      </div>
                    );
                  })
                )}

                <button className="checkout-coupon" type="button">
                  <span>Add coupons</span>
                  <i className="fa fa-angle-down"></i>
                </button>

                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                <div className="checkout-summary-total">
                  <span>Total</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
              </aside>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
