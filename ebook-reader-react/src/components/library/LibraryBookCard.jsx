import { Link } from "react-router-dom";
import { Heart, BookOpen } from "lucide-react";

export default function LibraryBookCard({ item, onToggleFavorite }) {
  if (!item?.book) return null;

  const { bookId, title, coverImageUrl } = item.book;
  const { readingProgress, isFavorite } = item;
  const progressPercent = readingProgress?.progressPercent ?? 0;
  const roundedPercent = Math.round(progressPercent);


  return (
    <div className="group relative flex flex-col gap-2">
      <Link to={`/reading/${bookId}`} className="relative block">
        <img
          src={coverImageUrl}
          alt={title}
          onError={(e) => {
            e.target.style.display = "none";
          }}
          className="w-full aspect-2/3 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {progressPercent > 0 && (
          <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-linear-to-t from-black/80 via-black/50 to-transparent px-2 pb-1.5 pt-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-medium text-white leading-none">
                {roundedPercent}%
              </span>
            </div>
            <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </Link>

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {title}
        </p>
        <button onClick={onToggleFavorite} className="shrink-0 cursor-pointer">
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground hover:text-red-500"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
