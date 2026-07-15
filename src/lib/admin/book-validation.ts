import { z } from "zod";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const txt = (max = 300) =>
  z.string().trim().max(max).optional().or(z.literal(""));
const uuidOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || UUID_RE.test(v), "Invalid selection")
  .optional()
  .or(z.literal(""));
const num = (msg: string, min = 0, max = 1_000_000) =>
  z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(min, msg).max(max),
  );

export const bookSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  subtitle: txt(),
  isbn: txt(40),
  edition: txt(60),
  university: txt(120),
  course: txt(80),
  semester: txt(60),
  language: txt(40),
  pages: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(0).max(100000).optional(),
  ),
  publication_date: txt(20),
  price: num("Enter a valid price"),
  stock: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().int().min(0).max(1_000_000),
  ),
  description: z.string().trim().max(8000).optional().or(z.literal("")),
  // A book can have any number of authors (including zero).
  author_ids: z.array(z.string().regex(UUID_RE, "Invalid author selection")).default([]),
  category_id: uuidOrEmpty,
  is_featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  // Manual per-book delivery charge. Blank = use the site default rule;
  // 0 = free delivery for this book; a positive number = fixed charge.
  delivery_charge: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0, "Enter a valid amount").max(10000).optional(),
  ),
});

export type BookFormValues = z.infer<typeof bookSchema>;

export const stockSchema = z.object({
  stock: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().int().min(0).max(1_000_000),
  ),
});
