import type { Metadata } from "next";
import Link from "next/link";
import { Pagination } from "@/components/catalog/Pagination";
import { ConfirmSubmit } from "@/components/forms/ConfirmSubmit";
import { adminListCategories } from "@/lib/admin/categories";
import { deleteCategoryAction } from "@/lib/actions/admin-category-actions";

export const metadata: Metadata = { title: "Categories — Admin" };
export const dynamic = "force-dynamic";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const result = await adminListCategories({ q, page });
  const baseQuery: Record<string, string> = {};
  if (q) baseQuery.q = q;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-muted">
            {result.total} {result.total === 1 ? "category" : "categories"}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-white"
        >
          Add category
        </Link>
      </div>

      <form method="get" action="/admin/categories" className="flex gap-3">
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
          <p className="font-serif text-lg text-ink">No categories found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {result.rows.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{c.name}</p>
                <p className="mt-0.5 text-sm text-muted">
                  <code>{c.slug}</code> ·{" "}
                  <Link
                    href={`/admin/books?category=${c.slug}`}
                    className="hover:text-ink"
                  >
                    {c.book_count} {c.book_count === 1 ? "book" : "books"}
                  </Link>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-sm">
                <Link
                  href={`/admin/categories/${c.id}/edit`}
                  className="font-medium text-ink hover:text-muted"
                >
                  Edit
                </Link>
                {c.book_count > 0 ? (
                  <span
                    className="cursor-not-allowed text-muted/60"
                    title={`Cannot delete — ${c.book_count} ${
                      c.book_count === 1 ? "book is" : "books are"
                    } assigned`}
                  >
                    Delete
                  </span>
                ) : (
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmSubmit
                      message={`Delete category "${c.name}"?`}
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
        basePath="/admin/categories"
      />
    </div>
  );
}
