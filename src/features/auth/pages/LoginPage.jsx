import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthLogin, setIsAuthLoginActionCreator } from "../states/action";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthLogin = useSelector((state) => state.isAuthLogin);
  const [email, onEmail] = useInput();
  const [password, onPassword] = useInput();

  useEffect(() => {
    if (isAuthLogin) {
      dispatch(setIsAuthLoginActionCreator(false));
      navigate("/");
    }
  }, [isAuthLogin, dispatch, navigate]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      showWarningDialog("Email dan kata sandi wajib diisi");
      return;
    }
    dispatch(asyncSetIsAuthLogin({ email, password }));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Masuk</h2>
        <p className="mt-1 text-sm text-slate-500">Selamat datang kembali, silakan masuk ke akunmu.</p>
      </div>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" value={email} onChange={onEmail} placeholder="nama@email.com" className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Kata Sandi</label>
        <input id="password" type="password" value={password} onChange={onPassword} placeholder="Masukkan kata sandi" className="input" />
      </div>
      <button type="submit" className="btn btn-primary w-full">Masuk</button>
      <p className="text-center text-sm text-slate-500">
        Belum punya akun? <Link to="/auth/register" className="font-semibold text-indigo-600 hover:underline">Daftar</Link>
      </p>
    </form>
  );
}
