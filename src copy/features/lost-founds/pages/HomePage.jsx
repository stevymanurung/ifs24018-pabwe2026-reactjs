import {
  IconAlertTriangle,
  IconCircleCheck,
  IconClipboardList,
  IconPackage,
  IconPhoto,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { assetUrl } from "../../../helpers/apiHelper";
import {
  STATUS_LABEL,
  STATUS_STYLE,
  extractRows,
  formatDate,
  pct,
  showConfirmDialog,
} from "../../../helpers/toolsHelper";
import useInput from "../../../hooks/useInput";
import AddModal from "../modals/AddModal";
import {
  asyncChangeLostFound,
  asyncDeleteLostFound,
  asyncGetLostFoundStats,
  asyncGetLostFounds,
  setIsLostFoundAddedActionCreator,
  setIsLostFoundChangedActionCreator,
  setIsLostFoundDeletedActionCreator,
} from "../states/action";

const selectClass = "input w-auto";

function StatList({ title, data }) {
  const rows = extractRows(data);
  return (
    <div className="card p-5">
      <h4 className="mb-3 text-base font-extrabold">{title}</h4>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada data.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {rows.map((row) => {
            const text = Object.values(row).join(" · ");
            return (
              <li key={text} className="rounded-lg bg-slate-50 px-3 py-2 font-medium">
                {text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

StatList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default function HomePage() {
  const dispatch = useDispatch();
  const lostFounds = useSelector((s) => s.lostFounds);
  const isLoading = useSelector((s) => s.isLostFound);
  const isAdded = useSelector((s) => s.isLostFoundAdded);
  const isChanged = useSelector((s) => s.isLostFoundChanged);
  const isDeleted = useSelector((s) => s.isLostFoundDeleted);
  const stats = useSelector((s) => s.lostFoundStats);

  const [isMe, setIsMe] = useState(false);
  const [status, setStatus] = useState("all");
  const [completed, setCompleted] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [keyword, onKeyword] = useInput();
  const { hash } = useLocation();

  const load = useCallback(
    () => dispatch(asyncGetLostFounds(isMe ? { is_me: 1 } : {})),
    [dispatch, isMe]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    dispatch(asyncGetLostFoundStats());
  }, [dispatch]);

  useEffect(() => {
    if (isAdded) {
      dispatch(setIsLostFoundAddedActionCreator(false));
      setShowAdd(false);
      load();
    }
  }, [isAdded, dispatch, load]);

  // Aksi cepat dari kartu (tandai selesai / hapus) selesai: reset flag, muat ulang
  useEffect(() => {
    if (isChanged || isDeleted) {
      dispatch(setIsLostFoundChangedActionCreator(false));
      dispatch(setIsLostFoundDeletedActionCreator(false));
      load();
    }
  }, [isChanged, isDeleted, dispatch, load]);

  // Menu "Statistik" pada sidebar mengarah ke #statistik: gulir ke bagian tersebut
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  const onToggleCompleted = (item) =>
    dispatch(
      asyncChangeLostFound(item.id, {
        title: item.title,
        description: item.description,
        status: item.status,
        is_completed: item.is_completed === 1 ? 0 : 1,
      })
    );

  const onDelete = async (item) => {
    if (await showConfirmDialog(`Hapus laporan "${item.title}"?`, "Hapus")) {
      dispatch(asyncDeleteLostFound(item.id));
    }
  };

  const kw = keyword.toLowerCase();
  const filtered = lostFounds.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      (completed === "all" || String(item.is_completed) === completed) &&
      item.title.toLowerCase().includes(kw)
  );

  const summary = [
    ["Total", lostFounds.length, IconClipboardList, "bg-indigo-100 text-indigo-600", "bg-indigo-500"],
    ["Barang Hilang", lostFounds.filter((i) => i.status === "lost").length, IconAlertTriangle, "bg-rose-100 text-rose-600", "bg-rose-500"],
    ["Barang Ditemukan", lostFounds.filter((i) => i.status === "found").length, IconPackage, "bg-emerald-100 text-emerald-600", "bg-emerald-500"],
    ["Selesai", lostFounds.filter((i) => i.is_completed === 1).length, IconCircleCheck, "bg-sky-100 text-sky-600", "bg-sky-500"],
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg shadow-indigo-200">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Laporan Lost &amp; Found</h2>
          <p className="mt-1 text-sm text-indigo-100">
            Pantau barang hilang dan temuan, lalu tandai selesai saat sudah kembali ke pemiliknya.
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn bg-white text-indigo-700 shadow-sm hover:bg-indigo-50">
          <IconPlus size={18} /> Tambah Laporan
        </button>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map(([label, value, Icon, iconStyle, barStyle]) => (
          <div key={label} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-3xl font-extrabold">{value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}>
                <Icon size={20} />
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${barStyle}`}
                style={{ width: `${pct(value, lostFounds.length)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card flex flex-wrap items-center gap-2 p-3">
        <div className="relative min-w-52 flex-1">
          <IconSearch size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={keyword} onChange={onKeyword} placeholder="Cari judul laporan..." className="input pl-10" />
        </div>
        <select aria-label="Filter status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="all">Semua jenis</option>
          <option value="lost">Hilang</option>
          <option value="found">Ditemukan</option>
        </select>
        <select aria-label="Filter penyelesaian" value={completed} onChange={(e) => setCompleted(e.target.value)} className={selectClass}>
          <option value="all">Semua status</option>
          <option value="0">Belum selesai</option>
          <option value="1">Selesai</option>
        </select>
        <select aria-label="Filter kepemilikan" value={isMe ? "me" : "all"} onChange={(e) => setIsMe(e.target.value === "me")} className={selectClass}>
          <option value="all">Semua laporan</option>
          <option value="me">Laporan saya</option>
        </select>
      </div>

      {isLoading && <p className="animate-pulse text-sm font-medium text-indigo-600">Memuat data...</p>}
      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-12 text-center text-slate-500">
          <IconClipboardList size={40} className="text-slate-300" />
          <p>Tidak ada laporan ditemukan.</p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.id} className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
              <Link to={`/lost-founds/${item.id}`} className="block flex-1">
                {item.cover ? (
                  <img src={assetUrl(item.cover)} alt={item.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 text-slate-400">
                    <IconPhoto size={36} />
                  </div>
                )}
                <div className="space-y-2 p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`badge ${STATUS_STYLE[item.status]}`}>{STATUS_LABEL[item.status]}</span>
                    <span className="badge bg-slate-100 text-slate-600">
                      {item.is_completed === 1 ? "Selesai" : "Belum selesai"}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold leading-snug group-hover:text-indigo-700">{item.title}</h3>
                  <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
                </div>
              </Link>
              <div className="flex gap-2 border-t border-slate-100 p-3">
                <button onClick={() => onToggleCompleted(item)} className="btn btn-success-outline flex-1 py-2">
                  {item.is_completed === 1 ? "Buka Kembali" : "Tandai Selesai"}
                </button>
                <button onClick={() => onDelete(item)} className="btn btn-danger-outline py-2">
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <section id="statistik" className="grid scroll-mt-24 gap-4 md:grid-cols-2">
        <StatList title="Statistik Harian" data={stats.daily} />
        <StatList title="Statistik Bulanan" data={stats.monthly} />
      </section>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
