import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useUi } from "../context/UiContext";
import { menuCategories, menuItemSlug } from "./menuData";

const dropdownVariants = {
  open: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    scaleY: 0,
    transition: {
      duration: 0.14,
      ease: [0.4, 0, 1, 1],
      staggerChildren: 0.04,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const dropdownItemVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -10 },
};

const dropdownIconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

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

  return <MenuItemDetail key={itemSlug} itemSlug={itemSlug} />;
}

function MenuItemDetail({ itemSlug }) {
  const { addToCart } = useUi();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const item = useMemo(
    () => allMenuItems.find((menuItem) => menuItem.slug === itemSlug),
    [itemSlug],
  );

  if (!item) return <Navigate to="/menu" replace />;

  const sizeOptions = item.sizes?.length
    ? item.sizes
    : [{ label: "Item", price: item.price, value: 0 }];
  const selectedSize = sizeOptions[selectedSizeIndex] ?? sizeOptions[0];
  const selectedSizeSlug = menuItemSlug(selectedSize.label);
  const hasSizeDropdown = sizeOptions.length > 1;

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
              <p className="menu-item-price">{selectedSize.price}</p>
              <p className="menu-item-description">{item.description}</p>

              {item.allergens ? (
                <div className="menu-item-allergens">
                  <span>Allergens</span>
                  {item.allergens.length ? (
                    <ul>
                      {item.allergens.map((allergen) => (
                        <li key={allergen}>{allergen}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No listed allergens</p>
                  )}
                </div>
              ) : null}

              {hasSizeDropdown ? (
                <SizeDropdown
                  itemName={item.name}
                  onChange={(index) => {
                    setSelectedSizeIndex(index);
                    setAdded(false);
                  }}
                  options={sizeOptions}
                  selectedIndex={selectedSizeIndex}
                />
              ) : null}

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
                    addToCart(
                      {
                        ...item,
                        cartKey: `${item.slug}-${selectedSizeSlug}`,
                        price: selectedSize.price,
                        selectedSize: selectedSize.label,
                        selectedSizePrice: selectedSize.price,
                      },
                      quantity,
                    );
                    setAdded(true);
                  }}
                >
                  {added ? "Added" : `Add ${selectedSize.price}`}
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

function SizeDropdown({ itemName, onChange, options, selectedIndex }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="menu-item-size" ref={dropdownRef}>
      <span>Size</span>
      <motion.div animate={open ? "open" : "closed"} className="menu-item-size-dropdown">
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`Choose size for ${itemName}`}
          className="menu-item-size-trigger"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span>{selectedOption.label}</span>
          <strong>{selectedOption.price}</strong>
          <motion.i aria-hidden="true" variants={dropdownIconVariants}>
            <CaretDownIcon size={18} weight="bold" />
          </motion.i>
        </button>

        <AnimatePresence>
          {open ? (
            <motion.ul
              className="menu-item-size-menu"
              exit="closed"
              initial="closed"
              role="listbox"
              style={{ originY: "top" }}
              variants={dropdownVariants}
            >
              {options.map((option, index) => {
                const selected = index === selectedIndex;

                return (
                  <motion.li key={`${option.label}-${option.price}`} variants={dropdownItemVariants}>
                    <button
                      aria-selected={selected}
                      className="menu-item-size-option"
                      onClick={() => {
                        onChange(index);
                        setOpen(false);
                      }}
                      role="option"
                      type="button"
                    >
                      <span>{option.label}</span>
                      <strong>{option.price}</strong>
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
