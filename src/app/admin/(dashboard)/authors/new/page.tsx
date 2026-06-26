import type { Metadata } from "next";
import Link from "next/link";
import { AdminAuthorForm } from "@/components/admin/AdminAuthorForm";
import { createAuthorAction } from "@/lib/actions/admin-author-actions";

export const metadata: Metadata = { title: "Add author — Admin" };

export default function NewAuthorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Add author
        </h1>
        <Link href="/admin/authors" className="text-sm text-muted hover:text-ink">
          Cancel
        </Link>
      </div>
      <div className="max-w-3xl rounded-2xl border border-hairline p-6">
        <AdminAuthorForm
          action={createAuthorAction}
          submitLabel="Create author"
        />
      </div>
    </div>
  );
}
