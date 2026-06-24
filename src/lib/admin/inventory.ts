import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/** Stock at or below this (and above 0) is "low". */
export const LOW_STOCK_THRESHOLD = 5;

export type InventoryFilter = "all" | "low" | "out" | "in";

export interface InventorySummary {
  totalTitles: number;
  totalUnits: number;
  outOfStock: number;
  lowStock: number;
  inventoryValue: number;
}

export interface InventoryItem {
  id: string;
  title: string;
  isbn: string | null;
  stock: number;
  price: number;
  cover_image: string | null;
  author_name: string | null;
  category_name: string | null;
}

export interface StockMovement {
  id: string;
  book_id: string | null;
  change: number;
  reason: string | null;
  new_stock: number;
  created_at: string;
  book_title: string | null;
}

const DEFAULT_PAGE_SIZE = 10;
const normalizeSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export async function getInventorySummary(): Promise<InventorySummary> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("books").select("price, stock");
  if (error) throw new Error(error.message);

  let totalUnits = 0;
  let outOfStock = 0;
  let lowStock = 0;
  let inventoryValue = 0;
  for (const b of data ?? []) {
    const stock = Number(b.stock ?? 0);
    const price = Number(b.price ?? 0);
    totalUnits += stock;
    inventoryValue += price * stock;
    if (stock <= 0) outOfStock += 1;
    else if (stock <= LOW_STOCK_THRESHOLD) lowStock += 1;
  }

  return {
    totalTitles: (data ?? []).length,
    totalUnits,
    outOfStock,
    lowStock,
    inventoryValue,
  };
}

const ITEM_SELECT =
  "id, title, isbn, stock, price, cover_image, " +
  "author:authors ( name ), category:categories ( name )";

async function authorIdsByName(term: string): Promise<string[]> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("authors")
    .select("id")
    .ilike("name", `%${term}%`);
  return (data ?? []).map((a) => a.id as string);
}

async function resolveCategoryId(slug: string): Promise<string | null> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.from("categories").select("id, slug");
  const target = normalizeSlug(slug);
  return (data ?? []).find((c) => normalizeSlug(c.slug) === target)?.id ?? null;
}

export interface InventoryList {
  items: InventoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function listInventory(params: {
  q?: string;
  filter?: InventoryFilter;
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<InventoryList> {
  const supabase = getSupabaseAdminClient();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("books").select(ITEM_SELECT, { count: "exact" });

  switch (params.filter) {
    case "out":
      query = query.lte("stock", 0);
      break;
    case "low":
      query = query.gt("stock", 0).lte("stock", LOW_STOCK_THRESHOLD);
      break;
    case "in":
      query = query.gt("stock", LOW_STOCK_THRESHOLD);
      break;
    default:
      break;
  }

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
      const ors = [`title.ilike.%${term}%`, `isbn.ilike.%${term}%`];
      const ids = await authorIdsByName(term);
      if (ids.length) ors.push(`author_id.in.(${ids.join(",")})`);
      query = query.or(ors.join(","));
    }
  }

  // Lowest stock first — surfaces shortages.
  query = query
    .order("stock", { ascending: true })
    .order("title", { ascending: true })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const items: InventoryItem[] = (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      title: string;
      isbn: string | null;
      stock: number;
      price: number;
      cover_image: string | null;
      author: { name?: string } | { name?: string }[] | null;
      category: { name?: string } | { name?: string }[] | null;
    };
    const author = Array.isArray(r.author) ? r.author[0] : r.author;
    const category = Array.isArray(r.category) ? r.category[0] : r.category;
    return {
      id: r.id,
      title: r.title,
      isbn: r.isbn,
      stock: r.stock,
      price: r.price,
      cover_image: r.cover_image,
      author_name: author?.name ?? null,
      category_name: category?.name ?? null,
    };
  });

  const total = count ?? 0;
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Low + out-of-stock titles (stock at or below the threshold), lowest first. */
export async function getStockAlerts(limit = 8): Promise<InventoryItem[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select(ITEM_SELECT)
    .lte("stock", LOW_STOCK_THRESHOLD)
    .order("stock", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      title: string;
      isbn: string | null;
      stock: number;
      price: number;
      cover_image: string | null;
      author: { name?: string } | { name?: string }[] | null;
      category: { name?: string } | { name?: string }[] | null;
    };
    const author = Array.isArray(r.author) ? r.author[0] : r.author;
    const category = Array.isArray(r.category) ? r.category[0] : r.category;
    return {
      id: r.id,
      title: r.title,
      isbn: r.isbn,
      stock: r.stock,
      price: r.price,
      cover_image: r.cover_image,
      author_name: author?.name ?? null,
      category_name: category?.name ?? null,
    };
  });
}

export async function adjustStock(
  bookId: string,
  change: number,
  reason: string | null,
): Promise<number> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc("adjust_stock", {
    p_book_id: bookId,
    p_change: change,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  return Number(data ?? 0);
}

export async function listRecentMovements(
  limit = 12,
): Promise<StockMovement[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("stock_movements")
    .select("id, book_id, change, reason, new_stock, created_at, book:books ( title )")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      book_id: string | null;
      change: number;
      reason: string | null;
      new_stock: number;
      created_at: string;
      book: { title?: string } | { title?: string }[] | null;
    };
    const book = Array.isArray(r.book) ? r.book[0] : r.book;
    return {
      id: r.id,
      book_id: r.book_id,
      change: r.change,
      reason: r.reason,
      new_stock: r.new_stock,
      created_at: r.created_at,
      book_title: book?.title ?? null,
    };
  });
}
