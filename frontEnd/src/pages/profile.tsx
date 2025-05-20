import React, { useEffect, useState } from "react";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";


interface UserProfile {
  user_id: string;
  username: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const data = await fetchFromAPI("/user/getUserById", "GET");
      setProfile(data.user || data);
      console.log("Profile data:", data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Gagal mengambil data profile.");
    }
  };
  fetchProfile();
}, []);

  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Profile of {profile?.username}</h1>
        {error && <p className="profile-error">{error}</p>}
        {profile ? (
          <div className="profile-info">
            <p className="profile-info"><strong>User ID :</strong> {profile.user_id}</p>
            <p className="profile-info"><strong>Username:</strong> {profile.username}</p>
            <p className="profile-info"><strong>Email :</strong> {profile.email}</p>
          </div>
        ) : (
          !error && <p className="profile-loading">Loading...</p>
        )}
        <div className="profile-buttons">
          <button
            className="profile-btn-back"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
          <button
            className="profile-btn-edit"
            onClick={() => navigate("/editProfile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


