import React, { useEffect, useState } from "react";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import { useNavigate } from "react-router-dom";

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
      const data = await fetchFromAPI("/user/getUserById", "get",null);
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
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh"
    }}>
      <div style={{
        background: "#232326", padding: "36px 48px", borderRadius: "18px", boxShadow: "0 8px 32px 0 rgba(0,0,0,0.28)",
        minWidth: "340px"
      }}>
        <h2 style={{ color: "#fff", marginBottom: "18px" }}>Profile</h2>
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
        {profile ? (
          <div style={{ color: "#eaeaea", fontSize: "1.1rem" }}>
            <p><strong>User ID:</strong> {profile.user_id}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        ) : (
          !error && <p style={{ color: "#bdbdbd" }}>Loading...</p>
        )}
        <button
          style={{
            marginTop: "24px", background: "#35353b", color: "#eaeaea", border: "none",
            borderRadius: "8px", padding: "10px 24px", fontSize: "1rem", cursor: "pointer"
          }}
          onClick={() => navigate("/home")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;


