import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Loader2, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { changePassword, logout } from "../../reducers/auth";
import InputField from "../../components/common/InputField";
import Alert from "../../components/common/Alert";

const initialForm = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const MIN_PASSWORD_LENGTH = 8;

const fields = [
  {
    key: "oldPassword",
    label: "Current Password",
    placeholder: "Enter your current password",
    autoComplete: "current-password",
    icon: <KeyRound className="h-4 w-4" />,
  },
  {
    key: "newPassword",
    label: "New Password",
    placeholder: `At least ${MIN_PASSWORD_LENGTH} characters`,
    autoComplete: "new-password",
    icon: <Lock className="h-4 w-4" />,
  },
  {
    key: "confirmPassword",
    label: "Confirm New Password",
    placeholder: "Re-enter your new password",
    autoComplete: "new-password",
    icon: <Lock className="h-4 w-4" />,
  },
];

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    // While the success screen is showing, the only way out is to log in
    // again — the password (and likely the session) has already changed.
    if (success) return;

    setForm(initialForm);
    setError("");
    setFieldErrors({});
    setSubmitting(false);
    onClose();
  };

  const handleGoToLogin = async () => {
    // Best-effort: clear any local/refresh session before redirecting.
    // Even if this fails (e.g. token already invalid), we still navigate.
    try {
      await dispatch(logout());
    } finally {
      setForm(initialForm);
      setFieldErrors({});
      setSubmitting(false);
      setSuccess(false);
      onClose();
      navigate("/login", { replace: true });
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) setError("");
  };

  const validate = () => {
    const errors = {};

    if (!form.oldPassword.trim()) {
      errors.oldPassword = "Please enter your current password.";
    }

    if (!form.newPassword.trim()) {
      errors.newPassword = "Please enter a new password.";
    } else if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
      errors.newPassword = `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (form.newPassword === form.oldPassword) {
      errors.newPassword =
        "New password must be different from the current password.";
    }

    if (!form.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (form.confirmPassword !== form.newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      await dispatch(
        changePassword({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      ).unwrap();

      setSuccess(true);
      dispatch(logout());
    } catch (err) {
      setError(err || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fade-in"
      onClick={success ? undefined : resetAndClose}
    >
      <div
        className="w-full max-w-md animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              {success ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {success ? "Password Updated" : "Change Password"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {success
                  ? "Your password has been changed."
                  : "Choose a strong password you don't use elsewhere."}
              </p>
            </div>
          </div>
          {!success && (
            <button
              type="button"
              onClick={resetAndClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {success ? (
          /* Success state — forces re-login since credentials just changed */
          <div className="px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <p className="text-sm text-foreground">
              Your password has been changed successfully.
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              For security reasons, please log in again with your new password.
            </p>
            <button
              type="button"
              onClick={handleGoToLogin}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5
                text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200
                hover:opacity-90 hover:shadow-md active:scale-[0.98] cursor-pointer"
            >
              Log In Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {error && (
              <div className="mb-4">
                <Alert message={error} onClose={() => setError("")} />
              </div>
            )}

            <div className="space-y-4">
              {fields.map(({ key, label, placeholder, autoComplete, icon }) => (
                <InputField
                  key={key}
                  id={key}
                  label={label}
                  icon={icon}
                  type="password"
                  name={key}
                  required
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={handleChange(key)}
                  error={fieldErrors[key]}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5
                text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200
                hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed
                disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
              <button
                type="button"
                onClick={resetAndClose}
                disabled={submitting}
                className="flex flex-1 items-center justify-center rounded-lg border border-border
                bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200
                hover:bg-muted hover:shadow-sm active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;