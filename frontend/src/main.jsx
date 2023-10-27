import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element = {<Home/>} />
      <Route path="/about" element = {<About/>} />
      <Route path="/profle" element = {<Profile/>} />
      <Route path="/sign-in" element = {<SignIn/>} />
      <Route path="/sign-up" element = {<SignUp/>} />
    </Routes>
  </BrowserRouter>
);
