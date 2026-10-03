import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import NavbarComponent from "./NavbarComponent";

const setup = (profile, props = {}) =>
  render(
    <MemoryRouter>
      <NavbarComponent profile={profile} onToggleSidebar={vi.fn()} onLogout={vi.fn()} {...props} />
    </MemoryRouter>
  );

describe("NavbarComponent", () => {
  it("menampilkan status memuat saat profil kosong", () => {
    setup(null);
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
    expect(screen.getByText("Memeriksa sesi...")).toBeInTheDocument();
  });

  it("menampilkan logo, judul, status sesi aktif, nama & foto profil", () => {
    setup({ name: "Budi", photo: "img/b.png" });
    expect(screen.getByAltText("Budi")).toBeInTheDocument();
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByText("Sesi aktif")).toBeInTheDocument();
  });

  it("memanggil toggle sidebar", async () => {
    const onToggleSidebar = vi.fn();
    setup({ name: "Budi", photo: null }, { onToggleSidebar });
    await userEvent.click(screen.getByLabelText("Buka menu"));
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it("dropdown profil terbuka lalu menutup lewat link profil", async () => {
    const user = userEvent.setup();
    setup({ name: "Budi", photo: null });
    await user.click(screen.getByLabelText("Menu profil"));
    await user.click(screen.getByText("Profil Saya"));
    expect(screen.queryByText("Profil Saya")).not.toBeInTheDocument();
  });

  it("tombol keluar memanggil onLogout", async () => {
    const onLogout = vi.fn();
    setup({ name: "Budi", photo: null }, { onLogout });
    await userEvent.click(screen.getByRole("button", { name: /Keluar/ }));
    expect(onLogout).toHaveBeenCalled();
  });
});
