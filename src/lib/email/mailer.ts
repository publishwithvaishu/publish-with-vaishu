import "server-only";
import { Resend } from "resend";

// Professional sender on the Publish With Vaishu domain. The domain must be
// verified in Resend (SPF/DKIM DNS records) for delivery to arbitrary
// recipients; override per-environment with RESEND_FROM if needed.
const FROM =
  process.env.RESEND_FROM ?? "Publish With Vaishu <noreply@publishwithvaishu.in>";

/**
 * Send a transactional email. If RESEND_API_KEY is not configured (e.g. local
 * dev), the email is logged to the server console instead of being sent — so
 * verification / reset flows remain testable without a Resend account.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `\n[email:dev] (RESEND_API_KEY not set — not actually sent)\n` +
        `  to:      ${params.to}\n` +
        `  subject: ${params.subject}\n` +
        `  body:\n${params.text}\n`,
    );
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
  if (error) throw new Error(`Email send failed: ${error.message}`);
}

const wrap = (heading: string, body: string, cta: { label: string; url: string }) => `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;color:#1d1d1f">
    <h1 style="font-size:20px;margin:0 0 16px">${heading}</h1>
    <p style="font-size:15px;line-height:1.6;color:#6e6e73;margin:0 0 24px">${body}</p>
    <a href="${cta.url}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;font-size:14px;font-weight:500;padding:12px 24px;border-radius:9999px">${cta.label}</a>
    <p style="font-size:12px;color:#6e6e73;margin:24px 0 0">If the button doesn't work, paste this link into your browser:<br>${cta.url}</p>
    <p style="font-size:12px;color:#6e6e73;margin:24px 0 0">— Publish With Vaishu</p>
  </div>`;

export function verifyEmailContent(url: string) {
  return {
    subject: "Verify your email — Publish With Vaishu",
    html: wrap(
      "Confirm your email",
      "Welcome to Publish With Vaishu. Please confirm your email address to finish setting up your account.",
      { label: "Verify email", url },
    ),
    text: `Confirm your email for Publish With Vaishu by opening this link:\n${url}`,
  };
}

export function resetPasswordContent(url: string) {
  return {
    subject: "Reset your password — Publish With Vaishu",
    html: wrap(
      "Reset your password",
      "We received a request to reset your password. This link expires in 60 minutes. If you didn't request it, you can ignore this email.",
      { label: "Reset password", url },
    ),
    text: `Reset your Publish With Vaishu password (link expires in 60 minutes):\n${url}`,
  };
}

export function orderConfirmationContent(params: {
  orderNumber: string;
  amount: string; // already-formatted, e.g. "₹369"
  orderUrl: string;
}) {
  return {
    subject: `Order ${params.orderNumber} confirmed — Publish With Vaishu`,
    html: wrap(
      "Thank you for your order!",
      `Your payment was successful and order <strong>${params.orderNumber}</strong> is confirmed. Amount paid: <strong>${params.amount}</strong>. We'll email you again when it ships.`,
      { label: "View your order", url: params.orderUrl },
    ),
    text: `Thank you! Payment received and order ${params.orderNumber} confirmed (paid ${params.amount}).\nView it here: ${params.orderUrl}`,
  };
}

/** Notifies the store owner whenever a customer places an order (COD or Razorpay). */
export function ownerOrderNotificationContent(params: {
  orderNumber: string;
  amount: string; // already-formatted, e.g. "₹369"
  paymentMethod: string; // "cod" | "razorpay"
  customerName: string;
  customerEmail: string | null;
  itemsSummary: string; // e.g. "2x Corporate Accounting, 1x Business Statistics"
  orderUrl: string;
}) {
  const methodLabel = params.paymentMethod === "razorpay" ? "Paid online (Razorpay)" : "Cash on delivery";
  return {
    subject: `New order ${params.orderNumber} — Publish With Vaishu`,
    html: wrap(
      "New order placed",
      `<strong>${params.orderNumber}</strong> — ${params.amount} (${methodLabel})<br>` +
        `Customer: ${params.customerName}${params.customerEmail ? ` (${params.customerEmail})` : ""}<br>` +
        `Items: ${params.itemsSummary}`,
      { label: "View order in admin", url: params.orderUrl },
    ),
    text:
      `New order ${params.orderNumber} — ${params.amount} (${methodLabel})\n` +
      `Customer: ${params.customerName}${params.customerEmail ? ` (${params.customerEmail})` : ""}\n` +
      `Items: ${params.itemsSummary}\n` +
      `View: ${params.orderUrl}`,
  };
}
