import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import PremiumGridBackground from "./PremiumGridBackground";
import { menuCategories, menuItemSlug } from "../pages/menuData";

const specials = menuCategories.find((category) => category.name === "Specials")?.items ?? [];

const offerCutouts = {
  Ayamase: "/assets/images/special-offers/ayamase-alpha.png",
  "Yam Porridge": "/assets/images/special-offers/yam-porridge-alpha.png",
  "Grilled Tilapia": "/assets/images/special-offers/tilapia-alpha.png",
};

const selectedOffers = [
  {
    itemName: "Ayamase",
    kicker: "Chef's Selection",
    headline: "Freshly Prepared. Served At Its Best.",
    theme: "gold",
    size: "small",
  },
  {
    itemName: "Yam Porridge",
    kicker: "House Special",
    headline: "Soft, Savoury & Deeply Comforting.",
    theme: "red",
    size: "small",
  },
  {
    itemName: "Grilled Tilapia",
    kicker: "Signature Special",
    headline: "Smoky, Spiced & Grilled To Order.",
    theme: "green",
    size: "large",
  },
]
  .map((offer) => ({
    ...offer,
    item: specials.find((item) => item.name === offer.itemName),
  }))
  .map((offer) => ({
    ...offer,
    cutout: offer.item ? offerCutouts[offer.item.name] ?? offer.item.image : null,
  }))
  .filter((offer) => offer.item);

const sectionStyle = {
  background: "#fff",
  padding: "86px 0 94px",
};

const labelStyle = {
  color: "#0b0b12",
  fontFamily: '"Heebo", sans-serif',
  fontSize: "15px",
  fontWeight: 700,
  marginBottom: "16px",
};

const dotStyle = {
  background: "#b90012",
  borderRadius: "50%",
  display: "inline-block",
  height: "7px",
  marginRight: "10px",
  width: "7px",
};

const titleStyle = {
  color: "#0b0b12",
  fontFamily: '"Archivo Black", "Heebo", sans-serif',
  fontSize: "clamp(28px, 3vw, 40px)",
  letterSpacing: "0",
  lineHeight: 0.95,
  margin: "0 auto",
  maxWidth: "760px",
  textTransform: "uppercase",
};

const introStyle = {
  color: "#232936",
  fontFamily: '"Heebo", sans-serif',
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: 1.55,
  margin: "24px auto 58px",
  maxWidth: "760px",
};

const gridStyle = {
  margin: "0 auto",
  maxWidth: "1100px",
};

const themes = {
  gold: {
    base: "#f7a400",
    overlay: "linear-gradient(135deg, rgba(255, 220, 0, 0.95), rgba(239, 88, 0, 0.94))",
    text: "#fff",
    pattern: "rgba(255,255,255,0.23)",
    badge: "#fff0be",
    badgeText: "#5d3925",
    buttonText: "#6b3a22",
  },
  red: {
    base: "#b60012",
    overlay: "linear-gradient(135deg, rgba(183, 0, 18, 0.95), rgba(227, 37, 37, 0.9))",
    text: "#fff",
    pattern: "rgba(255,255,255,0.14)",
    badge: "#ff9f1c",
    badgeText: "#fff",
    buttonText: "#6b241f",
  },
  green: {
    base: "#075944",
    overlay: "linear-gradient(135deg, rgba(5, 83, 64, 0.98), rgba(6, 92, 70, 0.94))",
    text: "#fff",
    pattern: "rgba(255,255,255,0.08)",
    badge: "#fff",
    badgeText: "#806153",
    buttonText: "#6b3a22",
  },
};

const priceText = (price) => price.replace(/Â£/g, "£");

