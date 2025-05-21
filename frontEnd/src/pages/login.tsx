import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromAPI } from "../../../backend/src/api/api.ts"; // Adjust the import path as necessary
import '../styles/login.css'; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // Tambahkan state untuk pesan info


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
      if (token) {
    setInfo("Kamu sudah login, silakan logout");
    setTimeout(() => {
      navigate('/profile');
    }, 2000); 
  }
  }, [navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetchFromAPI('/user/login', 'POST', { email, password });
      const token = response.token;
      // const user_id = response.user_id; // Assuming the response contains user_id
      localStorage.setItem('token', token); 
      // localStorage.setItem('user_id', user_id); // Store user_id in local storage
      navigate('/profile'); 
      localStorage.setItem('user_id', user_id); // Store user_id in local storage
      navigate('/home'); 
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {info && <p className="info-message">{info}</p>} {/* Tampilkan pesan info */}
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