import type { Metadata } from "next";
import Link from "next/link";
import { AdminCategoryForm } from "@/components/admin/AdminCategoryForm";
import { createCategoryAction } from "@/lib/actions/admin-category-actions";

export const metadata: Metadata = { title: "Add category — Admin" };

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Add category
        </h1>
        <Link
          href="/admin/categories"
          className="text-sm text-muted hover:text-ink"
        >
          Cancel
        </Link>
      </div>
      <div className="max-w-lg rounded-2xl border border-hairline p-6">
        <AdminCategoryForm
          action={createCategoryAction}
          submitLabel="Create category"
        />
      </div>
    </div>
  );
}
