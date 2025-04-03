import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaComment, FaUserPlus, FaUserMinus } from "react-icons/fa";

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.user_id;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const userId = getUserIdFromToken(token);

      try {
        setLoading(true);
        const postsResponse = await fetch("http://127.0.0.1:8000/api/posts/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!postsResponse.ok) throw new Error("Failed to fetch posts.");
        const postsData = await postsResponse.json();
        setPosts(postsData.map((post) => ({ ...post, isLiked: post.is_liked })));

        const usersResponse = await fetch("http://127.0.0.1:8000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!usersResponse.ok) throw new Error("Failed to fetch users.");
        const usersData = await usersResponse.json();
        setUsers(usersData.filter((user) => user.id !== userId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollowToggle = async (targetUserId) => {
    const token = getToken();
    if (!token) {
      alert("You need to be logged in to follow/unfollow.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/follows/${targetUserId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === targetUserId ? { ...user, isFollowed: data.is_followed } : user
          )
        );
      } else {
        alert("Failed to toggle follow.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (postId) => {
    const token = getToken();
    if (!token) {
      alert("You need to be logged in to like this post.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, like_count: data.like_count, isLiked: data.is_liked } : post
          )
        );
      } else {
        alert("Failed to toggle like.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/");
  };

  return (
    <div
      className="container mt-5"
      style={{
        backgroundColor: "#ADD8E6", // Blue color background for the webpage
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "50px",
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Navigation Buttons */}
      <div className="d-flex justify-content-center mb-4 gap-3">
        <Link
          to="/myposts"
          className="btn btn-primary btn-lg rounded-pill px-4 shadow"
          style={{
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          📝 My Posts
        </Link>
        <Link
          to="/profile"
          className="btn btn-secondary btn-lg rounded-pill px-4 shadow"
          style={{
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          🙍‍♂️ Profile
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-danger btn-lg rounded-pill px-4 shadow"
          style={{
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          🚪 Logout
        </button>
      </div>

      <h1 className="text-center mb-4 text-dark fw-bold"> Welcome to DevConnect!!</h1>

      {loading && <div className="text-center mt-4">Loading...</div>}

      {error && (
        <div className="alert alert-danger text-center">
          {error}
          <button onClick={() => navigate("/")} className="btn btn-primary mt-2">
            Go to Login
          </button>
        </div>
      )}

      <div className="list-group">
        {posts.map((post) => (
          <div
            key={post.id}
            className="list-group-item list-group-item-action mb-4 p-4"
            style={{
              backgroundColor: "#FFEBF0", // Light pink background for posts
              borderRadius: "10px",
              width: "80%", // Increased width of the posts
              margin: "auto",
              minHeight: "250px", // Increased length of the posts
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <div>
              <p className="card-text">{post.content}</p>
              <p className="card-subtitle text-muted">
                By:{" "}
                <Link to={`/profile/${post.author.username}`} className="fw-bold text-primary">
                  {post.author.username}
                </Link>
                {post.author.id !== getUserIdFromToken(getToken()) && (
                  <button
                    onClick={() => handleFollowToggle(post.author.id)}
                    className="btn btn-sm ms-2 rounded-pill"
                    style={{
                      border: "none",
                      background: post.author.isFollowed ? "#FF4D4D" : "#4CAF50",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  >
                    {post.author.isFollowed ? <FaUserMinus size={30} /> : <FaUserPlus size={30} />}
                  </button>
                )}
              </p>
              <p className="card-text mt-2">
                <FaHeart size={20} color="red" /> {post.like_count} Likes
              </p>
            </div>

            {/* Like and Comment Buttons Side by Side */}
            <div className="d-flex gap-3 mt-3">
              <button
                onClick={() => handleLikeToggle(post.id)}
                className={`btn rounded-pill ${post.isLiked ? "btn-danger" : "btn-light"}`}
                style={{
                  width: "120px",
                  height: "50px",
                  fontSize: "18px",
                  border: "none",
                  backgroundColor: post.isLiked ? "red" : "#ffffff", // Red background when liked
                  color: post.isLiked ? "white" : "red", // White color for liked posts
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <FaHeart size={20} color={post.isLiked ? "white" : "red"} /> {/* White heart when liked */}
              </button>

              <Link
                to={`/posts/${post.id}/comments`}
                className="btn btn-warning rounded-pill"
                style={{
                  width: "120px",
                  height: "50px",
                  fontSize: "18px",
                  border: "none",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <FaComment size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
