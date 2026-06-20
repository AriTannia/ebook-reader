import React, { useState } from 'react';
import { Link } from "react-router-dom"
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import AuthLayout from "../components/AuthLayout"
import InputField from "../components/InputField"
import Alert from "../components/Alert"
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { register } from '../reducers/auth';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { message } = useSelector((state) => state.message);

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    dispatch(register({ username, email, password }))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch(() => {
        setLoading(false);
        setError(message || "Registration failed. Please try again.");
      });
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join thousands of readers today
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert message={error} onClose={() => setError("")} />
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <InputField
              id="name"
              label="Full name"
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              minLength={3}
              maxLength={20}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User className="h-4 w-4" />}
            />
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
            <InputField
              id="password"
              label="Password"
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              maxLength={40}
              icon={<Lock className="h-4 w-4" />}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary transition-opacity hover:opacity-80"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;