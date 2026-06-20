import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import BoardUser from "./pages/BoardUser";
import BoardAdmin from "./pages/BoardAdmin";

import { logout } from "./reducers/auth";
import { clearMessage } from "./reducers/message";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if(["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage());
    }
  }, [dispatch, location]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if(currentUser){
      setShowAdminBoard(currentUser.Routes.includes("ROLE_ADMIN"));
    } else {
      setShowAdminBoard(false);
    }
  }, [currentUser]);

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/home" element={<Home />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/user" element={<BoardUser />} />
      <Route exact path="/admin" element={<BoardAdmin />} />
    </Routes>
  );
}

export default App;
