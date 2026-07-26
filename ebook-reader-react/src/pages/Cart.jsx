import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, BookOpen, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../reducers/cart";
import { createOrder } from "../reducers/order";
import { useNavigate } from "react-router-dom";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatAuthorNames(authorNames, maxVisible = 2) {
  if (!authorNames) return "";
  const names = authorNames
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (names.length <= maxVisible) {
    return names.join(", ");
  }

  const visible = names.slice(0, maxVisible);
  const remaining = names.length - maxVisible;
  return `${visible.join(", ")} and ${remaining} more`;
}

export default function Cart() {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [removingIds, setRemovingIds] = useState(new Set());
  const [removedIds, setRemovedIds] = useState(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = (cartItemId) => {
    setRemovingIds((prev) => new Set(prev).add(cartItemId));
    setTimeout(() => {
      setRemovedIds((prev) => new Set(prev).add(cartItemId));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
      dispatch(removeFromCart(cartItemId))
      .unwrap()
      .catch((err) => {
        console.error("Failed to remove item from cart:", err);
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(cartItemId);
          return next;
        });
        setRemovedIds((prev) => {
          const next = new Set(prev);
          next.delete(cartItemId);
          return next;
        });
      });
    }, 300);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    dispatch(createOrder()).unwrap()
      .then((order) => {
        console.log("Order created successfully:", order);
        navigate(`/checkout/${order.orderId}`);
      })
      .catch((err) => {
        console.error("Failed to create order:", err);
      })
      .finally(() => {
        setIsCheckingOut(false);
      });
  };

  const items = cart?.items || [];

  const visibleItems = items.filter((item) => !removedIds.has(item.cartItemId));
  const isEmpty = visibleItems.length === 0;
  const pendingRemovalAmount = items
    .filter((item) => removingIds.has(item.cartItemId))
    .reduce((sum, item) => sum + item.book.price, 0)
  const totalPrice = (cart?.totalPrice ?? 0) - pendingRemovalAmount
 
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-fade-in-up">
          Loading your cart...
        </p>
      </div>
    )
  }
 
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-sm text-accent-foreground bg-accent border border-border rounded-lg px-4 py-3 animate-alert-in">
          {error}
        </p>
      </div>
    )
  }
 
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3 animate-fade-in-up">
          <ShoppingCart className="size-6 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Your Cart
          </h1>
          {!isEmpty && (
            <span className="ml-1 rounded-full bg-accent px-2.5 py-0.5 text-sm font-medium text-accent-foreground">
              {visibleItems.length}
            </span>
          )}
        </div>
 
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-card px-8 py-16 text-center animate-fade-in-up">
            <div className="flex size-14 items-center justify-center rounded-full bg-accent">
              <BookOpen className="size-7 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <p className="text-lg font-medium text-foreground">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Browse our library and add some books you&apos;d like to read.
              </p>
            </div>
            <Link
              to="/library"
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in-up">
              <ul role="list" className="divide-y divide-border max-h-[60vh] overflow-y-auto scrollbar-hide">
                {visibleItems.map((item) => (
                  <li
                    key={item.cartItemId}
                    className={`flex items-center gap-4 px-5 py-4 transition-all duration-300 hover:bg-muted ${
                      removingIds.has(item.cartItemId)
                        ? "opacity-0 -translate-x-2"
                        : ""
                    }`}
                  >
                    {/* Cover thumbnail */}
                    <Link
                      to={`/books/${item.book.bookId}`}
                      className="shrink-0 rounded-lg overflow-hidden border border-border focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                      aria-label={`View details for ${item.book.title}`}
                    >
                      <img
                        src={item.book.coverImageUrl}
                        alt={`Cover of ${item.book.title}`}
                        width={56}
                        height={80}
                        className="h-20 w-14 object-cover"
                      />
                    </Link>
 
                    {/* Title + Author */}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/books/${item.book.bookId}`}
                        className="block truncate text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-sm"
                      >
                        {item.book.title}
                      </Link>
                      <p
                        className="mt-0.5 truncate text-sm text-muted-foreground"
                        title={item.book.authorNames}
                      >
                        {formatAuthorNames(item.book.authorNames)}
                      </p>
                    </div>
 
                    {/* Price */}
                    <p className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                      {formatPrice(item.book.price)}
                    </p>
 
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.cartItemId)}
                      disabled={removingIds.has(item.cartItemId)}
                      aria-label={`Remove ${item.book.title} from cart`}
                      className="shrink-0 flex items-center justify-center size-8 rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 disabled:opacity-40"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
 
            {/* Order summary */}
            <div className="mt-4 rounded-xl border border-border bg-card px-5 py-5 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-bold text-primary tabular-nums">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
 
              {/* Checkout button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isEmpty}
                className="mt-4 w-full rounded-lg bg-primary text-primary-foreground font-medium py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
              >
                {isCheckingOut ? (
                  <Loader2 className="size-5 mx-auto animate-spin" aria-hidden="true" />
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
