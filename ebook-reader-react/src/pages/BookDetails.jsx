import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  RotateCcw,
  Tag,
} from "lucide-react";
import RatingSummary from "../components/review/RatingSummary";
import ReviewCard from "../components/review/ReviewCard";
import { fetchBookDetails } from "../reducers/book";
import {
  fetchReviewsByBookId,
  fetchReviewStatsByBookId,
} from "../reducers/review";
import { addToCart } from "../reducers/cart";
import WriteReviewCard from "../components/review/WriteReviewCard";

const MAX_VISIBLE_AUTHORS = 2;
const DESCRIPTION_LIMIT = 260;

export default function BookDetails() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const book = useSelector((state) => state.book.selectedBook);
  const reviewsPage = useSelector((state) => state.review.reviews);
  const reviewStats = useSelector((state) => state.review.stats);
  const reviews = reviewsPage?.content || [];
  const isLoadingBook = useSelector((state) => state.book.loading);

  const [isInCart, setIsInCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    dispatch(fetchBookDetails(bookId));
    dispatch(fetchReviewStatsByBookId(bookId));
  }, [dispatch, bookId]);

  useEffect(() => {
    dispatch(fetchReviewsByBookId({ bookId, page, size: PAGE_SIZE }));
  }, [dispatch, bookId, page]);

  useEffect(() => {
    setShowAllAuthors(false);
    setShowFullDescription(false);
    setIsInCart(false);
    setPage(0);
  }, [bookId]);

  const handlePrevPage = () => {
    if (reviewsPage && !reviewsPage.first) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (reviewsPage && !reviewsPage.last) setPage((p) => p + 1);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await dispatch(
      addToCart({
        bookId: book.bookId,
      }),
    );
    setIsInCart(true);
    setIsAddingToCart(false);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?categoryIds=${categoryId}`);
  };

  const handleTagClick = (tagId) => {
    navigate(`/search?tagIds=${tagId}`);
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

  console.log("Book details:", book);
  const isOutOfStock = book.status !== "ACTIVE";
  const authors = book.authors || [];
  const visibleAuthors = showAllAuthors
    ? authors
    : authors.slice(0, MAX_VISIBLE_AUTHORS);
  const hiddenAuthorsCount = authors.length - MAX_VISIBLE_AUTHORS;

  const description = book.description || "";
  const isDescriptionLong = description.length > DESCRIPTION_LIMIT;
  const displayedDescription =
    isDescriptionLong && !showFullDescription
      ? description.slice(0, DESCRIPTION_LIMIT).trimEnd() + "…"
      : description;

  return (
    <div className="min-h-full bg-background">
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Section 1: Book Info */}
        <section className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left column: cover image, sticky so it stays balanced against long content */}
          <div className="flex justify-center lg:sticky lg:top-8 lg:self-start">
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

          {/* Right column: book details */}
          <div className="flex flex-col justify-start">
            {/* Out of stock badge */}
            {isOutOfStock && (
              <div className="mb-3 inline-flex w-fit rounded-full bg-red-50 px-3 py-1.5">
                <span className="text-sm font-medium text-red-700">
                  Out of stock
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="mb-1.5 text-3xl font-bold leading-tight text-foreground">
              {book.title}
            </h1>

            {/* Categories: breadcrumb-style links right under the title */}
            {book.categories?.length > 0 && (
              <p className="mb-3 text-sm text-muted-foreground">
                {book.categories.map((category, index) => (
                  <span key={category.categoryId}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(category.categoryId)}
                      className="text-primary hover:underline"
                    >
                      {category.categoryName}
                    </button>
                    {index < book.categories.length - 1 && (
                      <span className="mx-1.5 text-muted-foreground">·</span>
                    )}
                  </span>
                ))}
              </p>
            )}

            {/* Authors, truncated with "+X more" toggle */}
            <p className="mb-5 text-foreground">
              by{" "}
              <span className="font-medium">
                {visibleAuthors.map((a) => a.authorName).join(", ")}
              </span>
              {hiddenAuthorsCount > 0 && !showAllAuthors && (
                <button
                  type="button"
                  onClick={() => setShowAllAuthors(true)}
                  className="ml-1 text-sm text-muted-foreground underline decoration-dotted hover:text-primary"
                >
                  +{hiddenAuthorsCount} more
                </button>
              )}
              {showAllAuthors && authors.length > MAX_VISIBLE_AUTHORS && (
                <button
                  type="button"
                  onClick={() => setShowAllAuthors(false)}
                  className="ml-1 text-sm text-muted-foreground underline decoration-dotted hover:text-primary"
                >
                  show less
                </button>
              )}
            </p>

            {/* Metadata row: Publisher, Language, Published Date */}
            <div className="mb-6 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
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

            {/* Description */}
            <div className="mb-6 max-w-2xl">
              <p className="leading-relaxed text-foreground">
                {displayedDescription}
              </p>
              {isDescriptionLong && (
                <button
                  type="button"
                  onClick={() => setShowFullDescription((v) => !v)}
                  className="mt-1 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {showFullDescription ? (
                    <>
                      Show less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Tags: bordered clickable chips, visually distinct from category links */}
            {book.tags?.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <button
                    key={tag.tagId}
                    type="button"
                    onClick={() => handleTagClick(tag.tagId)}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Tag className="h-3 w-3" />
                    {tag.tagName}
                  </button>
                ))}
              </div>
            )}

            {/* Price and Add to Cart Section */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-2xl font-bold leading-none text-foreground">
                  ${book.price.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => {
                  if (book.existedInLibrary) {
                    navigate(`/reading/${book.bookId}`);
                    return;
                  }

                  if (book.pendingOrder) {
                    navigate(`/orders`);
                    return;
                  }

                  handleAddToCart();
                }}
                disabled={
                  !book.existedInLibrary &&
                  (isOutOfStock || isInCart || isAddingToCart)
                }
                className="flex h-11 items-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding...
                  </>
                ) : book.existedInLibrary ? (
                  <>
                    <BookOpen className="h-5 w-5" />
                    Read in Library
                  </>
                ) : book.pendingOrder ? (
                  <>
                    <RotateCcw className="h-5 w-5" />
                    Continue Payment
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
              <RatingSummary stats={reviewStats} />
            </div>

            <div className="lg:col-span-2">
              {book.existedInLibrary ? (
                <div className="mb-6">
                  <WriteReviewCard
                    bookId={bookId}
                    existedUserReview={book.existedUserReview}
                    onSubmitReview={() =>
                      setBook((prev) => ({ ...prev, existedUserReview: true }))
                    }
                  />
                </div>
              ) : null}
              {reviews.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={`${bookId}-${review.reviewId}`}
                        review={review}
                        bookId={bookId}
                      />
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
