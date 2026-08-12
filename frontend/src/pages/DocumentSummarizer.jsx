import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DocumentSummarizer.css";

function DocumentSummarizer() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setMessage("Please select a PDF file only.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setSummary("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a PDF document first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    setLoading(true);
    setMessage("");
    setSummary("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/documents/summarize",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to summarize document"
        );
      }

      setSummary(data.summary);
      setMessage("Document summarized successfully!");
    } catch (error) {
      console.error(error);
      setMessage(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-page">
      <div className="document-container">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="document-header">
          <h1>Document Summarizer 📄</h1>
          <p>
            Upload a PDF document and get a quick summary of its contents.
          </p>
        </div>

        <div className="upload-card">
          <form onSubmit={handleSubmit}>
            <label className="file-label">
              Select PDF Document
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />

            {file && (
              <p className="file-name">
                Selected: {file.name}
              </p>
            )}

            <button
              type="submit"
              className="summarize-button"
              disabled={loading || !file}
            >
              {loading
                ? "Summarizing..."
                : "Summarize Document"}
            </button>
          </form>

          {message && (
            <p className="document-message">
              {message}
            </p>
          )}
        </div>

        {summary && (
          <div className="summary-card">
            <h2>Document Summary</h2>
            <p>{summary}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default DocumentSummarizer;