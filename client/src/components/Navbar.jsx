import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        HelpDesk Pro
      </Link>

      <div className="nav-actions">
        {user && (
          <div className="nav-links">
            <span className="user-info">
              {user.name} · {user.role}
            </span>

            <Link to="/">Dashboard</Link>

            <Link to="/tickets/new">
              New Ticket
            </Link>

            <button
              type="button"
              className="button button-secondary"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}