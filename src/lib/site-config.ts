/**
 * Static, presentational site copy / contact details. UI-only — no secrets,
 * no backend.
 */

// International format, digits only (used to build wa.me links).
export const WHATSAPP_NUMBER = "918056112930";

// Human-readable phone shown in the footer.
export const PHONE = "+91 8056112930";

export const EMAIL = "publishwithvaishu2525@gmail.com";

// Publisher's LinkedIn — used by the floating social button next to WhatsApp.
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/ms-k-vaishnavi-m-sc-cs-m-sc-cfis-m-phil-cs-net-0aa0561b4";

/** Store owner's inbox for order-placed notifications (see Part C). */
export const OWNER_NOTIFICATION_EMAIL = "publishwithvaishu@gmail.com";

/** Build a wa.me link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
