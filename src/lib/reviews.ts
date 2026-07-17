import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Creates or updates a customer's rating/comment for a book. One review per
 * (book_id, user_id) — see migration 0011 for the unique constraint this
 * upsert relies on. Uses the admin client because `reviews` has RLS enabled
 * with no public write policy (writes only happen server-side).
 */
export async function upsertReview(input: {
  bookId: string;
  userId: string;
  rating: number;
  comment: string | null;
}): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("reviews").upsert(
    {
      book_id: input.bookId,
      user_id: input.userId,
      rating: input.rating,
      comment: input.comment,
    },
    { onConflict: "book_id,user_id" },
  );
  if (error) throw new Error(`Failed to save review: ${error.message}`);
}
