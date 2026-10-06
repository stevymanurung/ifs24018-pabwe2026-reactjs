import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import * as actions from "../states/action";
import ProfilePage from "./ProfilePage";

vi.mock("../../../helpers/toolsHelper", () => ({ showWarningDialog: vi.fn() }));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncChangeProfile: vi.fn(() => ({ type: "noop" })),
  asyncChangeProfilePhoto: vi.fn(() => ({ type: "noop" })),
  asyncChangeProfilePassword: vi.fn(() => ({ type: "noop" })),
}));

const profile = { id: 1, name: "Budi", email: "budi@x.com", photo: null };

describe("ProfilePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan pesan memuat saat profil belum ada", () => {
    renderWithProviders(<ProfilePage />);
    expect(screen.getByText(/Memuat profil/)).toBeInTheDocument();
  });

  it("memvalidasi & mengirim perubahan data akun", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, { preloadedState: { profile } });
    expect(screen.getByLabelText("Nama")).toHaveValue("Budi");
    await user.clear(screen.getByLabelText("Nama"));
    await user.click(screen.getByRole("button", { name: "Simpan Profil" }));
    expect(showWarningDialog).toHaveBeenCalledTimes(1);

    await user.type(screen.getByLabelText("Nama"), "Budi S");
    await user.click(screen.getByRole("button", { name: "Simpan Profil" }));
    expect(actions.asyncChangeProfile).toHaveBeenCalledWith({ name: "Budi S", email: "budi@x.com" });
  });

  it("mengunggah foto setelah berkas dipilih", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, { preloadedState: { profile } });
    const button = screen.getByRole("button", { name: "Unggah Foto" });
    expect(button).toBeDisabled();
    const file = new File(["x"], "a.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Berkas foto"), file);
    await user.click(button);
    expect(actions.asyncChangeProfilePhoto).toHaveBeenCalledWith(file);
  });

  it("memvalidasi & mengirim perubahan kata sandi", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, { preloadedState: { profile } });
    const submit = screen.getByRole("button", { name: "Ubah Kata Sandi" });
    await user.click(submit);
    expect(showWarningDialog).toHaveBeenCalledTimes(1);

    await user.type(screen.getByLabelText("Kata Sandi Lama"), "lama");
    await user.type(screen.getByLabelText("Kata Sandi Baru"), "baru");
    fireEvent.click(submit);
    expect(actions.asyncChangeProfilePassword).toHaveBeenCalledWith({
      password: "lama",
      newPassword: "baru",
    });
  });
});
