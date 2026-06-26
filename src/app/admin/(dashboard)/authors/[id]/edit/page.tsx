import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminAuthorForm } from "@/components/admin/AdminAuthorForm";
import { updateAuthorAction } from "@/lib/actions/admin-author-actions";
import { getAuthorDetail } from "@/lib/admin/authors";

export const metadata: Metadata = { title: "Edit author — Admin" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const author = await getAuthorDetail(id);
  if (!author) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Edit author
          </h1>
          <p className="mt-1 truncate text-muted">{author.name}</p>
        </div>
        <Link
          href="/admin/authors"
          className="shrink-0 text-sm text-muted hover:text-ink"
        >
          Cancel
        </Link>
      </div>
      <div className="max-w-3xl rounded-2xl border border-hairline p-6">
        <AdminAuthorForm
          action={updateAuthorAction}
          author={author}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
