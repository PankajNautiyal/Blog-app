import { useSnackbar } from "notistack";
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    summary: "",
    content: "",
  });

  const {enqueueSnackbar} = useSnackbar()

  // Simple validation function
  const validateForm = () => {
    let formErrors = { title: "", summary: "", content: "" };
    let isValid = true;

    if (!title) {
      formErrors.title = "Title is required";
      isValid = false;
    }
    if (!summary) {
      formErrors.summary = "Summary is required";
      isValid = false;
    }
    if (!content) {
      formErrors.content = "Content is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleFieldChange = (field, value) => {
    // Update field value
    if (field === "title") setTitle(value);
    if (field === "summary") setSummary(value);
    if (field === "content") setContent(value);

    // Clear errors when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const createNewPost = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);

    try {
      const response = await fetch("http://localhost:8800/post", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
        enqueueSnackbar('Post created successfully',{variant:'success'})
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar('Error creating post',{variant:'success'})
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form
      action=""
      onSubmit={createNewPost}
      className="flex flex-col items-start justify-between p-8 lg:w-1/2 gap-2 md:gap-1 mx-auto mt-10 lg:mt-0"
      encType="multipart/form-data"
    >
      <h2 className="text-center m-auto text-2xl mb-4 font-semibold">
        Create New Post
      </h2>
      <input
        type="text"
        placeholder="Title"
        className={`border-2 ${errors.title ? 'border-red-500' : 'border-gray-400'} px-4 py-1 m-1 bg-transparent rounded-md text-lg w-full focus:outline-none focus:border-2 focus:border-gray-900 dark:border-gray-700 dark:focus:border-gray-300`}
        value={title}
        onChange={(e) => handleFieldChange("title", e.target.value)}
      />
      {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}

      <input
        type="text"
        placeholder="Summary"
        className={`border-2 ${errors.summary ? 'border-red-500' : 'border-gray-400'} px-4 py-1 m-1 bg-transparent rounded-md text-lg w-full focus:outline-none focus:border-2 focus:border-gray-900 dark:border-gray-700 dark:focus:border-gray-300`}
        value={summary}
        onChange={(e) => handleFieldChange("summary", e.target.value)}
      />
      {errors.summary && <p className="text-red-500 text-xs">{errors.summary}</p>}

      <input
        type="file"
        name="file"
        className="bg-gray-700 py-2 px-4 m-1 rounded-md text-white cursor-pointer hover:bg-gray-800 transition-colors duration-200 w-full"
        onChange={(e) => setFiles(e.target.files)}
      />

      <ReactQuill
        className={`w-full my-4 md:my-1 border text-sx h-[200px] lg:h-[150px] lg:text-lg dark:border-gray-700 dark:focus:border-gray-300 ${errors.content ? 'border-red-500' : ''}`}
        theme="snow"
        value={content}
        onChange={(value) => handleFieldChange("content", value)}
      />
      {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}

      <button className="bg-gray-800 py-2 md:py-2 px-4 text-white rounded w-full m-auto my-2 hover:bg-gray-700 cursor-pointer z-10">
        Create Post
      </button>
    </form>
  );
};

export default CreatePost;
