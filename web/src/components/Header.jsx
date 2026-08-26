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
  }, [pathname]);

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
        <button
          className="mobile-menu-toggle"
          id="hamburger"
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={openMobile}
        >
          <i className={barsClass}></i>
        </button>
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
        <div className={`mobile-menu-overlay ${mobileOpen ? "is-open" : ""}`} id="mobile-menu">
          <div className="mobile-menu-backdrop" aria-hidden="true"></div>
          <div className="mobile-menu-content">
            <div className="mobile-menu-top">
              <Logo variant="light" compact />
              <button
                className="mobile-menu-close"
                id="hamburger-cross"
                type="button"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                <i className="fa fa-close"></i>
              </button>
            </div>
            <nav className="mobile-overlay-nav" aria-label="Mobile navigation">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} onClick={closeMobile}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-contact">
              <span>Get In Touch</span>
              <a href="mailto:choprepublic@subtleinnovsvcs.org">
                choprepublic@subtleinnovsvcs.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
