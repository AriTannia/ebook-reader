import React, { useState, useEffect, useCallback } from "react";
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

import { logout, getCurrentUser } from "./reducers/auth";
import { clearMessage } from "./reducers/message";
import Navbar from "./components/Navbar";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user: currentUser } = useSelector((state) => state.auth);

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
    <>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/books/:bookId" element={<BookDetails />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/checkout/:orderId" element={<Checkout />} />
      </Routes>
    </>
  );
};

export default App;
