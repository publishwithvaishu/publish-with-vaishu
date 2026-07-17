import Link from "next/link";
import { StarRating } from "@/components/book/StarRating";
import { ReviewForm } from "@/components/book/ReviewForm";
import { getBookReviews, getBookRatingSummary, getMyReviewForBook } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth/session";

/** Ratings + reviews for a book: average summary, the customer's own rating form, and the review list. */
export async function ReviewsSection({ bookId }: { bookId: string }) {
  const user = await getCurrentUser();

  const [summary, reviews, myReview] = await Promise.all([
    getBookRatingSummary(bookId),
    getBookReviews(bookId),
    user ? getMyReviewForBook(bookId, user.id) : Promise.resolve(null),
  ]);

  const otherReviews = myReview
    ? reviews.filter((r) => r.id !== myReview.id)
    : reviews;

  return (
    <section className="mt-16 border-t border-hairline pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Ratings &amp; reviews
        </h2>
        {summary.count > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={summary.average} size={20} />
            <span className="text-sm font-semibold text-ink">
              {summary.average.toFixed(1)}
            </span>
            <span className="text-sm text-muted">
              ({summary.count} {summary.count === 1 ? "rating" : "ratings"})
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        {user ? (
          <ReviewForm
            bookId={bookId}
            initialRating={myReview?.rating ?? 0}
            initialComment={myReview?.comment ?? ""}
          />
        ) : (
          <div className="card-dark rounded-2xl p-5 text-sm text-muted sm:p-6">
            <Link href="/login" className="font-medium text-gold hover:underline">
              Sign in
            </Link>{" "}
            to rate this book.
          </div>
        )}
      </div>

      {(myReview || otherReviews.length > 0) && (
        <ul className="mt-8 space-y-4">
          {myReview && <ReviewCard review={myReview} isMine />}
          {otherReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ReviewCard({
  review,
  isMine,
}: {
  review: { rating: number; comment: string | null; createdAt: string; reviewerName: string };
  isMine?: boolean;
}) {
  return (
    <li className="glass-dark rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StarRating value={review.rating} size={15} />
          <span className="text-sm font-medium text-ink">
            {review.reviewerName}
            {isMine && <span className="text-muted"> (you)</span>}
          </span>
        </div>
        <span className="text-xs text-muted">
          {new Date(review.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      {review.comment && (
        <p className="mt-2 text-sm leading-relaxed text-muted">{review.comment}</p>
      )}
    </li>
  );
}
