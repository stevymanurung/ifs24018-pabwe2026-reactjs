import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncDeleteLostFound, asyncGetLostFound } from "../states/action";
import DetailPage from "./DetailPage";

vi.mock("../../../helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal()),
  showConfirmDialog: vi.fn(),
}));
vi.mock("../modals/ChangeModal", () => ({
  default: ({ onClose }) => <button onClick={onClose}>Modal Ubah</button>,
}));
vi.mock("../modals/ChangeCoverModal", () => ({
  default: ({ onClose }) => <button onClick={onClose}>Modal Cover</button>,
}));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncGetLostFound: vi.fn(() => ({ type: "noop" })),
  asyncDeleteLostFound: vi.fn(() => ({ type: "noop" })),
}));

const item = {
  id: 5, title: "Dompet", description: "hitam", status: "lost", is_completed: 1,
  cover: "img/d.png", created_at: "2024-01-01T00:00:00Z", author: { name: "Budi", photo: null },
};

const setup = (state = {}) =>
  renderWithProviders(
    <Routes>
      <Route path="/lost-founds/:id" element={<DetailPage />} />
      <Route path="/" element={<div>Beranda</div>} />
    </Routes>,
    { preloadedState: state, route: "/lost-founds/5" }
  );

describe("DetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan pesan memuat bila data belum sesuai id", () => {
    setup({ lostFound: { ...item, id: 99 } });
    expect(asyncGetLostFound).toHaveBeenCalledWith("5");
    expect(screen.getByText(/Memuat detail/)).toBeInTheDocument();
  });

  it("menampilkan detail lengkap (dengan cover, selesai)", () => {
    setup({ lostFound: item });
    expect(screen.getByAltText("Dompet")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();
    expect(screen.getByText(/Budi ·/)).toBeInTheDocument();
  });

  it("menampilkan placeholder cover dan status belum selesai", () => {
    setup({ lostFound: { ...item, cover: null, is_completed: 0, author: undefined, name: "Siti" } });
    expect(screen.getByText("Tanpa cover")).toBeInTheDocument();
    expect(screen.getByText("Belum selesai")).toBeInTheDocument();
    expect(screen.getByText(/Siti ·/)).toBeInTheDocument();
  });

  it("membuka modal ubah data dan cover lalu menutupnya", async () => {
    const user = userEvent.setup();
    setup({ lostFound: item });
    await user.click(screen.getByRole("button", { name: "Edit Data" }));
    await user.click(screen.getByText("Modal Ubah"));
    await user.click(screen.getByRole("button", { name: "Edit Cover" }));
    await user.click(screen.getByText("Modal Cover"));
    expect(screen.queryByText("Modal Cover")).not.toBeInTheDocument();
  });

  it("hapus: batal tidak menghapus, konfirmasi menghapus", async () => {
    const user = userEvent.setup();
    setup({ lostFound: item });
    showConfirmDialog.mockResolvedValueOnce(false);
    await user.click(screen.getByRole("button", { name: "Hapus" }));
    expect(asyncDeleteLostFound).not.toHaveBeenCalled();
    showConfirmDialog.mockResolvedValueOnce(true);
    await user.click(screen.getByRole("button", { name: "Hapus" }));
    expect(asyncDeleteLostFound).toHaveBeenCalledWith("5");
  });

  it("setelah data/cover diubah: reset flag, tutup modal, muat ulang", () => {
    const { store } = setup({ lostFound: item, isLostFoundChanged: true, isLostFoundChangedCover: true });
    expect(store.getState().isLostFoundChanged).toBe(false);
    expect(store.getState().isLostFoundChangedCover).toBe(false);
    expect(asyncGetLostFound).toHaveBeenCalledTimes(2);
  });

  it("setelah dihapus: kembali ke beranda", () => {
    const { store } = setup({ lostFound: item, isLostFoundDeleted: true });
    expect(screen.getByText("Beranda")).toBeInTheDocument();
    expect(store.getState().isLostFoundDeleted).toBe(false);
  });
});
