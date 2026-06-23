import type { Metadata } from "next";
import Link from "next/link";
import { AdminBookForm } from "@/components/admin/AdminBookForm";
import { createBookAction } from "@/lib/actions/admin-book-actions";
import { adminListAuthors } from "@/lib/admin/books";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = { title: "Add book — Admin" };
export const dynamic = "force-dynamic";

export default async function NewBookPage() {
  const [authors, categories] = await Promise.all([
    adminListAuthors(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Add book
        </h1>
        <Link href="/admin/books" className="text-sm text-muted hover:text-ink">
          Cancel
        </Link>
      </div>
      <div className="max-w-3xl rounded-2xl border border-hairline p-6">
        <AdminBookForm
          action={createBookAction}
          authors={authors}
          categories={categories}
          submitLabel="Create book"
        />
      </div>
    </div>
  );
}
