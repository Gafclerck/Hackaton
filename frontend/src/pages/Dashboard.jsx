import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dossiers, clients } from "../data/mockData";
import { STATUT_LABELS, STATUT_COLORS, ROLE_LABELS } from "../lib/constants";
import { formatDate } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  FolderOpen,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const total = dossiers.length;
    const enCours = dossiers.filter((d) => d.statut === "EN_COURS").length;
    const enAttente = dossiers.filter((d) => d.statut === "EN_ATTENTE").length;
    const termines = dossiers.filter((d) => d.statut === "TERMINE").length;
    const enRevue = dossiers.filter((d) => d.statut === "EN_REVUE").length;
    const totalClients = clients.length;

    return { total, enCours, enAttente, termines, enRevue, totalClients };
  }, []);

  const recentDossiers = useMemo(
    () => [...dossiers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    []
  );

  const statCards = [
    { label: "Total Dossiers", value: stats.total, icon: FolderOpen, color: "text-[#1a237e]", bg: "bg-[#1a237e]/10" },
    { label: "En cours", value: stats.enCours, icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "En attente", value: stats.enAttente, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Terminés", value: stats.termines, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Clients", value: stats.totalClients, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.prenom} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Voici un aperçu de votre activité — {ROLE_LABELS[user?.role]}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Dossiers récents</CardTitle>
            <Link
              to="/dossiers"
              className="text-sm text-[#1a237e] hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDossiers.map((d) => (
                <Link
                  key={d.id}
                  to={`/dossiers/${d.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">{d.reference}</span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUT_COLORS[d.statut]}`}
                      >
                        {STATUT_LABELS[d.statut]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate mt-1">{d.titre}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-xs text-gray-500">{formatDate(d.date_ouverture)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "En attente", count: stats.enAttente, total: stats.total, color: "bg-amber-400" },
                { label: "En cours", count: stats.enCours, total: stats.total, color: "bg-blue-500" },
                { label: "En revue", count: stats.enRevue, total: stats.total, color: "bg-purple-500" },
                { label: "Terminé", count: stats.termines, total: stats.total, color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
