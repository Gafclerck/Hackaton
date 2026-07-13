import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";

const pageTitles = {
  "/dashboard": { title: "Tableau de bord", subtitle: "Vue d'ensemble de votre activité" },
  "/dossiers": { title: "Dossiers", subtitle: "Gestion des dossiers juridiques" },
  "/clients": { title: "Clients", subtitle: "Base centralisée des clients" },
  "/agences": { title: "Agences", subtitle: "Gestion des agences" },
  "/utilisateurs": { title: "Utilisateurs", subtitle: "Gestion des utilisateurs" },
  "/specialites": { title: "Spécialités", subtitle: "Types d'affaires et spécialités" },
  "/parametres": { title: "Paramètres", subtitle: "Configuration de l'application" },
};

export default function AppLayout() {
  const { user } = useAuth();
  const path = window.location.pathname;
  const matchedKey = Object.keys(pageTitles).find((key) => path.startsWith(key)) || "/dashboard";
  const { title, subtitle } = pageTitles[matchedKey] || { title: "Application", subtitle: "" };

  return (
    <div className="flex h-screen bg-gray-50/50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
