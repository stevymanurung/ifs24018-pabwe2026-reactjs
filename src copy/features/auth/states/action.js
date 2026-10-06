import * as authApi from "../api/authApi";
import { putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const ActionType = {
  SET_IS_AUTH_LOGIN: "auth/setIsAuthLogin",
  SET_IS_AUTH_REGISTER: "auth/setIsAuthRegister",
  SET_IS_AUTH_LOGOUT: "auth/setIsAuthLogout",
};

export const setIsAuthLoginActionCreator = (status) => ({
  type: ActionType.SET_IS_AUTH_LOGIN,
  payload: { status },
});

export const setIsAuthRegisterActionCreator = (status) => ({
  type: ActionType.SET_IS_AUTH_REGISTER,
  payload: { status },
});

export const setIsAuthLogoutActionCreator = (status) => ({
  type: ActionType.SET_IS_AUTH_LOGOUT,
  payload: { status },
});

export const asyncSetIsAuthLogin = ({ email, password }) => async (dispatch) => {
  try {
    const token = await authApi.postLogin({ email, password });
    putAccessToken(token);
    dispatch(setIsAuthLoginActionCreator(true));
  } catch (error) {
    showErrorDialog(error.message);
  }
};

export const asyncSetIsAuthRegister = ({ name, email, password }) => async (dispatch) => {
  try {
    const message = await authApi.postRegister({ name, email, password });
    showSuccessDialog(message);
    dispatch(setIsAuthRegisterActionCreator(true));
  } catch (error) {
    showErrorDialog(error.message);
  }
};

export const asyncSetIsAuthLogout = () => (dispatch) => {
  removeAccessToken();
  dispatch(setIsAuthLogoutActionCreator(true));
};
