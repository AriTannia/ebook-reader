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

  const [formdData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState({
    email: false,
    password: false,
  });

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const validateForm = (email, password) => {
    const errors = {};

    if(!email){
      errors.email = "Email is required.";
    } else if(!email.includes("@")){
      errors.email = "Please enter a valid email address.";
    }

    if(!password){
      errors.password = "Password is required.";
    } else if(password.length < 6){
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };

  const validateField = (name, value) => {
    const errors = validateForm(
      name === "email" ? value : formdData.email,
      name === "password" ? value : formdData.password
    );

    return errors[name] ? { [name]: errors[name] } : {};
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdData,
      [name]: value
    });
    const newErrors = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: newErrors[name]
    }));
    
    setServerError((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  if(isLoggedIn) {
    return <Navigate to="/" />;
  }

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const allErrors = {
          ...validateField("email", formdData.email),
          ...validateField("password", formdData.password),
        }

        if(Object.keys(allErrors).length > 0){
          setFieldErrors(allErrors);
          setLoading(false);
          return;
        }

        setServerError({ email: false, password: false });

        dispatch(login({ email: formdData.email, password: formdData.password }))
        .unwrap()
        .then(() => {
            navigate("/");
        })
        .catch((errorMessage) => {
            setLoading(false);
            setError(errorMessage || "Login failed. Please try again.");
            setServerError({ email: true, password: true });
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
            <p className="mt-2 text-sm text-muted-foreground cursor-pointer">
              Sign in to continue to your library
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert message={error} onClose={() => setError("")} />
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>
            <InputField
              id="email"
              label="Email address"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formdData.email}
              onChange={handleInputChange}
              error={fieldErrors.email}
              isInvalid={serverError.email}
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
                value={formdData.password}
                onChange={handleInputChange}
                error={fieldErrors.password}
                isInvalid={serverError.password}
                icon={<Lock className="h-4 w-4" />}
              />
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs font-medium text-primary transition-opacity hover:opacity-80 cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
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
              className="font-medium text-primary transition-opacity hover:opacity-80 cursor-pointer"
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