import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      } else {
        console.error("Failed to fetch post");
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      alert("Post updated successfully!");
      navigate("/myposts");
    } else {
      alert("Failed to update post");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="card shadow p-4">
        <h2 className="mb-4">Edit Post</h2>
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit your post..."
            className="form-control"
            rows="5"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditPost;
