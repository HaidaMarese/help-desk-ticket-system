import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      await login(formData);
      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <form
        className="form-card"
        onSubmit={handleSubmit}
      >
        <h1>Welcome back</h1>

        <p>Log in to manage IT support tickets.</p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button
          className="button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>

        <p>
          Need an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}