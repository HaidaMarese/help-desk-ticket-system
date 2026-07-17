import { Link } from "react-router-dom";

export default function TicketCard({ ticket }) {
  return (
    <article className="ticket-card">
      <div className="ticket-card-header">
        <h3>{ticket.title}</h3>

        <span
          className={`status status-${ticket.status
            .toLowerCase()
            .replaceAll(" ", "-")}`}
        >
          {ticket.status}
        </span>
      </div>

      <p>{ticket.description}</p>

      <div className="ticket-meta">
        <span>
          <strong>Category:</strong> {ticket.category}
        </span>

        <span>
          <strong>Priority:</strong> {ticket.priority}
        </span>

        <span>
          <strong>Created by:</strong>{" "}
          {ticket.createdBy?.name}
        </span>

        <span>
          <strong>Assigned to:</strong>{" "}
          {ticket.assignedTo?.name || "Unassigned"}
        </span>
      </div>

      <Link
        to={`/tickets/${ticket._id}`}
        className="button"
      >
        View details
      </Link>
    </article>
  );
}