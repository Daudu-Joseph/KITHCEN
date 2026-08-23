import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Cart from "./Cart";
import SearchBar from "./SearchBar";
import { useTemplateEffects } from "../hooks/useTemplateEffects";

export default function Layout() {
  const { pathname } = useLocation();
  useTemplateEffects();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <SearchBar />
      <Cart />
      <Outlet />
      <a
        href="#top"
        id="back-to-top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <i className="fa-solid fa-angles-up"></i>
      </a>
      <Footer />
    </>
  );
}