function PriceBadge({ price, large, theme }) {
  return (
    <motion.div
      style={{
        alignItems: "center",
        background: theme.badge,
        boxShadow: "0 14px 24px rgba(35, 18, 8, 0.16)",
        clipPath:
          "polygon(50% 0%, 58% 9%, 70% 4%, 75% 17%, 88% 15%, 87% 30%, 100% 38%, 91% 50%, 100% 62%, 87% 70%, 88% 85%, 75% 83%, 70% 96%, 58% 91%, 50% 100%, 42% 91%, 30% 96%, 25% 83%, 12% 85%, 13% 70%, 0% 62%, 9% 50%, 0% 38%, 13% 30%, 12% 15%, 25% 17%, 30% 4%, 42% 9%)",
        color: theme.badgeText,
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Heebo", sans-serif',
        fontSize: large ? "15px" : "13px",
        fontWeight: 800,
        height: large ? "126px" : "104px",
        justifyContent: "center",
        lineHeight: 1.1,
        position: "absolute",
        right: large ? "58px" : "118px",
        textAlign: "center",
        top: large ? "178px" : "66px",
        width: large ? "126px" : "104px",
        zIndex: 4,
      }}
      animate={{ rotate: [0, -3, 3, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <span>Price</span>
      <strong style={{ fontSize: large ? "20px" : "17px", marginTop: "7px" }}>
        {priceText(price)}
      </strong>
    </motion.div>
  );
}

function OfferCard({ offer, index }) {
  const reduceMotion = useReducedMotion();
  const theme = themes[offer.theme];
  const isLarge = offer.size === "large";
  const cardHeight = isLarge ? "580px" : "270px";

  return (
    <motion.article
      initial={{
        opacity: 0,
        x: reduceMotion ? 0 : isLarge ? 46 : -46,
        y: reduceMotion ? 0 : 24,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={reduceMotion ? undefined : { y: -8, scale: 1.012 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: theme.base,
        borderRadius: "18px",
        boxShadow: "0 24px 45px rgba(49, 24, 14, 0.12)",
        color: theme.text,
        height: cardHeight,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          background: theme.overlay,
          inset: 0,
          position: "absolute",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(${theme.pattern} 2px, transparent 2px)`,
          backgroundSize: "15px 15px",
          inset: 0,
          opacity: offer.theme === "green" ? 0.45 : 0.85,
          position: "absolute",
        }}
      />
      <img
        aria-hidden="true"
        src={offer.cutout}
        alt=""
        style={{
          filter: offer.theme === "green" ? "saturate(0.85) brightness(0.7)" : "saturate(0.9)",
          height: isLarge ? "360px" : "230px",
          objectFit: "contain",
          opacity: offer.theme === "green" ? 0.18 : 0.24,
          position: "absolute",
          right: isLarge ? "-62px" : "-56px",
          top: isLarge ? "18px" : "-42px",
          transform: "rotate(-18deg)",
          width: isLarge ? "360px" : "260px",
          zIndex: 1,
        }}
      />
      <div
        style={{
          left: isLarge ? "34px" : "26px",
          maxWidth: isLarge ? "360px" : "260px",
          position: "absolute",
          top: isLarge ? "34px" : "28px",
          zIndex: 3,
        }}
      >
        <p
          style={{
            fontFamily: '"Heebo", sans-serif',
            fontSize: "16px",
            fontWeight: 800,
            margin: "0 0 14px",
            color: theme.text,
          }}
        >
          {offer.kicker}
        </p>
        <h3
          style={{
            fontFamily: '"Archivo Black", "Heebo", sans-serif',
            fontSize: isLarge ? "28px" : "24px",
            letterSpacing: "0",
            lineHeight: 1.06,
            margin: 0,
            maxWidth: isLarge ? "330px" : "260px",
            textTransform: "uppercase",
            color: theme.text,
          }}
        >
          {offer.headline}
        </h3>
      </div>

      <motion.img
        src={offer.cutout}
        alt={offer.item.name}
        style={{
          bottom: isLarge ? "78px" : "-30px",
          filter: "contrast(1.04) saturate(1.08) drop-shadow(0 18px 24px rgba(0,0,0,0.18))",
          height: isLarge ? "360px" : "248px",
          objectFit: "contain",
          position: "absolute",
          right: isLarge ? "18px" : "-42px",
          width: isLarge ? "420px" : "350px",
          zIndex: 2,
        }}
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <PriceBadge price={offer.item.price} large={isLarge} theme={theme} />

      <div
        className="book-a-table menu-leaf-button"
        style={{
          background: "#fff",
          bottom: isLarge ? "32px" : "22px",
          left: isLarge ? "auto" : "26px",
          margin: 0,
          position: "absolute",
          right: isLarge ? "26px" : "auto",
          width: "150px",
          zIndex: 5,
        }}
      >
        <div className="anim-layer" style={{ backgroundColor: "#cf0612" }}></div>
        <Link
          to={`/menu/${menuItemSlug(offer.item.name)}`}
          style={{
            color: theme.buttonText,
            fontSize: "14px",
            gap: "10px",
            height: "48px",
            padding: "0 18px",
            textTransform: "none",
          }}
        >
          Order Now <i className="fa fa-fire" aria-hidden="true" style={{ color: "#ff2b1f" }}></i>
        </Link>
      </div>
    </motion.article>
  );
}

export default function HomeSpecialOffers() {
  const reduceMotion = useReducedMotion();

  if (selectedOffers.length < 3) {
    return null;
  }

  return (
    <section className="premium-grid-section" style={sectionStyle}>
      <PremiumGridBackground />
      <div className="container">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.5 }}
        >
          <p style={labelStyle}>
            <span style={dotStyle}></span>
            Special Offers
          </p>
          <h2 style={titleStyle}>Delicious Deals You Can't Miss</h2>
          <p style={introStyle}>
            Enjoy Chop Republic favourites at clear prices, freshly prepared and
            full of flavour for family meals, parties, and proper cravings.
          </p>
        </motion.div>

        <div style={gridStyle}>
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-4">
                <OfferCard offer={selectedOffers[0]} index={0} />
                <OfferCard offer={selectedOffers[1]} index={1} />
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <OfferCard offer={selectedOffers[2]} index={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
