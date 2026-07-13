import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, FolderOpen, Users, Brain, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { DEMO_ACCOUNTS } from "../data/mockData";

const features = [
  { icon: FolderOpen, label: "Gestion des Dossiers" },
  { icon: Users, label: "Base Clients Centralisée" },
  { icon: Brain, label: "Analyse IA Intégrée" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[60%] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a237e 0%, #0d1642 100%)" }}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16">
          <div className="flex flex-col items-center mb-14">
            <div className="p-8 rounded-full bg-white/10 backdrop-blur-sm mb-10">
              <Scale className="w-28 h-28 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-5xl font-bold text-white text-center mb-5">
              Cabinet Diallo & Associés
            </h1>
            <p className="text-xl text-white/70 text-center max-w-lg leading-relaxed">
              Plateforme de gestion intelligente des dossiers juridiques
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-8">
            {features.map((feat) => (
              <div
                key={feat.label}
                className="flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <feat.icon className="w-6 h-6 text-white/80" />
                <span className="text-base text-white/80 font-medium">{feat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white px-8 py-16">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="p-5 rounded-full bg-[#1a237e]/10 mb-5">
              <Scale className="w-14 h-14 text-[#1a237e]" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-[#1a237e]">Cabinet Diallo & Associés</h2>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Bienvenue</h2>
            <p className="text-lg text-gray-500">Connectez-vous à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-gray-400 pointer-events-none" />
              <Input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-[52px] h-14 text-base"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-gray-400 pointer-events-none" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-[52px] pr-[52px] h-14 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-13 text-base bg-[#1a237e] text-white hover:bg-[#0d1642] transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Se connecter"
              )}
            </Button>

            {error && (
              <p className="text-red-600 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          <div className="mt-10 p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-4">Comptes de démonstration :</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => quickLogin(acc)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1a237e]/10 text-[#1a237e] text-sm font-medium hover:bg-[#1a237e]/20 transition-colors"
                >
                  {acc.user.prenom} {acc.user.nom}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
