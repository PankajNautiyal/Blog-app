import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DeletePost from "./DeletePost";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null)
  const { id } = useParams();

  // Fetch the logged-in user's information
  useEffect(() => {
    fetch("http://localhost:8800/profile", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8800/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  if (!postInfo || !currentUser) return "";

  const isAuthor = currentUser.id === postInfo.author._id;

  return (
    <div className="w-full h-full p-6 px-10 mt-10 lg:mt-0">
      <div className="text-center">
        <h1 className="text-3xl mb-6 font-semibold">{postInfo.title}</h1>
        <time className="text-sm text-gray-500 font-semibold">
          {format(new Date(postInfo.createdAt), "MMM d, yyyy  HH:mm")}
        </time>
        <h2 className="text-md text-gray-700 font-semibold mb-2">
          By @{postInfo.author.username}
        </h2>
        {isAuthor && <button className="bg-gray-800 text-white p-2 rounded mb-6 lg:w-1/3 mt-4 md:mt-0  hover:bg-gray-700">
           <Link to={`/edit/${postInfo._id}`}>Edit this post</Link>
        </button>}
        {isAuthor && <DeletePost postId={postInfo._id} />}
        <img
          src={`http://localhost:8800/${postInfo.cover}`}
          alt=""
          className="h-[250px] m-auto mb-6 mt-6 rounded"
        />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
        className="text-lg"
      ></div>
    </div>
  );
};

export default PostPage;
