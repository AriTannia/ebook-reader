import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import ePub from "epubjs";
import { fetchContentUrl } from "../../../reducers/book.content";
import { saveReadingProgress } from "../../../reducers/reading.progress";

const PROGRESS_SAVE_DEBOUNCE_MS = 3000;

export default function EpubReader({ bookId, onInteract, onScrollIntent }) {
  const dispatch = useDispatch();
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const locationsReadyRef = useRef(false);
  const saveTimerRef = useRef(null);
  const lastLocationRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const flushProgress = useCallback(() => {
    const loc = lastLocationRef.current;
    if (!loc) return;

    dispatch(
      saveReadingProgress({
        bookId: Number(bookId),
        locator: loc.cfi,
        progressPercent: Math.min(100, Math.max(0, loc.percent)),
      }),
    );
  }, [bookId, dispatch]);

  useEffect(() => {
    let cancelled = false;

    const loadBook = async () => {
      try {
        const res = await dispatch(fetchContentUrl(bookId));
        const signedUrl = res.payload.data;

        const fileRes = await fetch(signedUrl);
        if (!fileRes.ok) throw new Error("Failed to download epub file");
        const arrayBuffer = await fileRes.arrayBuffer();

        if (cancelled) return;

        const book = ePub(arrayBuffer);
        const rendition = book.renderTo(viewerRef.current, {
          width: "100%",
          height: "100%",
          manager: "continuous",
          spread: "none",
        });
        rendition.hooks.render.register((view) => {
          const contents = view?.contents;

          if (!contents) {
            return;
          }

          contents.addStylesheetRules(
            {
              html: {
                margin: "0",
                padding: "0",
                overflow: "auto !important",
                "overflow-x": "hidden !important",
                height: "100% !important",
                "min-height": "100% !important",
                "column-count": "1 !important",
                "column-gap": "0 !important",
                "column-width": "auto !important",
              },
              body: {
                margin: "0 !important",
                padding: "0 !important",
                overflow: "visible !important",
                "overflow-x": "hidden !important",
                "line-height": "1.8 !important",
                "font-family": "serif !important",
                width: "100% !important",
                height: "100% !important",
                "min-height": "100% !important",
                display: "block !important",
                "column-count": "1 !important",
                "column-gap": "0 !important",
                "column-width": "auto !important",
              },
              "body *": {
                "max-width": "100% !important",
              },
              img: {
                display: "block !important",
                "max-width": "100% !important",
                "max-height": "100% !important",
                height: "auto !important",
                "object-fit": "contain !important",
                "break-inside": "avoid !important",
              },
              svg: {
                "max-width": "100% !important",
              },
            },
            "reader-scroll-fix",
          );

          const doc = contents.document;

          const handleInteract = () => {
            onInteract?.();
          };

          const handleScroll = () => {
            onScrollIntent?.();
          };

          doc.addEventListener("click", handleInteract);
          doc.addEventListener("touchstart", handleInteract, { passive: true });
          doc.addEventListener("scroll", handleScroll, {
            passive: true,
            capture: true,
          });
        });
        book.ready
          .then(() => book.locations.generate(1600))
          .then(() => {
            if (!cancelled) locationsReadyRef.current = true;
          })
          .catch((err) => {
            console.warn("Failed to generate epub locations, progress tracking disabled:", err);
          });

        rendition.on("relocated", (location) => {
          if(!locationsReadyRef.current) return;
          const cfi = location?.start?.cfi;
          if(!cfi) return;

          const percent = book.locations.percentageFromCfi(cfi) * 100;
          lastLocationRef.current = { cfi, percent };

          if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
          }
          saveTimerRef.current = setTimeout(() => {
            flushProgress();
          }, PROGRESS_SAVE_DEBOUNCE_MS);
        });

        rendition.flow("scrolled-continuous");
        rendition.display();
        renditionRef.current = rendition;
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      cancelled = true;
      if(saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      flushProgress();
      renditionRef.current?.destroy();
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
    <div className="flex h-full min-h-0 w-full flex-col">
      {loading && <p className="text-muted-foreground">Loading book...</p>}
      <div
        ref={viewerRef}
        className="w-full flex-1 min-h-0 overflow-hidden bg-background"
      />
    </div>
  );
}
