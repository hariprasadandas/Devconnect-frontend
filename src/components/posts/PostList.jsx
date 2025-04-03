import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/posts/");
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="container">
      <h2 className="my-4 text-center">Posts</h2>
      <Link to="/posts/create" className="btn btn-primary mb-4">
        Create New Post
      </Link>
      <ul className="list-unstyled">
        {posts.map((post) => (
          <li key={post.id} className="post-card shadow-sm mb-4 p-4 rounded">
            <h3 className="text-primary">{post.content}</h3>
            <p className="text-muted">By: {post.author.username}</p>
            <div className="d-flex justify-content-start">
              <Link to={`/posts/edit/${post.id}`} className="btn btn-warning mr-2">
                Edit
              </Link>
              <Link to={`/posts/delete/${post.id}`} className="btn btn-danger">
                Delete
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
