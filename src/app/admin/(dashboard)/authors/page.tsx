import type { Metadata } from "next";
import Link from "next/link";
import { Pagination } from "@/components/catalog/Pagination";
import { ConfirmSubmit } from "@/components/forms/ConfirmSubmit";
import { getAuthorsPage } from "@/lib/admin/authors";
import { deleteAuthorAction } from "@/lib/actions/admin-author-actions";

export const metadata: Metadata = { title: "Authors — Admin" };
export const dynamic = "force-dynamic";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function AdminAuthorsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const result = await getAuthorsPage({ q, page });
  const baseQuery: Record<string, string> = {};
  if (q) baseQuery.q = q;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Authors
          </h1>
          <p className="mt-1 text-muted">
            {result.total} {result.total === 1 ? "author" : "authors"}
          </p>
        </div>
        <Link
          href="/admin/authors/new"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-white"
        >
          Add author
        </Link>
      </div>

      <form method="get" action="/admin/authors" className="flex gap-3">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name"
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
          <p className="font-serif text-lg text-ink">No authors found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {result.rows.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/authors/${a.id}`}
                    className="font-medium text-ink hover:underline"
                  >
                    {a.name}
                  </Link>
                  {!a.active && (
                    <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {[a.designation, a.college].filter(Boolean).join(" · ") || "—"}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {a.book_count} {a.book_count === 1 ? "book" : "books"}
                  {a.email ? ` · ${a.email}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-sm">
                <Link
                  href={`/admin/authors/${a.id}/edit`}
                  className="font-medium text-ink hover:text-muted"
                >
                  Edit
                </Link>
                {a.book_count > 0 ? (
                  <span
                    className="cursor-not-allowed text-muted/60"
                    title={`Cannot delete — ${a.book_count} ${
                      a.book_count === 1 ? "book is" : "books are"
                    } assigned`}
                  >
                    Delete
                  </span>
                ) : (
                  <form action={deleteAuthorAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmSubmit
                      message={`Delete author "${a.name}"?`}
                      className="text-muted hover:text-red-600"
                    >
                      Delete
                    </ConfirmSubmit>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        baseQuery={baseQuery}
        basePath="/admin/authors"
      />
    </div>
  );
}
