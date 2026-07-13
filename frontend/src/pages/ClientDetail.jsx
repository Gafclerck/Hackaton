import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { clients, agences, dossiers, utilisateurs } from "../data/mockData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Dialog } from "../components/ui/Dialog";
import { cn, formatDate, getInitials } from "../lib/utils";
import { TYPE_PERSONNE_LABELS, STATUT_LABELS, STATUT_COLORS } from "../lib/constants";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  CreditCard,
  FileText,
  Hash,
  Scale,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const client = clients.find((c) => c.id === Number(id));

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="h-16 w-16 text-gray-300 mb-5" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Client non trouvé</h2>
        <p className="text-lg text-gray-500 mb-6">
          Ce client n'existe pas ou a été supprimé.
        </p>
        <Link to="/clients">
          <Button>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux clients
          </Button>
        </Link>
      </div>
    );
  }

  const agence = agences.find((a) => a.id === client.agence_id);
  const clientDossiers = dossiers.filter((d) => d.client_id === client.id);
  const dossiersEnCours = clientDossiers.filter((d) => d.statut === "EN_COURS").length;
  const dossiersTermines = clientDossiers.filter((d) => d.statut === "TERMINE").length;

  const displayName =
    client.type_personne === "MORALE"
      ? client.nom
      : `${client.prenom || ""} ${client.nom}`;

  const getAvocatName = (avocatId) => {
    const u = utilisateurs.find((u) => u.id === avocatId);
    return u ? `${u.prenom} ${u.nom}` : "Non affecté";
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    navigate("/clients");
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 py-3">
      {Icon && <Icon className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-base font-medium text-gray-900">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-5">
          <Link to="/clients">
            <Button variant="ghost" size="icon" className="h-11 w-11">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-xl font-bold">
              {getInitials(client.prenom, client.nom)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={client.type_personne === "PHYSIQUE" ? "default" : "secondary"}>
                  {TYPE_PERSONNE_LABELS[client.type_personne]}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              Informations personnelles
            </h2>
            <div className="divide-y divide-gray-100">
              {client.type_personne === "PHYSIQUE" && (
                <>
                  <InfoRow label="Prénom" value={client.prenom} />
                  <InfoRow label="Nom" value={client.nom} />
                  <InfoRow icon={Mail} label="Email" value={client.email} />
                  <InfoRow icon={Phone} label="Téléphone" value={client.telephone} />
                  <InfoRow icon={MapPin} label="Adresse" value={client.adresse} />
                  <InfoRow icon={Briefcase} label="Profession" value={client.profession} />
                  <InfoRow icon={Calendar} label="Date de naissance" value={formatDate(client.date_naissance)} />
                  <InfoRow icon={CreditCard} label="Numéro d'identité" value={client.numero_identite} />
                </>
              )}
              {client.type_personne === "MORALE" && (
                <>
                  <InfoRow label="Raison sociale" value={client.nom} />
                  <InfoRow icon={Scale} label="Forme juridique" value={client.forme_juridique} />
                  <InfoRow icon={Hash} label="Registre de commerce" value={client.registre_commerce} />
                  <InfoRow icon={Mail} label="Email" value={client.email} />
                  <InfoRow icon={Phone} label="Téléphone" value={client.telephone} />
                  <InfoRow icon={MapPin} label="Adresse" value={client.adresse} />
                </>
              )}
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              Dossiers associés ({clientDossiers.length})
            </h2>
            {clientDossiers.length === 0 ? (
              <p className="text-base text-gray-500 text-center py-8">
                Aucun dossier associé à ce client.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                        Référence
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                        Titre
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                        Statut
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                        Avocat
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                        Date ouverture
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {clientDossiers.map((dossier) => (
                      <tr key={dossier.id} className="hover:bg-gray-50">
                        <td className="py-3.5 text-base">
                          <Link
                            to={`/dossiers/${dossier.id}`}
                            className="text-[#1a237e] hover:underline font-medium"
                          >
                            {dossier.reference}
                          </Link>
                        </td>
                        <td className="py-3.5 text-base text-gray-700">{dossier.titre}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUT_COLORS[dossier.statut]}`}>
                            {STATUT_LABELS[dossier.statut]}
                          </span>
                        </td>
                        <td className="py-3.5 text-base text-gray-600">{getAvocatName(dossier.avocat_id)}</td>
                        <td className="py-3.5 text-base text-gray-600">
                          {formatDate(dossier.date_ouverture)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {agence && (
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">
                Agence
              </h2>
              <div className="flex items-center gap-4 mb-5">
                <div className="p-2.5 rounded-xl bg-blue-50">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 text-lg">{agence.nom}</span>
              </div>
              <div className="space-y-3 text-base text-gray-600">
                {agence.adresse && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    {agence.adresse}
                  </div>
                )}
                {agence.telephone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    {agence.telephone}
                  </div>
                )}
                {agence.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    {agence.email}
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Statistiques</h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-base text-gray-600">Total dossiers</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {clientDossiers.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-base text-gray-600">En cours</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {dossiersEnCours}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-base text-gray-600">Terminés</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {dossiersTermines}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dates</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Date de création</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {formatDate(client.created_at)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Confirmer la suppression"
      >
        <p className="text-base text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le client{" "}
          <strong>{displayName}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
