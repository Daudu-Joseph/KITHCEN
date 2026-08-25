import { HouseIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ReceiptPrinter } from "../components/ReceiptPrinter";
import { TactileButton } from "../components/TactileButton";
import { useUi } from "../context/UiContext";

const parsePrice = (price) => {
  const match = price.match(/[\d,.]+/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
};

const formatPrice = (value) =>
  `£${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

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

const getSavedOrder = () => {
  try {
    const savedOrder = window.localStorage.getItem(savedOrderKey);
    return savedOrder ? JSON.parse(savedOrder) : null;
  } catch {
    return null;
  }
};

export default function CheckoutPage() {
  const { cartItems, clearCart, openCart } = useUi();
  const [form, setForm] = useState(initialForm);
  const [order, setOrder] = useState(() => getSavedOrder());
  const [receiptStage, setReceiptStage] = useState(() => (getSavedOrder() ? "complete" : "processing"));

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

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const placeOrder = (event) => {
    event.preventDefault();
    if (!canPlaceOrder) return;
    const placedOrder = {
      customer: { ...form },
      date: new Date().toISOString(),
      items: cartItems.map((item) => ({ ...item })),
      orderNumber: getOrderNumber(),
      total: subtotal,
    };

    setOrder(placedOrder);
    window.localStorage.setItem(savedOrderKey, JSON.stringify(placedOrder));
    setReceiptStage("processing");
    clearCart();
  };

  const downloadReceipt = () => {
    window.print();
  };

  const clearSavedOrder = () => {
    window.localStorage.removeItem(savedOrderKey);
  };

  useEffect(() => {
    if (!order) return undefined;

    const printingTimer = window.setTimeout(() => setReceiptStage("printing"), 650);
    const completeTimer = window.setTimeout(() => setReceiptStage("complete"), 2600);

    return () => {
      window.clearTimeout(printingTimer);
      window.clearTimeout(completeTimer);
    };
  }, [order]);

  const orderCustomerName = order
    ? `${order.customer.firstName} ${order.customer.lastName}`.trim()
    : "";
  const orderItemCount = order
    ? order.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const receiptScreenTitle =
    order && order.items.length === 1 ? order.items[0].name : "Chop Republic order";
  const receiptScreenSubtitle = `${orderItemCount} ${
    orderItemCount === 1 ? "item" : "items"
  } ready for payment`;

  return (
    <main className="checkout-page">
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
                          <div className="printed-receipt-item" key={item.slug}>
                            <div>
                              <strong>{item.name}</strong>
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
                <h1>Order placed</h1>
                <p>We'll contact you on WhatsApp to validate your order and make payment.</p>
              </div>

              <div className="checkout-status-actions">
                <button className="checkout-status-download" type="button" onClick={downloadReceipt}>
                  Download Receipt
                </button>
                <Link to="/menu" className="checkout-status-return" onClick={clearSavedOrder}>
                  Return to Menu
                </Link>
              </div>
            </div>
          ) : (
            <form className="checkout-layout" onSubmit={placeOrder}>
              <div className="checkout-form">
                <h2>Contact information</h2>
                <input
                  name="phone"
                  onChange={updateField}
                  placeholder="Phone number"
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
                <div className="checkout-payment">
                  <strong>WhatsApp Checkout</strong>
                  <span>Place order and pay via WhatsApp</span>
                </div>

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
                  By proceeding with your purchase you agree to our Terms and Conditions and Privacy
                  Policy
                </p>

                <div className="checkout-actions">
                  <button className="checkout-return-cart" type="button" onClick={openCart}>
                    <i className="fa fa-arrow-left"></i>
                    Return to Cart
                  </button>
                  <button disabled={!canPlaceOrder} type="submit">
                    Place Order
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
                      <div className="checkout-summary-item" key={item.slug}>
                        <div className="checkout-summary-image">
                          <img src={item.image} alt={item.name} />
                          <span>{item.quantity}</span>
                        </div>
                        <div>
                          <h3>{item.name}</h3>
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
