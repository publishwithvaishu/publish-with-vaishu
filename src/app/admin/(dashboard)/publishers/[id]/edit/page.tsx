import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPublisherForm } from "@/components/admin/AdminPublisherForm";
import { updatePublisherAction } from "@/lib/actions/admin-publisher-actions";
import { getPublisherDetail } from "@/lib/admin/publishers";

export const metadata: Metadata = { title: "Edit publisher — Admin" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPublisherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const publisher = await getPublisherDetail(id);
  if (!publisher) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Edit publisher
          </h1>
          <p className="mt-1 truncate text-muted">{publisher.name}</p>
        </div>
        <Link
          href="/admin/publishers"
          className="shrink-0 text-sm text-muted hover:text-ink"
        >
          Cancel
        </Link>
      </div>
      <div className="max-w-3xl rounded-2xl border border-hairline p-6">
        <AdminPublisherForm
          action={updatePublisherAction}
          publisher={publisher}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
