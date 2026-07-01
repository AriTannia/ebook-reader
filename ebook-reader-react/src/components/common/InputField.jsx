import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
  label,
  icon,
  id,
  type = "text",
  error,
  isInvalid,
  ...props
}) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const resolvedType = isPassword ? (show ? "text" : "password") : type;
  const hasError = isInvalid || Boolean(error);
  const showErrorMessage = typeof error === "string" && error.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="group relative flex items-center">
        <span className={`pointer-events-none absolute left-3.5 text-muted-foreground transition-colors group-focus-within:${
          hasError ? 'text-red-500' : 'text-primary'
        } ${hasError ? 'text-red-500' : 'text-muted-foreground'}`}>
          {icon}
        </span>
        <input
          id={id}
          type={resolvedType}
          className={`w-full rounded-xl border border-input bg-card py-3 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all ${
            hasError ? 'border-red-600 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20' 
            : 'border-input focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {showErrorMessage && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
