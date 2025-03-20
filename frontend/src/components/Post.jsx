import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, cover, content, createdAt, author }) => {
  const newDate = new Date(createdAt);

  return (
    <main className="w-full flex flex-col lg:flex-row justify-center items-center p-4 lg:mx-10 shadow shadow-gray-400/50 border-1 border-gray-500 rounded-2xl lg:border-0 mt-10 lg:mt-0">
      {/* Image Section */}
      <div className="w-full lg:w-1/2 h-[200px] mb-4 lg:mb-0 lg:px-10">
        <Link to={`/post/${_id}`}>
          <img
            src={`http://localhost:8800/${cover}`}
            alt=""
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>

      {/* Text Section */}
      <div className="w-full lg:w-1/2 px-4 py-2">
        <Link to={`/post/${_id}`}>
          <h3 className="text-blue-900 text-2xl mb-2">{title}</h3>
        </Link>
        <h4 className="text-gray-600 text-lg mb-2">
          <span className="pr-2">{author?.username}</span>
          <time>{format(newDate, "MMM d, yyyy  HH:mm")}</time>
        </h4>

        <p className="text-gray-900 dark:text-gray-400 mt-2">
          {summary}
        </p>
      </div>
    </main>
  );
};

export default Post;
