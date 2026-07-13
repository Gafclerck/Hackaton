import { NavLink } from "react-router-dom";
import {
  Scale,
  LayoutDashboard,
  FolderOpen,
  Users,
  Building2,
  UserCog,
  Gavel,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS, ROLES } from "../../lib/constants";
import { getInitials } from "../../lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: null },
  { label: "Dossiers", icon: FolderOpen, path: "/dossiers", roles: null },
  { label: "Clients", icon: Users, path: "/clients", roles: null },
  {
    label: "Agences",
    icon: Building2,
    path: "/agences",
    roles: [ROLES.GERANT_CENTRAL, ROLES.CHEF_AGENCE],
  },
  {
    label: "Utilisateurs",
    icon: UserCog,
    path: "/utilisateurs",
    roles: [ROLES.GERANT_CENTRAL],
  },
  {
    label: "Spécialités",
    icon: Gavel,
    path: "/specialites",
    roles: [ROLES.GERANT_CENTRAL],
  },
];

export default function Sidebar({ user }) {
  const { logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  const userName = user ? `${user.prenom} ${user.nom}` : "Utilisateur";
  const initials = getInitials(user?.prenom, user?.nom);

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-4 px-6 py-6 border-b border-gray-100">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a237e]">
          <Scale className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-base font-bold text-[#1a237e] block leading-tight">
            Cabinet Diallo
          </span>
          <span className="text-sm font-medium text-gray-400">
            & Associés
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${
                isActive
                  ? "bg-[#1a237e]/10 font-semibold text-[#1a237e] shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Settings pinned at bottom */}
      <div className="px-4 pb-3">
        <NavLink
          to="/parametres"
          className={({ isActive }) =>
            `flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${
              isActive
                ? "bg-[#1a237e]/10 font-semibold text-[#1a237e]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`
          }
        >
          <Settings className="h-5 w-5" />
          Paramètres
        </NavLink>
      </div>

      {/* User card */}
      <div className="border-t border-gray-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1a237e] text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-gray-900">
              {userName}
            </p>
            <p className="truncate text-sm text-gray-500">
              {ROLE_LABELS[user?.role] ?? user?.role}
            </p>
          </div>
          <button
            onClick={logout}
            title="Déconnexion"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
