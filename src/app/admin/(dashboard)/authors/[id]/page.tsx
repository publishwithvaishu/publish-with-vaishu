import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmit } from "@/components/forms/ConfirmSubmit";
import { StockLevelBadge } from "@/components/admin/StockLevelBadge";
import {
  getAuthorDetail,
  getAuthorBooks,
} from "@/lib/admin/authors";
import { deleteAuthorAction } from "@/lib/actions/admin-author-actions";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Author — Admin" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AdminAuthorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const author = await getAuthorDetail(id);
  if (!author) notFound();
  const books = await getAuthorBooks(id);

  const credentials = [author.designation, author.department, author.college]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      <Link
        href="/admin/authors"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        ← All authors
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {author.name}
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href={`/admin/authors/${author.id}/edit`}
            className="inline-flex h-10 items-center rounded-full border border-hairline px-4 font-medium text-ink hover:bg-bg-secondary"
          >
            Edit
          </Link>
          {books.length === 0 && (
            <form action={deleteAuthorAction}>
              <input type="hidden" name="id" value={author.id} />
              <ConfirmSubmit
                message={`Delete author "${author.name}"?`}
                className="inline-flex h-10 items-center rounded-full border border-red-200 px-4 font-medium text-red-700 hover:bg-red-50"
              >
                Delete
              </ConfirmSubmit>
            </form>
          )}
        </div>
      </div>

      {/* Info */}
      <section className="rounded-2xl border border-hairline p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
          <AuthorAvatar name={author.name} photo={author.photo} />
          <div className="min-w-0 flex-1">
            {credentials && <p className="text-sm text-muted">{credentials}</p>}
            <dl className="mt-3 space-y-1.5 text-sm">
              <Row label="Email" value={author.email ?? "—"} />
              <Row label="Phone" value={author.phone ?? "—"} />
            </dl>
            {author.bio && (
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {author.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Books */}
      <section className="rounded-2xl border border-hairline p-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">
          Books by this author ({books.length})
        </h2>
        {books.length === 0 ? (
          <p className="text-sm text-muted">No books assigned.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {books.map((b) => (
              <li key={b.id} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/admin/books/${b.id}/edit`}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-sm text-ink">
                        {b.title}
                      </span>
                      {!b.published && (
                        <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">
                      {b.category?.name ?? "—"} · {formatPrice(b.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm text-muted">Stock {b.stock}</span>
                    <StockLevelBadge stock={b.stock} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}

function AuthorAvatar({
  name,
  photo,
}: {
  name: string;
  photo: string | null;
}) {
  const isRealPhoto = photo && !photo.includes("placehold.co");
  const initials = name
    .split(/\s+/)
    .filter((w) => /[a-z]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-hairline bg-bg-secondary">
      {isRealPhoto ? (
        <Image src={photo} alt={name} fill sizes="96px" className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-serif text-2xl text-ink">
          {initials || "·"}
        </span>
      )}
    </div>
  );
}
