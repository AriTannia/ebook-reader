import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import InputField from "../../components/common/InputField";
import Alert from "../../components/common/Alert";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../reducers/auth";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value) => {
    if (!value) return "Email is required.";
    if (!value.includes("@")) return "Please enter a valid email address.";
    return "";
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setFieldError(validateEmail(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const errMsg = validateEmail(email);

    if (errMsg) {
      setFieldError(errMsg);
      return;
    }

    setLoading(true);

    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch((err) => {
        setError(err || "An error occurred. Please try again.");
        setLoading(false);
      });
  };

  if (submitted) {
    return (
      <AuthLayout>
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              If an account exists for{" "}
              <span className="font-medium text-foreground">{email}</span>,
              we've sent a password reset link. It will expire in 15 minutes.
            </p>

            <Link
              to="/login"
              className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
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
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert message={error} onClose={() => setError("")} />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <InputField
              id="email"
              label="Email address"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleChange}
              error={fieldError}
              icon={<Mail className="h-4 w-4" />}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-medium text-primary transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
