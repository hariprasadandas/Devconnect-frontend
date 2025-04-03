import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const DeletePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem("jwt_token");
    const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Post deleted successfully!");
      navigate("/posts");
    } else {
      alert("Failed to delete post");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Delete Post</h2>
        <p>Are you sure you want to delete this post?</p>
        <div className="d-flex gap-2">
          <button onClick={handleDelete} className="btn btn-danger">
            Yes, Delete
          </button>
          <button onClick={() => navigate("/myposts")} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
