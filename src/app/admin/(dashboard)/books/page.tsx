import type { Metadata } from "next";
import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { Pagination } from "@/components/catalog/Pagination";
import { ConfirmSubmit } from "@/components/forms/ConfirmSubmit";
import { adminListBooks } from "@/lib/admin/books";
import { getCategories } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import {
  togglePublishAction,
  updateStockAction,
  deleteBookAction,
} from "@/lib/actions/admin-book-actions";

export const metadata: Metadata = { title: "Books — Admin" };
export const dynamic = "force-dynamic";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function AdminBooksPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const category = first(sp.category) || undefined;
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const [result, categories] = await Promise.all([
    adminListBooks({ q, category, page }),
    getCategories(),
  ]);

  const baseQuery: Record<string, string> = {};
  if (q) baseQuery.q = q;
  if (category) baseQuery.category = category;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Books
          </h1>
          <p className="mt-1 text-muted">
            {result.total} {result.total === 1 ? "title" : "titles"}
          </p>
        </div>
        <Link
          href="/admin/books/new"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-white"
        >
          Add book
        </Link>
      </div>

      {/* Search + filter (GET form — no JS needed) */}
      <form
        method="get"
        action="/admin/books"
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search title, author or ISBN"
          className="h-11 flex-1 rounded-full border border-hairline bg-bg px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
        <select
          name="category"
          defaultValue={category ?? ""}
          className="h-11 rounded-full border border-hairline bg-bg px-4 text-sm text-ink focus:border-ink focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 rounded-full border border-hairline px-5 text-sm font-medium text-ink hover:bg-bg-secondary"
        >
          Apply
        </button>
      </form>

      {result.books.length === 0 ? (
        <div className="rounded-2xl border border-hairline px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink">No books found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {result.books.map((book) => (
            <li
              key={book.id}
              className="rounded-2xl border border-hairline p-4"
            >
              <div className="flex gap-4">
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md border border-hairline bg-bg-secondary">
                  <BookCover
                    title={book.title}
                    coverImage={book.cover_image}
                    variant="mini"
                    sizes="56px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink">{book.title}</p>
                    {book.published ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted">
                        Hidden
                      </span>
                    )}
                    {book.is_featured && (
                      <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] font-medium text-muted">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {book.authors.length > 0
                      ? book.authors.map((a) => a.name).join(", ")
                      : "—"}
                    {book.category ? ` · ${book.category.name}` : ""} ·{" "}
                    {formatPrice(book.price)}
                  </p>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    {/* Inline stock */}
                    <form
                      action={updateStockAction}
                      className="flex items-center gap-1.5"
                    >
                      <input type="hidden" name="id" value={book.id} />
                      <label className="text-muted" htmlFor={`stock-${book.id}`}>
                        Stock
                      </label>
                      <input
                        id={`stock-${book.id}`}
                        name="stock"
                        type="number"
                        min={0}
                        defaultValue={book.stock}
                        className="h-9 w-16 rounded-lg border border-hairline bg-bg px-2 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-hairline px-3 py-1 text-xs font-medium text-ink hover:bg-bg-secondary"
                      >
                        Save
                      </button>
                    </form>

                    {/* Publish toggle */}
                    <form action={togglePublishAction}>
                      <input type="hidden" name="id" value={book.id} />
                      <input
                        type="hidden"
                        name="publish"
                        value={book.published ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="font-medium text-ink hover:text-muted"
                      >
                        {book.published ? "Unpublish" : "Publish"}
                      </button>
                    </form>

                    <Link
                      href={`/admin/books/${book.id}/edit`}
                      className="font-medium text-ink hover:text-muted"
                    >
                      Edit
                    </Link>

                    <form action={deleteBookAction} className="ml-auto">
                      <input type="hidden" name="id" value={book.id} />
                      <ConfirmSubmit
                        message={`Delete "${book.title}"? This cannot be undone.`}
                        className="text-muted hover:text-red-600"
                      >
                        Delete
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        baseQuery={baseQuery}
        basePath="/admin/books"
      />
    </div>
  );
}
