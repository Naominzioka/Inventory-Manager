import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="page auth-page">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Login to manage products, stock, and suppliers.</p>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <button type="submit">Login</button>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}