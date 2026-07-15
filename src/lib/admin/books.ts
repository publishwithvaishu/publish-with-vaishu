import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Book } from "@/lib/types";

const ADMIN_BOOK_SELECT =
  "id, title, subtitle, isbn, edition, university, course, semester, language, " +
  "pages, publication_date, price, stock, cover_image, description, is_featured, " +
  "published, author_id, category_id, created_at, delivery_charge, " +
  "authors:book_authors ( position, author:authors ( id, name ) ), " +
  "category:categories ( id, name, slug )";

export interface AdminBook extends Book {
  published: boolean;
  authors: { id: string; name: string }[];
  category: { id: string; name: string; slug: string } | null;
}

export interface BookWrite {
  title: string;
  subtitle: string | null;
  isbn: string | null;
  edition: string | null;
  university: string | null;
  course: string | null;
  semester: string | null;
  language: string | null;
  pages: number | null;
  publication_date: string | null;
  price: number;
  stock: number;
  description: string | null;
  /** Every selected author, in display order. Can be empty (no authors). */
  authorIds: string[];
  category_id: string | null;
  is_featured: boolean;
  published: boolean;
  cover_image?: string | null;
  /** Manual per-book delivery charge. null = use the site default rule. */
  delivery_charge: number | null;
}

function mapAdminBookRow(row: unknown): AdminBook {
  const r = row as Record<string, unknown>;
  const rawAuthors =
    (r.authors as
      | { position: number; author: { id: string; name: string } | null }[]
      | undefined) ?? [];
  return {
    ...(r as unknown as AdminBook),
    authors: rawAuthors
      .filter((a): a is typeof a & { author: { id: string; name: string } } => !!a.author)
      .sort((a, b) => a.position - b.position)
      .map((a) => a.author),
  };
}

const DEFAULT_PAGE_SIZE = 8;

