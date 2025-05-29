import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

interface UserProfile {
  user_id: string;
  username: string;
  email: string;
}

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/getCurrentUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setProfile(data.user || data);
      } catch (err) {
        setError("Gagal mengambil data profile.");
      }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Ambil value dari input berdasarkan class
    const usernameInput = document.querySelector<HTMLInputElement>(".input-username");
    const emailInput = document.querySelector<HTMLInputElement>(".input-email");
    const passwordInput = document.querySelector<HTMLInputElement>(".input-password");

    const username = usernameInput?.value || "";
    const email = emailInput?.value || "";
    const password = passwordInput?.value || "";

    try {
      await axios.put(
        "http://localhost:3000/user/update",
        {
          username,
          email,
          ...(password && { password }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      setError("Gagal mengupdate profile.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Edit Profile</h1>
        {error && <p className="profile-error">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        {profile ? (
          <form onSubmit={handleSubmit}>
            <div className="profile-info">
              <label>
                Username:
                <input
                  type="text"
                  defaultValue={profile.username}
                  className="profile-info input-username"
                  style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6 }}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  defaultValue={profile.email}
                  className="profile-info input-email"
                  style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6 }}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  className="profile-info input-password"
                  style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6 }}
                  placeholder="Leave blank to keep current password"
                />
              </label>
            </div>
            <div className="profile-buttons">
              <button className="profile-btn-back" type="button" onClick={() => navigate("/profile")}>
                Cancel
              </button>
              <button className="profile-btn-edit" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          !error && <p className="profile-loading">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;