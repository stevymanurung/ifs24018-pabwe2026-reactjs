import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import {
  asyncChangeProfile,
  asyncChangeProfilePassword,
  asyncChangeProfilePhoto,
} from "../states/action";

const btnClass = "btn btn-primary w-full";

function ProfileForms({ profile }) {
  const dispatch = useDispatch();
  const isChangeProfile = useSelector((s) => s.isChangeProfile);
  const isChangePhoto = useSelector((s) => s.isChangeProfilePhoto);
  const isChangePassword = useSelector((s) => s.isChangeProfilePassword);
  const [name, onName] = useInput(profile.name);
  const [email, onEmail] = useInput(profile.email);
  const [password, onPassword] = useInput();
  const [newPassword, onNewPassword] = useInput();
  const [file, setFile] = useState(null);

  const submitProfile = (e) => {
    e.preventDefault();
    if (!name || !email) {
      showWarningDialog("Nama dan email wajib diisi");
      return;
    }
    dispatch(asyncChangeProfile({ name, email }));
  };

  const submitPhoto = (e) => {
    e.preventDefault();
    dispatch(asyncChangeProfilePhoto(file));
  };

  const submitPassword = (e) => {
    e.preventDefault();
    if (!password || !newPassword) {
      showWarningDialog("Kata sandi lama dan baru wajib diisi");
      return;
    }
    dispatch(asyncChangeProfilePassword({ password, newPassword }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submitPhoto} className="card space-y-4 p-6">
        <h3 className="text-lg font-extrabold">Foto Profil</h3>
        <Avatar name={profile.name} photo={profile.photo} className="h-24 w-24" />
        <input aria-label="Berkas foto" type="file" accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white" />
        <button type="submit" disabled={!file || isChangePhoto} className={btnClass}>Unggah Foto</button>
      </form>

      <form onSubmit={submitProfile} className="card space-y-4 p-6">
        <h3 className="text-lg font-extrabold">Data Akun</h3>
        <label htmlFor="p-name" className="label">Nama</label>
        <input id="p-name" value={name} onChange={onName} className="input" />
        <label htmlFor="p-email" className="label">Email</label>
        <input id="p-email" type="email" value={email} onChange={onEmail} className="input" />
        <button type="submit" disabled={isChangeProfile} className={btnClass}>Simpan Profil</button>
      </form>

      <form onSubmit={submitPassword} className="card space-y-4 p-6">
        <h3 className="text-lg font-extrabold">Ubah Kata Sandi</h3>
        <label htmlFor="p-old" className="label">Kata Sandi Lama</label>
        <input id="p-old" type="password" value={password} onChange={onPassword} className="input" />
        <label htmlFor="p-new" className="label">Kata Sandi Baru</label>
        <input id="p-new" type="password" value={newPassword} onChange={onNewPassword} className="input" />
        <button type="submit" disabled={isChangePassword} className={btnClass}>Ubah Kata Sandi</button>
      </form>
    </div>
  );
}

ProfileForms.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
};

export default function ProfilePage() {
  const profile = useSelector((state) => state.profile);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Profil Saya</h2>
        <p className="text-sm text-slate-500">Kelola foto, data akun, dan kata sandimu.</p>
      </div>
      {profile ? <ProfileForms profile={profile} /> : <div className="card p-10 text-center text-slate-500">Memuat profil...</div>}
    </section>
  );
}
