import { ActionType } from "./action";

const make = (type, initial, pick) => (state = initial, action) =>
  action.type === type ? pick(action.payload) : state;

export const users = make(ActionType.SET_USERS, [], (p) => p.users);
export const user = make(ActionType.SET_USER, null, (p) => p.user);
export const profile = make(ActionType.SET_PROFILE, null, (p) => p.profile);
export const isProfile = make(ActionType.SET_IS_PROFILE, false, (p) => p.status);
export const isChangeProfile = make(ActionType.SET_IS_CHANGE_PROFILE, false, (p) => p.status);
export const isChangeProfilePhoto = make(
  ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
  false,
  (p) => p.status
);
export const isChangeProfilePassword = make(
  ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
  false,
  (p) => p.status
);
