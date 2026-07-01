import { useState } from "react";
import { ThumbsUp, CheckCircle, Edit2, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateReviewHelpfulCount } from "../../reducers/review";
import StarRating from "./StarRating";
import toast from "react-hot-toast";

export default function ReviewCard({ review, bookId }) {
  const dispatch = useDispatch();
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpCount, setHelpCount] = useState(review.helpfulCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHelpful = async () => {
    if (isHelpful || isSubmitting) return;

    setIsSubmitting(true);
    setIsHelpful(true);
    setHelpCount((prev) => prev + 1);

    try {
      await dispatch(updateReviewHelpfulCount({ bookId, reviewId: review.reviewId })).unwrap();
      toast.success("Marked as helpful!");
    } catch (error) {
      setIsHelpful(false);
      setHelpCount((prev) => prev - 1);
      toast.error("Failed to mark as helpful. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get initials from full name
  const initials = review.user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Format date
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      {/* Header: Avatar, name, and badges */}
      <div className="mb-4 flex items-start gap-4">
        {/* Avatar */}
        {review.user.avatarUrl ? (
          <img
            src={review.user.avatarUrl}
            alt={review.user.fullName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {initials}
            </span>
          </div>
        )}

        {/* User info and badges */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-foreground">
              {review.user.fullName}
            </h4>
            {review.verifiedPurchase && (
              <div className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  Verified Purchase
                </span>
              </div>
            )}
            {review.edited && (
              <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Edited
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating and date */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <StarRating rating={review.rating} size="md" />
        </div>
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
      </div>

      {/* Comment */}
      <p className="mb-4 text-sm leading-relaxed text-foreground">
        {review.comment}
      </p>

      {/* Helpful button */}
      <button
        onClick={handleHelpful}
        disabled={isHelpful || isSubmitting}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp className="h-4 w-4" />
        )}
        Helpful ({helpCount})
      </button>
    </div>
  );
}
