import { describe, expect, it, vi } from "vitest";
import { apiFetch } from "../../../helpers/apiHelper";
import { postLogin, postRegister } from "./authApi";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn() }));

describe("authApi", () => {
  it("postLogin mengirim kredensial dan mengembalikan token", async () => {
    apiFetch.mockResolvedValue({ data: { token: "tok" } });
    expect(await postLogin({ email: "a@b.c", password: "123" })).toBe("tok");
    expect(apiFetch).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: { email: "a@b.c", password: "123" },
    });
  });

  it("postRegister mengirim data akun dan mengembalikan pesan", async () => {
    apiFetch.mockResolvedValue({ message: "ok" });
    expect(await postRegister({ name: "A", email: "a@b.c", password: "1" })).toBe("ok");
    expect(apiFetch).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: { name: "A", email: "a@b.c", password: "1" },
    });
  });
});
