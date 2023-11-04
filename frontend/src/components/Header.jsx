import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useTheme } from "../context/ThemeContext";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <header className="bg-slate-200 shadow-xl dark:bg-black">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl flex flex-wrap">
            <span className="text-slate-500 dark:text-white">Skyline</span>
            <span className="text-slate-700 dark:text-slate-400">Estate</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            className="bg-transparent focus:outline-none w-34 sm:w-64"
            type="text"
            placeholder="Search..."
          />
          <FaSearch />
        </form>
        <ul className="flex gap-2 sm:gap-10">
        <DarkModeSwitch 
          checked={isDarkTheme}
          onChange={toggleTheme}
          className="text-slate-500"
          sunColor="yellow"
          moonColor="white"
        />
          <Link to="/">
            <li className="hidden sm:inline font-bold hover:underline dark:text-white">Home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline font-bold hover:underline dark:text-white">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile_image"
              />
            ) : (
              <li className="sm:inline font-bold hover:underline dark:text-white">SignIn</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
