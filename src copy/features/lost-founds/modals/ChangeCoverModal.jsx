import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncChangeLostFoundCover } from "../states/action";

export default function ChangeCoverModal({ lostFoundId, onClose }) {
  const dispatch = useDispatch();
  const isChanging = useSelector((state) => state.isLostFoundChangeCover);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const onFile = (event) => {
    const selected = event.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(asyncChangeLostFoundCover(lostFoundId, file));
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={onSubmit} className="modal-panel">
        <h3 className="text-xl font-extrabold">Ganti Cover</h3>
        <input aria-label="Berkas cover" type="file" accept="image/*" onChange={onFile}
          className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white" />
        {preview && <img src={preview} alt="Pratinjau cover" className="max-h-64 w-full rounded-xl bg-slate-100 object-contain" />}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-outline">Batal</button>
          <button type="submit" disabled={!file || isChanging}
            className="btn btn-primary">
            Unggah
          </button>
        </div>
      </form>
    </div>
  );
}

ChangeCoverModal.propTypes = {
  lostFoundId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
};
