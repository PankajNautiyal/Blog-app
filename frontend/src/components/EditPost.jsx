import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new';
import { Navigate, useParams } from 'react-router-dom';

const EditPost = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");
    const [cover, setCover] = useState('')
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams()
    const {enqueueSnackbar} = useSnackbar()
  
    useEffect(() => {
      fetch(`https://blog-app-d760.onrender.com/post/${id}`).then(response=>{
        response.json().then(postInfo =>{
            setTitle(postInfo.title)
            setContent(postInfo.content)
            setSummary(postInfo.summary)
            setCover(postInfo.cover)
        })
      })
    }, [])
    
    const updatePost = async (e) => {
      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("content", content);
      data.set("id",id)
      if(files?.[0]) {
        data.set('file', files[0])
      }
  
      e.preventDefault();
      console.log(files);
      const response = await fetch("http://localhost:8800/post", {
        method: "PUT",
        body: data,
        credentials:"include"
      });
      if(response.ok){
        setRedirect(true);
        enqueueSnackbar('Post updated successfully',{variant:'success'})
      }
    };
  
    if (redirect) {
      return <Navigate to={`/post/${id}`} />;
    }
  return (
    <form
          action=""
          onSubmit={updatePost}
          className="flex flex-col items-start justify-between p-8 w-full mx-auto space-y-4 mt-10 lg:mt-0"
          encType="multipart/form-data"
        >
          <h2 className='mx-auto text-black text-2xl font-semibold'>Edit Post</h2>
          <input
            type="text"
            placeholder="Title"
            className="border-2 border-gray-500 px-4 py-1 m-1 bg-transparent rounded-md text-lg w-full focus:outline-none focus:border-2 focus:border-gray-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
    
          <input
            type="text"
            placeholder="Summary"
            className="border-2 border-gray-500 px-4 py-1 m-1 bg-transparent rounded-md text-lg w-full focus:outline-none focus:border-2 focus:border-gray-800"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
    
          <input
            type="file"
            name="file"
            className="bg-gray-700 py-2 px-4 m-1 rounded-md text-white cursor-pointer hover:bg-gray-800 transition-colors duration-200 w-full"
            onChange={(e) => setFiles(e.target.files)}
          />
          <ReactQuill
            className="w-full my-4 bg-transparent text-lg"
            theme="snow"
            value={content}
            onChange={setContent}
          />
          <button className="bg-gray-800 py-2 px-4 text-white rounded w-full m-auto my-2 hover:bg-gray-700">
            Update Post
          </button>
        </form>
  )
}

export default EditPost