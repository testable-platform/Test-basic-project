import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({ title, submitLabel, fields, onSubmit }) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""])),
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card auth-card">
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name}>
            {field.label}
            <input
              type={field.type || "text"}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required !== false}
              minLength={field.minLength}
            />
          </label>
        ))}

        {error ? <p className="error">{error}</p> : null}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Please wait..." : submitLabel}
        </button>
      </form>

      <p className="auth-switch">
        {title === "Login" ? (
          <>
            Need an account? <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            Already have an account? <Link to="/login">Login</Link>
          </>
        )}
      </p>
    </div>
  );
}
