"use client";

import { useActionState, useState } from "react";
import { submitReviewAction } from "@/lib/actions/review-actions";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { initialActionState } from "@/lib/forms/types";
import { cn } from "@/lib/cn";

/**
 * Interactive 1–5 star picker + optional comment. Submits via the
 * submitReviewAction server action (upserts — resubmitting updates the
 * customer's existing rating for this book instead of duplicating it).
 */
export function ReviewForm({
  bookId,
  initialRating = 0,
  initialComment = "",
}: {
  bookId: string;
  initialRating?: number;
  initialComment?: string;
}) {
  const [state, formAction] = useActionState(submitReviewAction, initialActionState);
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);

  return (
    <form action={formAction} className="card-dark rounded-2xl p-5 sm:p-6">
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="rating" value={rating} />

      <p className="text-sm font-medium text-ink">
        {initialRating > 0 ? "Update your rating" : "Rate this book"}
      </p>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="tap-target p-0.5"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              className={cn(
                "transition-colors",
                (hovered || rating) >= n ? "text-gold" : "text-white/20",
              )}
            >
              <path
                d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z"
                fill={(hovered || rating) >= n ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        ))}
      </div>

      <label htmlFor="review-comment" className="mt-4 block text-sm font-medium text-ink">
        Comment <span className="text-muted">(optional)</span>
      </label>
      <textarea
        id="review-comment"
        name="comment"
        rows={3}
        defaultValue={initialComment}
        placeholder="What did you think of this book?"
        maxLength={1000}
        className="mt-1.5 w-full rounded-xl border border-hairline bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#e8b647]/60 focus:outline-none"
      />

      {(state.error || state.success) && (
        <div className="mt-4">
          <FormAlert error={state.error} success={state.success} />
        </div>
      )}
      {state.fieldErrors?.rating && (
        <p className="mt-2 text-xs text-red-300">{state.fieldErrors.rating}</p>
      )}

      <SubmitButton pendingText="Saving…" className="mt-5 h-11 px-6 text-sm">
        {initialRating > 0 ? "Update rating" : "Submit rating"}
      </SubmitButton>
    </form>
  );
}
