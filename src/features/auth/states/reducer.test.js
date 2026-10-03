import { describe, expect, it } from "vitest";
import {
  setIsAuthLoginActionCreator,
  setIsAuthLogoutActionCreator,
  setIsAuthRegisterActionCreator,
} from "./action";
import { isAuthLogin, isAuthLogout, isAuthRegister } from "./reducer";

describe("auth reducer", () => {
  it.each([
    [isAuthLogin, setIsAuthLoginActionCreator],
    [isAuthRegister, setIsAuthRegisterActionCreator],
    [isAuthLogout, setIsAuthLogoutActionCreator],
  ])("menangani state awal, action miliknya, dan action tak dikenal", (reducer, creator) => {
    expect(reducer(undefined, { type: "UNKNOWN" })).toBe(false);
    expect(reducer(false, creator(true))).toBe(true);
    expect(reducer(true, { type: "UNKNOWN" })).toBe(true);
  });
});
