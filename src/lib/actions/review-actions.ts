"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireDbUser } from "@/lib/auth/session";
import { fieldErrors } from "@/lib/auth/validation";
import { upsertReview } from "@/lib/reviews";
import type { ActionState } from "@/lib/forms/types";

const reviewSchema = z.object({
  bookId: z.string().uuid(),
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  comment: z
    .string()
    .trim()
    .max(1000, "Keep your comment under 1000 characters")
    .optional()
    .or(z.literal("")),
});

export async function submitReviewAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireDbUser();

  const parsed = reviewSchema.safeParse({
    bookId: String(formData.get("bookId") ?? ""),
    rating: formData.get("rating"),
    comment: String(formData.get("comment") ?? ""),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrors(parsed.error) };
  }

  await upsertReview({
    bookId: parsed.data.bookId,
    userId: user.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment?.trim() || null,
  });

  revalidatePath(`/books/${parsed.data.bookId}`);
  return { ok: true, success: "Thanks for your rating!" };
}
