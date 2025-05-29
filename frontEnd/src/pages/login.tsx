import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setInfo("Kamu sudah login, silakan logout");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  }, [navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      } else {
        setError("Login gagal. Email atau password salah.");
      }
    } catch (error) {
      setError("Login gagal. Email atau password salah.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {info && <p className="info-message">{info}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a onClick={() => navigate("/Register")}>Register</a>
        </p>
        <button onClick={() => navigate("Home")}>Back to Home</button>
      </div>
    </div>
  );
};

export default LoginPage;