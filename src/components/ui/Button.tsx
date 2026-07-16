import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant =
  | "primary"
  | "outline"
  | "secondary"
  | "danger"
  | "success";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "tap-target transition-all duration-200 active:scale-[0.99] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

// Dark luxury palette — gold is the primary action colour sitewide.
const variants: Record<Variant, string> = {
  primary: "btn-gold",
  secondary:
    "glass-dark text-ink hover:border-[#e8b647]/40 hover:-translate-y-px",
  outline:
    "border border-[#e8b647]/50 text-gold bg-transparent hover:bg-[#e8b647]/10 hover:-translate-y-px",
  danger:
    "border border-red-400/40 bg-red-500/15 text-red-300 hover:bg-red-500/25",
  success:
    "border border-emerald-400/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    href,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
