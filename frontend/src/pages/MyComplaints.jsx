import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyComplaints.css";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    category: "",
    status: "",
  });

  const navigate = useNavigate();

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token");

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
        setMessage(data.message || "Failed to fetch complaints");
        return;
      }

      setComplaints(data);
    } catch (error) {
      setMessage("Something went wrong while fetching complaints.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete complaint");
        return;
      }

      setComplaints(
        complaints.filter((complaint) => complaint._id !== id)
      );

      setMessage("Complaint deleted successfully!");
    } catch (error) {
      setMessage("Something went wrong while deleting the complaint.");
      console.error(error);
    }
  };

  const handleEdit = (complaint) => {
    setEditingId(complaint._id);

    setEditData({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
    });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update complaint");
        return;
      }

      setComplaints(
        complaints.map((complaint) =>
          complaint._id === id ? data.complaint : complaint
        )
      );

      setEditingId(null);
      setMessage("Complaint updated successfully!");
    } catch (error) {
      setMessage("Something went wrong while updating the complaint.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="complaints-page">
      <div className="complaints-container">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="complaints-header">
          <h1>My Complaints</h1>
          <p>
            Track, edit, and manage your submitted complaints.
          </p>
        </div>

        {message && (
          <p className="complaints-message">
            {message}
          </p>
        )}

        {complaints.length === 0 ? (
          <div className="empty-state">
            <h2>No complaints found</h2>
            <p>
              You haven't submitted any complaints yet.
            </p>
          </div>
        ) : (
          <div className="complaints-grid">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="complaint-item"
              >
                {editingId === complaint._id ? (
                  <div className="edit-form">
                    <h2>Edit Complaint</h2>

                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          title: e.target.value,
                        })
                      }
                    />

                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                    />

                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="Infrastructure">
                        Infrastructure
                      </option>
                      <option value="Public Safety">
                        Public Safety
                      </option>
                      <option value="Sanitation">
                        Sanitation
                      </option>
                      <option value="Utilities">
                        Utilities
                      </option>
                      <option value="Other">
                        Other
                      </option>
                    </select>

                    <select
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>
                      <option value="In Progress">
                        In Progress
                      </option>
                      <option value="Resolved">
                        Resolved
                      </option>
                    </select>

                    <div className="complaint-actions">
                      <button
                        className="save-btn"
                        onClick={() =>
                          handleUpdate(complaint._id)
                        }
                      >
                        Save Changes
                      </button>

                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setEditingId(null);
                          setEditData({
                            title: "",
                            description: "",
                            category: "",
                            status: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="complaint-top">
                      <div>
                        <h2>{complaint.title}</h2>

                        <p className="complaint-description">
                          {complaint.description}
                        </p>
                      </div>

                      <span className="status-badge">
                        {complaint.status}
                      </span>
                    </div>

                    <div className="complaint-details">
                      <div className="complaint-detail">
                        <strong>Category:</strong>{" "}
                        {complaint.category}
                      </div>

                      <div className="complaint-detail">
                        <strong>Submitted:</strong>{" "}
                        {new Date(
                          complaint.createdAt
                        ).toLocaleString()}
                      </div>
                    </div>

                    <div className="complaint-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(complaint)}
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(complaint._id)
                        }
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;