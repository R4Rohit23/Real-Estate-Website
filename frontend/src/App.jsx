import React from "react";
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
import { useTheme } from "./context/ThemeContext";
import CreateListing from "./pages/CreateListing.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";

function App() {
  const { isDarkTheme } = useTheme();

  return (
    <div className={`${isDarkTheme ? "dark" : "light"}`}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/profile" element={<Profile />}/>
                  <Route path="/create-listing" element={<CreateListing />} />
                  <Route path="/update-listing/:id" element={<UpdateListing />} />
                </Route>
              </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
