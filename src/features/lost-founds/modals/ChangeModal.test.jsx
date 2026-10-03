import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncChangeLostFound } from "../states/action";
import ChangeModal from "./ChangeModal";

vi.mock("../../../helpers/toolsHelper", () => ({ showWarningDialog: vi.fn() }));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncChangeLostFound: vi.fn(() => ({ type: "noop" })),
}));

const item = { id: 7, title: "Kunci", description: "Di kantin", status: "lost", is_completed: 0 };

describe("ChangeModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("terisi data awal dan memvalidasi input kosong", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangeModal lostFound={item} onClose={vi.fn()} />);
    expect(screen.getByLabelText("Judul")).toHaveValue("Kunci");
    await user.clear(screen.getByLabelText("Judul"));
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    expect(showWarningDialog).toHaveBeenCalled();
    expect(asyncChangeLostFound).not.toHaveBeenCalled();
  });

  it("mengirim perubahan dengan status selesai (is_completed=1)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangeModal lostFound={item} onClose={vi.fn()} />);
    await user.selectOptions(screen.getByLabelText("Jenis Laporan"), "found");
    await user.type(screen.getByLabelText("Deskripsi"), "!");
    await user.click(screen.getByLabelText("Tandai selesai"));
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    expect(asyncChangeLostFound).toHaveBeenCalledWith(7, {
      title: "Kunci",
      description: "Di kantin!",
      status: "found",
      is_completed: 1,
    });
  });

  it("mengirim is_completed=0 bila tidak dicentang dan menutup lewat Batal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal lostFound={item} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    expect(asyncChangeLostFound.mock.calls[0][1].is_completed).toBe(0);
    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
