import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Document, Page, pdfjs } from "react-pdf";
import { streamPdf } from "../../../reducers/book.content";
import { saveReadingProgress } from "../../../reducers/reading.progress";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PROGRESS_SAVE_DEBOUNCE_MS = 3000;

function LazyPdfPage({ pageNumber, width, onPageVisible }) {
  const pageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy-load observer: fires once, then disconnects.
  useEffect(() => {
    const element = pageRef.current;
    if (!element || isVisible) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  // Reading-progress observer: stays alive, reports whenever this page
  // is meaningfully in view (>= 50%).
  useEffect(() => {
    if (!isVisible) return undefined;
    const element = pageRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onPageVisible?.(pageNumber);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible, pageNumber, onPageVisible]);

  return (
    <div ref={pageRef} className="flex justify-center">
      {isVisible ? (
        <Page
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      ) : (
        <div className="w-full max-w-180 min-h-240 rounded-md border border-border bg-background/70 flex items-center justify-center text-sm text-muted-foreground">
          Loading page {pageNumber}...
        </div>
      )}
    </div>
  );
}

export default function PdfReader({ bookId, title }) {
  const dispatch = useDispatch();
  const pdfStream = useSelector((state) => state.bookContent.pdfStream);
  const [numPages, setNumPages] = useState(null);

  const currentPageRef = useRef(1);
  const numPagesRef = useRef(null);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    dispatch(streamPdf(bookId));
  }, [bookId, dispatch]);

  const fileConfig = useMemo(() => {
    return {
      url: pdfStream,
      withCredentials: true,
    };
  }, [pdfStream]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    numPagesRef.current = numPages;
  };

  const flushProgress = useCallback(() => {
    const total = numPagesRef.current;
    const page = currentPageRef.current;
    if (!total || !page) return;

    dispatch(
      saveReadingProgress({
        bookId: Number(bookId),
        locator: String(page),
        progressPercent: Math.min(100, (page / total) * 100),
      }),
    );
  }, [bookId, dispatch]);

  const handlePageVisible = useCallback(
    (pageNumber) => {
      if (currentPageRef.current === pageNumber) return;
      currentPageRef.current = pageNumber;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        flushProgress();
      }, PROGRESS_SAVE_DEBOUNCE_MS);
    },
    [flushProgress],
  );

  // Best-effort save on unmount (route change, closing the reader, etc).
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      flushProgress();
    };
  }, [bookId]);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center py-8 px-4">
      <h1 className="text-lg font-semibold mb-4 text-center">{title}</h1>
      <Document
        file={fileConfig}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p className="text-muted-foreground">Loading PDF...</p>}
        error={<p className="text-destructive">Failed to load PDF file.</p>}
      >
        <div className="flex w-full justify-center">
          <div className="w-full max-w-3xl space-y-6">
            {Array.from({ length: numPages ?? 0 }, (_, index) => (
              <LazyPdfPage
                key={index + 1}
                pageNumber={index + 1}
                width={720}
                onPageVisible={handlePageVisible}
              />
            ))}
          </div>
        </div>
      </Document>
    </div>
  );
}