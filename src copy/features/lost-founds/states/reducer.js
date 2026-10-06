import { ActionType } from "./action";

const make = (type, initial, pick) => (state = initial, action) =>
  action.type === type ? pick(action.payload) : state;

const flag = (type) => make(type, false, (p) => p.status);

export const lostFounds = make(ActionType.SET_LOST_FOUNDS, [], (p) => p.lostFounds);
export const lostFound = make(ActionType.SET_LOST_FOUND, null, (p) => p.lostFound);
export const lostFoundStats = make(
  ActionType.SET_LOST_FOUND_STATS,
  { daily: null, monthly: null },
  (p) => p.stats
);
export const isLostFound = flag(ActionType.SET_IS_LOST_FOUND);
export const isLostFoundAdd = flag(ActionType.SET_IS_LOST_FOUND_ADD);
export const isLostFoundAdded = flag(ActionType.SET_IS_LOST_FOUND_ADDED);
export const isLostFoundChange = flag(ActionType.SET_IS_LOST_FOUND_CHANGE);
export const isLostFoundChanged = flag(ActionType.SET_IS_LOST_FOUND_CHANGED);
export const isLostFoundChangeCover = flag(ActionType.SET_IS_LOST_FOUND_CHANGE_COVER);
export const isLostFoundChangedCover = flag(ActionType.SET_IS_LOST_FOUND_CHANGED_COVER);
export const isLostFoundDelete = flag(ActionType.SET_IS_LOST_FOUND_DELETE);
export const isLostFoundDeleted = flag(ActionType.SET_IS_LOST_FOUND_DELETED);
