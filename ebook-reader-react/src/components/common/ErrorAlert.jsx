import { AlertCircle, X } from "lucide-react"

export default function ErrorAlert({ message, onClose }) {
      return (
    <div className="animate-alert-in flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm text-red-600">
      <AlertCircle className="h-5 w-5 shrink-0 font-semibold text-red-600" />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss error"
        className="ml-2 shrink-0 text-red-600 transition-opacity hover:opacity-70"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}