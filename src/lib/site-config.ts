/**
 * Static, presentational site copy / contact details. UI-only — no secrets,
 * no backend.
 *
 * TODO(owner): WHATSAPP_NUMBER and PHONE are PLACEHOLDERS — replace with the
 * publisher's real numbers before pushing live.
 */

// International format, digits only (used to build wa.me links).
export const WHATSAPP_NUMBER = "919840000000"; // TODO: replace with real number

// Human-readable phone shown in the footer.
export const PHONE = "+91 98400 00000"; // TODO: replace with real number

export const EMAIL = "support@publishwithvaishu.in";

/** Build a wa.me link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
