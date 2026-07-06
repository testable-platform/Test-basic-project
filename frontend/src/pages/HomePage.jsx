import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="hero card">
      <h1>Simple Auth Starter</h1>
      <p>
        A minimal Python FastAPI backend with a React frontend. Register, log in, and log out
        with JWT-based authentication.
      </p>
      <div className="hero-actions">
        <Link to="/register" className="btn btn-primary">
          Get started
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Sign in
        </Link>
      </div>
    </div>
  );
}
