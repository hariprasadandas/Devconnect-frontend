import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = getToken();

      if (!token) {
        setError("You are not logged in. Please log in to view your posts.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/myposts/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading your posts...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="text-center mt-5">
        <h5 className="text-muted">You have no posts yet.</h5>
        <Link to="/posts/create" className="btn btn-primary mt-3">
          <FaPlus className="me-2" /> Create New Post
        </Link>
      </div>
    );
  }

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "#ffff", // Light pink background for the webpage
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Your Posts</h2>
        <Link to="/posts/create" className="btn btn-success">
          <FaPlus className="me-2" /> Create New Post
        </Link>
      </div>

      <div className="row">
        {posts.map((post) => (
          <div key={post.id} className="col-md-6 mb-4">
            <div
              className="card shadow-sm border-0 h-100"
              style={{
                backgroundColor: "#6161", // Blue background for each post
              }}
            >
              <div className="card-body">
                <h5 className="card-title">{post.content}</h5>
                <p className="card-subtitle text-muted mb-3">By: {post.author.username}</p>
                <div className="d-flex justify-content-between">
                  <Link to={`/posts/edit/${post.id}`} className="btn btn-outline-warning">
                    <FaEdit className="me-2" /> Edit
                  </Link>
                  <Link to={`/posts/delete/${post.id}`} className="btn btn-outline-danger">
                    <FaTrashAlt className="me-2" /> Delete
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
