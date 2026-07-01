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
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "tap-target transition-all duration-200 active:scale-[0.99] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white card-soft hover:bg-indigo-700 hover:shadow-md",
  secondary:
    "bg-bg text-ink border border-hairline card-soft hover:bg-bg-secondary",
  outline:
    "border border-hairline text-ink bg-transparent hover:bg-bg-secondary hover:border-ink/20",
  danger: "bg-red-600 text-white card-soft hover:bg-red-700",
  success: "bg-emerald-600 text-white card-soft hover:bg-emerald-700",
};

const sizes: Record<Size, string> = {
  md: "px-5 text-sm",
  lg: "px-7 text-base",
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
