/**
 * Static, presentational site copy / contact details. UI-only — no secrets,
 * no backend.
 *
 * TODO(owner): PHONE is still a placeholder — replace with the publisher's
 * real number before pushing live.
 */

// International format, digits only (used to build wa.me links).
export const WHATSAPP_NUMBER = "918056112930";

// Human-readable phone shown in the footer.
export const PHONE = "+91 98400 00000"; // TODO: replace with real number

export const EMAIL = "publishwithvaishu@gmail.com";

/** Store owner's inbox for order-placed notifications (see Part C). */
export const OWNER_NOTIFICATION_EMAIL = "publishwithvaishu@gmail.com";

/** Build a wa.me link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
