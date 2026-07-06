import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Basic Auth App
      </Link>
      <nav>
        {isAuthenticated ? (
          <>
            <span className="nav-user">Hi, {user?.username}</span>
            <Link to="/dashboard">Dashboard</Link>
            <button type="button" className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
