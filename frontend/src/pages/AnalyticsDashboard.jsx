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
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="analytics-page">
        <p>{message}</p>

        <button
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin Dashboard
        </button>
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

  return (
    <div className="analytics-page">
      <div className="analytics-container">

        <button
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin Dashboard
        </button>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/analytics")}
        >
          View Analytics 📊
        </button>

        <div className="analytics-header">
          <h1>Complaint Analytics 📊</h1>
          <p>
            Overview and insights from citizen complaints.
          </p>
        </div>

        <div className="analytics-stats">

          <div className="analytics-card">
            <h2>{analytics.totalComplaints}</h2>
            <p>Total Complaints</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.statusStats.pending}</h2>
            <p>Pending</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.statusStats.inProgress}</h2>
            <p>In Progress</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.statusStats.resolved}</h2>
            <p>Resolved</p>
          </div>

        </div>

        <div className="charts-grid">

          <div className="chart-card">
            <h2>Complaint Status</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={[
                        "#f59e0b",
                        "#3b82f6",
                        "#22c55e",
                      ][index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Complaints by Category</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="complaints"
                  name="Complaints"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="recent-complaints">
          <h2>Recent Complaints</h2>

          {analytics.recentComplaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <div className="recent-list">
              {analytics.recentComplaints.map((complaint) => (
                <div
                  className="recent-item"
                  key={complaint._id}
                >
                  <div>
                    <h3>{complaint.title}</h3>

                    <p>
                      Category: {complaint.category}
                    </p>

                    <p>
                      Submitted by:{" "}
                      {complaint.user?.name || "Unknown"}
                    </p>
                  </div>

                  <span
                    className={`status-badge ${complaint.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AnalyticsDashboard;