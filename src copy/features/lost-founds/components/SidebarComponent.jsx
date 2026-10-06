import { IconChartBar, IconHome, IconUser, IconUsers } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

const items = [
  { path: "/", hash: "", label: "Dashboard / Laporan", Icon: IconHome },
  { path: "/", hash: "#statistik", label: "Statistik", Icon: IconChartBar },
  { path: "/users", hash: "", label: "Pengguna", Icon: IconUsers },
  { path: "/profile", hash: "", label: "Profil Saya", Icon: IconUser },
];

export default function SidebarComponent({ open, onClose }) {
  const { pathname, hash } = useLocation();

  return (
    <>
      {open && (
        <button type="button" aria-label="Tutup menu" data-testid="sidebar-overlay" onClick={onClose}
          className="fixed inset-0 z-30 cursor-default bg-black/40 lg:hidden" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-4 pt-20 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}>
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Menu</p>
        <nav className="space-y-1">
          {items.map(({ path, hash: itemHash, label, Icon }) => (
            <Link key={label} to={`${path}${itemHash}`} onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                pathname === path && hash === itemHash
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

SidebarComponent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
