import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";

export default function HorizontalScrollSection({
  title,
  books,
  loading,
  viewAllLink,
}) {
  if (loading) {
    return (
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>

        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-5 pb-2 min-w-min">
            {[...Array(5)].map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <Link
          to={viewAllLink}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Scrollable Books Container */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 pb-2 min-w-min">
          {books.map((book) => (
            <div key={book.bookId} className="w-44 shrink-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
