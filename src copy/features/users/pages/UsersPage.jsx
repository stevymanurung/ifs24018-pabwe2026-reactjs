import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import useInput from "../../../hooks/useInput";
import { asyncGetUsers } from "../states/action";

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [keyword, onKeyword] = useInput();

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Daftar Pengguna</h2>
        <p className="text-sm text-slate-500">Semua pengguna yang terdaftar pada sistem.</p>
      </div>
      <input value={keyword} onChange={onKeyword} placeholder="Cari nama pengguna..."
        className="input sm:max-w-sm" />
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Tidak ada pengguna ditemukan.</div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <li key={u.id} className="card flex items-center gap-3 p-4 transition hover:shadow-md">
              <Avatar name={u.name} photo={u.photo} className="h-12 w-12" />
              <div>
                <p className="font-bold">{u.name}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
