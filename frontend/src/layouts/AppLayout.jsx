import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import NouveauDossierModal from "../components/modals/NouveauDossierModal";

export default function AppLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedAgence, setSelectedAgence] = useState("all");
  const [showNouveauDossier, setShowNouveauDossier] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Chargement…</div>
      </div>
    );
  }

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          user={user}
          selectedAgence={selectedAgence}
          onAgenceChange={setSelectedAgence}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          <Outlet />

          {/* FAB */}
          <button
            onClick={() => setShowNouveauDossier(true)}
            className="fixed bottom-8 right-8 flex items-center gap-2 bg-primary text-primary-foreground border-none rounded-[28px] px-5 py-3 text-sm font-semibold cursor-pointer shadow-lg hover:bg-sidebar-accent hover:-translate-y-0.5 hover:shadow-xl transition-all duration-150 z-40"
            aria-label="Créer un nouveau dossier"
          >
            <FiPlus size={18} />
            Nouveau dossier
          </button>
        </main>
      </div>

      <NouveauDossierModal
        open={showNouveauDossier}
        onClose={() => setShowNouveauDossier(false)}
        onCreated={(ref) => {
          setShowNouveauDossier(false);
          navigate(`/dossiers/${ref}`);
        }}
      />
    </div>
  );
}
