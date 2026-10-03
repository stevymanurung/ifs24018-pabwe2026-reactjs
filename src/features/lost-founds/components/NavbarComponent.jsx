import { IconLogout, IconMenu2, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../../components/Avatar";

export default function NavbarComponent({ profile, onToggleSidebar, onLogout }) {
  const [open, setOpen] = useState(false);
  const name = profile?.name ?? "Memuat...";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button aria-label="Buka menu" onClick={onToggleSidebar} className="lg:hidden">
          <IconMenu2 />
        </button>
        <img src="/logo.svg" alt="Logo" className="h-9 w-9 rounded-xl" />
        <h1 className="text-lg font-extrabold text-indigo-700">Lost &amp; Founds</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {profile ? "Sesi aktif" : "Memeriksa sesi..."}
        </span>

        <div className="relative">
          <button aria-label="Menu profil" onClick={() => setOpen(!open)} className="flex items-center gap-2">
            <Avatar name={name} photo={profile?.photo} />
            <span className="hidden text-sm font-medium sm:block">{name}</span>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
              <Link to="/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">
                <IconUser size={16} /> Profil Saya
              </Link>
            </div>
          )}
        </div>

        <button onClick={onLogout} aria-label="Keluar"
          className="btn btn-danger-outline px-3 py-2">
          <IconLogout size={16} /> <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
