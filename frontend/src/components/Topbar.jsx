import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell, FiSearch, FiChevronDown, FiSettings, FiLogOut, FiX,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { getInitials, getAvatarColor, ROLE_LABELS } from "../utils/helpers";

export default function Topbar({ selectedAgence, onAgenceChange, agences }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-6 gap-4 shrink-0 relative z-10">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="text-muted-foreground hover:bg-secondary p-1.5 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Recherche"
        >
          <FiSearch size={18} />
        </button>
        <div className={`overflow-hidden transition-all duration-200 ${searchOpen ? "w-[280px]" : "w-0"}`}>
          <input
            ref={searchRef}
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Référence, titre, client…"
            onBlur={() => { if (!searchVal) setSearchOpen(false); }}
            className="w-[280px] border border-border rounded px-3 py-1.5 text-[13px] bg-background text-foreground outline-none"
          />
        </div>
        {searchOpen && searchVal && (
          <button
            onClick={() => { setSearchVal(""); searchRef.current?.focus(); }}
            className="text-muted-foreground p-0.5"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        {user.role === "chef_central" && agences && (
          <div className="relative">
            <select
              value={selectedAgence}
              onChange={(e) => onAgenceChange(e.target.value)}
              className="appearance-none h-9 pr-8 pl-3 border border-border rounded bg-card text-foreground text-[13px] cursor-pointer outline-none min-w-[170px]"
            >
              <option value="all">Toutes les agences</option>
              {agences.map((a) => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
            <FiChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
            />
          </div>
        )}

        <button
          className="relative text-muted-foreground w-[44px] h-[44px] flex items-center justify-center rounded hover:bg-secondary"
          aria-label="Notifications"
        >
          <FiBell size={19} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-destructive text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-card">
            0
          </span>
        </button>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <Avatar user={user} size={30} />
            <div className="text-left">
              <div className="text-[13px] font-semibold text-foreground leading-tight">{user.nom}</div>
              <div className="text-[11px] text-muted-foreground">{ROLE_LABELS[user.role]}</div>
            </div>
            <FiChevronDown size={13} className="text-muted-foreground ml-0.5" />
          </button>

          {menuOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[240px] bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2.5 mb-2">
                  <Avatar user={user} size={36} />
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">{user.nom}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[11px] font-medium bg-secondary text-secondary-foreground rounded-md px-2 py-0.5">
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
              </div>
              <div className="py-1.5">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-foreground hover:bg-secondary transition-colors text-left">
                  <FiSettings size={15} className="text-muted-foreground" />
                  Paramètres du compte
                </button>
                <div className="h-px bg-border mx-2 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-destructive hover:bg-red-50 transition-colors text-left"
                >
                  <FiLogOut size={15} />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Avatar({ user, size = 36 }) {
  const bg = getAvatarColor(user?.nom);
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold shrink-0 select-none text-primary-foreground"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.36,
      }}
    >
      {getInitials(user?.nom)}
    </div>
  );
}
