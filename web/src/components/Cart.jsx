import { useUi } from "../context/UiContext";

const ITEMS = [
  {
    img: "/assets/images/product-2a.jpg",
    name: "The Cracker Barrel's Country Boy Breakfast",
    price: 25.0,
  },
  {
    img: "/assets/images/product-2b.jpg",
    name: "Old Timer's Meat Breakfast",
    price: 12.0,
  },
  {
    img: "/assets/images/product-2c.jpg",
    name: "Uncle Herschel's Favorite",
    price: 25.0,
  },
  {
    img: "/assets/images/product-2d.jpg",
    name: "Grandpa's Country Fried Breakfast",
    price: 30.0,
  },
];

export default function Cart() {
  const { cartOpen, closeCart } = useUi();

  return (
    <div className="shopping-cart" style={{ right: cartOpen ? "0" : "-100vw" }}>
      <div className="shopping-cart-header d-flex justify-content-between">
        <h2>Review your Cart</h2>
        <i className="fa fa-close" role="button" tabIndex={0} onClick={closeCart}></i>
      </div>
      <div className="shopping-cart-body">
        {ITEMS.map((item) => (
          <div
            className="row shopping-cart-item d-flex justify-content-between"
            key={item.name}
          >
            <div className="col-2 d-flex align-items-center">
              <img src={item.img} alt="" />
            </div>
            <div className="col-8">
              <h3>{item.name}</h3>
              <div className="shopping-cart-counter">
                <i className="fa fa-minus"></i>
                <span>1</span>
                <i className="fa fa-plus"></i>
              </div>
            </div>
            <div className="col-2 item-price d-flex align-items-end">
              <p className="mb-0 text-center">$ {item.price.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="shopping-cart-footer">
        <div className="d-flex justify-content-between px-3 py-2">
          <div>
            <h2 className="mb-0">Subtotal</h2>
            <p className="mb-0">Shipping & taxes calculated at checkout</p>
          </div>
          <div className="d-flex align-items-end">
            <p className="footet-total-price mb-0">$ 92.0</p>
          </div>
        </div>
        <div className="d-flex justify-content-between px-2">
          <div className="footer-checkout">
            <div className="anim-layer"></div>
            <a href="#">Checkout</a>
          </div>
          <div className="footer-shopping">
            <div className="anim-layer"></div>
            <a
              href="#continue"
              onClick={(e) => {
                e.preventDefault();
                closeCart();
              }}
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