export interface AdminBookList {
  books: AdminBook[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const normalizeSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

async function resolveCategoryId(slug: string): Promise<string | null> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.from("categories").select("id, slug");
  const target = normalizeSlug(slug);
  return (data ?? []).find((c) => normalizeSlug(c.slug) === target)?.id ?? null;
}

/** Book ids linked (via book_authors) to any author whose name matches. */
async function bookIdsByAuthorName(term: string): Promise<string[]> {
  const supabase = getSupabaseAdminClient();
  const { data: authorRows } = await supabase
    .from("authors")
    .select("id")
    .ilike("name", `%${term}%`);
  const authorIds = (authorRows ?? []).map((a) => a.id as string);
  if (authorIds.length === 0) return [];

  const { data: linkRows } = await supabase
    .from("book_authors")
    .select("book_id")
    .in("author_id", authorIds);
  return [...new Set((linkRows ?? []).map((r) => r.book_id as string))];
}

/** All books (published + unpublished) for the admin list. */
export async function adminListBooks(params: {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminBookList> {
  const supabase = getSupabaseAdminClient();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("books")
    .select(ADMIN_BOOK_SELECT, { count: "exact" });

  if (params.category) {
    const id = await resolveCategoryId(params.category);
    query = query.eq(
      "category_id",
      id ?? "00000000-0000-0000-0000-000000000000",
    );
  }

  if (params.q && params.q.trim()) {
    const term = params.q.trim().replace(/[,()*]/g, " ").trim();
    if (term) {
      const like = `%${term}%`;
      const ors = [`title.ilike.${like}`, `isbn.ilike.${like}`];
      const bookIds = await bookIdsByAuthorName(term);
      if (bookIds.length) ors.push(`id.in.(${bookIds.join(",")})`);
      query = query.or(ors.join(","));
    }
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const total = count ?? 0;
  return {
    books: (data ?? []).map(mapAdminBookRow),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function adminGetBook(id: string): Promise<AdminBook | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select(ADMIN_BOOK_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapAdminBookRow(data) : null;
}

/** Replaces a book's book_authors rows to exactly match `authorIds`, in order. */
async function setBookAuthors(bookId: string, authorIds: string[]): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error: delError } = await supabase
    .from("book_authors")
    .delete()
    .eq("book_id", bookId);
  if (delError) throw new Error(delError.message);

  if (authorIds.length === 0) return;
  const rows = authorIds.map((author_id, position) => ({
    book_id: bookId,
    author_id,
    position,
  }));
  const { error: insError } = await supabase.from("book_authors").insert(rows);
  if (insError) throw new Error(insError.message);
}

/** Splits BookWrite into the plain `books` row patch + the authorIds list. */
function splitWrite(write: BookWrite) {
  const { authorIds, ...bookFields } = write;
  return {
    bookFields,
    authorIds,
    // Kept on `books.author_id` for backward compatibility with any code
    // that still reads it directly (e.g. legacy reports) — the join table
    // is the source of truth for display everywhere else now.
    legacyAuthorId: authorIds[0] ?? null,
  };
}

export async function adminCreateBook(write: BookWrite): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const { bookFields, authorIds, legacyAuthorId } = splitWrite(write);
  const { data, error } = await supabase
    .from("books")
    .insert({ ...bookFields, author_id: legacyAuthorId })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const bookId = data.id as string;
  await setBookAuthors(bookId, authorIds);
  return bookId;
}

export async function adminUpdateBook(
  id: string,
  write: BookWrite,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { bookFields, authorIds, legacyAuthorId } = splitWrite(write);
  // Drop cover_image when undefined so we don't overwrite an existing cover.
  const patch: Record<string, unknown> = { ...bookFields, author_id: legacyAuthorId };
  if (bookFields.cover_image === undefined) delete patch.cover_image;
  const { error } = await supabase.from("books").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  await setBookAuthors(id, authorIds);
}

export async function adminDeleteBook(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminSetPublished(
  id: string,
  published: boolean,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("books")
    .update({ published })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminUpdateStock(
  id: string,
  stock: number,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("books").update({ stock }).eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Active individual authors for the book form's multi-select. Legacy
 * combined-name rows (deactivated by the author-split migration) are
 * excluded so only real individual profiles are selectable.
 */
export async function adminListAuthors(): Promise<
  { id: string; name: string }[]
> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("authors")
    .select("id, name")
    .eq("active", true)
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as { id: string; name: string }[];
}

// ---------------------------------------------------------------------------
//  Book image gallery (additional photos — e.g. back cover)
// ---------------------------------------------------------------------------

export interface BookImage {
  id: string;
  url: string;
}

export async function adminGetBookImages(bookId: string): Promise<BookImage[]> {
  // Wrapped in try/catch (not just checking `error`) so ANY failure mode —
  // including the table not existing yet before migration 0008 has run —
  // degrades to "no extra images" instead of crashing the whole edit page.
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("book_images")
      .select("id, url")
      .eq("book_id", bookId)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as BookImage[];
  } catch (e) {
    console.error("adminGetBookImages failed:", e);
    return [];
  }
}

/** Append images to a book's gallery, positioned after any existing ones. */
export async function adminAddBookImages(
  bookId: string,
  urls: string[],
): Promise<void> {
  if (urls.length === 0) return;
  const supabase = getSupabaseAdminClient();

  const { data: existing, error: countError } = await supabase
    .from("book_images")
    .select("position")
    .eq("book_id", bookId)
    .order("position", { ascending: false })
    .limit(1);
  if (countError) throw new Error(countError.message);

  const startPosition = ((existing?.[0]?.position as number) ?? -1) + 1;
  const rows = urls.map((url, i) => ({
    book_id: bookId,
    url,
    position: startPosition + i,
  }));

  const { error } = await supabase.from("book_images").insert(rows);
  if (error) throw new Error(error.message);
}

export async function adminDeleteBookImage(imageId: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("book_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
}
