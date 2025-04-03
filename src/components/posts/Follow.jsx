import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Follow = () => {
  const { userId } = useParams();  // Get userId from URL
  const [followed, setFollowed] = useState(false);  // Track if the user is followed
  const [followerCount, setFollowerCount] = useState(0);  // Track the follower count
  const [followingCount, setFollowingCount] = useState(0);  // Track the following count
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [followers, setFollowers] = useState([]);  // List of followers

  // Fetch the initial follow status, follower count, and following count
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/follows/${userId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          setFollowerCount(data.follower_count);
          setFollowingCount(data.following_count);  // Fetch following count
          setFollowed(data.followed || false);  // Adjust to use 'followed' status from API
          setFollowers(data.followers);
        } else {
          setError(data.error || 'Failed to fetch follow details.');
        }
      } catch (err) {
        setError('An error occurred: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowStatus();
    } else {
      setError('User ID is missing.');
      setLoading(false);
    }
  }, [userId]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    const token = localStorage.getItem('token');  // Assuming you're storing JWT token in localStorage
    if (!token) {
      alert('You need to be logged in with another user to follow/unfollow.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`http://127.0.0.1:8000/api/follows/${userId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFollowed(!followed);  // Toggle follow status
        setFollowerCount(data.follower_count);  // Update follower count
        setFollowingCount(data.following_count);  // Update following count
        alert(data.message);
      } else {
        setError(data.error || 'An error occurred while toggling follow.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Follow User</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User {userId}</h5>
          <p className="card-text"> Followers: {followerCount}</p>
          <p className="card-text"> Following: {followingCount}</p>  
          <p className="card-text">Followers: {followers.join(', ,')} </p>

          <button
            className={`btn ${followed ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleFollowToggle}
          >
            {followed ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Follow;
