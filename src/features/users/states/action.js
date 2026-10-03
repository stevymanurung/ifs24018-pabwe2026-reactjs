import * as userApi from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthLogout } from "../../auth/states/action";

export const ActionType = {
  SET_USERS: "users/setUsers",
  SET_USER: "users/setUser",
  SET_PROFILE: "users/setProfile",
  SET_IS_PROFILE: "users/setIsProfile",
  SET_IS_CHANGE_PROFILE: "users/setIsChangeProfile",
  SET_IS_CHANGE_PROFILE_PHOTO: "users/setIsChangeProfilePhoto",
  SET_IS_CHANGE_PROFILE_PASSWORD: "users/setIsChangeProfilePassword",
};

const creator = (type, key) => (value) => ({ type, payload: { [key]: value } });

export const setUsersActionCreator = creator(ActionType.SET_USERS, "users");
export const setUserActionCreator = creator(ActionType.SET_USER, "user");
export const setProfileActionCreator = creator(ActionType.SET_PROFILE, "profile");
export const setIsProfileActionCreator = creator(ActionType.SET_IS_PROFILE, "status");
export const setIsChangeProfileActionCreator = creator(ActionType.SET_IS_CHANGE_PROFILE, "status");
export const setIsChangeProfilePhotoActionCreator = creator(
  ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
  "status"
);
export const setIsChangeProfilePasswordActionCreator = creator(
  ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
  "status"
);

export const asyncGetUsers = () => async (dispatch) => {
  try {
    dispatch(setUsersActionCreator(await userApi.getUsers()));
  } catch (error) {
    showErrorDialog(error.message);
  }
};

// Gagal memuat profil = token tidak valid/kedaluwarsa -> paksa logout
export const asyncGetProfile = () => async (dispatch) => {
  try {
    dispatch(setProfileActionCreator(await userApi.getProfile()));
    dispatch(setIsProfileActionCreator(true));
  } catch (error) {
    showErrorDialog(error.message);
    dispatch(asyncSetIsAuthLogout());
  }
};

const mutateProfile = (start, request) => async (dispatch) => {
  dispatch(start(true));
  try {
    showSuccessDialog(await request());
    await dispatch(asyncGetProfile());
  } catch (error) {
    showErrorDialog(error.message);
  } finally {
    dispatch(start(false));
  }
};

export const asyncChangeProfile = (data) =>
  mutateProfile(setIsChangeProfileActionCreator, () => userApi.putProfile(data));

export const asyncChangeProfilePhoto = (file) =>
  mutateProfile(setIsChangeProfilePhotoActionCreator, () => userApi.postProfilePhoto(file));

export const asyncChangeProfilePassword = (data) =>
  mutateProfile(setIsChangeProfilePasswordActionCreator, () => userApi.putProfilePassword(data));
