import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const Oprofiles = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams(); // Get username from URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/profile/${username}/`);
        if (!response.ok) {
          throw new Error('Profile not found.');
        }
        const data = await response.json();
        console.log(data);  // Log the response for debugging
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        {error}
        <button onClick={() => navigate("/")} className="btn btn-primary mt-2">
          Go to Home
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center mt-5">Profile not available</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Profile</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{profile.username}</h5>
          <p className='card-email'>{profile.email}</p>
          <p className="card-text">{profile.bio ? profile.bio : "No bio available"}</p> {/* Handle null bio */}
        </div>
        <Link
            to={`/follow/${profile.id}`} // Profile ID is used here to navigate to the Follow page
            className="text-blue-500 hover:underline"
          >
            Follow this user
          </Link>
      </div>
    </div>
  );
};

export default Oprofiles;
