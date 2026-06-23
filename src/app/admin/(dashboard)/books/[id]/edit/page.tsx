import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBookForm } from "@/components/admin/AdminBookForm";
import { updateBookAction } from "@/lib/actions/admin-book-actions";
import { adminGetBook, adminListAuthors } from "@/lib/admin/books";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = { title: "Edit book — Admin" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const [book, authors, categories] = await Promise.all([
    adminGetBook(id),
    adminListAuthors(),
    getCategories(),
  ]);
  if (!book) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Edit book
          </h1>
          <p className="mt-1 truncate text-muted">{book.title}</p>
        </div>
        <Link href="/admin/books" className="shrink-0 text-sm text-muted hover:text-ink">
          Cancel
        </Link>
      </div>
      <div className="max-w-3xl rounded-2xl border border-hairline p-6">
        <AdminBookForm
          action={updateBookAction}
          authors={authors}
          categories={categories}
          book={book}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
