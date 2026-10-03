import { configureStore } from "@reduxjs/toolkit";
import { isAuthLogin, isAuthLogout, isAuthRegister } from "./features/auth/states/reducer";
import * as usersReducers from "./features/users/states/reducer";
import * as lostFoundReducers from "./features/lost-founds/states/reducer";

export const reducer = {
  isAuthLogin,
  isAuthRegister,
  isAuthLogout,
  ...usersReducers,
  ...lostFoundReducers,
};

export const store = configureStore({ reducer });
