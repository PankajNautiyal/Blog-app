import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const DeletePost = ({ postId }) => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar()

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const response = await fetch(`http://localhost:8800/post/${postId}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies (JWT token)
      });

      if (response.ok) {
        enqueueSnackbar('Post deleted successfully',{variant:'success'})
        navigate("/"); // Redirect to homepage or other desired page after delete
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error: ${errorData.message}`,{variant:'error'})
      }
    }
  };

  return (
    <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 mx-1 rounded">
      Delete Post
    </button>
  );
};

export default DeletePost;
