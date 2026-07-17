import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTicket = useCallback(async () => {
    try {
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load ticket"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadTechnicians = useCallback(async () => {
    if (user.role !== "technician") {
      return;
    }

    try {
      const response = await api.get(
        "/tickets/technicians"
      );

      setTechnicians(response.data);
    } catch (requestError) {
      console.error(requestError);
    }
  }, [user.role]);

  useEffect(() => {
    loadTicket();
    loadTechnicians();
  }, [loadTicket, loadTechnicians]);

  const handleTechnicianUpdate = async (event) => {
    const { name, value } = event.target;

    try {
      const response = await api.put(
        `/tickets/${id}`,
        {
          [name]: value,
        }
      );

      setTicket(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update ticket"
      );
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      const response = await api.post(
        `/tickets/${id}/comments`,
        {
          message: comment,
        }
      );

      setTicket(response.data);
      setComment("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to add comment"
      );
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tickets/${id}`);
      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete ticket"
      );
    }
  };

  if (loading) {
    return (
      <div className="page-message">
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-message">
        {error || "Ticket not found"}
      </div>
    );
  }

  const canDelete =
    user.role === "technician" ||
    ticket.status === "Open";

  return (
    <main className="page-container narrow-page">
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <article className="details-card">
        <div className="ticket-card-header">
          <div>
            <p className="ticket-number">
              Ticket #{ticket._id.slice(-6).toUpperCase()}
            </p>

            <h1>{ticket.title}</h1>
          </div>

          <span
            className={`status status-${ticket.status
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {ticket.status}
          </span>
        </div>

        <p className="ticket-description">
          {ticket.description}
        </p>

        <div className="details-grid">
          <div>
            <strong>Category</strong>
            <span>{ticket.category}</span>
          </div>

          <div>
            <strong>Priority</strong>
            <span>{ticket.priority}</span>
          </div>

          <div>
            <strong>Created by</strong>
            <span>{ticket.createdBy?.name}</span>
          </div>

          <div>
            <strong>Assigned to</strong>
            <span>
              {ticket.assignedTo?.name || "Unassigned"}
            </span>
          </div>

          <div>
            <strong>Created</strong>
            <span>
              {new Date(
                ticket.createdAt
              ).toLocaleString()}
            </span>
          </div>

          <div>
            <strong>Last updated</strong>
            <span>
              {new Date(
                ticket.updatedAt
              ).toLocaleString()}
            </span>
          </div>
        </div>

        {user.role === "technician" && (
          <section className="technician-panel">
            <h2>Technician controls</h2>

            <div className="form-row">
              <label>
                Status
                <select
                  name="status"
                  value={ticket.status}
                  onChange={handleTechnicianUpdate}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </label>

              <label>
                Priority
                <select
                  name="priority"
                  value={ticket.priority}
                  onChange={handleTechnicianUpdate}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </label>

              <label>
                Assigned technician
                <select
                  name="assignedTo"
                  value={ticket.assignedTo?._id || ""}
                  onChange={handleTechnicianUpdate}
                >
                  <option value="">Unassigned</option>

                  {technicians.map((technician) => (
                    <option
                      key={technician._id}
                      value={technician._id}
                    >
                      {technician.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        )}

        {canDelete && (
          <button
            className="button button-danger"
            onClick={handleDelete}
          >
            Delete ticket
          </button>
        )}
      </article>

      <section className="details-card">
        <h2>Comments</h2>

        <form
          className="comment-form"
          onSubmit={handleComment}
        >
          <textarea
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            rows="4"
            maxLength="500"
            placeholder="Add a comment..."
            required
          />

          <button
            className="button"
            type="submit"
          >
            Add comment
          </button>
        </form>

        <div className="comments-list">
          {ticket.comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            ticket.comments
              .slice()
              .reverse()
              .map((ticketComment) => (
                <article
                  className="comment"
                  key={ticketComment._id}
                >
                  <div className="comment-header">
                    <strong>
                      {ticketComment.author?.name}
                    </strong>

                    <span>
                      {ticketComment.author?.role}
                    </span>
                  </div>

                  <p>{ticketComment.message}</p>

                  <small>
                    {new Date(
                      ticketComment.createdAt
                    ).toLocaleString()}
                  </small>
                </article>
              ))
          )}
        </div>
      </section>
    </main>
  );
}