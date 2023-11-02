import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import "./index.css";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import PrivateRoute from "./components/PrivateRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<PrivateRoute />}> {/* Parent Route */}
            <Route path="/profile" element={<Profile />} /> {/* Child Route */}
          </Route>
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
