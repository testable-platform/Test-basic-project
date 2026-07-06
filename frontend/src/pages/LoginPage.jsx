import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Login"
      submitLabel="Sign in"
      fields={[
        { name: "username", label: "Username", placeholder: "your username" },
        { name: "password", label: "Password", type: "password", placeholder: "your password" },
      ]}
      onSubmit={async (form) => {
        await login(form);
        navigate("/dashboard");
      }}
    />
  );
}
