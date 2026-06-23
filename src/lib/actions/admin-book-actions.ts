"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { bookSchema, stockSchema } from "@/lib/admin/book-validation";
import { fieldErrors } from "@/lib/auth/validation";
import { uploadCover } from "@/lib/admin/storage";
import {
  adminCreateBook,
  adminUpdateBook,
  adminDeleteBook,
  adminSetPublished,
  adminUpdateStock,
  type BookWrite,
} from "@/lib/admin/books";
import type { ActionState } from "@/lib/forms/types";
import type { BookFormValues } from "@/lib/admin/book-validation";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const toNull = (v?: string) => {
  const s = (v ?? "").trim();
  return s === "" ? null : s;
};

function extract(fd: FormData) {
  return {
    title: str(fd, "title"),
    subtitle: str(fd, "subtitle"),
    isbn: str(fd, "isbn"),
    edition: str(fd, "edition"),
    university: str(fd, "university"),
    course: str(fd, "course"),
    semester: str(fd, "semester"),
    language: str(fd, "language"),
    pages: str(fd, "pages"),
    publication_date: str(fd, "publication_date"),
    price: str(fd, "price"),
    stock: str(fd, "stock"),
    description: str(fd, "description"),
    author_id: str(fd, "author_id"),
    category_id: str(fd, "category_id"),
    is_featured: fd.get("is_featured") === "on",
    published: fd.get("published") === "on",
  };
}

function buildWrite(v: BookFormValues): BookWrite {
  return {
    title: v.title.trim(),
    subtitle: toNull(v.subtitle),
    isbn: toNull(v.isbn),
    edition: toNull(v.edition),
    university: toNull(v.university),
    course: toNull(v.course),
    semester: toNull(v.semester),
    language: toNull(v.language),
    pages: v.pages ?? null,
    publication_date: toNull(v.publication_date),
    price: v.price,
    stock: v.stock,
    description: toNull(v.description),
    author_id: v.author_id ? v.author_id : null,
    category_id: v.category_id ? v.category_id : null,
    is_featured: !!v.is_featured,
    published: !!v.published,
  };
}

export async function createBookAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = bookSchema.safeParse(extract(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  try {
    const cover = await uploadCover(formData.get("cover") as File | null);
    const write = buildWrite(parsed.data);
    write.cover_image = cover; // null when no file uploaded
    await adminCreateBook(write);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create book." };
  }

  revalidatePath("/admin/books");
  revalidatePath("/books");
  redirect("/admin/books");
}

export async function updateBookAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return { error: "Missing book id." };

  const parsed = bookSchema.safeParse(extract(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  try {
    const cover = await uploadCover(formData.get("cover") as File | null);
    const write = buildWrite(parsed.data);
    // Only replace the cover when a new file was uploaded.
    write.cover_image = cover ?? undefined;
    await adminUpdateBook(id, write);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not update book." };
  }

  revalidatePath("/admin/books");
  revalidatePath("/books");
  revalidatePath(`/books/${id}`);
  redirect("/admin/books");
}

export async function deleteBookAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (id) {
    await adminDeleteBook(id);
    revalidatePath("/admin/books");
    revalidatePath("/books");
  }
}

export async function togglePublishAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const publish = str(formData, "publish") === "true";
  if (id) {
    await adminSetPublished(id, publish);
    revalidatePath("/admin/books");
    revalidatePath("/books");
    revalidatePath(`/books/${id}`);
  }
}

export async function updateStockAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const parsed = stockSchema.safeParse({ stock: str(formData, "stock") });
  if (id && parsed.success) {
    await adminUpdateStock(id, parsed.data.stock);
    revalidatePath("/admin/books");
    revalidatePath("/books");
  }
}
