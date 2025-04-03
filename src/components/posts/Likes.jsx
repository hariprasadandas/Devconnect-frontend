import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Like = () => {
  const { id } = useParams();
  const [likeCount, setLikeCount] = useState(0);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch likes data for the post
  const fetchLikes = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state

      const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/like/`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.like_count);

        if (Array.isArray(data.users)) {
          setLikedUsers(data.users);
          const currentUser = localStorage.getItem("username");
          if (currentUser) {
            setIsLiked(data.user_has_liked || data.users.includes(currentUser));
          }
        } else {
          throw new Error("Invalid users data format received");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch likes data");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [id]);

  // Handle like/unlike action
  const handleLikeToggle = async () => {
    if (loading) return;
  
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      alert("You need to be logged in to like this post.");
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ likeCount }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.like_count);
  
        if (Array.isArray(data.users)) { 
          setLikedUsers(data.users);
          setIsLiked(!isLiked);
          alert("Like toggled successfully!");
        } else {
          alert("Invalid users data format received.");
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to toggle like.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <div>
        <strong>Likes:</strong> {likeCount}
        {likedUsers.length > 0 ? (
          <ul>
            {likedUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        ) : (
          <p>No likes yet. Be the first to like!</p>
        )}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button onClick={handleLikeToggle} disabled={loading}>
        {loading ? "Processing..." : isLiked ? "Unlike" : "Like"}
      </button>
    </div>
  );
};

export default Like;
