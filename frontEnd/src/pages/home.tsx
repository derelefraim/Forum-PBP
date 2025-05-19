import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { fetchFromAPI } from "../../../backend/src/api/api.ts"; // Adjust the import path as necessary
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetchFromAPI('/login', 'POST', { username, password });
      const token = response.token;
      localStorage.setItem('token', token); 
    //   navigate('/'); // Redirect to home or profile after successful login
    //   navigate('/home'); // Redirect to home or profile after successful login
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
};

export default LoginPage;