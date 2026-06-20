import React, { useState } from 'react';
import { Link } from "react-router-dom"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import AuthLayout from "../components/AuthLayout"
import InputField from "../components/InputField"
import Alert from "../components/Alert"
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '../reducers/auth';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  if(isLoggedIn) {
    return <Navigate to="/" />;
  }

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        dispatch(login({ email, password }))
        .unwrap()
        .then(() => {
            navigate("/");
        })
        .catch(() => {
            setLoading(false);
            setError(message || "Login failed. Please try again.");
        });
    };

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to your library
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert message={error} onClose={() => setError("")} />
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate={false}>
            <InputField
              id="email"
              label="Email address"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />
            <div className="flex flex-col gap-1.5">
              <InputField
                id="password"
                label="Password"
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs font-medium text-primary transition-opacity hover:opacity-80"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary transition-opacity hover:opacity-80"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
};

export default Login;