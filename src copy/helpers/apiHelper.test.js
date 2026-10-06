import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  apiFetch,
  assetUrl,
  getAccessToken,
  putAccessToken,
  removeAccessToken,
} from "./apiHelper";

const mockFetch = (json, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(json) });

describe("apiHelper", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("menyimpan, mengambil, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("assetUrl membentuk URL absolut dari path relatif maupun absolut", () => {
    expect(assetUrl("img/a.png")).toBe("https://open-api.delcom.org/img/a.png");
    expect(assetUrl("https://x.com/a.png")).toBe("https://x.com/a.png");
  });

  it("GET tanpa token, tanpa params, tanpa body", async () => {
    const fetchMock = mockFetch({ success: true, data: 1 });
    vi.stubGlobal("fetch", fetchMock);
    const json = await apiFetch("/users");
    expect(json.data).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(`${DELCOM_BASEURL}/users`, {
      method: "GET",
      headers: {},
    });
  });

  it("menyertakan query params (nilai kosong dibuang) dan bearer token", async () => {
    putAccessToken("tok");
    const fetchMock = mockFetch({ success: true });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/lost-founds", {
      params: { status: "lost", is_me: 1, kosong: "", nol: null, undef: undefined },
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${DELCOM_BASEURL}/lost-founds?status=lost&is_me=1`);
    expect(init.headers.Authorization).toBe("Bearer tok");
  });

  it("mengirim body objek sebagai urlencoded dan FormData apa adanya", async () => {
    const fetchMock = mockFetch({ success: true });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/auth/login", { method: "POST", body: { email: "a@b.c" } });
    expect(fetchMock.mock.calls[0][1].body.toString()).toBe("email=a%40b.c");

    const form = new FormData();
    await apiFetch("/x", { method: "POST", body: form });
    expect(fetchMock.mock.calls[1][1].body).toBe(form);
  });

  it("tetap sukses bila respons tidak memuat field success", async () => {
    vi.stubGlobal("fetch", mockFetch({ message: "Berhasil login", data: { token: "t" } }));
    const json = await apiFetch("/auth/login");
    expect(json.data.token).toBe("t");
  });

  it("melempar error dengan pesan server ketika HTTP tidak ok", async () => {
    vi.stubGlobal("fetch", mockFetch({ message: "Tidak diizinkan" }, false));
    await expect(apiFetch("/x")).rejects.toThrow("Tidak diizinkan");
  });

  it("melempar error dengan pesan server ketika success=false", async () => {
    vi.stubGlobal("fetch", mockFetch({ success: false, message: "Gagal!" }));
    await expect(apiFetch("/x")).rejects.toThrow("Gagal!");
  });
});
