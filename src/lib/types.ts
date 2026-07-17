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
  website: string | null;
  linkedin: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface Publisher {
  id: string;
  name: string;
  designation: string | null;
  bio: string | null;
  photo: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  display_order: number;
  active: boolean;
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
  /** Manual per-book delivery charge. null = use the site default rule. */
  delivery_charge: number | null;
}

// A book joined with its authors (one book can have 1..N) + category, as
// used on the homepage/catalog cards.
export interface BookWithRelations extends Book {
  authors: Pick<Author, "id" | "name">[];
  category: Pick<Category, "id" | "name" | "slug"> | null;
}

// Full book detail with the complete author records (ordered) and category.
export interface BookDetail extends Book {
  authors: Author[];
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

export interface Review {
  id: string;
  bookId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewerName: string;
}

export interface RatingSummary {
  average: number;
  count: number;
}
