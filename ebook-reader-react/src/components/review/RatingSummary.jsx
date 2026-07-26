import { Star } from "lucide-react";
import StarRating from "./StarRating";

export default function RatingSummary({ stats }) {
  const {
    averageRating = 0,
    totalReviews = 0,
    ratingDistribution = {},
  } = stats || {};

  const ratings = Object.entries(ratingDistribution).sort(
    ([a], [b]) => Number(b) - Number(a),
  );

  if (!totalReviews) {
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
      <h3 className="mb-5 text-lg font-semibold text-foreground">
        Customer Reviews
      </h3>

      <div className="mb-5 flex items-center gap-3">
        <span className="text-4xl font-bold leading-none text-foreground">
          {averageRating.toFixed(1)}
        </span>
        <div>
          <StarRating rating={averageRating} />
          <p className="mt-1 text-sm text-muted-foreground">
            Based on {totalReviews.toLocaleString()}{" "}
            {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {ratings.map(([rating, count]) => {
          const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="inline-flex w-7.5 shrink-0 items-center justify-end gap-0.5 leading-none text-muted-foreground">
                <span className="leading-none tabular-nums">{rating}</span>
                <Star className="h-2.75 w-2.75 fill-yellow-400 text-yellow-400" />
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-yellow-50">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}