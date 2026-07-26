import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchContentUrl } from "../../../reducers/book.content";
import { saveReadingProgress } from "../../../reducers/reading.progress";

const PROGRESS_SAVE_DEBOUNCE_MS = 3000;

export default function TxtReader({ bookId, title }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rootRef = useRef(null);
  const saveTimerRef = useRef(null);
  const lastPercentRef = useRef(null);

  const flushProgress = useCallback(() => {
    const percent = lastPercentRef.current;
    if (percent === null) return;

    dispatch(
      saveReadingProgress({
        bookId: Number(bookId),
        // TXT has no addressable position like a CFI or page number, so we
        // just persist the scroll percentage itself as the locator.
        locator: percent.toFixed(2),
        progressPercent: Math.min(100, Math.max(0, percent)),
      }),
    );
  }, [bookId, dispatch]);

  useEffect(() => {
    let cancelled = false;

    const loadText = async () => {
      try {
        const res = await dispatch(fetchContentUrl(bookId));
        const signedUrl = res.payload.data;
        const fileRes = await fetch(signedUrl);
        if (!fileRes.ok) throw new Error("Failed to download text file");
        const text = await fileRes.text();
        if (!cancelled) {
          setContent(text);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    loadText();
    return () => {
      cancelled = true;
    };
  }, [bookId, dispatch]);

  // Attach a scroll listener to the actual scrollable ancestor rendered by
  // ReadingPage (the "overflow-y-auto" wrapper), since this component's own
  // root div isn't the scroll container.
  useEffect(() => {
    if (loading || error) return undefined;

    const scrollContainer = rootRef.current?.parentElement;
    if (!scrollContainer) return undefined;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const maxScroll = scrollHeight - clientHeight;
      const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 100;
      lastPercentRef.current = percent;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        flushProgress();
      }, PROGRESS_SAVE_DEBOUNCE_MS);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [loading, error, flushProgress]);

  // Best-effort save on unmount.
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      flushProgress();
    };
  }, [bookId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-background flex justify-center py-8 px-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-lg font-semibold mb-6">{title}</h1>
        {loading ? (
          <p className="text-muted-foreground">Loading text...</p>
        ) : (
          <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed text-foreground">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}