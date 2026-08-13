import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});

  const navigate = useNavigate();

  const fetchAllComplaints = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to fetch complaints");
        return;
      }

      setComplaints(data);

      const statusData = {};
      data.forEach((complaint) => {
        statusData[complaint._id] = complaint.status;
      });

      setSelectedStatus(statusData);
    } catch (error) {
      setMessage("Something went wrong while fetching complaints.");
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/admin/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: selectedStatus[id],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update status");
        return;
      }

      setComplaints((currentComplaints) =>
        currentComplaints.map((complaint) =>
          complaint._id === id ? data.complaint : complaint
        )
      );

      setMessage("Complaint status updated successfully!");
    } catch (error) {
      setMessage("Something went wrong while updating the status.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <button
              className="back-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/analytics")}
            >
              View Analytics 📊
            </button>

            <h1>Admin Dashboard</h1>
            <p>Manage and update all citizen complaints</p>
          </div>

          <div className="admin-badge">ADMIN</div>
        </div>

        {message && <div className="admin-message">{message}</div>}

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Total</span>
            <strong>{complaints.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Pending</span>
            <strong>
              {
                complaints.filter(
                  (complaint) => complaint.status === "Pending"
                ).length
              }
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>In Progress</span>
            <strong>
              {
                complaints.filter(
                  (complaint) => complaint.status === "In Progress"
                ).length
              }
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Resolved</span>
            <strong>
              {
                complaints.filter(
                  (complaint) => complaint.status === "Resolved"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="admin-content">
          <h2>All Complaints</h2>

          {complaints.length === 0 ? (
            <div className="empty-state">
              No complaints found.
            </div>
          ) : (
            <div className="admin-complaints-list">
              {complaints.map((complaint) => (
                <div
                  className="admin-complaint-card"
                  key={complaint._id}
                >
                  <div className="complaint-card-header">
                    <div>
                      <h3>{complaint.title}</h3>
                      <span className="complaint-category">
                        {complaint.category}
                      </span>
                    </div>

                    <span
                      className={`status-badge ${complaint.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  <div className="complaint-user-info">
                    <div>
                      <span>Submitted by</span>
                      <strong>{complaint.user?.name || "Unknown"}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{complaint.user?.email || "Unknown"}</strong>
                    </div>

                    <div>
                      <span>Submitted</span>
                      <strong>
                        {new Date(
                          complaint.createdAt
                        ).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="status-update-section">
                    <h4>Update Complaint Status</h4>

                    <div className="status-controls">
                      <select
                        value={
                          selectedStatus[complaint._id] ||
                          complaint.status
                        }
                        onChange={(e) =>
                          setSelectedStatus({
                            ...selectedStatus,
                            [complaint._id]: e.target.value,
                          })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      <button
                        className="update-status-button"
                        onClick={() =>
                          handleStatusUpdate(complaint._id)
                        }
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;