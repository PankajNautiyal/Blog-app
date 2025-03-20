import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import Post from "./Post.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  const { userInfo,setUserInfo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("https://blog-app-d760.onrender.com/profile", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.log("Error fetching user profile:", error);
      setUserInfo(null);
    }
  };

  useEffect(() => {
    fetchUserProfile()
    if (userInfo) {
      fetch('http://localhost:8800/post')
        .then(response => response.json())
        .then(posts => {
          setPosts(posts);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching posts:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  return (
    <div className="w-full px-10 py-5">
      {loading ? (
        <div>Loading...</div> 
      ) : userInfo ? (
        // If the user is signed in, show posts
        <div>
          {posts.length > 0 ? (
            posts.map(post => (
              <Post key={post._id} {...post} />
            ))
          ) : (
            <p className="text-center mt-20 text-2xl">No posts available.</p>
          )}
        </div>
      ) : (
        // If the user is not signed in, show a message about the app
        <div className="flex items-center justify-center  mt-30 lg:mt-20 flex-col gap-5">
          <h1 className="text-4xl">Welcome to Our Blog App!</h1>
          <p className="text-xl m-auto md:text-2xl">
            This is a platform where you can create, read, and share blog posts with others. 
          </p>
          <p className="text-2xl">
          To start exploring, please <Link to="/login" className="text-yellow-600 hover:text-yellow-800 hover:font-semibold">Log In</Link> or <Link to="/register" className="text-yellow-600 hover:text-yellow-800 hover:font-semibold">Register</Link>.

          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
