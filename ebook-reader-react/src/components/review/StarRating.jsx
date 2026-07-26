import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ 
  rating, 
  size = "md", 
  showLabel = false,
  interactive = false,
  onRatingChange }) {
  
  const [hoveredRating, setHoveredRating] = useState(0);
  const sizeMap = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };
  
  // Interactive mode allows users to select a rating by clicking on stars
  if (interactive) {
    const displayRating = hoveredRating || rating;

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => onRatingChange?.(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`${sizeMap[size]} transition-colors ${
                    starValue <= displayRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {showLabel && (
          <span className="text-sm font-medium text-foreground">
            {rating > 0 ? rating.toFixed(1) : "Select a rating"}
          </span>
        )}
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            className={`${sizeMap[size]} fill-amber-400 text-amber-400`}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${sizeMap[size]} text-amber-400`} />
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Star
                className={`${sizeMap[size]} fill-amber-400 text-amber-400`}
              />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeMap[size]} text-muted-foreground/30`}
          />
        ))}
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
