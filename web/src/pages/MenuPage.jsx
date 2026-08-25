import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { menuCategories, menuItemSlug } from "./menuData";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].name);
  const activeMenu = useMemo(
    () => menuCategories.find((category) => category.name === activeCategory) ?? menuCategories[0],
    [activeCategory],
  );

  return (
    <main className="menu-page">
      <section className="menu-hero">
        <div className="container">
          <div className="menu-hero-content" data-aos="fade-up">
            <h1>Order Now</h1>
            <p>
              Your favorite Nigerian meals, now just a few clicks away. Browse,
              customize, and enjoy - hot, fresh, and home-style.
            </p>
          </div>
          <div className="menu-hero-image" data-aos="fade-left">
            <img
              src="/assets/images/hero-jollof-chicken-transparent.png"
              alt="Jollof rice with grilled chicken, plantain, and coleslaw"
            />
          </div>
        </div>
      </section>

      <section className="menu-page-grid-section">
        <div className="container">
          <div className="menu-category-pills" data-aos="fade-up">
            {menuCategories.map((category) => (
              <button
                className={`menu-category-pill${category.name === activeCategory ? " active" : ""}`}
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="menu-card-grid" data-aos="fade-up">
            {activeMenu.items.map((item) => (
              <Link
                className="menu-grid-card"
                key={item.name}
                to={`/menu/${menuItemSlug(item.name)}`}
                aria-label={`View ${item.name}`}
              >
                <img src={item.image ?? activeMenu.image} alt={item.name} />
                <div className="menu-grid-card-body">
                  <div className="menu-grid-card-title">
                    <h2>{item.name}</h2>
                    <span>{item.price}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
