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

  const [formdData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState({
    fullName: false,
    email: false,
    password: false,
  });
  
  const { message } = useSelector((state) => state.message);

  const validateForm = (fullName, email, password) => {
    const errors = {};
    if(!fullName){
      errors.fullName = "Full name is required.";
    } else if(fullName.length < 3){
      errors.fullName = "Full name must be at least 3 characters.";
    }

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
      name === "fullName" ? value : formdData.fullName,
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

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const allErrors = {
      ...validateField("fullName", formdData.fullName),
      ...validateField("email", formdData.email),
      ...validateField("password", formdData.password),
    };

    if(Object.keys(allErrors).length > 0){
      setFieldErrors(allErrors);
      setLoading(false);
      return;
    }

    setServerError({ fullName: false, email: false, password: false });

    dispatch(register({ fullName: formdData.fullName, email: formdData.email, password: formdData.password }))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((errorMessage) => {
        setLoading(false);
        setError(errorMessage || "Registration failed. Please try again.");
        setServerError({ fullName: true, email: true, password: true });
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
              name="fullName"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              minLength={3}
              maxLength={20}
              value={formdData.fullName}
              onChange={handleInputChange}
              error={fieldErrors.fullName}
              isInvalid={serverError.fullName}
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
              value={formdData.email}
              onChange={handleInputChange}
              error={fieldErrors.email}
              isInvalid={serverError.email}
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
              value={formdData.password}
              onChange={handleInputChange}
              error={fieldErrors.password}
              isInvalid={serverError.password}
              minLength={6}
              maxLength={40}
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
              className="font-medium text-primary transition-opacity hover:opacity-80 cursor-pointer"
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