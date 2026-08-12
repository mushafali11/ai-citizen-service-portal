import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/complaints",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load dashboard");
          return;
        }

        setComplaints(data);
      } catch (error) {
        setMessage("Something went wrong while loading dashboard.");
        console.error(error);
      }
    };

    fetchComplaints();
  }, [navigate]);

  const total = complaints.length;

  const pending = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">Citizen Portal</div>

        <div className="nav-user">
          Manage your complaints
        </div>
      </nav>

      <main className="dashboard-container">
        <div className="dashboard-header">
          <h1>Citizen Dashboard</h1>
          <p>
            Track and manage your submitted complaints in one place.
          </p>
        </div>

        {message && <p>{message}</p>}

        <div className="stats-grid">
          <div className="stat-card">
            <h2>{total}</h2>
            <p>Total Complaints</p>
          </div>

          <div className="stat-card">
            <h2>{pending}</h2>
            <p>Pending</p>
          </div>

          <div className="stat-card">
            <h2>{inProgress}</h2>
            <p>In Progress</p>
          </div>

          <div className="stat-card">
            <h2>{resolved}</h2>
            <p>Resolved</p>
          </div>
        </div>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/complaint")}
          >
            + Submit New Complaint
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/my-complaints")}
          >
            View My Complaints
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/chatbot")}
          >
            🤖 Chat with Assistant
          </button>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;