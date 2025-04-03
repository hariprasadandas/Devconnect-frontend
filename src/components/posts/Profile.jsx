import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoggedInUserProfile = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("You need to be logged in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedInUserProfile();
  }, []);

  if (loading) return <p style={styles.loadingText}>Loading...</p>;
  if (error) return <p style={styles.errorText}>{error}</p>;

  return (
    <div style={styles.profileContainer}>
      <h1 style={styles.profileTitle}>Your Profile</h1>
      {profile ? (
        <div style={styles.profileCard}>
          <div style={styles.profileAvatar}>
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div style={styles.profileInfo}>
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
          </div>
          <Link to={`/follow/${profile.id}`} style={styles.followButton}>
            Follow this user
          </Link>
        </div>
      ) : (
        <p style={styles.noDataText}>No profile data available.</p>
      )}
    </div>
  );
};

// Inline CSS styles
const styles = {
  profileContainer: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  profileTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  profileCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  profileAvatar: {
    width: "60px",
    height: "60px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  profileInfo: {
    fontSize: "16px",
    color: "#555",
    textAlign: "left",
  },
  followButton: {
    display: "inline-block",
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "6px",
    textDecoration: "none",
    transition: "background 0.3s ease-in-out",
    textAlign: "center",
  },
  followButtonHover: {
    backgroundColor: "#0056b3",
  },
  loadingText: {
    color: "#555",
    fontSize: "16px",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: "16px",
    textAlign: "center",
  },
  noDataText: {
    color: "#777",
    fontSize: "16px",
    textAlign: "center",
  },
};

export default Profile;
