import React, { useContext, useEffect, useState } from "react";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Layout from "./layout/Layout";
import { UserContext, UserContextProvider } from "./context/userContext.jsx";
import CreatePost from "./components/CreatePost.jsx";
import PostPage from "./components/PostPage.jsx";
import EditPost from "./components/EditPost.jsx";

const App = () => {
    const {dark, setDark} = useContext(UserContext)
  
  return (
    <UserContextProvider>
    <div className="dark:bg-black bg-gray-300 text-black max-w-screen h-full dark:text-white">

      <Routes>
        <Route path="/" element={<Layout dark={dark} setDark={setDark}/>}>
          <Route index element={<Home/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </div>
    </UserContextProvider>
  );
};

export default App;
