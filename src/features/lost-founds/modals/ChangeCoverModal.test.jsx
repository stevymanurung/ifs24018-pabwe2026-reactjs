import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import { asyncChangeLostFoundCover } from "../states/action";
import ChangeCoverModal from "./ChangeCoverModal";

vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncChangeLostFoundCover: vi.fn(() => ({ type: "noop" })),
}));

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => "blob:preview");
  });

  it("tombol unggah nonaktif sebelum berkas dipilih", () => {
    renderWithProviders(<ChangeCoverModal lostFoundId={3} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Unggah" })).toBeDisabled();
    expect(screen.queryByAltText("Pratinjau cover")).not.toBeInTheDocument();
  });

  it("menampilkan pratinjau, mengunggah, dan menutup lewat Batal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal lostFoundId={3} onClose={onClose} />);
    const file = new File(["x"], "c.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Berkas cover"), file);
    expect(screen.getByAltText("Pratinjau cover")).toHaveAttribute("src", "blob:preview");
    await user.click(screen.getByRole("button", { name: "Unggah" }));
    expect(asyncChangeLostFoundCover).toHaveBeenCalledWith(3, file);
    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
