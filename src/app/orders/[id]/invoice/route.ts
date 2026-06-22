import { getCurrentUser } from "@/lib/auth/session";
import { getOrderForUser } from "@/lib/orders/orders";
import { buildInvoicePdf } from "@/lib/orders/invoice";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return new Response("Not found", { status: 404 });

  const user = await getCurrentUser();
  if (!user?.id) return new Response("Unauthorized", { status: 401 });

  const data = await getOrderForUser(user.id, id);
  if (!data) return new Response("Not found", { status: 404 });

  const pdf = await buildInvoicePdf(data);

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${data.order.order_number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
