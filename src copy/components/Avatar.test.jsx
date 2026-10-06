import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("menampilkan foto bila tersedia", () => {
    render(<Avatar name="Budi" photo="img/b.png" />);
    expect(screen.getByRole("presentation")).toHaveAttribute("src", "https://open-api.delcom.org/img/b.png");
  });

  it("menampilkan inisial bila foto kosong, dengan kelas custom", () => {
    render(<Avatar name="budi" photo={null} className="h-20 w-20" />);
    expect(screen.getByText("B")).toHaveClass("h-20");
  });
});
