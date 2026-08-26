import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUi } from "../context/UiContext";
import Logo from "./Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/reservation", label: "Reservation" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { cartItems, openSearch, openCart, mobileOpen, openMobile, closeMobile } = useUi();
  const [scrolled, setScrolled] = useState(false);
  const onDarkBar = isHome || scrolled;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  const iconClass = onDarkBar ? "" : "text-dark";
  const linkClass = onDarkBar
    ? "text-decoration-none text-uppercase p-4"
    : "text-decoration-none text-uppercase p-4 text-dark";
  const barsClass = onDarkBar
    ? "fa fa-2x fa-bars me-3 text-white"
    : "fa fa-2x fa-bars me-3 text-dark";

  return (
    <header className={`${!isHome && !scrolled ? "bg-white" : ""} ${scrolled ? "scrolled" : ""}`.trim()}>
      <div
        className={`container header d-none d-lg-flex ${scrolled ? "my-2" : "my-3"}`}
      >
        <div className="logo">
          <Logo variant={onDarkBar ? "light" : "dark"} />
        </div>
        <div className="menus">
          <ul className="d-flex mb-0">
            {NAV.map((item) => (
              <li className="list-unstyled py-2" key={item.to}>
                <Link className={linkClass} to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="icons">
          <a
            className="text-decoration-none"
            href="#search"
            onClick={(e) => {
              e.preventDefault();
              openSearch();
            }}
          >
            <i className={`fa fa-search me-3 ${iconClass}`.trim()}></i>
          </a>
          <a
            className="cart-nav-link text-decoration-none"
            href="#cart"
            onClick={(e) => {
              e.preventDefault();
              openCart();
            }}
          >
            <i className={`fa fa-shopping-bag me-3 ${iconClass}`.trim()}></i>
            {cartCount > 0 && <span className="cart-nav-count">{cartCount}</span>}
          </a>
        </div>
      </div>

      <div className="mobile-header d-flex justify-content-around py-3 align-items-center d-lg-none">
        <div
          id="hamburger"
          role="button"
          tabIndex={0}
          onClick={openMobile}
          onKeyDown={(e) => {
            if (e.key === "Enter") openMobile();
          }}
        >
          <i className={barsClass}></i>
        </div>
        <div className="mobile-nav-logo">
          <div className="logo">
            <Logo variant={onDarkBar ? "light" : "dark"} compact />
          </div>
        </div>
        <div className="mobile-nav-icons">
          <div className="icons">
            <a
              className="text-decoration-none"
              href="#search"
              onClick={(e) => {
                e.preventDefault();
                openSearch();
              }}
            >
              <i className={`fa fa-search me-3 ${iconClass}`.trim()}></i>
            </a>
            <a
              className="cart-nav-link text-decoration-none"
              href="#cart"
              onClick={(e) => {
                e.preventDefault();
                openCart();
              }}
            >
              <i className={`fa fa-shopping-bag me-3 ${iconClass}`.trim()}></i>
              {cartCount > 0 && <span className="cart-nav-count">{cartCount}</span>}
            </a>
          </div>
        </div>
        <div
          className="mobile-menu-panel position-fixed w-75 bg-white h-100 top-0 start-0"
          id="mobile-menu"
          style={{ transform: mobileOpen ? "translateX(0%)" : "translateX(-100%)" }}
        >
          <div
            id="hamburger-cross"
            className="d-flex justify-content-end align-items-center py-2"
            role="button"
            tabIndex={0}
            onClick={closeMobile}
            onKeyDown={(e) => {
              if (e.key === "Enter") closeMobile();
            }}
          >
            <i className="fa fa-2x fa-plus me-3 "></i>
          </div>
          <div className="menus">
            <ul className="d-flex flex-column ps-2 mb-0 mt-4">
              {NAV.map((item) => (
                <li className="list-unstyled py-2" key={item.to}>
                  <Link
                    className="text-dark text-decoration-none text-uppercase p-4"
                    to={item.to}
                    onClick={closeMobile}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
