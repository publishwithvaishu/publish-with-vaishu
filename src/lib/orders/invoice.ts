import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { OrderWithDetails } from "@/lib/orders/types";

// StandardFonts (WinAnsi) lack the ₹ glyph, so the PDF uses "Rs.".
const money = (n: number) =>
  "Rs. " +
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export async function buildInvoicePdf({
  order,
  items,
}: OrderWithDetails): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const ink = rgb(0.11, 0.11, 0.12);
  const muted = rgb(0.43, 0.43, 0.45);
  const line = rgb(0.91, 0.91, 0.9);
  const M = 50;
  const W = 595.28;
  let y = 800;

  type Opt = { f?: PDFFont; size?: number; color?: ReturnType<typeof rgb> };
  const text = (s: string, x: number, yy: number, o: Opt = {}) =>
    page.drawText(s, {
      x,
      y: yy,
      size: o.size ?? 10,
      font: o.f ?? font,
      color: o.color ?? ink,
    });
  const right = (s: string, xr: number, yy: number, o: Opt = {}) => {
    const f = o.f ?? font;
    const w = f.widthOfTextAtSize(s, o.size ?? 10);
    text(s, xr - w, yy, o);
  };
  const hr = (yy: number, x1 = M, x2 = W - M) =>
    page.drawLine({
      start: { x: x1, y: yy },
      end: { x: x2, y: yy },
      thickness: 1,
      color: line,
    });

  // Header
  text("Publish With Vaishu", M, y, { f: bold, size: 18 });
  right("TAX INVOICE", W - M, y, { f: bold, size: 14, color: muted });
  y -= 16;
  text("Academic book publishing · Chennai, India", M, y, {
    size: 9,
    color: muted,
  });
  y -= 24;
  hr(y);
  y -= 24;

  // Meta
  text("Order", M, y, { size: 9, color: muted });
  right("Order date", W - M, y, { size: 9, color: muted });
  y -= 14;
  text(order.order_number, M, y, { f: bold, size: 11 });
  right(
    new Date(order.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    W - M,
    y,
    { size: 11 },
  );
  y -= 30;

  // Ship to
  const a = order.shipping_address;
  if (a) {
    text("Ship to", M, y, { size: 9, color: muted });
    y -= 14;
    text(a.full_name, M, y, { f: bold, size: 10 });
    y -= 13;
    text(`${a.address}, ${a.city}`, M, y, { size: 10, color: muted });
    y -= 13;
    text(`${a.state} - ${a.pincode}`, M, y, { size: 10, color: muted });
    y -= 13;
    if (a.mobile) {
      text(a.mobile, M, y, { size: 10, color: muted });
      y -= 13;
    }
    y -= 12;
  }

  // Items table
  hr(y);
  y -= 16;
  text("Item", M, y, { f: bold, size: 9, color: muted });
  right("Qty", 360, y, { f: bold, size: 9, color: muted });
  right("Price", 460, y, { f: bold, size: 9, color: muted });
  right("Amount", W - M, y, { f: bold, size: 9, color: muted });
  y -= 8;
  hr(y);
  y -= 18;

  for (const it of items) {
    const title =
      it.title_snapshot.length > 46
        ? it.title_snapshot.slice(0, 45) + "..."
        : it.title_snapshot;
    text(title, M, y, { size: 10 });
    right(String(it.quantity), 360, y, { size: 10 });
    right(money(it.price_snapshot), 460, y, { size: 10 });
    right(money(it.price_snapshot * it.quantity), W - M, y, { size: 10 });
    y -= 20;
  }
  y -= 2;
  hr(y);
  y -= 20;

  const totalRow = (label: string, val: string, strong = false) => {
    const o: Opt = strong
      ? { f: bold, size: 11 }
      : { size: 10, color: muted };
    right(label, 460, y, o);
    right(val, W - M, y, strong ? { f: bold, size: 11 } : { size: 10 });
    y -= 18;
  };
  totalRow("Subtotal", money(order.subtotal));
  totalRow(
    "Delivery",
    order.shipping_charge === 0 ? "Free" : money(order.shipping_charge),
  );
  totalRow("Tax (GST)", money(order.tax_amount));
  hr(y + 8, 360);
  totalRow("Total", money(order.grand_total), true);
  y -= 16;

  text(
    `Payment: ${
      order.payment_method === "cod"
        ? "Pay on delivery"
        : (order.payment_method ?? "-")
    } (${order.payment_status})`,
    M,
    y,
    { size: 9, color: muted },
  );
  y -= 28;
  text("Thank you for shopping with Publish With Vaishu.", M, y, {
    size: 9,
    color: muted,
  });

  return doc.save();
}
