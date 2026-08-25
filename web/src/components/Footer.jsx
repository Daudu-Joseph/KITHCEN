import { Link } from "react-router-dom";
import Logo from "./Logo";

const footerColumns = [
  {
    title: "Menu",
    links: [
      { label: "Menu", to: "/menu" },
      { label: "Reservations", to: "/reservation" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Gallery", to: "/" },
      { label: "Catering", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", to: "/contact" },
      { label: "Contact", to: "/contact" },
      { label: "Order Help", to: "/menu" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/contact" },
      { label: "Terms of Service", to: "/contact" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="fresh-footer">
      <section className="footer-cta">
        <img
          className="footer-cta-food footer-cta-food-left"
          src="/assets/images/menu-slider-dinner.png"
          alt=""
        />
        <img
          className="footer-cta-food footer-cta-food-right"
          src="/assets/images/hero-jollof-chicken-transparent.png"
          alt=""
        />
        <div className="footer-cta-lines" aria-hidden="true"></div>
        <div className="footer-cta-content">
          <h2>Hungry? We're Ready Come And Enjoy</h2>
          <p>
            Order your favorite meals now and enjoy bold Chop Republic flavour delivered fast to
            your doorstep.
          </p>
          <Link to="/menu">
            Order Now
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>
      </section>

      <section className="footer-main">
        <div className="footer-wave" aria-hidden="true"></div>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Logo variant="light" />
              <div className="footer-address">
                <h3>Address</h3>
                <p>
                  Subtle Innovative Services Ltd. T/A Chop Republic
                  <br />
                  Trading Address: 66 Paul Street, London - EC2A 4NA
                </p>
                <a href="tel:+447990532631">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                  +44 7990 532631
                </a>
              </div>
            </div>

            <nav className="footer-links" aria-label="Footer navigation">
              {footerColumns.map((column) => (
                <div className="footer-link-column" key={column.title}>
                  <h3>{column.title}</h3>
                  {column.links.map((link) => (
                    <Link key={link.label} to={link.to}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="footer-bottom">
        <div className="container">
          <p>&copy; {year} Chop Republic. All rights reserved.</p>
          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}
