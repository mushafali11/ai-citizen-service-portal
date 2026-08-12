import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ComplaintForm.css";

function ComplaintForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to submit complaint");
        return;
      }

      setMessage("Complaint submitted successfully!");

      setTitle("");
      setDescription("");
      setCategory("");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="complaint-page">
      <div className="complaint-container">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="complaint-card">
          <h1>Submit a Complaint</h1>

          <p className="complaint-subtitle">
            Tell us about the issue and we’ll help you track its progress.
          </p>

          <form
            className="complaint-form"
            onSubmit={handleSubmit}
          >
            <label>Complaint Title</label>

            <input
              type="text"
              placeholder="Enter complaint title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Description</label>

            <textarea
              placeholder="Describe your complaint in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
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

            <button
              className="complaint-submit"
              type="submit"
            >
              Submit Complaint
            </button>
          </form>

          {message && (
            <p className="complaint-message">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintForm;