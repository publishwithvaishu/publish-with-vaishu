/**
 * Opts the entire /admin/* subtree back out of the sitewide warm theme
 * (see .theme-admin in globals.css) — the admin dashboard is an internal
 * tool, not a customer-facing page, so it keeps its original light SaaS
 * look regardless of the theme applied at the body level.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="theme-admin min-h-full">{children}</div>;
}
