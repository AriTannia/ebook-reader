import StarRating from "./StarRating";

export default function RatingSummary({ averageRating, reviewCount }) {
  if (!reviewCount || reviewCount === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Customer Reviews
        </h3>
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to share your thoughts.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h3 className="mb-6 text-lg font-semibold text-foreground">
        Customer Reviews
      </h3>

      <div className="shrink-0">
        <div className="text-4xl font-bold text-foreground">
          {averageRating.toFixed(1)}
        </div>
        <div className="mt-1">
          <StarRating rating={averageRating} />
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Based on {reviewCount.toLocaleString()}{" "}
          {reviewCount === 1 ? "review" : "reviews"}
        </div>
      </div>
    </div>
  );
}