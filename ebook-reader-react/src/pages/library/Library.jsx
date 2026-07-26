import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLibraryItems, toggleFavoriteItem } from "../../reducers/library";
import LibraryBookCard from "../../components/library/LibraryBookCard";
import BookCardSkeleton from "../../components/book/BookCardSkeleton";

const FILTER_TABS = [
  { key: "ALL", label: "All Books" },
  { key: "FAVORITE", label: "Favorites" },
];

export default function LibraryPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.library);
  const [activeTab, setActiveTab] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(
      getAllLibraryItems({
        isFavorite: activeTab === "FAVORITE" ? true : undefined,
        keyword: keyword || undefined,
      }),
    );
  }, [dispatch, activeTab, keyword]);

  const handleToggleFavorite = (bookId, isFavorite) => {
    dispatch(toggleFavoriteItem({ bookId, isFavorite: !isFavorite }));
  };
  
  return (
    <div className="min-h-full bg-background">
      <main className="mx-auto max-w-7xl px-6 py-12 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-foreground">My Library</h1>
          <input
            type="text"
            placeholder="Search your books..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-sm w-64"
          />
        </div>

        <div className="flex gap-2 border-b border-border">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-semibold cursor-pointer transition-colors ${
                activeTab === tab.key
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">
            No books found in your library.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {items?.map((item) => (
              <LibraryBookCard
                key={item.book.bookId}
                item={item}
                onToggleFavorite={() =>
                  handleToggleFavorite(item.book.bookId, item.isFavorite)
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}