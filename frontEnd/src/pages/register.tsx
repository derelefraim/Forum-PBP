import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

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
    // Simulasi register sukses
    alert("Register success! (simulasi)");
    navigate("/login");
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