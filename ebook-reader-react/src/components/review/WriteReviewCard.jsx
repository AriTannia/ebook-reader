import { useState } from "react";
import { useDispatch } from "react-redux";
import { Send } from "lucide-react";
import { addReview } from "../../reducers/review";
import StarRating from "./StarRating";

export default function WriteReviewCard({ bookId, existedUserReview, onSubmitReview }) {
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();

  if (existedUserReview) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await dispatch(addReview({ bookId, reviewData: { rating, comment } })).unwrap();
      setIsWriting(false);
      setRating(0);
      setComment("");
      onSubmitReview();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsWriting(false);
    setRating(0);
    setComment("");
  };

  return (
    <div className="rounded-xl border border-border bg-white px-6 py-4">
      {!isWriting ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground">
            Did you read this book? Share your thoughts!
          </p>
          <button
            onClick={() => setIsWriting(true)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Write a Review
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <StarRating
            rating={rating}
            size="lg"
            interactive
            showLabel
            onRatingChange={setRating}
          />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            rows={3}
            className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
