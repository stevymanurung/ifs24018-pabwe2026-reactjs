import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { putAccessToken } from "./helpers/apiHelper";
import { renderWithProviders } from "./test-utils";
import * as lostFoundApi from "./features/lost-founds/api/lostFoundApi";
import * as userApi from "./features/users/api/userApi";

vi.mock("./features/lost-founds/api/lostFoundApi");
vi.mock("./features/users/api/userApi");
vi.mock("./helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal()),
  showErrorDialog: vi.fn(),
}));

describe("App (integrasi routing)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    userApi.getProfile.mockResolvedValue({ id: 1, name: "Budi", email: "b@b.c", photo: null });
    userApi.getUsers.mockResolvedValue([{ id: 1, name: "Budi", email: "b@b.c", photo: null }]);
    lostFoundApi.getLostFounds.mockResolvedValue([
      { id: 5, title: "Dompet", description: "d", status: "lost", is_completed: 0, cover: null, created_at: "2024-01-01" },
    ]);
    lostFoundApi.getLostFound.mockResolvedValue({
      id: 5, title: "Dompet", description: "d", status: "lost", is_completed: 0, cover: null, created_at: "2024-01-01",
    });
    lostFoundApi.getLostFoundStatsDaily.mockResolvedValue([]);
    lostFoundApi.getLostFoundStatsMonthly.mockResolvedValue([]);
  });

  it("tanpa token, beranda dialihkan ke halaman login", () => {
    renderWithProviders(<App />);
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("/auth tanpa subrute dialihkan ke halaman login", () => {
    renderWithProviders(<App />, { route: "/auth" });
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("menampilkan halaman registrasi", () => {
    renderWithProviders(<App />, { route: "/auth/register" });
    expect(screen.getByRole("heading", { name: "Daftar Akun" })).toBeInTheDocument();
  });

  it("dengan token, beranda memuat daftar laporan", async () => {
    putAccessToken("tok");
    renderWithProviders(<App />);
    expect(await screen.findByText("Dompet")).toBeInTheDocument();
    expect(userApi.getProfile).toHaveBeenCalled();
  });

  it("rute detail, pengguna, dan profil", async () => {
    putAccessToken("tok");
    const detail = renderWithProviders(<App />, { route: "/lost-founds/5" });
    expect(await screen.findByRole("heading", { name: "Dompet" })).toBeInTheDocument();
    detail.unmount();

    const users = renderWithProviders(<App />, { route: "/users" });
    expect(await screen.findByRole("heading", { name: "Daftar Pengguna" })).toBeInTheDocument();
    users.unmount();

    renderWithProviders(<App />, { route: "/profile" });
    expect(await screen.findByLabelText("Nama")).toHaveValue("Budi");
  });

  it("rute tak dikenal dialihkan ke beranda", async () => {
    putAccessToken("tok");
    renderWithProviders(<App />, { route: "/tidak-ada" });
    expect(await screen.findByText("Dompet")).toBeInTheDocument();
  });

  it("profil gagal dimuat (token tidak valid) memaksa kembali ke login", async () => {
    putAccessToken("basi");
    userApi.getProfile.mockRejectedValue(new Error("Token tidak valid"));
    renderWithProviders(<App />);
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });
});
