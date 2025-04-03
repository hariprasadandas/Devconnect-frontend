import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/auth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("jwt_token", data.access);
      setIsAuthenticated(true);
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      margin: 0,
    },
    card: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      width: "100%",
      padding: "30px",
      textAlign: "center",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "0.9rem",
      color: "#666",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
      textAlign: "left",
    },
    label: {
      fontSize: "0.9rem",
      color: "#444",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      marginTop: "5px",
      transition: "border-color 0.3s",
    },
    inputFocus: {
      outline: "none",
      borderColor: "#4facfe",
    },
    button: {
      width: "100%",
      padding: "12px 0",
      fontSize: "1rem",
      fontWeight: "bold",
      color: "white",
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    buttonHover: {
      background: "linear-gradient(135deg, #00d2ff, #3a7bd5)",
    },
    signupPrompt: {
      fontSize: "0.9rem",
      color: "#555",
      marginTop: "20px",
    },
    signupLink: {
      color: "#4facfe",
      fontWeight: "bold",
      textDecoration: "none",
    },
    signupLinkHover: {
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back!</h2>
        <p style={styles.subtitle}>Please log in to continue</p>

        <form>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            style={styles.button}
          >
            Login
          </button>
        </form>

        <p style={styles.signupPrompt}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.signupLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
