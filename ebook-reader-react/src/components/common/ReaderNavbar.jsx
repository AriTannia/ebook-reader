import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReaderNavbar({ title, hidden = false }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/library");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md transition-all duration-200 ${
        hidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {title ? (
          <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
            {title}
          </h1>
        ) : (
          <div className="flex-1" />
        )}

        <div className="w-18" />
      </div>
    </header>
  );
}