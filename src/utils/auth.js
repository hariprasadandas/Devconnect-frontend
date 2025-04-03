// src/utils/auth.js

const TOKEN_KEY = "jwt_token";

// Save the JWT token to localStorage
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Retrieve the JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove the JWT token from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Decode the JWT token to check expiration
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      removeToken();
      return false;
    }
    return true;
  } catch (e) {
    // If the token is invalid or cannot be decoded, return false
    console.error("Error decoding the token:", e);
    removeToken();
    return false;
  }
};
