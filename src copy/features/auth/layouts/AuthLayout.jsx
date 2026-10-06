import { IconMapPin, IconSearch, IconShieldCheck, IconUsers } from "@tabler/icons-react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../../helpers/apiHelper";

const highlights = [
  { Icon: IconSearch, text: "Laporkan barang hilang dalam hitungan detik" },
  { Icon: IconMapPin, text: "Bantu barang temuan kembali ke pemiliknya" },
  { Icon: IconUsers, text: "Dipakai bersama oleh seluruh sivitas kampus" },
  { Icon: IconShieldCheck, text: "Akun aman dengan autentikasi token" },
];

export default function AuthLayout() {
  if (getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 p-14 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative">
          <img src="/logo.svg" alt="" className="h-14 w-14 rounded-2xl shadow-lg" />
          <p className="mt-6 text-4xl font-extrabold tracking-tight">Lost &amp; Founds</p>
          <p className="mt-3 max-w-md text-indigo-100">
            Laporkan barang hilang, temukan pemiliknya, dan bantu sesama sivitas kampus.
          </p>
          <ul className="mt-10 space-y-4">
            {highlights.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-indigo-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <img src="/logo.svg" alt="" className="h-9 w-9 rounded-xl" />
            <p className="text-lg font-extrabold text-indigo-700">Lost &amp; Founds</p>
          </div>
          <div className="card p-8 shadow-xl shadow-slate-200/70">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
