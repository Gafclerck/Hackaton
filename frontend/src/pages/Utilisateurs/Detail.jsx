import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Building2, Shield, Calendar, Clock } from "lucide-react";
import { useUser } from "../../hooks/useUsers";
import { useAgence } from "../../hooks/useAgences";
import { ROLE_LABELS } from "../../lib/constants";
import { formatDate, formatDateTime } from "../../lib/utils";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";

export default function UtilisateurDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, loading } = useUser(id);
  const { data: agence } = useAgence(user?.agence_id);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground mb-1">Utilisateur introuvable</p>
          <Button variant="outline" onClick={() => navigate("/utilisateurs")} className="mt-3">
            Retour a la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 pb-20 bg-background">
      <div className="max-w-[900px] mx-auto">
        <button
          onClick={() => navigate("/utilisateurs")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Retour aux utilisateurs
        </button>

        <div className="flex items-center gap-4 mb-8">
          <Avatar nom={`${user.prenom} ${user.nom}`} size={56} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground mb-1">{user.prenom} {user.nom}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{ROLE_LABELS[user.role] || user.role}</Badge>
              <Badge variant={user.actif ? "success" : "secondary"}>
                {user.actif ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Agence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    <Building2 size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Agence</p>
                    <p className="text-sm font-medium text-foreground">{agence?.nom || "Non assignee"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    <Shield size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium text-foreground">{ROLE_LABELS[user.role] || user.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informations du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cree le</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(user.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Derniere connexion</p>
                  <p className="text-sm font-medium text-foreground">
                    {user.last_login ? formatDateTime(user.last_login) : "Jamais"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
