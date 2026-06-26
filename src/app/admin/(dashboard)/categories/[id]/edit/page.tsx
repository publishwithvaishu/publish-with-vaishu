import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCategoryForm } from "@/components/admin/AdminCategoryForm";
import { updateCategoryAction } from "@/lib/actions/admin-category-actions";
import { adminGetCategory } from "@/lib/admin/categories";

export const metadata: Metadata = { title: "Edit category — Admin" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const category = await adminGetCategory(id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Edit category
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
          action={updateCategoryAction}
          category={category}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
