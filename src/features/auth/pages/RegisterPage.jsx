import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthRegister, setIsAuthRegisterActionCreator } from "../states/action";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthRegister = useSelector((state) => state.isAuthRegister);
  const [name, onName] = useInput();
  const [email, onEmail] = useInput();
  const [password, onPassword] = useInput();

  useEffect(() => {
    if (isAuthRegister) {
      dispatch(setIsAuthRegisterActionCreator(false));
      navigate("/auth/login");
    }
  }, [isAuthRegister, dispatch, navigate]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!name || !email || !password) {
      showWarningDialog("Nama, email, dan kata sandi wajib diisi");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showWarningDialog("Format email tidak valid");
      return;
    }
    if (password.length < 6) {
      showWarningDialog("Kata sandi minimal 6 karakter");
      return;
    }
    dispatch(asyncSetIsAuthRegister({ name, email, password }));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Daftar Akun</h2>
        <p className="mt-1 text-sm text-slate-500">Buat akun baru untuk mulai melaporkan barang.</p>
      </div>
      <div>
        <label htmlFor="name" className="label">Nama</label>
        <input id="name" value={name} onChange={onName} placeholder="Nama lengkap" className="input" />
      </div>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" value={email} onChange={onEmail} placeholder="nama@email.com" className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Kata Sandi</label>
        <input id="password" type="password" value={password} onChange={onPassword} placeholder="Minimal 6 karakter" className="input" />
      </div>
      <button type="submit" className="btn btn-primary w-full">Daftar</button>
      <p className="text-center text-sm text-slate-500">
        Sudah punya akun? <Link to="/auth/login" className="font-semibold text-indigo-600 hover:underline">Masuk</Link>
      </p>
    </form>
  );
}
