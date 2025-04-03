import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Comment = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/posts/${id}/comments/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/posts/${id}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (response.ok) {
        const addedComment = await response.json();
        setComments((prevComments) => [...prevComments, addedComment]);
        setNewComment("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "20px auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
    },
    commentList: {
      listStyle: "none",
      padding: "0",
      marginBottom: "20px",
    },
    commentItem: {
      padding: "10px",
      borderBottom: "1px solid #eee",
      marginBottom: "10px",
    },
    author: {
      fontWeight: "bold",
      color: "#007BFF",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      fontSize: "1rem",
      resize: "none",
    },
    button: {
      padding: "10px 15px",
      background: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    buttonHover: {
      background: "#0056b3",
    },
    loading: {
      fontSize: "1rem",
      color: "#777",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Comments</h3>
      {loading ? (
        <p style={styles.loading}>Loading comments...</p>
      ) : (
        <ul style={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} style={styles.commentItem}>
              <span style={styles.author}>{comment.author.username}</span>:{" "}
              {comment.content}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddComment} style={styles.form}>
        <textarea
          rows="3"
          placeholder="Add a comment..."
          style={styles.textarea}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        ></textarea>
        <button type="submit" style={styles.button}>
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default Comment;
