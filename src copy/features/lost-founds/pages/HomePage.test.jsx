import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import {
  asyncChangeLostFound,
  asyncDeleteLostFound,
  asyncGetLostFoundStats,
  asyncGetLostFounds,
} from "../states/action";
import HomePage from "./HomePage";

vi.mock("../../../helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal()),
  showConfirmDialog: vi.fn(),
}));
vi.mock("../modals/AddModal", () => ({
  default: ({ onClose }) => <button onClick={onClose}>Modal Tambah</button>,
}));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncGetLostFounds: vi.fn(() => ({ type: "noop" })),
  asyncGetLostFoundStats: vi.fn(() => ({ type: "noop" })),
  asyncChangeLostFound: vi.fn(() => ({ type: "noop" })),
  asyncDeleteLostFound: vi.fn(() => ({ type: "noop" })),
}));

const items = [
  { id: 1, title: "Dompet", description: "hitam", status: "lost", is_completed: 0, cover: null, created_at: "2024-01-01T00:00:00Z" },
  { id: 2, title: "Kunci", description: "motor", status: "found", is_completed: 1, cover: "img/k.png", created_at: "2024-01-02T00:00:00Z" },
  { id: 3, title: "HP", description: "biru", status: "lost", is_completed: 1, cover: null, created_at: "2024-01-03T00:00:00Z" },
];

const setup = (extra = {}, route = "/") =>
  renderWithProviders(<HomePage />, { preloadedState: { lostFounds: items, ...extra }, route });

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("memuat data, statistik, serta menampilkan ringkasan dan kartu", () => {
    setup({ isLostFound: true });
    expect(asyncGetLostFounds).toHaveBeenCalledWith({});
    expect(asyncGetLostFoundStats).toHaveBeenCalled();
    expect(screen.getByText("Memuat data...")).toBeInTheDocument();
    expect(screen.getByText("Total").nextSibling).toHaveTextContent("3");
    expect(screen.getByText("Barang Hilang").nextSibling).toHaveTextContent("2");
    expect(screen.getByText("Selesai", { selector: "p" }).nextSibling).toHaveTextContent("2");
    expect(screen.getByAltText("Kunci")).toBeInTheDocument();
    expect(screen.getByText("Dompet").closest("a")).toHaveAttribute("href", "/lost-founds/1");
  });

  it("menyaring berdasarkan jenis, status selesai, dan kata kunci", async () => {
    const user = userEvent.setup();
    setup();
    await user.selectOptions(screen.getByLabelText("Filter status"), "lost");
    expect(screen.queryByText("Kunci")).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Filter penyelesaian"), "1");
    expect(screen.queryByText("Dompet")).not.toBeInTheDocument();
    expect(screen.getByText("HP")).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/Cari judul/), "zzz");
    expect(screen.getByText(/Tidak ada laporan/)).toBeInTheDocument();
  });

  it("filter 'Laporan saya' memuat ulang dengan is_me=1", async () => {
    setup();
    await userEvent.selectOptions(screen.getByLabelText("Filter kepemilikan"), "me");
    expect(asyncGetLostFounds).toHaveBeenLastCalledWith({ is_me: 1 });
    await userEvent.selectOptions(screen.getByLabelText("Filter kepemilikan"), "all");
    expect(asyncGetLostFounds).toHaveBeenLastCalledWith({});
  });

  it("menampilkan statistik harian dan pesan kosong untuk bulanan", () => {
    setup({ lostFoundStats: { daily: { stats: [{ date: "2024-01-01", total: 4 }] }, monthly: null } });
    expect(screen.getByText("2024-01-01 · 4")).toBeInTheDocument();
    expect(screen.getByText("Belum ada data.")).toBeInTheDocument();
  });

  it("membuka & menutup modal tambah", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: /Tambah Laporan/ }));
    await userEvent.click(screen.getByText("Modal Tambah"));
    expect(screen.queryByText("Modal Tambah")).not.toBeInTheDocument();
  });

  it("setelah laporan ditambahkan: tutup modal, reset flag, muat ulang", () => {
    const { store } = setup({ isLostFoundAdded: true });
    expect(store.getState().isLostFoundAdded).toBe(false);
    expect(asyncGetLostFounds).toHaveBeenCalledTimes(2);
  });

  it("aksi cepat: tandai selesai / buka kembali mengirim perubahan status", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getAllByRole("button", { name: "Tandai Selesai" })[0]);
    expect(asyncChangeLostFound).toHaveBeenCalledWith(1, {
      title: "Dompet",
      description: "hitam",
      status: "lost",
      is_completed: 1,
    });
    await user.click(screen.getAllByRole("button", { name: "Buka Kembali" })[0]);
    expect(asyncChangeLostFound).toHaveBeenLastCalledWith(2, expect.objectContaining({ is_completed: 0 }));
  });

  it("aksi cepat hapus: batal tidak menghapus, konfirmasi menghapus", async () => {
    const user = userEvent.setup();
    setup();
    showConfirmDialog.mockResolvedValueOnce(false);
    await user.click(screen.getAllByRole("button", { name: "Hapus" })[0]);
    expect(asyncDeleteLostFound).not.toHaveBeenCalled();
    showConfirmDialog.mockResolvedValueOnce(true);
    await user.click(screen.getAllByRole("button", { name: "Hapus" })[0]);
    expect(asyncDeleteLostFound).toHaveBeenCalledWith(1);
  });

  it("setelah aksi cepat selesai: reset flag dan muat ulang", () => {
    const { store } = setup({ isLostFoundChanged: true, isLostFoundDeleted: true });
    expect(store.getState().isLostFoundChanged).toBe(false);
    expect(store.getState().isLostFoundDeleted).toBe(false);
    expect(asyncGetLostFounds).toHaveBeenCalledTimes(2);
  });

  it("menggulir ke bagian statistik saat hash #statistik (dan aman bila id tak ada)", () => {
    setup({}, "/#statistik");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    setup({}, "/#tidak-ada");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("bar ringkasan 0% ketika tidak ada laporan", () => {
    setup({ lostFounds: [] });
    expect(screen.getByText("Total").nextSibling).toHaveTextContent("0");
  });
});
