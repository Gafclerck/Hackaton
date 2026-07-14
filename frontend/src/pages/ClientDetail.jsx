import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, CreditCard, FileText, Trash2 } from "lucide-react";
import { clients, dossiers } from "../data/mockData";
import { TYPE_CLIENT_LABELS } from "../lib/constants";
import { formatDate } from "../lib/utils";
import Card, { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import StatusBadge from "../components/ui/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../components/ui/Dialog";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

  const client = clients.find((c) => c.id === id);
  const clientDossiers = dossiers.filter((d) => d.client_id === id);

  if (!client) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground mb-1">Client introuvable</p>
          <Button variant="outline" onClick={() => navigate("/clients")} className="mt-3">
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
          onClick={() => navigate("/clients")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Retour aux clients
        </button>

        <div className="flex items-center gap-4 mb-8">
          <Avatar nom={client.nom} size={56} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground mb-1">{client.nom}</h1>
            <Badge variant={client.type_client === "PHYSIQUE" ? "secondary" : "info"}>
              {TYPE_CLIENT_LABELS[client.type_client]}
            </Badge>
          </div>
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} />
            Supprimer
          </Button>
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
                    <p className="text-sm font-medium text-foreground">{client.email || "---"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telephone</p>
                    <p className="text-sm font-medium text-foreground">{client.telephone || "---"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Identifiants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {client.nin && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                      <CreditCard size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">NIN</p>
                      <p className="text-sm font-medium text-foreground font-mono tabular-nums">{client.nin}</p>
                    </div>
                  </div>
                )}
                {client.rccm && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                      <CreditCard size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">RCCM</p>
                      <p className="text-sm font-medium text-foreground font-mono tabular-nums">{client.rccm}</p>
                    </div>
                  </div>
                )}
                {!client.nin && !client.rccm && (
                  <p className="text-sm text-muted-foreground italic">Aucun identifiant enregistre</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Dossiers associes</CardTitle>
              <Badge variant="secondary">{clientDossiers.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {clientDossiers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                  <FileText size={20} />
                </div>
                <p className="text-sm text-muted-foreground">Aucun dossier associe a ce client.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {clientDossiers.map((d, i) => (
                  <div
                    key={d.reference}
                    onClick={() => navigate(`/dossiers/${d.reference}`)}
                    className={`flex items-center gap-4 py-3.5 cursor-pointer hover:opacity-75 transition-opacity ${i > 0 ? "border-t border-border" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-primary tabular-nums">{d.reference}</span>
                        <StatusBadge statut={d.statut} />
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{d.titre}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {d.type_affaire} - {formatDate(d.date_reception)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showDelete} onOpenChange={setShowDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Voulez-vous vraiment supprimer le client {client.nom} ? Cette action est irreversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDelete(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={() => { setShowDelete(false); navigate("/clients"); }}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
