import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { dark, setDark } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://blog-app-d760.onrender.com/profile", {
      credentials: "include",
    })
      .then((response) => {
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const logout = async () => {
    try {
      // Send the logout request to the server
      const response = await fetch("https://blog-app-d760.onrender.com/logout", {
        credentials: "include",
        method: "POST",
      });

      if (response.ok) {
        // Clear the user info from state
        setUserInfo(null);

        // Navigate to login page after logout
        navigate("/login", { replace: true });
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const username = userInfo?.username;

  return (
    <>
      <nav className="flex items-center justify-between px-6 lg:px-10 py-4 shadow shadow-black/25 dark:shadow-white/25 sticky top-0 backdrop-blur-lg">
        <Link to="/" className="text-3xl font-semibold ">
          Blog
        </Link>
        <div className="flex items-center justify-center p-4 lg:text-2xl text-sm font-semibold md:p-1 gap-6 md:gap-4 md:text-sm">
          {username ? (
            <>
              <h3 className="text-sky-700 hidden lg:block">
                Hi, {username.charAt(0).toUpperCase() + username.slice(1)} 👋
              </h3>
              <Link
                to="/create"
                className="lg:text-lg text-sm hover:text-blue-900"
              >
                Create new Post
              </Link>
              <Link
                to=""
                className="lg:text-lg text-sm flex flex-nowrap hover:text-blue-900"
                onClick={logout}
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg hover:text-gray-700">
                Login
              </Link>
              <Link to="/register" className="text-lg hover:text-gray-700">
                Register
              </Link>
            </>
          )}

          <button
            className="p-1 border dark:border-gray-400 border-gray-200 bg-gray-500 dark:bg-gray-800 dark:hover:bg-gray-600 rounded-full hover:bg-gray-900 text-sm lg:text-xl"
            onClick={() => setDark((prev) => !prev)}
          >{`${dark ? "☀️" : "🌙"}`}</button>
        </div>
      </nav>
      {username && (
        <h3 className="text-sky-700 lg:hidden block right-1 absolute p-3">
          Hi, {username.charAt(0).toUpperCase() + username.slice(1)} 👋
        </h3>
      )}
    </>
  );
};

export default Header;
