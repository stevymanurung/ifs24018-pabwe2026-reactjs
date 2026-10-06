import { ActionType } from "./action";

export function isAuthLogin(state = false, action) {
  return action.type === ActionType.SET_IS_AUTH_LOGIN ? action.payload.status : state;
}

export function isAuthRegister(state = false, action) {
  return action.type === ActionType.SET_IS_AUTH_REGISTER ? action.payload.status : state;
}

export function isAuthLogout(state = false, action) {
  return action.type === ActionType.SET_IS_AUTH_LOGOUT ? action.payload.status : state;
}
