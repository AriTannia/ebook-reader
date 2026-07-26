import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowRight, Loader2, CheckCircle2, XCircle } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import InputField from "../../components/common/InputField";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../reducers/auth";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const validateForm = (newPassword, confirmPassword) => {
    const errors = {};

    if (!newPassword) {
      errors.newPassword = "Password is required.";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (newPassword && confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  };

  const validateField = (name, value) => {
    const errors = validateForm(
      name === "newPassword" ? value : formData.newPassword,
      name === "confirmPassword" ? value : formData.confirmPassword,
    );
    return errors[name] ? { [name]: errors[name] } : {};
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const newErrors = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      toast.error("Invalid or missing token. Please request a new password reset.");
      return;
    }

    const allErrors = {
      ...validateField("newPassword", formData.newPassword),
      ...validateField("confirmPassword", formData.confirmPassword),
    };

    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      return;
    }

    setLoading(true);

    dispatch(resetPassword({ token, newPassword: formData.newPassword }))
      .unwrap()
      .then(() => {
        setLoading(false);
        setSuccess(true);
        toast.success("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2500);
      })
      .catch((errorMessage) => {
        setLoading(false);
        toast.error(errorMessage || "An error occurred. Please try again.");
      });
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Password reset successful
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Redirecting you to Sign In...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Token invalid/missing ngay từ đầu -> không hiện form
  if (!token) {
    return (
      <AuthLayout>
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Invalid reset link
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This link is missing or malformed. Please request a new password
              reset.
            </p>
            <Link
              to="/forgot-password"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter a new password for your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <InputField
              id="newPassword"
              label="New password"
              type="password"
              name="newPassword"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              error={fieldErrors.newPassword}
              icon={<Lock className="h-4 w-4" />}
            />
            <InputField
              id="confirmPassword"
              label="Confirm password"
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={fieldErrors.confirmPassword}
              icon={<Lock className="h-4 w-4" />}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
