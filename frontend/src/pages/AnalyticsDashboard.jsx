import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./AnalyticsDashboard.css";

function AnalyticsDashboard() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load analytics");
          return;
        }

        setAnalytics(data);
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while loading analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="analytics-page">
        <div className="analytics-container">
          <button
            className="analytics-back-button"
            onClick={() => navigate("/admin")}
          >
            ← Back to Admin Dashboard
          </button>

          <div className="analytics-error">
            {message}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const statusData = [
    {
      name: "Pending",
      value: analytics.statusStats.pending,
    },
    {
      name: "In Progress",
      value: analytics.statusStats.inProgress,
    },
    {
      name: "Resolved",
      value: analytics.statusStats.resolved,
    },
  ];

  const categoryData = analytics.categoryStats.map((item) => ({
    name: item._id,
    complaints: item.count,
  }));

  const chartColors = [
    "#d6a23a",
    "#2f7d68",
    "#16804b",
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-container">

        <button
          className="analytics-back-button"
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin Dashboard
        </button>

        <div className="analytics-hero">
          <div>
            <span className="analytics-label">
              ADMIN INSIGHTS
            </span>

            <h1>Complaint Analytics</h1>

            <p>
              Monitor complaint activity, track progress, and
              understand service trends across the Citizen Portal.
            </p>
          </div>

          <div className="analytics-hero-icon">
            📊
          </div>
        </div>

        <div className="analytics-stats">

          <div className="analytics-card total-card">
            <div className="analytics-card-icon">
              📋
            </div>

            <div>
              <h2>{analytics.totalComplaints}</h2>
              <p>Total Complaints</p>
            </div>
          </div>

          <div className="analytics-card pending-card">
            <div className="analytics-card-icon">
              ⏳
            </div>

            <div>
              <h2>{analytics.statusStats.pending}</h2>
              <p>Pending</p>
            </div>
          </div>

          <div className="analytics-card progress-card">
            <div className="analytics-card-icon">
              🔄
            </div>

            <div>
              <h2>{analytics.statusStats.inProgress}</h2>
              <p>In Progress</p>
            </div>
          </div>

          <div className="analytics-card resolved-card">
            <div className="analytics-card-icon">
              ✓
            </div>

            <div>
              <h2>{analytics.statusStats.resolved}</h2>
              <p>Resolved</p>
            </div>
          </div>

        </div>

        <div className="charts-grid">

          <div className="chart-card">
            <div className="chart-heading">
              <div>
                <h2>Complaint Status</h2>
                <p>
                  Distribution of all submitted complaints
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={105}
                  paddingAngle={4}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-heading">
              <div>
                <h2>Complaints by Category</h2>
                <p>
                  Issues reported across different service areas
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={categoryData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="complaints"
                  name="Complaints"
                  fill="#0b6b4f"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="recent-complaints">

          <div className="recent-header">
            <div>
              <span className="section-label">
                LATEST ACTIVITY
              </span>

              <h2>Recent Complaints</h2>

              <p>
                A quick overview of the latest complaints
                submitted through the portal.
              </p>
            </div>

            <span className="recent-count">
              {analytics.recentComplaints.length} Recent
            </span>
          </div>

          {analytics.recentComplaints.length === 0 ? (
            <div className="analytics-empty">
              No complaints found.
            </div>
          ) : (
            <div className="recent-list">

              {analytics.recentComplaints.map(
                (complaint) => (
                  <div
                    className="recent-item"
                    key={complaint._id}
                  >

                    <div className="recent-complaint-main">

                      <div className="recent-icon">
                        📄
                      </div>

                      <div>
                        <h3>
                          {complaint.title}
                        </h3>

                        <div className="recent-meta">
                          <span>
                            {complaint.category}
                          </span>

                          <span className="meta-dot">
                            •
                          </span>

                          <span>
                            {complaint.user?.name ||
                              "Unknown"}
                          </span>
                        </div>
                      </div>

                    </div>

                    <span
                      className={`status-badge ${complaint.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {complaint.status}
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AnalyticsDashboard;