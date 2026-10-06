import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SidebarComponent from "./SidebarComponent";

const setup = (open, onClose = vi.fn(), route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <SidebarComponent open={open} onClose={onClose} />
    </MemoryRouter>
  );

describe("SidebarComponent", () => {
  it("menampilkan seluruh menu navigasi", () => {
    setup(false);
    ["Dashboard / Laporan", "Statistik", "Pengguna", "Profil Saya"].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument()
    );
    expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
  });

  it("menandai menu aktif berdasarkan path dan hash", () => {
    setup(false, vi.fn(), "/#statistik");
    expect(screen.getByText("Statistik").closest("a")).toHaveClass("text-indigo-700");
    expect(screen.getByText("Dashboard / Laporan").closest("a")).not.toHaveClass("text-indigo-700");
  });

  it("menandai menu pengguna aktif pada rute /users", () => {
    setup(false, vi.fn(), "/users");
    expect(screen.getByText("Pengguna").closest("a")).toHaveClass("text-indigo-700");
  });

  it("drawer terbuka: overlay dan menu menutup drawer saat diklik", async () => {
    const onClose = vi.fn();
    setup(true, onClose);
    await userEvent.click(screen.getByTestId("sidebar-overlay"));
    await userEvent.click(screen.getByText("Pengguna"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
