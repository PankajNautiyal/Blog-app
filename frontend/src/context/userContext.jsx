import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [dark, setDark] = useState(false);

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkTheme");  // Retrieve saved theme
    if (savedTheme === "true") {
      setDark(true); // Set dark theme if it's saved as true
    } else {
      setDark(false); // Default to light theme if not saved or saved as false
    }
  }, []);

  // Update the body class and store the theme preference in localStorage
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("darkTheme", "true"); // Save dark theme to localStorage
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkTheme", "false"); // Save light theme to localStorage
    }
  }, [dark]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, dark, setDark }}>
      {children}
    </UserContext.Provider>
  );
};
