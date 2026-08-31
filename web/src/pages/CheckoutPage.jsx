import { HouseIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ReceiptPrinter } from "../components/ReceiptPrinter";
import { TactileButton } from "../components/TactileButton";
import { useUi } from "../context/UiContext";

const ONLINE_DELIVERY_FEE = 5;

const parsePrice = (price) => {
  const match = price.match(/[\d,.]+/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
};

const formatPrice = (value) => {
  const price = Number(value);
  const decimals = Number.isInteger(price) ? 0 : 2;

  return `\u00a3${price.toLocaleString("en-GB", {
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
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [whatsappCheckoutUrl, setWhatsappCheckoutUrl] = useState(
    () => initialReceipt.order?.whatsappUrl ?? "",
  );
  const [onlineFulfillmentModalOpen, setOnlineFulfillmentModalOpen] = useState(false);
  const [onlineFulfillmentMethod, setOnlineFulfillmentMethod] = useState("pickup");
  const [onlineDeliveryAddress, setOnlineDeliveryAddress] = useState("");

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
  const onlineDeliveryFee = onlineFulfillmentMethod === "delivery" ? ONLINE_DELIVERY_FEE : 0;
  const onlinePaymentTotal = subtotal + onlineDeliveryFee;
  const canConfirmOnlineFulfillment =
    onlineFulfillmentMethod === "pickup" || onlineDeliveryAddress.trim().length > 0;

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getOnlineFulfillmentCustomer = () => ({
    ...form,
    fulfillmentMethod: onlineFulfillmentMethod,
    deliveryAddress:
      onlineFulfillmentMethod === "delivery" ? onlineDeliveryAddress.trim() : "",
    deliveryFee: onlineDeliveryFee,
  });

  const buildOrderSnapshot = (method = paymentMethod, customer = form, total = subtotal) => ({
    customer: { ...customer },
    date: new Date().toISOString(),
    items: cartItems.map((item) => ({ ...item })),
    orderNumber: "",
    paymentMethod: method,
    total,
  });

  const placeWhatsappOrder = async () => {
    if (!canSubmitOrder) return;

    const orderSnapshot = buildOrderSnapshot("whatsapp");
    setStripeError("");
    setWhatsappLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/whatsapp-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          items: cartItems.map(({ image, name, price, quantity, selectedSize }) => ({
            image,
            name,
            price,
            quantity,
            selectedSize,
          })),
          total: subtotal,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.order || !data.whatsappUrl) {
        throw new Error(data.error ?? "Unable to create WhatsApp order.");
      }

      const placedOrder = {
        ...orderSnapshot,
        ...data.order,
        customer: { ...form, ...data.order.customer },
        items: orderSnapshot.items,
        paymentMethod: "whatsapp",
        whatsappUrl: data.whatsappUrl,
      };

      setOrder(placedOrder);
      setWhatsappCheckoutUrl(data.whatsappUrl);
      window.localStorage.setItem(savedOrderKey, JSON.stringify(placedOrder));
      setReceiptStage("processing");
      clearCart();
    } catch (error) {
      console.error("WhatsApp order could not start:", error);
      setStripeError(
        error instanceof TypeError
          ? "Order via WhatsApp is temporarily unavailable. Please try again."
          : error.message ?? "Order via WhatsApp is temporarily unavailable. Please try again.",
      );
    } finally {
      setWhatsappLoading(false);
    }
  };

  const submitSelectedPayment = (event) => {
    event.preventDefault();
    if (!canSubmitOrder) return;

    if (paymentMethod === "stripe") {
      setOnlineDeliveryAddress((currentAddress) => currentAddress || form.address);
      setOnlineFulfillmentModalOpen(true);
      return;
    }

    placeWhatsappOrder();
  };

  const startStripeCheckout = async () => {
    if (!canSubmitOrder || stripeLoading) return;

    const onlineCustomer = getOnlineFulfillmentCustomer();
    const pendingOrder = buildOrderSnapshot("stripe", onlineCustomer, onlinePaymentTotal);
    setStripeError("");
    setStripeLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: onlineCustomer,
          items: cartItems.map(({ image, name, price, quantity, selectedSize }) => ({
            image,
            name,
            price,
            quantity,
            selectedSize,
          })),
          deliveryFee: onlineDeliveryFee,
          total: onlinePaymentTotal,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.url || !data.order) {
        console.error("Stripe checkout server error:", data.error);
        throw new Error("Online payment is temporarily unavailable. Please try again or choose Order via WhatsApp.");
      }

      window.localStorage.setItem(
        pendingStripeOrderKey,
        JSON.stringify({
          ...pendingOrder,
          ...data.order,
          customer: { ...onlineCustomer, ...data.order.customer },
          items: pendingOrder.items,
          paymentMethod: "stripe",
        }),
      );
      window.location.assign(data.url);
    } catch (error) {
      window.localStorage.removeItem(pendingStripeOrderKey);
      console.error("Stripe checkout could not start:", error);
      setStripeError(
        error instanceof TypeError
          ? "Online payment is temporarily unavailable. Please try again or choose Order via WhatsApp."
          : error.message ?? "Online payment is temporarily unavailable. Please try again or choose Order via WhatsApp.",
      );
      setStripeLoading(false);
    }
  };

  const confirmOnlineFulfillment = () => {
    if (!canConfirmOnlineFulfillment) return;
    setOnlineFulfillmentModalOpen(false);
    startStripeCheckout();
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

    const confirmStripeOrder = async () => {
      processedStripeReturnRef.current = true;
      clearCart();
      const sessionId = searchParams.get("session_id");
      let paidOrder = { ...order, paymentMethod: "stripe", status: "PAID_ONLINE" };

      if (sessionId) {
        try {
          const response = await fetch(`${apiBaseUrl}/api/stripe-orders/confirm`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          });
          const data = await response.json().catch(() => ({}));

          if (response.ok && data.order) {
            paidOrder = {
              ...paidOrder,
              ...data.order,
              customer: { ...paidOrder.customer, ...data.order.customer },
              items: paidOrder.items,
              paymentMethod: "stripe",
            };
          } else {
            console.error("Stripe order confirmation server error:", data.error);
          }
        } catch (error) {
          console.error("Stripe order confirmation could not complete:", error);
        }
      }

      window.localStorage.setItem(savedOrderKey, JSON.stringify(paidOrder));
      window.localStorage.removeItem(pendingStripeOrderKey);
      window.history.replaceState(null, "", "/checkout");
      setOrder(paidOrder);
    };

    confirmStripeOrder();
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
  const orderStatusTitle = order?.paymentMethod === "stripe" ? "Payment confirmed" : "Almost done";
  const orderStatusMessage =
    order?.paymentMethod === "stripe"
      ? "Your payment was successful. We'll contact you to validate your order."
      : "Kindly send your order details on WhatsApp so our team can validate payment, pickup or delivery, allergies and next steps.";
  const orderDateOnly = order
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
      }).format(new Date(order.date))
    : "";
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
      {onlineFulfillmentModalOpen ? (
        <div className="checkout-modal-backdrop" role="presentation">
          <div
            aria-labelledby="online-fulfillment-title"
            aria-modal="true"
            className="checkout-modal"
            role="dialog"
          >
            <div className="checkout-modal-header">
              <div>
                <span>Pay Online</span>
                <h2 id="online-fulfillment-title">Pickup or delivery?</h2>
              </div>
              <button
                aria-label="Close pickup or delivery modal"
                onClick={() => setOnlineFulfillmentModalOpen(false)}
                type="button"
              >
                <XIcon aria-hidden="true" size={20} />
              </button>
            </div>

            <div className="checkout-fulfillment-options">
              <button
                aria-pressed={onlineFulfillmentMethod === "pickup"}
                className={onlineFulfillmentMethod === "pickup" ? "is-selected" : ""}
                onClick={() => setOnlineFulfillmentMethod("pickup")}
                type="button"
              >
                <strong>Pickup</strong>
                <small>Pickup details will be sent after your order is confirmed.</small>
              </button>
              <button
                aria-pressed={onlineFulfillmentMethod === "delivery"}
                className={onlineFulfillmentMethod === "delivery" ? "is-selected" : ""}
                onClick={() => setOnlineFulfillmentMethod("delivery")}
                type="button"
              >
                <strong>Delivery</strong>
                <small>Delivery fee is added before payment.</small>
              </button>
            </div>

            {onlineFulfillmentMethod === "delivery" ? (
              <label className="checkout-modal-field">
                <span>Delivery address</span>
                <textarea
                  onChange={(event) => setOnlineDeliveryAddress(event.target.value)}
                  placeholder="Enter the delivery address"
                  rows="3"
                  value={onlineDeliveryAddress}
                />
              </label>
            ) : (
              <div className="checkout-modal-note">
                Pickup location will be emailed or sent to your WhatsApp after confirmation.
              </div>
            )}

            <div className="checkout-modal-totals">
              <div>
                <span>Food total</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{onlineDeliveryFee ? formatPrice(onlineDeliveryFee) : formatPrice(0)}</strong>
              </div>
              <div>
                <span>Total to pay</span>
                <strong>{formatPrice(onlinePaymentTotal)}</strong>
              </div>
            </div>

            <div className="checkout-modal-actions">
              <button
                className="checkout-modal-secondary"
                onClick={() => setOnlineFulfillmentModalOpen(false)}
                type="button"
              >
                Back
              </button>
              <button
                disabled={!canConfirmOnlineFulfillment || stripeLoading}
                onClick={confirmOnlineFulfillment}
                type="button"
              >
                {stripeLoading ? (
                  <span className="checkout-button-spinner" aria-hidden="true"></span>
                ) : null}
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <section className="checkout-section">
        <div className="container">
          {order ? (
            <div className="checkout-status">
              {order.paymentMethod === "whatsapp" ? (
                <div className="checkout-whatsapp-status">
                  <div className="checkout-whatsapp-hero">
                    <h1>Thanks and You're Awesome, {order.customer.firstName || "there"}!</h1>
                    <p>Kindly send your order details by clicking below button.</p>
                    {whatsappCheckoutUrl ? (
                      <a
                        className="checkout-status-whatsapp-link"
                        href={whatsappCheckoutUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <i className="fab fa-whatsapp" aria-hidden="true"></i>
                        Send Order Details
                      </a>
                    ) : null}
                  </div>

                  <dl className="checkout-whatsapp-meta">
                    <div>
                      <dt>Order Number:</dt>
                      <dd>{order.orderNumber}</dd>
                    </div>
                    <div>
                      <dt>Date:</dt>
                      <dd>{orderDateOnly}</dd>
                    </div>
                    <div>
                      <dt>Total:</dt>
                      <dd>{formatPrice(order.total)}</dd>
                    </div>
                    <div>
                      <dt>Payment Method:</dt>
                      <dd>WhatsApp Checkout</dd>
                    </div>
                  </dl>

                  <p className="checkout-whatsapp-note">Place order and pay via WhatsApp</p>

                  <h2>Order details</h2>
                  <table className="checkout-whatsapp-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => {
                        const itemPrice = parsePrice(item.price);
                        return (
                          <tr key={item.cartKey ?? item.slug}>
                            <td>
                              {item.name} {item.selectedSize ? `(${item.selectedSize}) ` : ""}x {item.quantity}
                            </td>
                            <td>{formatPrice(itemPrice * item.quantity)}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>Subtotal:</td>
                        <td>{formatPrice(order.total)}</td>
                      </tr>
                      <tr>
                        <td>Total:</td>
                        <td>{formatPrice(order.total)}</td>
                      </tr>
                      <tr>
                        <td>Payment method:</td>
                        <td>WhatsApp Checkout</td>
                      </tr>
                    </tbody>
                  </table>

                  <h2>Billing address</h2>
                  <address className="checkout-whatsapp-address">
                    <span>{orderCustomerName}</span>
                    <span>{order.customer.address}</span>
                    <span>{order.customer.country}</span>
                    <span>{order.customer.phone}</span>
                    <span>{order.customer.email}</span>
                  </address>
                </div>
              ) : (
                <>
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
                          {order.customer.deliveryFee ? (
                            <div>
                              <dt>Delivery</dt>
                              <dd>{formatPrice(order.customer.deliveryFee)}</dd>
                            </div>
                          ) : null}
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
                          {order.customer.fulfillmentMethod ? (
                            <div>
                              <dt>Fulfilment</dt>
                              <dd>{order.customer.fulfillmentMethod}</dd>
                            </div>
                          ) : null}
                          {order.customer.deliveryAddress ? (
                            <div>
                              <dt>Delivery</dt>
                              <dd>{order.customer.deliveryAddress}</dd>
                            </div>
                          ) : null}
                          {order.customer.orderNote?.trim() ? (
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
                    <Link className="checkout-status-menu-link" to="/menu">
                      Return to Menu
                    </Link>
                  </div>
                </>
              )}
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
                    <strong>Order via WhatsApp</strong>
                    <small>Send your order to our WhatsApp team</small>
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
                  <button disabled={!canSubmitOrder || stripeLoading || whatsappLoading} type="submit">
                    {stripeLoading || whatsappLoading ? (
                      <span className="checkout-button-spinner" aria-hidden="true"></span>
                    ) : null}
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
