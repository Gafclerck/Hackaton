import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../lib/constants";
import { getInitials } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/DropdownMenu";

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth();
  const [notifications] = useState(3);

  const userName = user ? `${user.prenom} ${user.nom}` : "Utilisateur";
  const initials = getInitials(user?.prenom, user?.nom);

  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Left – title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-[15px] text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right – search, bell, avatar */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-72 rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-12 pr-4 text-[15px] outline-none transition-colors focus:border-[#3949ab] focus:bg-white focus:ring-1 focus:ring-[#3949ab]/30"
          />
        </div>

        {/* Notification bell */}
        <button className="relative rounded-xl p-3 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-[22px] w-[22px]" />
          {notifications > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white border-2 border-white">
              {notifications}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a237e] text-sm font-bold text-white">
                {initials}
              </div>
              <span className="hidden text-[15px] font-medium text-gray-700 lg:block">
                {userName}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <p className="px-4 pb-2 text-sm text-gray-400">
              {ROLE_LABELS[user?.role] ?? user?.role}
            </p>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.assign("/profil")}>
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.assign("/parametres")}>
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
