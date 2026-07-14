import { useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid, FiFolder, FiList, FiHome, FiUsers,
  FiBookOpen, FiSettings,
} from "react-icons/fi";
import { getInitials, getAvatarColor } from "../utils/helpers";

const ALL_NAV = [
  { id: "dashboard",    label: "Tableau de bord",   icon: FiGrid },
  { id: "dossiers",     label: "Dossiers",           icon: FiFolder },
  { id: "file",         label: "File d'affectation", icon: FiList },
  { id: "agences",      label: "Agences",            icon: FiHome },
  { id: "utilisateurs", label: "Utilisateurs",       icon: FiUsers },
  { id: "specialites",  label: "Spécialités",        icon: FiBookOpen },
  { id: "parametres",   label: "Paramètres",         icon: FiSettings },
];

const NAV_BY_ROLE = {
  chef_central:  ["dashboard", "dossiers", "file", "agences", "utilisateurs", "specialites", "parametres"],
  chef_agence:   ["dashboard", "dossiers", "file", "parametres"],
  avocat:        ["dashboard", "dossiers", "parametres"],
};

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeId = location.pathname.split("/").filter(Boolean)[0] || "dashboard";
  const allowed = NAV_BY_ROLE[user?.role] || NAV_BY_ROLE.avocat;
  const items = ALL_NAV.filter((i) => allowed.includes(i.id));
  const main = items.filter((i) => i.id !== "parametres");
  const bottom = items.filter((i) => i.id === "parametres");

  return (
    <nav className="w-[232px] shrink-0 bg-sidebar flex flex-col border-r border-sidebar-border h-full">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-accent/18 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <line x1="12" y1="3" x2="12" y2="21" /><line x1="5" y1="7" x2="19" y2="7" />
              <circle cx="5" cy="10" r="2.5" /><circle cx="19" cy="10" r="2.5" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-sidebar-foreground leading-tight">
              Cabinet Diop & Associés
            </div>
            <div className="text-[10px] text-white/45 tracking-wide">
              Gestion de cabinet
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 py-3 px-2.5 overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          {main.map((item) => (
            <SidebarBtn
              key={item.id}
              item={item}
              active={item.id === activeId}
              onClick={() => navigate("/" + item.id)}
              badge={item.id === "file" && user?.role === "chef_central" ? "4" : undefined}
            />
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="px-2.5 pb-4 pt-2 border-t border-sidebar-border">
        {bottom.map((item) => (
          <SidebarBtn
            key={item.id}
            item={item}
            active={item.id === activeId}
            onClick={() => navigate("/" + item.id)}
          />
        ))}
      </div>
    </nav>
  );
}

function SidebarBtn({ item, active, onClick, badge }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-[9px] rounded w-full text-left text-sm transition-colors duration-100 min-h-[44px]
        ${active
          ? "bg-sidebar-accent text-sidebar-foreground font-medium"
          : "text-white/80 hover:bg-white/7"
        }`}
    >
      <span className={active ? "opacity-100" : "opacity-70"}>
        <Icon size={18} />
      </span>
      {item.label}
      {badge && (
        <span className="ml-auto bg-accent text-accent-foreground rounded-full text-[10px] font-bold px-1.5 py-px">
          {badge}
        </span>
      )}
    </button>
  );
}
