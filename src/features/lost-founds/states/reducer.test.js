import { describe, expect, it } from "vitest";
import * as a from "./action";
import * as r from "./reducer";

const flags = [
  [r.isLostFound, a.setIsLostFoundActionCreator],
  [r.isLostFoundAdd, a.setIsLostFoundAddActionCreator],
  [r.isLostFoundAdded, a.setIsLostFoundAddedActionCreator],
  [r.isLostFoundChange, a.setIsLostFoundChangeActionCreator],
  [r.isLostFoundChanged, a.setIsLostFoundChangedActionCreator],
  [r.isLostFoundChangeCover, a.setIsLostFoundChangeCoverActionCreator],
  [r.isLostFoundChangedCover, a.setIsLostFoundChangedCoverActionCreator],
  [r.isLostFoundDelete, a.setIsLostFoundDeleteActionCreator],
  [r.isLostFoundDeleted, a.setIsLostFoundDeletedActionCreator],
].map(([reducer, creator]) => [reducer, creator, false, true]);

describe("lost-founds reducer", () => {
  it.each([
    [r.lostFounds, a.setLostFoundsActionCreator, [], [{ id: 1 }]],
    [r.lostFound, a.setLostFoundActionCreator, null, { id: 1 }],
    [
      r.lostFoundStats,
      a.setLostFoundStatsActionCreator,
      { daily: null, monthly: null },
      { daily: [1], monthly: [2] },
    ],
    ...flags.map(([reducer, creator, initial, value]) => [reducer, creator, initial, value]),
  ])("state awal, action miliknya, dan action tak dikenal (%#)", (reducer, creator, initial, value) => {
    expect(reducer(undefined, { type: "UNKNOWN" })).toEqual(initial);
    expect(reducer(initial, creator(value))).toEqual(value);
    expect(reducer("keep", { type: "UNKNOWN" })).toBe("keep");
  });
});
