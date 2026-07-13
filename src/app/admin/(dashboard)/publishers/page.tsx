import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmSubmit } from "@/components/forms/ConfirmSubmit";
import { getPublishers } from "@/lib/admin/publishers";
import { deletePublisherAction } from "@/lib/actions/admin-publisher-actions";

export const metadata: Metadata = { title: "Publishers — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPublishersPage() {
  const publishers = await getPublishers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Publishers
          </h1>
          <p className="mt-1 text-muted">
            Shown in the homepage &ldquo;Meet Our Publisher&rdquo; section
            (lowest display order that is active).
          </p>
        </div>
        <Link
          href="/admin/publishers/new"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-white"
        >
          Add publisher
        </Link>
      </div>

      {publishers.length === 0 ? (
        <div className="rounded-2xl border border-hairline px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink">No publishers yet</p>
          <p className="mt-1 text-sm text-muted">
            Add a publisher to show the &ldquo;Meet Our Publisher&rdquo; section
            on the homepage.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {publishers.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.photo || "https://placehold.co/80x80?text=%20"}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">{p.name}</span>
                    {!p.active && (
                      <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {p.designation || "—"}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    Order {p.display_order}
                    {p.email ? ` · ${p.email}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-sm">
                <Link
                  href={`/admin/publishers/${p.id}/edit`}
                  className="font-medium text-ink hover:text-muted"
                >
                  Edit
                </Link>
                <form action={deletePublisherAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <ConfirmSubmit
                    message={`Delete publisher "${p.name}"?`}
                    className="text-muted hover:text-red-600"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
