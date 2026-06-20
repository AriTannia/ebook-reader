import { AlertCircle, X } from "lucide-react"

export default function Alert({ message, onClose }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="animate-alert-in flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <AlertCircle className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <p className="flex-1 text-sm leading-relaxed text-foreground">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}