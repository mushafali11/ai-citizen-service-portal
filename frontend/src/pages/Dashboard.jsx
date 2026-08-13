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
      
      {/* Main Navigation */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-mark">CP</div>

          <div>
            <h2>Citizen Service Portal</h2>
            <span>Digital Public Services</span>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className="nav-link"
            onClick={() => navigate("/my-complaints")}
          >
            My Complaints
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-container">

        {/* Hero Section */}
        <section className="welcome-section">
          <div>
            <span className="welcome-tag">
              CITIZEN DASHBOARD
            </span>

            <h1>
              Your voice matters.
              <br />
              <span>We're here to help.</span>
            </h1>

            <p>
              Submit public service complaints, track their progress,
              access digital assistance, and manage everything from
              one secure platform.
            </p>

            <div className="hero-actions">
              <button
                className="primary-action"
                onClick={() => navigate("/complaint")}
              >
                Submit a Complaint →
              </button>

              <button
                className="outline-action"
                onClick={() => navigate("/my-complaints")}
              >
                Track Complaints
              </button>
            </div>
          </div>

          <div className="hero-info-card">
            <span className="info-label">
              COMPLAINT OVERVIEW
            </span>

            <h2>{total}</h2>
            <p>Total complaints submitted</p>

            <div className="info-divider"></div>

            <span>
              Keep track of your complaints and their progress.
            </span>
          </div>
        </section>

        {message && (
          <div className="dashboard-message">
            {message}
          </div>
        )}

        {/* Statistics */}
        <section className="statistics-section">
          <div className="section-heading">
            <div>
              <span>OVERVIEW</span>
              <h2>Complaint Statistics</h2>
            </div>

            <button
              className="view-all-btn"
              onClick={() => navigate("/my-complaints")}
            >
              View All →
            </button>
          </div>

          <div className="stats-grid">

            <div className="stat-card total-card">
              <div className="stat-icon">📋</div>
              <div>
                <h2>{total}</h2>
                <p>Total Complaints</p>
              </div>
            </div>

            <div className="stat-card pending-card">
              <div className="stat-icon">⏳</div>
              <div>
                <h2>{pending}</h2>
                <p>Pending</p>
              </div>
            </div>

            <div className="stat-card progress-card">
              <div className="stat-icon">⚙️</div>
              <div>
                <h2>{inProgress}</h2>
                <p>In Progress</p>
              </div>
            </div>

            <div className="stat-card resolved-card">
              <div className="stat-icon">✓</div>
              <div>
                <h2>{resolved}</h2>
                <p>Resolved</p>
              </div>
            </div>

          </div>
        </section>

        {/* Digital Services */}
        <section className="services-section">
          <div className="section-heading">
            <div>
              <span>DIGITAL SERVICES</span>
              <h2>How can we help you?</h2>
            </div>
          </div>

          <div className="services-grid">

            <button
              className="service-card featured-service"
              onClick={() => navigate("/complaint")}
            >
              <div className="service-icon">📝</div>
              <h3>Submit a Complaint</h3>
              <p>
                Report an issue related to public services and
                infrastructure.
              </p>
              <span>Get Started →</span>
            </button>

            <button
              className="service-card"
              onClick={() => navigate("/my-complaints")}
            >
              <div className="service-icon">📂</div>
              <h3>My Complaints</h3>
              <p>
                View, track, update, and manage your submitted
                complaints.
              </p>
              <span>View Complaints →</span>
            </button>

            <button
              className="service-card"
              onClick={() => navigate("/chatbot")}
            >
              <div className="service-icon">🤖</div>
              <h3>Citizen Assistant</h3>
              <p>
                Get quick answers and guidance about using the portal.
              </p>
              <span>Ask Assistant →</span>
            </button>

            <button
              className="service-card"
              onClick={() => navigate("/summarize")}
            >
              <div className="service-icon">📄</div>
              <h3>Document Assistant</h3>
              <p>
                Upload a document and generate a concise summary.
              </p>
              <span>Summarize Document →</span>
            </button>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="portal-footer">
        <div>
          <h3>Citizen Service Portal</h3>
          <p>Making public services more accessible through technology.</p>
        </div>

        <div className="footer-links">
          <span>Digital Services</span>
          <span>Citizen Support</span>
          <span>Secure Platform</span>
        </div>

        <div className="copyright">
          © 2026 Citizen Service Portal
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;