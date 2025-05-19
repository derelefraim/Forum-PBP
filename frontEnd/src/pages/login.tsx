import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { fetchFromAPI } from "../../../backend/src/api/api.ts"; // Adjust the import path as necessary
import '../styles/login.css'; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetchFromAPI('/user/login', 'POST', { email, password });
      const token = response.token;
      localStorage.setItem('token', token); 
      navigate('/home'); // Redirect to home or profile after successful login
      console.log("Login successful", response);
    console.log("Password yang dikirim:", password);
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.log("Login gagal");
      console.log("Password yang dikirim:", password);


    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
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