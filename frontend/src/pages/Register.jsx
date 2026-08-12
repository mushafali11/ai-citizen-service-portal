import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
        "http://localhost:5000/api/auth/register",
        formData
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Registration failed"
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

          <h1>Create Account</h1>

          <p className="auth-subtitle">
            Create your account to submit and track your complaints.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

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
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />

            <button className="auth-submit" type="submit">
              Create Account
            </button>
          </form>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <div className="auth-footer">
            Already have an account?{" "}
            <span
              className="auth-link"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;