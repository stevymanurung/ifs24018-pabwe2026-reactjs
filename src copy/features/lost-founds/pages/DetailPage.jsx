import { IconArrowLeft, IconPhoto } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import { assetUrl } from "../../../helpers/apiHelper";
import {
  STATUS_LABEL,
  STATUS_STYLE,
  formatDate,
  getAuthorName,
  showConfirmDialog,
} from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncDeleteLostFound,
  asyncGetLostFound,
  setIsLostFoundChangedActionCreator,
  setIsLostFoundChangedCoverActionCreator,
  setIsLostFoundDeletedActionCreator,
} from "../states/action";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lostFound = useSelector((s) => s.lostFound);
  const isChanged = useSelector((s) => s.isLostFoundChanged);
  const isChangedCover = useSelector((s) => s.isLostFoundChangedCover);
  const isDeleted = useSelector((s) => s.isLostFoundDeleted);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    dispatch(asyncGetLostFound(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (isChanged || isChangedCover) {
      dispatch(setIsLostFoundChangedActionCreator(false));
      dispatch(setIsLostFoundChangedCoverActionCreator(false));
      setModal(null);
      dispatch(asyncGetLostFound(id));
    }
  }, [isChanged, isChangedCover, dispatch, id]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(setIsLostFoundDeletedActionCreator(false));
      navigate("/");
    }
  }, [isDeleted, dispatch, navigate]);

  const onDelete = async () => {
    if (await showConfirmDialog("Hapus laporan ini?", "Hapus")) {
      dispatch(asyncDeleteLostFound(id));
    }
  };

  if (!(lostFound && String(lostFound.id) === id)) {
    return <p className="animate-pulse text-sm font-medium text-indigo-600">Memuat detail laporan...</p>;
  }

  const author = getAuthorName(lostFound);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
        <IconArrowLeft size={16} /> Kembali ke daftar
      </Link>
      <article className="card overflow-hidden">
        {lostFound.cover ? (
          <img src={assetUrl(lostFound.cover)} alt={lostFound.title}
            className="max-h-[28rem] w-full bg-slate-100 object-contain" />
        ) : (
          <div className="flex h-56 flex-col items-center justify-center gap-2 bg-linear-to-br from-slate-100 to-slate-200 text-slate-400">
            <IconPhoto size={40} />
            <span className="text-sm font-medium">Tanpa cover</span>
          </div>
        )}
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap gap-2">
            <span className={`badge ${STATUS_STYLE[lostFound.status]}`}>{STATUS_LABEL[lostFound.status]}</span>
            <span className="badge bg-slate-100 text-slate-600">
              {lostFound.is_completed === 1 ? "Selesai" : "Belum selesai"}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">{lostFound.title}</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Avatar name={author} photo={lostFound.author?.photo} className="h-8 w-8" />
            <span>{author} · {formatDate(lostFound.created_at)}</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed text-slate-700">{lostFound.description}</p>
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button onClick={() => setModal("cover")} className="btn btn-outline">Edit Cover</button>
            <button onClick={() => setModal("change")} className="btn btn-outline">Edit Data</button>
            <button onClick={onDelete} className="btn btn-danger">Hapus</button>
          </div>
        </div>
      </article>
      {modal === "change" && <ChangeModal lostFound={lostFound} onClose={() => setModal(null)} />}
      {modal === "cover" && <ChangeCoverModal lostFoundId={lostFound.id} onClose={() => setModal(null)} />}
    </div>
  );
}
