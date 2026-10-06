import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getAccessToken } from "../../../helpers/apiHelper";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthLogout, setIsAuthLogoutActionCreator } from "../../auth/states/action";
import { asyncGetProfile } from "../../users/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function LostFoundLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.profile);
  const isAuthLogout = useSelector((state) => state.isAuthLogout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = getAccessToken();

  useEffect(() => {
    if (token) {
      dispatch(asyncGetProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isAuthLogout) {
      dispatch(setIsAuthLogoutActionCreator(false));
      navigate("/auth/login");
    }
  }, [isAuthLogout, dispatch, navigate]);

  const onLogout = async () => {
    if (await showConfirmDialog("Yakin ingin keluar?", "Keluar")) {
      dispatch(asyncSetIsAuthLogout());
    }
  };

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarComponent profile={profile} onLogout={onLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:ml-64 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
