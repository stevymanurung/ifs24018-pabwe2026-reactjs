import { beforeEach, describe, expect, it, vi } from "vitest";
import * as authApi from "../api/authApi";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import {
  ActionType,
  asyncSetIsAuthLogin,
  asyncSetIsAuthLogout,
  asyncSetIsAuthRegister,
  setIsAuthLoginActionCreator,
  setIsAuthLogoutActionCreator,
  setIsAuthRegisterActionCreator,
} from "./action";

vi.mock("../api/authApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("auth action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("action creators menghasilkan action yang benar", () => {
    expect(setIsAuthLoginActionCreator(true)).toEqual({
      type: ActionType.SET_IS_AUTH_LOGIN,
      payload: { status: true },
    });
    expect(setIsAuthRegisterActionCreator(true).type).toBe(ActionType.SET_IS_AUTH_REGISTER);
    expect(setIsAuthLogoutActionCreator(false).payload.status).toBe(false);
  });

  it("login sukses: simpan token dan dispatch status true", async () => {
    authApi.postLogin.mockResolvedValue("tok");
    const dispatch = vi.fn();
    await asyncSetIsAuthLogin({ email: "a", password: "b" })(dispatch);
    expect(getAccessToken()).toBe("tok");
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(true));
  });

  it("login gagal: tampilkan dialog error", async () => {
    authApi.postLogin.mockRejectedValue(new Error("salah"));
    const dispatch = vi.fn();
    await asyncSetIsAuthLogin({ email: "a", password: "b" })(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("salah");
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("register sukses dan gagal", async () => {
    const dispatch = vi.fn();
    authApi.postRegister.mockResolvedValueOnce("dibuat");
    await asyncSetIsAuthRegister({ name: "n", email: "e", password: "p" })(dispatch);
    expect(showSuccessDialog).toHaveBeenCalledWith("dibuat");
    expect(dispatch).toHaveBeenCalledWith(setIsAuthRegisterActionCreator(true));

    authApi.postRegister.mockRejectedValueOnce(new Error("dobel"));
    await asyncSetIsAuthRegister({ name: "n", email: "e", password: "p" })(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("dobel");
  });

  it("logout menghapus token dan dispatch status true", () => {
    putAccessToken("tok");
    const dispatch = vi.fn();
    asyncSetIsAuthLogout()(dispatch);
    expect(getAccessToken()).toBeNull();
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLogoutActionCreator(true));
  });
});
