import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import * as Dialog from "@radix-ui/react-dialog"

export default function SignInRequiredModal({ isOpen, onClose }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Backdrop — dismissible by clicking outside, covers entire viewport */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 animate-modal-backdrop-in" />

        {/* Modal — centered on the screen, true fullscreen overlay */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card shadow-lg animate-modal-content-in p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Sign in to continue
              </h2>
              <p className="text-sm text-muted-foreground">
                You need to sign in to access your personal library and reading
                history.
              </p>
            </div>

            {/* Sign In Link with arrow */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-70 transition-opacity border-b border-transparent hover:border-primary"
            >
              <span className="underline">Sign in</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}