import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import TicketCard from "../components/TicketCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/tickets");
      setTickets(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load tickets"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const filteredTickets =
    statusFilter === "All"
      ? tickets
      : tickets.filter(
          (ticket) => ticket.status === statusFilter
        );

  if (loading) {
    return (
      <div className="page-message">
        Loading tickets...
      </div>
    );
  }

  return (
    <main className="page-container">
      <section className="page-header">
        <div>
          <h1>
            {user.role === "technician"
              ? "Support Queue"
              : "My Support Tickets"}
          </h1>

          <p>
            {user.role === "technician"
              ? "Review, assign, and resolve employee tickets."
              : "Create and track your IT support requests."}
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="button"
        >
          Create ticket
        </Link>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <strong>{tickets.length}</strong>
          <span>Total tickets</span>
        </div>

        <div className="summary-card">
          <strong>
            {
              tickets.filter(
                (ticket) => ticket.status === "Open"
              ).length
            }
          </strong>
          <span>Open</span>
        </div>

        <div className="summary-card">
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status === "In Progress"
              ).length
            }
          </strong>
          <span>In progress</span>
        </div>

        <div className="summary-card">
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status === "Resolved"
              ).length
            }
          </strong>
          <span>Resolved</span>
        </div>
      </section>

      <section className="filter-row">
        <label>
          Filter by status
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
        </label>
      </section>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <section className="ticket-grid">
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <h2>No tickets found</h2>
            <p>
              Create a support ticket to get started.
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
            />
          ))
        )}
      </section>
    </main>
  );
}