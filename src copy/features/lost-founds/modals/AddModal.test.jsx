import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncAddLostFound } from "../states/action";
import AddModal from "./AddModal";

vi.mock("../../../helpers/toolsHelper", () => ({ showWarningDialog: vi.fn() }));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncAddLostFound: vi.fn(() => ({ type: "noop" })),
}));

describe("AddModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memvalidasi judul dan deskripsi", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddModal onClose={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    await user.type(screen.getByLabelText("Judul"), "Dompet");
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    expect(showWarningDialog).toHaveBeenCalledTimes(2);
    expect(asyncAddLostFound).not.toHaveBeenCalled();
  });

  it("mengirim laporan baru dan menutup lewat Batal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} />);
    await user.type(screen.getByLabelText("Judul"), "Dompet");
    await user.type(screen.getByLabelText("Deskripsi"), "Warna hitam");
    await user.selectOptions(screen.getByLabelText("Jenis Laporan"), "found");
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    expect(asyncAddLostFound).toHaveBeenCalledWith({
      title: "Dompet",
      description: "Warna hitam",
      status: "found",
    });
    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
