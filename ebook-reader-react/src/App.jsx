import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import RootPage from "./pages/RootPage";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/admin/Dashboard";
import Library from "./pages/library/Library";
import ReadingPage from "./pages/library/ReadingPage";
import SearchStore from "./pages/SearchStore";
import ForgotPassword from "./pages/password/ForgotPassword";
import ResetPassword from "./pages/password/ResetPassword";

import { logout, getCurrentUser } from "./reducers/auth";
import { clearMessage } from "./reducers/message";
import Navbar from "./components/common/Navbar";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user: currentUser } = useSelector((state) => state.auth);
  const isReadingRoute = location.pathname.startsWith("/reading/");

  useEffect(() => {
    if (!isReadingRoute) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isReadingRoute]);

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage());
    }
  }, [dispatch, location]);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      {!isReadingRoute && <Navbar />}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
          <Route exact path="/reset-password" element={<ResetPassword />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/books/:bookId" element={<BookDetails />} />
          <Route exact path="/search" element={<SearchStore />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/checkout/:orderId" element={<Checkout />} />
          <Route path="/library" element={<Library />} />
          <Route path="/reading/:bookId" element={<ReadingPage />} />
          <Route path="/admin/*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
