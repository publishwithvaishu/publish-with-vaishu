// Database row types — mirror supabase/schema.sql exactly.

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Author {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  photo: string | null;
  bio: string | null;
  designation: string | null;
  department: string | null;
  college: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Book {
  id: string;
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
  cover_image: string | null;
  description: string | null;
  is_featured: boolean;
  author_id: string | null;
  category_id: string | null;
  created_at: string;
}

// A book joined with its author + category, as used on the homepage.
export interface BookWithRelations extends Book {
  author: Pick<Author, "id" | "name"> | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
}

// Full book detail with the complete author record and category.
export interface BookDetail extends Book {
  author: Author | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
}

export type SortOption = "newest" | "price-asc" | "price-desc";

export interface CatalogParams {
  q?: string;
  category?: string; // category slug
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface CatalogResult {
  books: BookWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TrustStats {
  booksPublished: number;
  authors: number;
  courses: number;
}
