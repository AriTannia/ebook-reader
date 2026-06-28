import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Check, Loader2,  ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import RatingSummary from "../components/RatingSummary";
import ReviewCard from "../components/ReviewCard";
import { fetchBookDetails } from "../reducers/book";
import { fetchReviewsByBookId } from "../reducers/review";

export default function BookDetails() {
  const { bookId } = useParams();
  const dispatch = useDispatch();

  const book = useSelector((state) => state.book.selectedBook);
  const reviewsPage = useSelector((state) => state.review.reviews);
  const reviews = reviewsPage?.content || [];
  const isLoadingBook = useSelector((state) => state.book.loading);

  const [isInCart, setIsInCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    dispatch(fetchBookDetails(bookId));
  }, [dispatch, bookId]);

  useEffect(() => {
    dispatch(fetchReviewsByBookId({ bookId, page, size: PAGE_SIZE }));
  }, [dispatch, bookId, page]);

  const handlePrevPage = () => {
    if (reviewsPage && !reviewsPage.first) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (reviewsPage && !reviewsPage.last) setPage((p) => p + 1);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsInCart(true);
    setIsAddingToCart(false);
  };

  if (isLoadingBook || !book) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  const isOutOfStock = book.status !== "ACTIVE";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Section 1: Book Info */}
        <section className="mb-16 grid gap-8 lg:grid-cols-2">
          {/* Left column: Book cover image */}
          <div className="flex items-center justify-center">
            {book.coverImageUrl ? (
              <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-96 w-full max-w-sm items-center justify-center rounded-xl border border-border bg-muted">
                <span className="text-muted-foreground">
                  No image available
                </span>
              </div>
            )}
          </div>

          {/* Right column: Book details */}
          <div className="flex flex-col justify-start">
            {/* Status badge */}
            {isOutOfStock && (
              <div className="mb-4 inline-flex w-fit rounded-full bg-red-50 px-3 py-1.5">
                <span className="text-sm font-medium text-red-700">
                  Out of stock
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground">
              {book.title}
            </h1>

            {/* Authors */}
            <div className="mb-4">
              <p className="text-foreground">
                by{" "}
                <span className="font-medium hover:text-primary">
                  {book.authors.map((author) => author.authorName).join(", ")}
                </span>
              </p>
            </div>

            {/* Metadata row: Publisher, Language, Published Date */}
            <div className="mb-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Publisher:</span>{" "}
                {book.publisher.publisherName}
              </div>
              <div>
                <span className="font-medium text-foreground">Language:</span>{" "}
                {book.language}
              </div>
              <div>
                <span className="font-medium text-foreground">Published:</span>{" "}
                {new Date(book.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Categories and Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {book.categories.map((category) => (
                <span
                  key={category.categoryId}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {category.categoryName}
                </span>
              ))}
              {book.tags.map((tag) => (
                <span
                  key={tag.tagId}
                  className="rounded-full border border-border bg-white px-3 py-1 text-sm font-medium text-foreground"
                >
                  {tag.tagName}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="mb-8 max-w-2xl leading-relaxed text-foreground">
              {book.description}
            </p>

            {/* Price and Add to Cart Section */}
            <div className="flex items-end gap-4">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Price</p>
                <p className="text-3xl font-bold text-foreground">
                  ${book.price.toFixed(2)}
                </p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isInCart || isAddingToCart}
                className="mb-1 flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding...
                  </>
                ) : isInCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Customer Reviews */}
        <section className="border-t border-border pt-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <RatingSummary
                averageRating={book.averageRating}
                reviewCount={book.reviewCount}
              />
            </div>

            <div className="lg:col-span-2">
              {reviews.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.reviewId, bookId} review={review} bookId={bookId} />
                    ))}
                  </div>

                  {reviewsPage && reviewsPage.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <button
                        onClick={handlePrevPage}
                        disabled={reviewsPage.first}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <span className="text-sm text-muted-foreground">
                        Page {reviewsPage.number + 1} of{" "}
                        {reviewsPage.totalPages}
                      </span>

                      <button
                        onClick={handleNextPage}
                        disabled={reviewsPage.last}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-border bg-white px-6 py-12 text-center">
                  <p className="mb-2 text-lg font-medium text-foreground">
                    No reviews yet
                  </p>
                  <p className="text-muted-foreground">
                    Be the first to share your thoughts about this book
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
