import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncSetIsAuthRegister } from "../states/action";
import RegisterPage from "./RegisterPage";

vi.mock("../../../helpers/toolsHelper", () => ({ showWarningDialog: vi.fn() }));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncSetIsAuthRegister: vi.fn(() => ({ type: "noop" })),
}));

describe("RegisterPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memvalidasi setiap field wajib", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    const submit = screen.getByRole("button", { name: "Daftar" });
    await user.click(submit);
    await user.type(screen.getByLabelText("Nama"), "Budi");
    await user.click(submit);
    await user.type(screen.getByLabelText("Email"), "b@b.c");
    await user.click(submit);
    expect(showWarningDialog).toHaveBeenCalledTimes(3);
    expect(asyncSetIsAuthRegister).not.toHaveBeenCalled();
  });

  it("menolak email tidak valid dan kata sandi kurang dari 6 karakter", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await user.type(screen.getByLabelText("Nama"), "Budi");
    await user.type(screen.getByLabelText("Email"), "bukan-email");
    await user.type(screen.getByLabelText("Kata Sandi"), "123456");
    await user.click(screen.getByRole("button", { name: "Daftar" }));
    expect(showWarningDialog).toHaveBeenLastCalledWith("Format email tidak valid");

    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "b@b.c");
    await user.clear(screen.getByLabelText("Kata Sandi"));
    await user.type(screen.getByLabelText("Kata Sandi"), "123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));
    expect(showWarningDialog).toHaveBeenLastCalledWith("Kata sandi minimal 6 karakter");
    expect(asyncSetIsAuthRegister).not.toHaveBeenCalled();
  });

  it("mengirim data registrasi yang lengkap", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await user.type(screen.getByLabelText("Nama"), "Budi");
    await user.type(screen.getByLabelText("Email"), "b@b.c");
    await user.type(screen.getByLabelText("Kata Sandi"), "123456");
    await user.click(screen.getByRole("button", { name: "Daftar" }));
    expect(asyncSetIsAuthRegister).toHaveBeenCalledWith({
      name: "Budi",
      email: "b@b.c",
      password: "123456",
    });
  });

  it("menuju halaman login setelah registrasi berhasil", () => {
    const { store } = renderWithProviders(
      <Routes>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<div>Halaman Login</div>} />
      </Routes>,
      { preloadedState: { isAuthRegister: true }, route: "/auth/register" }
    );
    expect(screen.getByText("Halaman Login")).toBeInTheDocument();
    expect(store.getState().isAuthRegister).toBe(false);
  });
});
