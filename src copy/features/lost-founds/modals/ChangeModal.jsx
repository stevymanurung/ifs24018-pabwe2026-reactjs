import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncChangeLostFound } from "../states/action";

export default function ChangeModal({ lostFound, onClose }) {
  const dispatch = useDispatch();
  const isChanging = useSelector((state) => state.isLostFoundChange);
  const [title, onTitle] = useInput(lostFound.title);
  const [description, onDescription] = useInput(lostFound.description);
  const [status, onStatus] = useInput(lostFound.status);
  const [completed, setCompleted] = useState(Boolean(lostFound.is_completed));

  const onSubmit = (event) => {
    event.preventDefault();
    if (!title || !description) {
      showWarningDialog("Judul dan deskripsi wajib diisi");
      return;
    }
    dispatch(
      asyncChangeLostFound(lostFound.id, {
        title,
        description,
        status,
        is_completed: completed ? 1 : 0,
      })
    );
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={onSubmit} className="modal-panel">
        <h3 className="text-xl font-extrabold">Ubah Laporan</h3>
        <label htmlFor="ch-title" className="label">Judul</label>
        <input id="ch-title" value={title} onChange={onTitle}
          className="input" />
        <label htmlFor="ch-desc" className="label">Deskripsi</label>
        <textarea id="ch-desc" value={description} onChange={onDescription} rows={4}
          className="input" />
        <label htmlFor="ch-status" className="label">Jenis Laporan</label>
        <select id="ch-status" value={status} onChange={onStatus}
          className="input">
          <option value="lost">Hilang</option>
          <option value="found">Ditemukan</option>
        </select>
        <label htmlFor="ch-done" className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
          <input id="ch-done" type="checkbox" className="h-4 w-4 accent-indigo-600" checked={completed}
            onChange={(e) => setCompleted(e.target.checked)} />
          <span>Tandai selesai</span>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn btn-outline">Batal</button>
          <button type="submit" disabled={isChanging}
            className="btn btn-primary">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

ChangeModal.propTypes = {
  lostFound: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    is_completed: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
