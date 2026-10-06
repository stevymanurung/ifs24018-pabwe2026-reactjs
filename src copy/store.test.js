import { describe, expect, it } from "vitest";
import { store } from "./store";
import { setIsAuthLoginActionCreator } from "./features/auth/states/action";
import { setUsersActionCreator } from "./features/users/states/action";
import { setLostFoundsActionCreator } from "./features/lost-founds/states/action";

describe("store", () => {
  it("menggabungkan reducer auth, users, dan lost-founds", () => {
    const keys = Object.keys(store.getState());
    expect(keys).toEqual(
      expect.arrayContaining(["isAuthLogin", "profile", "users", "lostFounds", "lostFoundStats"])
    );
  });

  it("memproses action dari tiap fitur", () => {
    store.dispatch(setIsAuthLoginActionCreator(true));
    store.dispatch(setUsersActionCreator([{ id: 1 }]));
    store.dispatch(setLostFoundsActionCreator([{ id: 2 }]));
    const state = store.getState();
    expect(state.isAuthLogin).toBe(true);
    expect(state.users).toEqual([{ id: 1 }]);
    expect(state.lostFounds).toEqual([{ id: 2 }]);
  });
});
