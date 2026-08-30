import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
            <div className="shopping-cart-item" key={item.cartKey ?? item.slug}>
              <img src={item.image} alt={item.name} />

              <div className="shopping-cart-item-main">
                <h3>{item.name}</h3>
                {item.selectedSize ? (
                  <p className="shopping-cart-item-size">{item.selectedSize}</p>
                ) : null}
                <div className="shopping-cart-counter">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name}`}
                    onClick={() => updateCartQuantity(item.cartKey ?? item.slug, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.name}`}
                    onClick={() => updateCartQuantity(item.cartKey ?? item.slug, item.quantity + 1)}
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
                  onClick={() => removeFromCart(item.cartKey ?? item.slug)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="shopping-cart-footer">
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
          <span>Checkout Now</span>
        </button>
      </div>
    </aside>
  );
}
