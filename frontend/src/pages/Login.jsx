import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            Citizen Portal
          </div>

          <h1>Welcome Back</h1>

          <p className="auth-subtitle">
            Sign in to access your account and manage your complaints.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              className="auth-submit"
              type="submit"
            >
              Sign In
            </button>
          </form>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <div className="auth-footer">
            Don't have an account?{" "}
            <span
              className="auth-link"
              onClick={() => navigate("/register")}
            >
              Create one
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;