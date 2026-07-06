import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="card dashboard-card">
      <h1>Welcome back</h1>
      <p>You are logged in as <strong>{user?.username}</strong>.</p>
      <div className="profile-grid">
        <div>
          <span className="label">Email</span>
          <span>{user?.email}</span>
        </div>
        <div>
          <span className="label">User ID</span>
          <span>{user?.id}</span>
        </div>
      </div>
      <button type="button" className="btn btn-secondary" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
