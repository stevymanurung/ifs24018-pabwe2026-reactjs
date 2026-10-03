import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncAddLostFound } from "../states/action";

export default function AddModal({ onClose }) {
  const dispatch = useDispatch();
  const isAdding = useSelector((state) => state.isLostFoundAdd);
  const [title, onTitle] = useInput();
  const [description, onDescription] = useInput();
  const [status, onStatus] = useInput("lost");

  const onSubmit = (event) => {
    event.preventDefault();
    if (!title || !description) {
      showWarningDialog("Judul dan deskripsi wajib diisi");
      return;
    }
    dispatch(asyncAddLostFound({ title, description, status }));
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={onSubmit} className="modal-panel">
        <h3 className="text-xl font-extrabold">Tambah Laporan</h3>
        <label htmlFor="add-title" className="label">Judul</label>
        <input id="add-title" value={title} onChange={onTitle}
          className="input" />
        <label htmlFor="add-desc" className="label">Deskripsi</label>
        <textarea id="add-desc" value={description} onChange={onDescription} rows={4}
          className="input" />
        <label htmlFor="add-status" className="label">Jenis Laporan</label>
        <select id="add-status" value={status} onChange={onStatus}
          className="input">
          <option value="lost">Hilang</option>
          <option value="found">Ditemukan</option>
        </select>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn btn-outline">Batal</button>
          <button type="submit" disabled={isAdding}
            className="btn btn-primary">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
