import { beforeEach, describe, expect, it, vi } from "vitest";
import * as userApi from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthLogout } from "../../auth/states/action";
import {
  ActionType,
  asyncChangeProfile,
  asyncChangeProfilePassword,
  asyncChangeProfilePhoto,
  asyncGetProfile,
  asyncGetUsers,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePasswordActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsProfileActionCreator,
  setProfileActionCreator,
  setUserActionCreator,
  setUsersActionCreator,
} from "./action";

vi.mock("../api/userApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));
vi.mock("../../auth/states/action", () => ({
  asyncSetIsAuthLogout: vi.fn(() => "LOGOUT_THUNK"),
}));

describe("users action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators", () => {
    expect(setUsersActionCreator([1])).toEqual({
      type: ActionType.SET_USERS,
      payload: { users: [1] },
    });
    expect(setUserActionCreator({ id: 1 }).payload.user).toEqual({ id: 1 });
    expect(setProfileActionCreator({ id: 2 }).payload.profile).toEqual({ id: 2 });
    expect(setIsProfileActionCreator(true).payload.status).toBe(true);
  });

  it("asyncGetUsers sukses dan gagal", async () => {
    const dispatch = vi.fn();
    userApi.getUsers.mockResolvedValueOnce([{ id: 1 }]);
    await asyncGetUsers()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator([{ id: 1 }]));

    userApi.getUsers.mockRejectedValueOnce(new Error("x"));
    await asyncGetUsers()(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("x");
  });

  it("asyncGetProfile sukses menyimpan profil, gagal memaksa logout", async () => {
    const dispatch = vi.fn();
    userApi.getProfile.mockResolvedValueOnce({ id: 5 });
    await asyncGetProfile()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator({ id: 5 }));
    expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(true));

    userApi.getProfile.mockRejectedValueOnce(new Error("expired"));
    await asyncGetProfile()(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("expired");
    expect(asyncSetIsAuthLogout).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith("LOGOUT_THUNK");
  });

  it.each([
    [asyncChangeProfile, "putProfile", setIsChangeProfileActionCreator],
    [asyncChangeProfilePhoto, "postProfilePhoto", setIsChangeProfilePhotoActionCreator],
    [asyncChangeProfilePassword, "putProfilePassword", setIsChangeProfilePasswordActionCreator],
  ])("mutasi profil sukses & gagal (%#)", async (thunk, apiName, start) => {
    const dispatch = vi.fn();
    userApi[apiName].mockResolvedValueOnce("berhasil");
    await thunk({ a: 1 })(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(1, start(true));
    expect(showSuccessDialog).toHaveBeenCalledWith("berhasil");
    expect(dispatch).toHaveBeenLastCalledWith(start(false));

    userApi[apiName].mockRejectedValueOnce(new Error("gagal"));
    await thunk({ a: 1 })(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });
});
