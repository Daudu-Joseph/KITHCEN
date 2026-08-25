import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useUi } from "../context/UiContext";
import { menuCategories, menuItemSlug } from "./menuData";

const allMenuItems = menuCategories.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    category: category.name,
    image: item.image ?? category.image,
    slug: menuItemSlug(item.name),
  })),
);

export default function MenuItemPage() {
  const { itemSlug } = useParams();
  const { addToCart } = useUi();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const item = useMemo(
    () => allMenuItems.find((menuItem) => menuItem.slug === itemSlug),
    [itemSlug],
  );

  if (!item) return <Navigate to="/menu" replace />;

  const relatedItems = allMenuItems
    .filter((menuItem) => menuItem.category === item.category && menuItem.slug !== item.slug)
    .slice(0, 4);

  return (
    <main className="menu-item-page">
      <section className="menu-item-detail">
        <div className="container">
          <Link className="menu-item-back" to="/menu">
            <i className="fa fa-arrow-left"></i>
            Back to menu
          </Link>

          <div className="menu-item-layout">
            <div className="menu-item-image">
              <img src={item.image} alt={item.name} />
              <button type="button" aria-label={`Preview ${item.name}`}>
                <i className="fa fa-search"></i>
              </button>
            </div>

            <div className="menu-item-info">
              <h1>{item.name}</h1>
              <p className="menu-item-price">{item.price}</p>
              <p className="menu-item-description">{item.description}</p>

              <div className="menu-item-actions">
                <div className="menu-item-quantity" aria-label="Quantity">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((value) => value + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="menu-item-cart-button"
                  type="button"
                  onClick={() => {
                    addToCart(item, quantity);
                    setAdded(true);
                  }}
                >
                  {added ? "Added" : "Add to cart"}
                </button>
              </div>

              <p className="menu-item-category">
                <span>Categories</span> Food, {item.category}
              </p>
            </div>
          </div>

          <div className="menu-item-related">
            <p>Additional information</p>
            <h2>Order more related meals</h2>
            <div className="menu-related-grid">
              {relatedItems.map((related) => (
                <Link
                  className="menu-related-card"
                  key={related.slug}
                  to={`/menu/${related.slug}`}
                >
                  <img src={related.image} alt={related.name} />
                  <span>{related.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
