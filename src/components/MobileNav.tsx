import Link from "next/link";
import { CartCountBadge } from "@/components/cart/CartCountBadge";

/**
 * Mobile bottom navigation (spec §4): Home, Categories, Cart, Account.
 * Hidden on md+ where the header serves navigation. ≥44px tap targets.
 */
const items = [
  { label: "Home", href: "/", icon: HomeIcon, badge: false },
  { label: "Categories", href: "/books", icon: GridIcon, badge: false },
  { label: "Cart", href: "/cart", icon: CartIcon, badge: true },
  { label: "Account", href: "/account", icon: UserIcon, badge: false },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-bg/90 backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ label, href, icon: Icon, badge }) => (
          <li key={label} className="flex-1">
            <Link
              href={href}
              className="flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted tap-target hover:text-ink"
            >
              <span className="relative">
                <Icon />
                {badge && <CartCountBadge />}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      {/* Safe-area spacer for devices with a home indicator. */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
    </svg>
  );
}
