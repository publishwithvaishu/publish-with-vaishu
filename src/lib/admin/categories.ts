import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  book_count: number;
}

export interface AdminCategoryList {
  rows: AdminCategoryRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 10;

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

/** A slug not already used by another category (appends -2, -3, … if needed). */
async function uniqueSlug(base: string): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("slug")
    .ilike("slug", `${base}%`);
  const taken = new Set((data ?? []).map((c) => c.slug as string));
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

/** Whether another category already uses this name (case-insensitive). */
export async function categoryNameExists(
  name: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  let query = supabase.from("categories").select("id").ilike("name", name.trim());
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

export async function adminListCategories(params: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminCategoryList> {
  const supabase = getSupabaseAdminClient();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("categories")
    .select("id, name, slug, created_at, books ( count )", { count: "exact" });

  if (params.q && params.q.trim()) {
    query = query.ilike("name", `%${params.q.trim()}%`);
  }

  query = query.order("name", { ascending: true }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const rows: AdminCategoryRow[] = (data ?? []).map((c) => {
    const books = c.books as { count: number }[] | undefined;
    return {
      id: c.id as string,
      name: c.name as string,
      slug: c.slug as string,
      created_at: c.created_at as string,
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

export async function adminGetCategory(
  id: string,
): Promise<{ id: string; name: string; slug: string } | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as { id: string; name: string; slug: string }) ?? null;
}

export async function getCategoryBookCount(id: string): Promise<number> {
  const supabase = getSupabaseAdminClient();
  const { count, error } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function createCategory(name: string): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const slug = await uniqueSlug(slugify(name));
  const { data, error } = await supabase
    .from("categories")
    .insert({ name: name.trim(), slug })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

/** Update the display name only — the slug is kept stable so storefront
 *  category links never break. */
export async function updateCategoryName(
  id: string,
  name: string,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
