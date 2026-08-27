import { createContext, useContext, useEffect, useMemo, useState } from "react";

const UiContext = createContext(null);
const CART_STORAGE_KEY = "chop-republic-cart";

const getInitialCartItems = () => {
  if (typeof window === "undefined") return [];

  try {
    const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
};

export function UiProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartItems, setCartItems] = useState(getInitialCartItems);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    setCartItems((items) => {
      const itemKey = item.cartKey ?? item.slug;
      const existingItem = items.find((cartItem) => (cartItem.cartKey ?? cartItem.slug) === itemKey);

      if (existingItem) {
        return items.map((cartItem) =>
          (cartItem.cartKey ?? cartItem.slug) === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        );
      }

      return [...items, { ...item, quantity }];
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (cartKey, quantity) => {
    setCartItems((items) =>
      items.map((item) =>
        (item.cartKey ?? item.slug) === cartKey
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  };

  const removeFromCart = (cartKey) => {
    setCartItems((items) => items.filter((item) => (item.cartKey ?? item.slug) !== cartKey));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartOpen(false);
  };

  const value = useMemo(
    () => ({
      cartOpen,
      cartItems,
      searchOpen,
      mobileOpen,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      openMobile: () => setMobileOpen(true),
      closeMobile: () => setMobileOpen(false),
    }),
    [cartOpen, cartItems, searchOpen, mobileOpen]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
