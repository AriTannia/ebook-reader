import { Link } from "react-router-dom";
import { BookOpen, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HorizontalScrollSection from "../components/HorizontalScrollSection";

import { fetchBooks } from "../reducers/book";

const STORE_SECTIONS = [
  {
    key: "BESTSELLER",
    title: "Best Sellers",
    badge: "BESTSELLER",
  },
  {
    key: "NEW",
    title: "New Releases",
    badge: "NEW",
  },
  {
    key: "MYSTERY",
    title: "Mystery",
    filters: {
      categoryId: 1,
    },
  },
  {
    key: "CLASSICS",
    title: "Classics",
    filters: {
      categoryId: 4,
    },
  },
];

export default function Store() {
  const dispatch = useDispatch();
  const { sections, loadingSections } = useSelector((state) => state.book);

  useEffect(() => {
    STORE_SECTIONS.forEach((section) => {
      dispatch(
        fetchBooks({
          key: section.key,
          badge: section.badge,
          filters: section.filters,
          page : 0,
          size : 10
        }),
      );
    });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        {STORE_SECTIONS.map((section) => (
          <HorizontalScrollSection
            key={section.key}
            title={section.title}
            loading={loadingSections[section.key] || false}
            books={sections[section.key] || []}
            viewAllLink={`/store/${section.key.toLowerCase()}`}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 mt-20 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Ebook Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
