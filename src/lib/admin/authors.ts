import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Author } from "@/lib/types";
import type { BookWithRelations } from "@/lib/types";

export interface AdminAuthorRow {
  id: string;
  name: string;
  email: string | null;
  designation: string | null;
  college: string | null;
  created_at: string;
  book_count: number;
}

export interface AdminAuthorList {
  rows: AdminAuthorRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthorWrite {
  name: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
  department: string | null;
  college: string | null;
  bio: string | null;
  photo?: string | null;
}

const DEFAULT_PAGE_SIZE = 10;

export async function authorNameExists(
  name: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  let query = supabase.from("authors").select("id").ilike("name", name.trim());
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

export async function getAuthorsPage(params: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminAuthorList> {
  const supabase = getSupabaseAdminClient();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("authors")
    .select("id, name, email, designation, college, created_at, books ( count )", {
      count: "exact",
    });

  if (params.q && params.q.trim()) {
    query = query.ilike("name", `%${params.q.trim()}%`);
  }

  query = query.order("name", { ascending: true }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const rows: AdminAuthorRow[] = (data ?? []).map((a) => {
    const books = a.books as { count: number }[] | undefined;
    return {
      id: a.id as string,
      name: a.name as string,
      email: (a.email as string) ?? null,
      designation: (a.designation as string) ?? null,
      college: (a.college as string) ?? null,
      created_at: a.created_at as string,
      book_count: books?.[0]?.count ?? 0,
    };
  });

  const total = count ?? 0;
  return {
    rows,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAuthorDetail(id: string): Promise<Author | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Author) ?? null;
}

export type AuthorBook = BookWithRelations & { published: boolean };

export async function getAuthorBooks(
  authorId: string,
): Promise<AuthorBook[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select(
      "id, title, subtitle, price, stock, cover_image, language, course, university, is_featured, published, " +
        "author:authors ( id, name ), category:categories ( id, name, slug )",
    )
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AuthorBook[];
}

export async function getAuthorBookCount(id: string): Promise<number> {
  const supabase = getSupabaseAdminClient();
  const { count, error } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true })
    .eq("author_id", id);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function createAuthor(write: AuthorWrite): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("authors")
    .insert(write)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function updateAuthor(
  id: string,
  write: AuthorWrite,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const patch: Record<string, unknown> = { ...write };
  // Keep the existing photo when no new file was uploaded.
  if (write.photo === undefined) delete patch.photo;
  const { error } = await supabase.from("authors").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteAuthor(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("authors").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
