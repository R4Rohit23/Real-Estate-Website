import { createContext, useState, useContext, useEffect } from "react";

// Context provides a way to pass data through the component tree without having to pass props down manually at every level.
export const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
});

// This useTheme hook allows other components to easily access the theme context by using the useContext hook. It provides access to the isDarkTheme state and the toggleTheme function.
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  // State to manage the theme
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // It gets the theme preference form the local storage when the component is mounted
  useEffect(() => {
    const localTheme = localStorage.getItem("isDarkTheme");
    setIsDarkTheme(JSON.parse(localTheme));
  }, []);

  // Store the theme preference to the local storage whenever the change occured
  useEffect(() => {
    localStorage.setItem("isDarkTheme", JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
