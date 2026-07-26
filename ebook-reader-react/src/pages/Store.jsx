import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HorizontalScrollSection from "../components/book/HorizontalScrollSection";
import { fetchBooks } from "../reducers/book";
import * as BookService from "../services/book.service";

const STORE_SECTIONS = [
  { key: "BESTSELLER", title: "Best Sellers", badge: "BESTSELLER" },
  { key: "NEW", title: "New Releases", badge: "NEW" },
  { key: "MYSTERY", title: "Mystery", filters: { categoryId: 1 } },
  { key: "CLASSICS", title: "Classics", filters: { categoryId: 4 } },
];

const SUGGESTION_DEBOUNCE_MS = 350;
const SUGGESTION_LIMIT = 6;

export default function Store() {
  const dispatch = useDispatch();
  const { sections, loadingSections } = useSelector((state) => state.book);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const searchBoxRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const showSuggestions = isSearchActive && searchQuery.trim().length > 0;

  const filteredSections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return STORE_SECTIONS.map((section) => {
      const books = sections[section.key] || [];
      if (!normalizedQuery) return { ...section, books };
      const filteredBooks = books.filter((book) => {
        const title = book.title?.toLowerCase() || "";
        const authors = book.authors?.map((a) => a.authorName?.toLowerCase() || "").join(" ");
        return title.includes(normalizedQuery) || authors?.includes(normalizedQuery);
      });
      return { ...section, books: filteredBooks };
    }).filter((section) => section.books.length > 0);
  }, [searchQuery, sections]);

  useEffect(() => {
    STORE_SECTIONS.forEach((section) => {
      dispatch(fetchBooks({ key: section.key, badge: section.badge, filters: section.filters, page: 0, size: 10 }));
    });
  }, [dispatch]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!trimmed) {
      requestIdRef.current += 1;
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const thisRequestId = ++requestIdRef.current;
      setLoadingSuggestions(true);
      try {
        const response = await BookService.searchBooks({ keyword: trimmed, page: 0, size: SUGGESTION_LIMIT });
        if (thisRequestId !== requestIdRef.current) return;
        setSuggestions(response.data.data?.content ?? []);
      } catch {
        if (thisRequestId === requestIdRef.current) setSuggestions([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setLoadingSuggestions(false);
      }
    }, SUGGESTION_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const collapseSearch = () => {
    setIsSearchActive(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (!isSearchActive) return;

    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        collapseSearch();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") collapseSearch();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchActive]);

  const goToBook = (book) => {
    collapseSearch();
    navigate(`/books/${book.bookId}`);
  };

  const goToFullSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    collapseSearch();
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const goToAdvancedSearch = () => {
    collapseSearch();
    navigate("/search");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") goToFullSearch();
  };

  return (
    <div className="min-h-full bg-background">
      <main className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        {/* Header row */}
        <div className="flex items-center gap-8">
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isSearchActive ? "max-w-0 -translate-x-4 opacity-0" : "max-w-xl translate-x-0 opacity-100"
            }`}
          >
            <h1 className="whitespace-nowrap text-3xl font-bold text-foreground">Store</h1>
            <p className="mt-1 whitespace-nowrap text-sm text-muted-foreground">
              Browse curated collections and search by title or author.
            </p>
          </div>

          <div ref={searchBoxRef} className="relative flex-1">
            <div className="flex items-center gap-3">
              <label
                className={`flex flex-1 items-center gap-3 rounded-full border bg-card px-5 py-3.5 shadow-sm transition-all duration-300 ${
                  isSearchActive
                    ? "border-primary/40 shadow-md ring-4 ring-primary/10"
                    : "border-border hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <Search
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isSearchActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchActive(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search books or authors..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {loadingSuggestions && (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                )}
              </label>

              <button
                onClick={goToAdvancedSearch}
                className={`flex shrink-0 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full px-4 py-3.5 text-sm font-medium text-muted-foreground transition-all duration-300 ease-in-out hover:bg-muted hover:text-foreground ${
                  isSearchActive ? "max-w-xs opacity-100" : "max-w-0 px-0 opacity-0"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 shrink-0" />
                Advanced Search
              </button>
            </div>

            {/* Suggestions popup */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                {loadingSuggestions ? (
                  <div className="flex items-center gap-2 px-5 py-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </div>
                ) : suggestions.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-muted-foreground">
                    No books found for "{searchQuery.trim()}"
                  </p>
                ) : (
                  <>
                    <div className="max-h-96 overflow-y-auto py-2">
                      {suggestions.map((book) => (
                        <button
                          key={book.bookId}
                          onClick={() => goToBook(book)}
                          className="flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-muted/60"
                        >
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="h-14 w-10 shrink-0 rounded-md object-cover bg-muted shadow-sm"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{book.title}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {book.authors?.map((a) => a.authorName).join(", ")}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={goToFullSearch}
                      className="w-full border-t border-border px-5 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-muted/60"
                    >
                      View all results for "{searchQuery.trim()}"
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section list — dims when search is active */}
        <div className="relative">
          {isSearchActive && (
            <div className="absolute inset-0 z-30 rounded-2xl bg-background/70 backdrop-blur-sm transition-opacity duration-300" />
          )}

          <div
            className={`space-y-16 transition-opacity duration-300 ${
              isSearchActive ? "pointer-events-none opacity-40" : "opacity-100"
            }`}
          >
            {STORE_SECTIONS.map((section) => (
              <HorizontalScrollSection
                key={section.key}
                title={section.title}
                loading={loadingSections[section.key] || false}
                books={sections[section.key] || []}
                viewAllLink={`/store/${section.key.toLowerCase()}`}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-muted/30 mt-20 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Ebook Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}