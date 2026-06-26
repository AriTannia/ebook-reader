import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Star, ShoppingCart } from "lucide-react"
import { fetchBookDetails } from "../reducers/book"

export default function BookCard({ book, onAddToCart }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)

  const handleCardClick = () => {
    dispatch(fetchBookDetails(book.bookId))
    navigate(`/books/${book.bookId}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Book Cover */}
      <div className="relative w-full aspect-3/4 overflow-hidden rounded-lg bg-muted shrink-0">
        {!imageError ? (
          <>
            <img
              src={book.coverImageUrl}
              alt={book.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </>
        ) : (
          /* Placeholder for missing image */
          <div className="w-full h-full bg-linear-to-br from-muted to-muted-foreground/10 flex items-center justify-center p-4">
            <h3 className="font-semibold text-sm text-foreground text-center line-clamp-3">
              {book.title}
            </h3>
          </div>
        )}
      </div>

      {/* Book Info — flex column with consistent spacing */}
      <div className="flex flex-col flex-1 gap-2 p-3">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground">{book.authors?.map(author => author.authorName).join(", ")}</p>

        {/* Rating
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-foreground">
              {book.rating}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({book.reviews.toLocaleString()})
          </span>
        </div> */}

        {/* Price — fixed at bottom, full width */}
        <div className="mt-auto pt-3 w-full">
          <span className="text-sm font-bold text-primary block">
            ${book.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}