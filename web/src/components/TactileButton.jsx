import { Link } from "react-router-dom";
import { cn } from "../helpers/classname-helper";

export function TactileButton({ children, className, depth = "default", href, size = "md", ...props }) {
  const classes = cn("tactile-button", `tactile-button-${size}`, `tactile-button-${depth}`, className);

  if (href) {
    return (
      <Link className={classes} to={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
