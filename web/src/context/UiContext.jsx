import { createContext, useContext, useMemo, useState } from "react";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const value = useMemo(
    () => ({
      cartOpen,
      searchOpen,
      mobileOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      openMobile: () => setMobileOpen(true),
      closeMobile: () => setMobileOpen(false),
    }),
    [cartOpen, searchOpen, mobileOpen]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
