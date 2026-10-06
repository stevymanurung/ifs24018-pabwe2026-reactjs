import { describe, expect, it } from "vitest";
import * as a from "./action";
import * as r from "./reducer";

describe("users reducer", () => {
  it.each([
    [r.users, [], a.setUsersActionCreator, [{ id: 1 }]],
    [r.user, null, a.setUserActionCreator, { id: 1 }],
    [r.profile, null, a.setProfileActionCreator, { id: 2 }],
    [r.isProfile, false, a.setIsProfileActionCreator, true],
    [r.isChangeProfile, false, a.setIsChangeProfileActionCreator, true],
    [r.isChangeProfilePhoto, false, a.setIsChangeProfilePhotoActionCreator, true],
    [r.isChangeProfilePassword, false, a.setIsChangeProfilePasswordActionCreator, true],
  ])("state awal, action miliknya, dan action tak dikenal (%#)", (reducer, initial, creator, value) => {
    expect(reducer(undefined, { type: "UNKNOWN" })).toEqual(initial);
    expect(reducer(initial, creator(value))).toEqual(value);
    expect(reducer("keep", { type: "UNKNOWN" })).toBe("keep");
  });
});
