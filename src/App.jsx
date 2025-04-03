import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";
import PostList from "./components/posts/PostList";
import CreatePost from "./components/posts/CreatePost";
import EditPost from "./components/posts/EditPost";
import DeletePost from "./components/posts/DeletePost";
import MyPosts from "./components/posts/MyPosts";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/Signup";
import Comment from "./components/posts/Comments";
import Like from "./components/posts/Likes";
import Profile from "./components/posts/Profile";
import Oprofiles from "./components/posts/Oprofiles";
import Follow from "./components/posts/Follow";

const App = () => {
    
  //const navigate = useNavigate(); // Add the useNavigate hook for redirection

  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("jwt_token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/home" />;
  };

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={ isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Routepath="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} />} /> */}

        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute><PostList /></ProtectedRoute>} />
        <Route path="/myposts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/posts/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/posts/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/posts/delete/:id" element={<ProtectedRoute><DeletePost /></ProtectedRoute>} />

        <Route path="/posts/:id/comments" element={<ProtectedRoute><Comment /></ProtectedRoute> } />
        <Route path="/posts/:id/like" element={<ProtectedRoute><Like /></ProtectedRoute> } />
        <Route path="/profile/:username" element={<ProtectedRoute><Oprofiles /></ProtectedRoute>} />

        <Route path="/follow/:userId" element={<ProtectedRoute><Follow /></ProtectedRoute>} />


        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route
          path="/logout"
          element={
            <Logout handleLogout={handleLogout} /> // Pass handleLogout to Logout component
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
