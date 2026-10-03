import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../api/lostFoundApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import * as a from "./action";

vi.mock("../api/lostFoundApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("lost-founds action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators membawa payload yang benar", () => {
    expect(a.setLostFoundsActionCreator([1])).toEqual({
      type: a.ActionType.SET_LOST_FOUNDS,
      payload: { lostFounds: [1] },
    });
    expect(a.setLostFoundActionCreator({ id: 1 }).payload.lostFound).toEqual({ id: 1 });
    expect(a.setLostFoundStatsActionCreator({ daily: 1 }).payload.stats).toEqual({ daily: 1 });
    expect(a.setIsLostFoundActionCreator(true).payload.status).toBe(true);
  });

  it.each([
    ["asyncGetLostFounds", "getLostFounds", a.setLostFoundsActionCreator, [{ id: 1 }], [{ q: 1 }]],
    ["asyncGetLostFound", "getLostFound", a.setLostFoundActionCreator, { id: 1 }, [7]],
  ])("%s: sukses menyimpan data & mengatur loading, gagal menampilkan error", async (name, apiName, creator, data, args) => {
    const dispatch = vi.fn();
    api[apiName].mockResolvedValueOnce(data);
    await a[name](...args)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(1, a.setIsLostFoundActionCreator(true));
    expect(dispatch).toHaveBeenCalledWith(creator(data));
    expect(dispatch).toHaveBeenLastCalledWith(a.setIsLostFoundActionCreator(false));

    api[apiName].mockRejectedValueOnce(new Error("gagal"));
    await a[name](...args)(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });

  it.each([
    ["asyncAddLostFound", "postLostFound", a.setIsLostFoundAddActionCreator, a.setIsLostFoundAddedActionCreator, [{}]],
    ["asyncChangeLostFound", "putLostFound", a.setIsLostFoundChangeActionCreator, a.setIsLostFoundChangedActionCreator, [1, {}]],
    ["asyncChangeLostFoundCover", "postLostFoundCover", a.setIsLostFoundChangeCoverActionCreator, a.setIsLostFoundChangedCoverActionCreator, [1, "file"]],
    ["asyncDeleteLostFound", "deleteLostFound", a.setIsLostFoundDeleteActionCreator, a.setIsLostFoundDeletedActionCreator, [1]],
  ])("%s: sukses & gagal", async (name, apiName, start, done, args) => {
    const dispatch = vi.fn();
    api[apiName].mockResolvedValueOnce("berhasil");
    await a[name](...args)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(1, start(true));
    expect(showSuccessDialog).toHaveBeenCalledWith("berhasil");
    expect(dispatch).toHaveBeenCalledWith(done(true));
    expect(dispatch).toHaveBeenLastCalledWith(start(false));

    dispatch.mockClear();
    api[apiName].mockRejectedValueOnce(new Error("gagal"));
    await a[name](...args)(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
    expect(dispatch).not.toHaveBeenCalledWith(done(true));
  });

  it("asyncGetLostFoundStats sukses dan gagal", async () => {
    const dispatch = vi.fn();
    api.getLostFoundStatsDaily.mockResolvedValueOnce({ d: 1 });
    api.getLostFoundStatsMonthly.mockResolvedValueOnce({ m: 1 });
    await a.asyncGetLostFoundStats()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      a.setLostFoundStatsActionCreator({ daily: { d: 1 }, monthly: { m: 1 } })
    );

    api.getLostFoundStatsDaily.mockRejectedValueOnce(new Error("stat"));
    api.getLostFoundStatsMonthly.mockResolvedValueOnce({});
    await a.asyncGetLostFoundStats()(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("stat");
  });
});
