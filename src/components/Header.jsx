import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    onLogout();
    navigate("/login");
  };

  const styles = {
    header: {
      background: "#007BFF",
      color: "#fff",
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#fff",
      textDecoration: "none",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },
    navLink: {
      color: "#fff",
      fontSize: "1rem",
      textDecoration: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      transition: "background 0.3s",
    },
    navLinkHover: {
      background: "rgba(255, 255, 255, 0.2)",
    },
    logoutButton: {
      background: "#FF5733",
      color: "#fff",
      padding: "8px 15px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "background 0.3s",
    },
    logoutButtonHover: {
      background: "#c44125",
    },
  };

  return (
    <header style={styles.header}>
      <Link to="/home" style={styles.logo}>
        MyApp
      </Link>
      <nav style={styles.navLinks}>
        <Link
          to="/home"
          style={styles.navLink}
          onMouseEnter={(e) => (e.target.style.background = styles.navLinkHover.background)}
          onMouseLeave={(e) => (e.target.style.background = "transparent")}
        >
          Home
        </Link>
        <Link
          to="/myposts"
          style={styles.navLink}
          onMouseEnter={(e) => (e.target.style.background = styles.navLinkHover.background)}
          onMouseLeave={(e) => (e.target.style.background = "transparent")}
        >
          My Posts
        </Link>
        <Link
          to="/profile"
          style={styles.navLink}
          onMouseEnter={(e) => (e.target.style.background = styles.navLinkHover.background)}
          onMouseLeave={(e) => (e.target.style.background = "transparent")}
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          onMouseEnter={(e) => (e.target.style.background = styles.logoutButtonHover.background)}
          onMouseLeave={(e) => (e.target.style.background = styles.logoutButton.background)}
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
