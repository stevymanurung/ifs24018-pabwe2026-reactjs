import { beforeEach, describe, expect, it, vi } from "vitest";
import Swal from "sweetalert2";
import {
  extractRows,
  getAuthorName,
  pct,
  formatDate,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

describe("toolsHelper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("dialog sukses, error, dan warning memanggil Swal dengan ikon yang tepat", async () => {
    await showSuccessDialog("ok");
    await showErrorDialog("err");
    await showWarningDialog("warn");
    const icons = Swal.fire.mock.calls.map(([o]) => o.icon);
    expect(icons).toEqual(["success", "error", "warning"]);
    expect(Swal.fire.mock.calls[0][0].text).toBe("ok");
  });

  it("showConfirmDialog mengembalikan status konfirmasi (teks default & custom)", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("hapus?")).toBe(true);
    expect(Swal.fire.mock.calls[0][0].confirmButtonText).toBe("Ya");

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("keluar?", "Keluar")).toBe(false);
    expect(Swal.fire.mock.calls[1][0].confirmButtonText).toBe("Keluar");
  });

  it("formatDate memformat tanggal ke locale Indonesia", () => {
    expect(formatDate("2024-02-28T10:00:00Z")).toContain("2024");
  });

  it("extractRows menangani array, objek berisi array, dan data kosong", () => {
    expect(extractRows([1, 2])).toEqual([1, 2]);
    expect(extractRows({ total: 2, stats: [3] })).toEqual([3]);
    expect(extractRows(null)).toEqual([]);
  });

  it("getAuthorName memilih author.name, name, lalu fallback", () => {
    expect(getAuthorName({ author: { name: "A" }, name: "B" })).toBe("A");
    expect(getAuthorName({ name: "B" })).toBe("B");
    expect(getAuthorName({})).toBe("Pengguna");
  });

  it("pct menghitung persentase dan aman untuk total nol", () => {
    expect(pct(1, 4)).toBe(25);
    expect(pct(3, 0)).toBe(0);
  });
});
