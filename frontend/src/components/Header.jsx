import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "../context/ThemeContext";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { isDarkTheme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // get the query string from the search bar of the window
    const urlParams = new URLSearchParams(window.location.search);

    // set the query term with specified value
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlSearchTerm = new URLSearchParams(location.search);
    const searchTermFromURL = urlSearchTerm.get('searchTerm');
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-lg dark:bg-black">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm ml-1 sm:text-xl flex flex-wrap">
            <span className="text-slate-500 dark:text-white">Skyline</span>
            <span className="text-slate-700 dark:text-slate-400">Estate</span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch />
          </button>
        </form>
        
        <ul className="flex gap-4 sm:gap-10">
          <DarkModeSwitch
            checked={isDarkTheme}
            onChange={toggleTheme}
            className="text-slate-500 hidden sm:inline"
            sunColor="yellow"
            moonColor="white"
          />
          <Link to="/">
            <li className="hidden sm:inline font-bold hover:underline dark:text-white">
              Home
            </li>
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
              <li className="sm:inline font-bold hover:underline dark:text-white">
                SignIn
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
