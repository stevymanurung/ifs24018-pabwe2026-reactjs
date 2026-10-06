import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncSetIsAuthLogin } from "../states/action";
import LoginPage from "./LoginPage";

vi.mock("../../../helpers/toolsHelper", () => ({ showWarningDialog: vi.fn() }));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncSetIsAuthLogin: vi.fn(() => ({ type: "noop" })),
}));

describe("LoginPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memvalidasi input kosong sebelum mengirim", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.click(screen.getByRole("button", { name: "Masuk" }));
    await user.type(screen.getByLabelText("Email"), "a@b.c");
    await user.click(screen.getByRole("button", { name: "Masuk" }));
    expect(showWarningDialog).toHaveBeenCalledTimes(2);
    expect(asyncSetIsAuthLogin).not.toHaveBeenCalled();
  });

  it("mengirim kredensial bila lengkap", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText("Email"), "a@b.c");
    await user.type(screen.getByLabelText("Kata Sandi"), "rahasia");
    await user.click(screen.getByRole("button", { name: "Masuk" }));
    expect(asyncSetIsAuthLogin).toHaveBeenCalledWith({ email: "a@b.c", password: "rahasia" });
  });

  it("menuju beranda ketika isAuthLogin true dan mereset state", () => {
    const { store } = renderWithProviders(
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/" element={<div>Beranda</div>} />
      </Routes>,
      { preloadedState: { isAuthLogin: true }, route: "/auth/login" }
    );
    expect(screen.getByText("Beranda")).toBeInTheDocument();
    expect(store.getState().isAuthLogin).toBe(false);
  });
});
