import { getCurrentUser } from "@/lib/auth/session";
import { getReport, toCSV, type Granularity } from "@/lib/admin/reports";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const report = url.searchParams.get("report") ?? "revenue";
  const def = defaultRange();
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");
  const from = fromParam && DATE_RE.test(fromParam) ? fromParam : def.from;
  const to = toParam && DATE_RE.test(toParam) ? toParam : def.to;
  const granularity: Granularity =
    url.searchParams.get("granularity") === "monthly" ? "monthly" : "daily";

  const data = await getReport({ from, to, granularity });

  let headers: string[];
  let rows: (string | number)[][];
  let filename: string;

  switch (report) {
    case "top-books":
      headers = ["Title", "Quantity sold", "Revenue"];
      rows = data.topBooks.map((b) => [b.title, b.qty, b.revenue]);
      filename = "top-books";
      break;
    case "top-customers":
      headers = ["Customer", "Email", "Orders", "Amount spent"];
      rows = data.topCustomers.map((c) => [c.name, c.email, c.orders, c.spent]);
      filename = "top-customers";
      break;
    case "sales-by-category":
      headers = ["Category", "Revenue", "Units sold"];
      rows = data.salesByCategory.map((c) => [c.name, c.revenue, c.qty]);
      filename = "sales-by-category";
      break;
    default:
      headers = ["Period", "Revenue", "Orders"];
      rows = data.series.map((s) => [s.label, s.revenue, s.orders]);
      filename = "revenue";
  }

  const csv = toCSV(headers, rows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}-${from}_to_${to}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
