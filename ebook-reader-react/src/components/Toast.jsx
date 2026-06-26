import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import { useToast } from "../context/ToastContext"

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg animate-fade-in-up max-w-sm ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-600"
              : toast.type === "error"
                ? "bg-red-50 border border-red-200 text-red-600"
                : "bg-blue-50 border border-blue-200 text-blue-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0" />
          ) : toast.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0" />
          ) : (
            <Info className="h-5 w-5 shrink-0" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto shrink-0 text-opacity-60 hover:text-opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}