import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromAPI } from "../../../backend/src/api/api.ts"; // Adjust the import path as necessary


const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    

    try {
      const response = await fetchFromAPI('/user/register', 'POST', { username, email, password });
      console.log(response);
      alert("Register success, boleh login lagi dong");
      navigate("/login");
    } catch (error) {
      console.error('Registration failed', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
};

export default RegisterPage;