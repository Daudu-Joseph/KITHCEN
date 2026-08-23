import { Link } from "react-router-dom";

export default function Logo({ variant = "light", compact = false }) {
  const src =
    variant === "dark"
      ? "/assets/brand/logo-dark.png"
      : "/assets/brand/logo-mark.png";

  return (
    <Link
      to="/"
      className={`brand-logo brand-logo-${variant}${compact ? " is-compact" : ""}`}
    >
      <img className="brand-mark" src={src} alt="Chop Republic" />
      <span className="brand-logo-text">
        <span>Chop</span>
        <span>Republic</span>
      </span>
    </Link>
  );
}
