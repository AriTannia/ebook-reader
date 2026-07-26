import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { searchBooks } from "../reducers/book";
import BookCard from "../components/book/BookCard";
import { FilterPanel } from "../components/search/FilterPanel";
import { useSearchFilters } from "../hooks/useSearchFilters";

import { fetchAuthors } from "../reducers/author";
import { fetchAllCategories } from "../reducers/category";
import { fetchTags } from "../reducers/tag";
import { fetchPublishers } from "../reducers/publisher";

export default function SearchStore() {
  const dispatch = useDispatch();

  const { searchResults, searchLoading } = useSelector((state) => state.book);
  const { authors } = useSelector((state) => state.author);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const { publishers } = useSelector((state) => state.publisher);

  const {
    filters,
    setKeyword,
    setMultiParam,
    removeFromMultiParam,
    setSingleParam,
    setPage,
    clearAllFilters,
    clearMultiFilters,
  } = useSearchFilters();

  const [inputValue, setInputValue] = useState(filters.keyword);
  const [showFilters, setShowFilters] = useState(false);

  const content = searchResults?.content ?? [];
  const totalElements = searchResults?.totalElements ?? 0;
  const totalPages = searchResults?.totalPages ?? 0;
  const currentPage = searchResults?.number ?? filters.page;

  useEffect(() => {
    dispatch(fetchAuthors());
    dispatch(fetchAllCategories());
    dispatch(fetchTags());
    dispatch(fetchPublishers());
  }, [dispatch]);

  useEffect(() => {
    setInputValue(filters.keyword);
  }, [filters.keyword]);

  useEffect(() => {
    const rawParams = {
      keyword: filters.keyword,
      page: filters.page,
      sort: filters.sort,
      authorIds: filters.authorIds,
      categoryIds: filters.categoryIds,
      tagIds: filters.tagIds,
      publisherId: filters.publisherId,
    };

    const params = Object.fromEntries(
      Object.entries(rawParams).filter(([, value]) =>
        Array.isArray(value) ? value.length > 0 : value !== "" && value != null,
      ),
    );

    dispatch(searchBooks(params));
  }, [dispatch, filters]);

  const handleSearchKeyDown = (e) => {
    if (e.key !== "Enter") return;
    setKeyword(inputValue.trim());
  };

  // Map raw entities to the { id, name } shape the filter UI expects,
  // in one place so FilterPanel stays entity-agnostic.
  const authorOptions = useMemo(
    () => (authors || []).map((a) => ({ id: a.authorId, name: a.authorName })),
    [authors],
  );
  const categoryOptions = useMemo(
    () =>
      (categories || []).map((c) => ({
        id: c.categoryId,
        name: c.categoryName,
      })),
    [categories],
  );
  const tagOptions = useMemo(
    () => (tags || []).map((t) => ({ id: t.tagId, name: t.tagName })),
    [tags],
  );
  const publisherOptions = useMemo(
    () =>
      (publishers || []).map((p) => ({
        id: p.publisherId,
        name: p.publisherName,
      })),
    [publishers],
  );

  return (
    <div className="min-h-full bg-background">
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Search Results{filters.keyword && `: "${filters.keyword}"`}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalElements} results
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 sm:w-72">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search books or authors..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm shadow-sm hover:bg-muted/50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            authorOptions={authorOptions}
            categoryOptions={categoryOptions}
            tagOptions={tagOptions}
            publisherOptions={publisherOptions}
            setMultiParam={setMultiParam}
            removeFromMultiParam={removeFromMultiParam}
            setSingleParam={setSingleParam}
            clearAllFilters={clearAllFilters}
            clearMultiFilters={clearMultiFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        <div>
          {searchLoading ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Searching...
            </p>
          ) : content.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No matching books found.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {content.map((book) => (
                <BookCard key={book.bookId} book={book} />
              ))}
            </div>
          )}
        </div>

        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setPage(Math.max(0, filters.page - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage(filters.page + 1)}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
