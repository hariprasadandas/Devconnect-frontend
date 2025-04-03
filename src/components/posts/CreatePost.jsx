import React, { useState } from "react";

const CreatePost = () => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    const response = await fetch("http://127.0.0.1:8000/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      alert("Post created successfully!");
      setContent("");
    } else {
      alert("Failed to create post");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="card shadow p-4">
        <h2 className="mb-4">Create Post</h2>
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            className="form-control"
            rows="5"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
