import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../../../helpers/apiHelper";
import {
  getProfile,
  getUsers,
  postProfilePhoto,
  putProfile,
  putProfilePassword,
} from "./userApi";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn() }));

describe("userApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getUsers mengembalikan daftar pengguna", async () => {
    apiFetch.mockResolvedValue({ data: { users: [{ id: 1 }] } });
    expect(await getUsers()).toEqual([{ id: 1 }]);
    expect(apiFetch).toHaveBeenCalledWith("/users");
  });

  it("getProfile mengembalikan profil aktif", async () => {
    apiFetch.mockResolvedValue({ data: { user: { id: 9 } } });
    expect(await getProfile()).toEqual({ id: 9 });
    expect(apiFetch).toHaveBeenCalledWith("/users/me");
  });

  it("putProfile mengubah nama & email", async () => {
    apiFetch.mockResolvedValue({ message: "ok" });
    expect(await putProfile({ name: "A", email: "a@b.c" })).toBe("ok");
    expect(apiFetch).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      body: { name: "A", email: "a@b.c" },
    });
  });

  it("postProfilePhoto mengunggah foto via FormData", async () => {
    apiFetch.mockResolvedValue({ message: "foto" });
    const file = new File(["x"], "a.png", { type: "image/png" });
    expect(await postProfilePhoto(file)).toBe("foto");
    const [path, opts] = apiFetch.mock.calls[0];
    expect(path).toBe("/users/me/photo");
    expect(opts.method).toBe("POST");
    expect(opts.body.get("photo")).toBe(file);
  });

  it("putProfilePassword memetakan newPassword ke new_password", async () => {
    apiFetch.mockResolvedValue({ message: "pw" });
    expect(await putProfilePassword({ password: "a", newPassword: "b" })).toBe("pw");
    expect(apiFetch).toHaveBeenCalledWith("/users/me/password", {
      method: "PUT",
      body: { password: "a", new_password: "b" },
    });
  });
});
