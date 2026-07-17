import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Software",
    priority: "Medium",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await api.post(
        "/tickets",
        formData
      );

      navigate(`/tickets/${response.data._id}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create ticket"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-container narrow-page">
      <form
        className="form-card"
        onSubmit={handleSubmit}
      >
        <h1>Create support ticket</h1>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <label>
          Ticket title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            minLength="3"
            maxLength="100"
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="7"
            minLength="10"
            maxLength="1000"
            required
          />
        </label>

        <label>
          Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>Hardware</option>
            <option>Software</option>
            <option>Network</option>
            <option>Access</option>
            <option>Security</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Priority
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>

        <button
          className="button"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Creating ticket..."
            : "Submit ticket"}
        </button>
      </form>
    </main>
  );
}