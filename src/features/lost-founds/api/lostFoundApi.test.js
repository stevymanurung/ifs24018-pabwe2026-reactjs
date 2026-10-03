import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../../../helpers/apiHelper";
import * as api from "./lostFoundApi";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn() }));

describe("lostFoundApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getLostFounds dengan & tanpa filter", async () => {
    apiFetch.mockResolvedValue({ data: { lost_founds: [{ id: 1 }] } });
    expect(await api.getLostFounds({ status: "lost", is_me: 1 })).toEqual([{ id: 1 }]);
    expect(apiFetch).toHaveBeenCalledWith("/lost-founds", {
      params: { status: "lost", is_me: 1 },
    });
    await api.getLostFounds();
    expect(apiFetch).toHaveBeenLastCalledWith("/lost-founds", { params: {} });
  });

  it("getLostFound mengembalikan detail", async () => {
    apiFetch.mockResolvedValue({ data: { lost_found: { id: 3 } } });
    expect(await api.getLostFound(3)).toEqual({ id: 3 });
    expect(apiFetch).toHaveBeenCalledWith("/lost-founds/3");
  });

  it("postLostFound", async () => {
    apiFetch.mockResolvedValue({ message: "tambah" });
    const data = { title: "t", description: "d", status: "lost" };
    expect(await api.postLostFound(data)).toBe("tambah");
    expect(apiFetch).toHaveBeenCalledWith("/lost-founds", { method: "POST", body: data });
  });

  it("putLostFound", async () => {
    apiFetch.mockResolvedValue({ message: "ubah" });
    const data = { title: "t", description: "d", status: "found", is_completed: 1 };
    expect(await api.putLostFound(2, data)).toBe("ubah");
    expect(apiFetch).toHaveBeenCalledWith("/lost-founds/2", { method: "PUT", body: data });
  });

  it("postLostFoundCover mengunggah file cover", async () => {
    apiFetch.mockResolvedValue({ message: "cover" });
    const file = new File(["x"], "c.png", { type: "image/png" });
    expect(await api.postLostFoundCover(4, file)).toBe("cover");
    const [path, opts] = apiFetch.mock.calls[0];
    expect(path).toBe("/lost-founds/4/cover");
    expect(opts.body.get("cover")).toBe(file);
  });

  it("deleteLostFound", async () => {
    apiFetch.mockResolvedValue({ message: "hapus" });
    expect(await api.deleteLostFound(5)).toBe("hapus");
    expect(apiFetch).toHaveBeenCalledWith("/lost-founds/5", { method: "DELETE" });
  });

  it("statistik harian dan bulanan", async () => {
    apiFetch.mockResolvedValue({ data: { stats: [1] } });
    expect(await api.getLostFoundStatsDaily()).toEqual({ stats: [1] });
    expect(apiFetch).toHaveBeenCalledWith("/lost-founds/stats/daily");
    expect(await api.getLostFoundStatsMonthly()).toEqual({ stats: [1] });
    expect(apiFetch).toHaveBeenCalledWith("/lost-founds/stats/monthly");
  });
});
