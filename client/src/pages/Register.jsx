import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData);
      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Registration failed"
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
        <h1>Create account</h1>

        <p>
          Register as an employee to submit IT support
          tickets.
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <label>
          Full name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

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
            minLength="6"
            required
          />
        </label>

        <button
          className="button"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Creating account..."
            : "Register"}
        </button>

        <p>
          Already registered?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}