import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const profile = await getProfile();
      setUser(profile);
      navigate("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-md w-96 border border-border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
          <p className="text-sm text-muted-foreground mt-1">Cabinet Diop & Associés</p>
        </div>
        {error && (
          <p className="bg-red-50 text-destructive text-sm mb-4 text-center rounded py-2">{error}</p>
        )}
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2.5 mb-4 border border-border rounded bg-input-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
          required
        />
        <label className="block text-sm font-medium text-foreground mb-1">Mot de passe</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2.5 mb-4 border border-border rounded bg-input-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground p-2.5 rounded font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
