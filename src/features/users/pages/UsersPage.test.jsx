import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import { asyncGetUsers } from "../states/action";
import UsersPage from "./UsersPage";

vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal()),
  asyncGetUsers: vi.fn(() => ({ type: "noop" })),
}));

const users = [
  { id: 1, name: "Budi", email: "budi@x.com", photo: null },
  { id: 2, name: "Siti", email: "siti@x.com", photo: "img/s.png" },
];

describe("UsersPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memuat pengguna dan menampilkan daftar", () => {
    renderWithProviders(<UsersPage />, { preloadedState: { users } });
    expect(asyncGetUsers).toHaveBeenCalled();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("siti@x.com")).toBeInTheDocument();
  });

  it("menyaring lewat pencarian dan menampilkan pesan kosong", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />, { preloadedState: { users } });
    await user.type(screen.getByPlaceholderText(/Cari nama/), "sit");
    expect(screen.queryByText("Budi")).not.toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/Cari nama/), "zzz");
    expect(screen.getByText(/Tidak ada pengguna/)).toBeInTheDocument();
  });
});
