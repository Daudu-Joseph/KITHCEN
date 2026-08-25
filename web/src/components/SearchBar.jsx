import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUi } from "../context/UiContext";
import { menuCategories, menuItemSlug } from "../pages/menuData";

const menuItems = menuCategories.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    category: category.name,
    image: item.image ?? category.image,
    slug: menuItemSlug(item.name),
  })),
);

export default function SearchBar() {
  const { searchOpen, closeSearch } = useUi();
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!trimmedQuery) return [];

    return menuItems.filter((item) => {
      const searchableText = `${item.name} ${item.category} ${item.description}`.toLowerCase();
      return searchableText.includes(trimmedQuery);
    });
  }, [trimmedQuery]);

  const suggestions = results.length > 0 ? results : menuItems.slice(0, 6);

  const closeAndReset = () => {
    closeSearch();
    setQuery("");
  };

  return (
    <div className={`search-bar ${searchOpen ? "show" : "d-none"}`} id="search-container">
      <div className="close-btn" id="search-close-btn" onClick={closeAndReset} role="button" tabIndex={0}>
        <i className="fa fa-close"></i>
      </div>
      <div className="search-panel">
        <div className="search-bar-wrapper">
          <input
            autoFocus={searchOpen}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search our menu..."
            type="search"
            value={query}
          />
          <button className="search-button" type="button" aria-label="Search menu">
            <i className="fa fa-search"></i>
          </button>
        </div>

        {trimmedQuery && results.length === 0 ? (
          <div className="search-empty">
            <h2>Sorry, we don't have that.</h2>
            <p>Try one of these foods from our menu instead.</p>
          </div>
        ) : null}

        {!trimmedQuery ? (
          <p className="search-hint">Type a food name, soup, rice dish, side, pastry, or protein.</p>
        ) : null}

        <div className="search-results">
          {suggestions.map((item) => (
            <Link
              className="search-result-card"
              key={item.slug}
              onClick={closeAndReset}
              to={`/menu/${item.slug}`}
            >
              <img src={item.image} alt="" />
              <div>
                <span>{item.category}</span>
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
