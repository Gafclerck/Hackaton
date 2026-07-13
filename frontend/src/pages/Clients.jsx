import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { clients, agences } from "../data/mockData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Dialog } from "../components/ui/Dialog";
import { ClientForm } from "../components/clients/ClientForm";
import { cn, formatDate, getInitials } from "../lib/utils";
import { TYPE_PERSONNE_LABELS } from "../lib/constants";
import {
  Search,
  Plus,
  LayoutGrid,
  LayoutList,
  Eye,
  Pencil,
  Users,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function Clients() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const filteredClients = useMemo(() => {
    const term = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.nom?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.prenom?.toLowerCase().includes(term) ||
        c.raison_sociale?.toLowerCase().includes(term)
    );
  }, [search]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPhysique = clients.filter((c) => c.type_personne === "PHYSIQUE").length;
  const totalMorale = clients.filter((c) => c.type_personne === "MORALE").length;

  const getAgenceName = (agenceId) => {
    const agence = agences.find((a) => a.id === agenceId);
    return agence?.nom || "—";
  };

  const handleCreate = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleSubmit = (data) => {
    setDialogOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500">Base centralisée des clients</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total clients</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Personnes physiques</p>
              <p className="text-2xl font-bold">{totalPhysique}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Personnes morales</p>
              <p className="text-2xl font-bold">{totalMorale}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[20px] w-[20px] text-gray-400 pointer-events-none" />
          <Input
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-[52px]"
          />
        </div>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "p-2 rounded-l-lg transition-colors",
              viewMode === "table"
                ? "bg-[#1a237e] text-white"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-r-lg transition-colors",
              viewMode === "grid"
                ? "bg-[#1a237e] text-white"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Aucun client trouvé
          </h3>
          <p className="text-sm text-gray-500">
            Essayez de modifier votre recherche ou ajoutez un nouveau client.
          </p>
        </Card>
      ) : viewMode === "table" ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Nom
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Type
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Téléphone
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Agence
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Date création
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-xs font-medium">
                          {getInitials(
                            client.type_personne === "MORALE"
                              ? client.raison_sociale
                              : `${client.prenom || ""} ${client.nom || ""}`
                          )}
                        </div>
                        <span className="font-medium text-gray-900">
                          {client.type_personne === "MORALE"
                            ? client.raison_sociale
                            : `${client.prenom || ""} ${client.nom}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          client.type_personne === "PHYSIQUE" ? "default" : "secondary"
                        }
                      >
                        {TYPE_PERSONNE_LABELS[client.type_personne]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {client.email || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {client.telephone || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getAgenceName(client.agence_id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(client.date_creation)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/clients/${client.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(client)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedClients.map((client) => (
            <Card key={client.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-lg font-bold mb-3">
                  {getInitials(
                    client.type_personne === "MORALE"
                      ? client.raison_sociale
                      : `${client.prenom || ""} ${client.nom || ""}`
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {client.type_personne === "MORALE"
                    ? client.raison_sociale
                    : `${client.prenom || ""} ${client.nom}`}
                </h3>
                <Badge
                  variant={
                    client.type_personne === "PHYSIQUE" ? "default" : "secondary"
                  }
                  className="mb-3"
                >
                  {TYPE_PERSONNE_LABELS[client.type_personne]}
                </Badge>
                <p className="text-sm text-gray-500 mb-1 truncate w-full">
                  {client.email || "—"}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {client.telephone || "—"}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  {getAgenceName(client.agence_id)}
                </p>
                <div className="flex gap-2">
                  <Link to={`/clients/${client.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(client)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} sur{" "}
            {filteredClients.length} clients
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  currentPage === i + 1 && "bg-[#1a237e] text-white"
                )}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingClient(null);
        }}
        title={editingClient ? "Modifier le client" : "Nouveau client"}
      >
        <ClientForm
          initialData={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => {
            setDialogOpen(false);
            setEditingClient(null);
          }}
        />
      </Dialog>
    </div>
  );
}