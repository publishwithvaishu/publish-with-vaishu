import type { Metadata } from "next";
import Link from "next/link";
import { Pagination } from "@/components/catalog/Pagination";
import { adminListUsers } from "@/lib/admin/users";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Customers — Admin" };
export const dynamic = "force-dynamic";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const result = await adminListUsers({ q, page });
  const baseQuery: Record<string, string> = {};
  if (q) baseQuery.q = q;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Customers
        </h1>
        <p className="mt-1 text-muted">
          {result.total} {result.total === 1 ? "customer" : "customers"}
        </p>
      </div>

      <form method="get" action="/admin/users" className="flex gap-3">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, email or mobile"
          className="h-11 flex-1 rounded-full border border-hairline bg-bg px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="h-11 rounded-full border border-hairline px-5 text-sm font-medium text-ink hover:bg-bg-secondary"
        >
          Search
        </button>
      </form>

      {result.rows.length === 0 ? (
        <div className="rounded-2xl border border-hairline px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink">No customers found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {result.rows.map((u) => (
            <li key={u.id}>
              <Link
                href={`/admin/users/${u.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4 transition-colors hover:border-ink/30"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">{u.name}</span>
                    {u.blocked && (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    {u.email}
                    {u.phone ? ` · ${u.phone}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Joined {formatDate(u.created_at)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-ink">
                    {u.order_count} {u.order_count === 1 ? "order" : "orders"}
                  </p>
                  <p className="text-sm text-muted">
                    {formatPrice(u.total_spent)} spent
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        baseQuery={baseQuery}
        basePath="/admin/users"
      />
    </div>
  );
}
