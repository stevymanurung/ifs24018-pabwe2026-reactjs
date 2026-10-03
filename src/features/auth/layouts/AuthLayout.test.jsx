import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { putAccessToken } from "../../../helpers/apiHelper";
import { renderWithProviders } from "../../../test-utils";
import AuthLayout from "./AuthLayout";

const ui = (
  <Routes>
    <Route path="/auth" element={<AuthLayout />}>
      <Route path="login" element={<div>Form Login</div>} />
    </Route>
    <Route path="/" element={<div>Beranda</div>} />
  </Routes>
);

describe("AuthLayout", () => {
  beforeEach(() => localStorage.clear());

  it("menampilkan banner dan konten anak bila belum login", () => {
    renderWithProviders(ui, { route: "/auth/login" });
    expect(screen.getByText("Form Login")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Lost & Founds/ })).toBeInTheDocument();
  });

  it("mengalihkan ke beranda bila token sudah ada", () => {
    putAccessToken("tok");
    renderWithProviders(ui, { route: "/auth/login" });
    expect(screen.getByText("Beranda")).toBeInTheDocument();
  });
});
