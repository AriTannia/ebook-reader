import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookFormatForReading, resetBookContent } from "../../reducers/book.content";
import ReaderNavbar from "../../components/common/ReaderNavbar";
import PdfReader from "../../components/library/reader/PdfReader";
import EpubReader from "../../components/library/reader/EpubReader";
import TxtReader from "../../components/library/reader/TxtReader";

export default function ReadingPage() {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const hideTimerRef = useRef(null);
  const [navHidden, setNavHidden] = useState(false);
  const { bookFormat, loading, error } = useSelector((state) => state.bookContent);

  useEffect(() => {
    dispatch(fetchBookFormatForReading(bookId));
    return () => {
      dispatch(resetBookContent());
    };
  }, [bookId, dispatch]);

  useEffect(() => {
    if (!bookFormat) {
      return undefined;
    }

    setNavHidden(false);

    hideTimerRef.current = window.setTimeout(() => {
      setNavHidden(true);
    }, 1500);

    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [bookFormat]);

  const showToolbar = () => {
    setNavHidden(false);
  };

  const hideToolbar = () => {
    setNavHidden(true);
  };

  const resetToolbarHideTimer = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    showToolbar();
    hideTimerRef.current = window.setTimeout(() => {
      hideToolbar();
    }, 1500);
  };

  if (loading && !bookFormat) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <ReaderNavbar hidden={navHidden} />
        <div
          className="flex flex-1 items-center justify-center text-muted-foreground"
          onMouseMove={resetToolbarHideTimer}
          onTouchStart={resetToolbarHideTimer}
          onPointerDown={showToolbar}
        >
          Loading book...
        </div>
      </div>
    );
  }

  if (error || !bookFormat) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <ReaderNavbar hidden={navHidden} />
        <div
          className="flex flex-1 items-center justify-center text-muted-foreground"
          onMouseMove={resetToolbarHideTimer}
          onTouchStart={resetToolbarHideTimer}
          onPointerDown={showToolbar}
        >
          Book not found or you don't have access.
        </div>
      </div>
    );
  }

  switch (bookFormat.formatType) {
    case "PDF":
      return (
        <div className="relative h-screen overflow-hidden bg-background" onPointerDown={showToolbar}>
          <ReaderNavbar hidden={navHidden} title={bookFormat.bookTitle} />
          <div className="h-full overflow-y-auto overscroll-contain" onScroll={resetToolbarHideTimer} onMouseMove={resetToolbarHideTimer} onTouchStart={resetToolbarHideTimer}>
            <PdfReader bookId={bookId} title={bookFormat.bookTitle} />
          </div>
        </div>
      );
    case "EPUB":
      return (
        <div className="relative h-screen overflow-hidden bg-background" onPointerDown={showToolbar}>
          <ReaderNavbar hidden={navHidden} title={bookFormat.bookTitle} />
          <div className="h-full overflow-hidden">
            <EpubReader
              bookId={bookId}
              onInteract={resetToolbarHideTimer}
              onScrollIntent={hideToolbar}
            />
          </div>
        </div>
      );
    case "TXT":
      return (
        <div className="relative h-screen overflow-hidden bg-background" onPointerDown={showToolbar}>
          <ReaderNavbar hidden={navHidden} title={bookFormat.bookTitle} />
          <div className="h-full overflow-y-auto overscroll-contain" onScroll={resetToolbarHideTimer} onMouseMove={resetToolbarHideTimer} onTouchStart={resetToolbarHideTimer}>
            <TxtReader bookId={bookId} title={bookFormat.bookTitle} />
          </div>
        </div>
      );
    default:
      return (
        <div className="relative h-screen overflow-hidden bg-background" onPointerDown={showToolbar}>
          <ReaderNavbar hidden={navHidden} title={bookFormat.bookTitle} />
          <div className="flex flex-1 items-center justify-center text-destructive">
            Unsupported file type: {bookFormat.formatType}
          </div>
        </div>
      );
  }
}