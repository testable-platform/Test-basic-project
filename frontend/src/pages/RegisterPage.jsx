import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Register"
      submitLabel="Create account"
      fields={[
        { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
        { name: "username", label: "Username", placeholder: "choose a username", minLength: 3 },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "minimum 6 characters",
          minLength: 6,
        },
      ]}
      onSubmit={async (form) => {
        await register(form);
        navigate("/dashboard");
      }}
    />
  );
}
