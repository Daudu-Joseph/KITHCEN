import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUi } from "../context/UiContext";

const parsePrice = (price) => {
  const match = price.match(/[\d,.]+/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
};

const formatPrice = (value) =>
  `£${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartOpen,
    closeCart,
    removeFromCart,
    updateCartQuantity,
  } = useUi();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [cartItems],
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="shopping-cart" style={{ right: cartOpen ? "0" : "-100vw" }}>
      <div className="shopping-cart-header">
        <h2>Your Cart</h2>
        <button type="button" aria-label="Close cart" onClick={closeCart}>
          <i className="fa fa-close"></i>
        </button>
      </div>

      <div className="shopping-cart-body">
        {cartItems.length === 0 ? (
          <div className="shopping-cart-empty">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div className="shopping-cart-item" key={item.slug}>
              <img src={item.image} alt={item.name} />

              <div className="shopping-cart-item-main">
                <h3>{item.name}</h3>
                <div className="shopping-cart-counter">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name}`}
                    onClick={() => updateCartQuantity(item.slug, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.name}`}
                    onClick={() => updateCartQuantity(item.slug, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="shopping-cart-item-side">
                <p>{formatPrice(parsePrice(item.price) * item.quantity)}</p>
                <button
                  className="shopping-cart-remove"
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeFromCart(item.slug)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="shopping-cart-footer">
        <button className="cart-promo-toggle" type="button">
          <span>Apply a promo code</span>
          <i className="fa fa-angle-up"></i>
        </button>

        <div className="cart-subtotal">
          <div>
            <h2>
              Subtotal - {itemCount} {itemCount === 1 ? "item" : "items"}
            </h2>
            <p>Shipping & taxes calculated at checkout.</p>
          </div>
          <p className="footet-total-price">{formatPrice(subtotal)}</p>
        </div>

        <button
          className="footer-checkout"
          type="button"
          disabled={cartItems.length === 0}
          onClick={() => {
            closeCart();
            navigate("/checkout");
          }}
        >
          <i className="fa fa-lock"></i>
          Checkout Now
        </button>
      </div>
    </aside>
  );
}
