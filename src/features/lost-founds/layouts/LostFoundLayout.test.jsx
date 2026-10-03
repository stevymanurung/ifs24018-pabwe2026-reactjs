import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncSetIsAuthLogout } from "../../auth/states/action";
import { asyncGetProfile } from "../../users/states/action";
import LostFoundLayout from "./LostFoundLayout";

vi.mock("../../../helpers/toolsHelper", () => ({ showConfirmDialog: vi.fn() }));
vi.mock("../../auth/states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncSetIsAuthLogout: vi.fn(() => ({ type: "noop" })),
}));
vi.mock("../../users/states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncGetProfile: vi.fn(() => ({ type: "noop" })),
}));

const ui = (
  <Routes>
    <Route path="/" element={<LostFoundLayout />}>
      <Route index element={<div>Isi Halaman</div>} />
    </Route>
    <Route path="/auth/login" element={<div>Halaman Login</div>} />
  </Routes>
);

describe("LostFoundLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("mengalihkan ke login bila tidak ada token (tanpa memuat profil)", () => {
    renderWithProviders(ui);
    expect(screen.getByText("Halaman Login")).toBeInTheDocument();
    expect(asyncGetProfile).not.toHaveBeenCalled();
  });

  it("memuat profil dan menampilkan navbar, sidebar, serta konten", async () => {
    putAccessToken("tok");
    renderWithProviders(ui, { preloadedState: { profile: { name: "Budi", photo: null } } });
    expect(asyncGetProfile).toHaveBeenCalled();
    expect(screen.getByText("Isi Halaman")).toBeInTheDocument();
    expect(screen.getByText("Budi", { selector: "span.hidden" })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Buka menu"));
    expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("sidebar-overlay"));
    expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
  });

  it("logout: batal tidak melakukan apa-apa, konfirmasi memanggil logout", async () => {
    const user = userEvent.setup();
    putAccessToken("tok");
    renderWithProviders(ui);
    showConfirmDialog.mockResolvedValueOnce(false);
    await user.click(screen.getByRole("button", { name: /Keluar/ }));
    expect(asyncSetIsAuthLogout).not.toHaveBeenCalled();

    showConfirmDialog.mockResolvedValueOnce(true);
    await user.click(screen.getByRole("button", { name: /Keluar/ }));
    expect(asyncSetIsAuthLogout).toHaveBeenCalled();
  });

  it("menuju login dan mereset state ketika isAuthLogout true", () => {
    putAccessToken("tok");
    const { store } = renderWithProviders(ui, { preloadedState: { isAuthLogout: true } });
    expect(screen.getByText("Halaman Login")).toBeInTheDocument();
    expect(store.getState().isAuthLogout).toBe(false);
    expect(getAccessToken()).toBe("tok");
  });
});
