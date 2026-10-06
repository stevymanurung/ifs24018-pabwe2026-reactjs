import * as api from "../api/lostFoundApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const ActionType = {
  SET_LOST_FOUNDS: "lostFounds/setLostFounds",
  SET_LOST_FOUND: "lostFounds/setLostFound",
  SET_IS_LOST_FOUND: "lostFounds/setIsLostFound",
  SET_IS_LOST_FOUND_ADD: "lostFounds/setIsLostFoundAdd",
  SET_IS_LOST_FOUND_ADDED: "lostFounds/setIsLostFoundAdded",
  SET_IS_LOST_FOUND_CHANGE: "lostFounds/setIsLostFoundChange",
  SET_IS_LOST_FOUND_CHANGED: "lostFounds/setIsLostFoundChanged",
  SET_IS_LOST_FOUND_CHANGE_COVER: "lostFounds/setIsLostFoundChangeCover",
  SET_IS_LOST_FOUND_CHANGED_COVER: "lostFounds/setIsLostFoundChangedCover",
  SET_IS_LOST_FOUND_DELETE: "lostFounds/setIsLostFoundDelete",
  SET_IS_LOST_FOUND_DELETED: "lostFounds/setIsLostFoundDeleted",
  SET_LOST_FOUND_STATS: "lostFounds/setLostFoundStats",
};

const creator = (type, key) => (value) => ({ type, payload: { [key]: value } });

export const setLostFoundsActionCreator = creator(ActionType.SET_LOST_FOUNDS, "lostFounds");
export const setLostFoundActionCreator = creator(ActionType.SET_LOST_FOUND, "lostFound");
export const setLostFoundStatsActionCreator = creator(ActionType.SET_LOST_FOUND_STATS, "stats");
export const setIsLostFoundActionCreator = creator(ActionType.SET_IS_LOST_FOUND, "status");
export const setIsLostFoundAddActionCreator = creator(ActionType.SET_IS_LOST_FOUND_ADD, "status");
export const setIsLostFoundAddedActionCreator = creator(ActionType.SET_IS_LOST_FOUND_ADDED, "status");
export const setIsLostFoundChangeActionCreator = creator(ActionType.SET_IS_LOST_FOUND_CHANGE, "status");
export const setIsLostFoundChangedActionCreator = creator(ActionType.SET_IS_LOST_FOUND_CHANGED, "status");
export const setIsLostFoundChangeCoverActionCreator = creator(
  ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
  "status"
);
export const setIsLostFoundChangedCoverActionCreator = creator(
  ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
  "status"
);
export const setIsLostFoundDeleteActionCreator = creator(ActionType.SET_IS_LOST_FOUND_DELETE, "status");
export const setIsLostFoundDeletedActionCreator = creator(ActionType.SET_IS_LOST_FOUND_DELETED, "status");

// Pembungkus pengambilan data: menyalakan flag loading isLostFound
const load = (request, onSuccess) => async (dispatch) => {
  dispatch(setIsLostFoundActionCreator(true));
  try {
    dispatch(onSuccess(await request()));
  } catch (error) {
    showErrorDialog(error.message);
  } finally {
    dispatch(setIsLostFoundActionCreator(false));
  }
};

// Pembungkus aksi mutasi: flag proses (start) + flag selesai (done)
const mutate = (start, done, request) => async (dispatch) => {
  dispatch(start(true));
  try {
    showSuccessDialog(await request());
    dispatch(done(true));
  } catch (error) {
    showErrorDialog(error.message);
  } finally {
    dispatch(start(false));
  }
};

export const asyncGetLostFounds = (filters) =>
  load(() => api.getLostFounds(filters), setLostFoundsActionCreator);

export const asyncGetLostFound = (id) =>
  load(() => api.getLostFound(id), setLostFoundActionCreator);

export const asyncAddLostFound = (data) =>
  mutate(setIsLostFoundAddActionCreator, setIsLostFoundAddedActionCreator, () =>
    api.postLostFound(data)
  );

export const asyncChangeLostFound = (id, data) =>
  mutate(setIsLostFoundChangeActionCreator, setIsLostFoundChangedActionCreator, () =>
    api.putLostFound(id, data)
  );

export const asyncChangeLostFoundCover = (id, file) =>
  mutate(setIsLostFoundChangeCoverActionCreator, setIsLostFoundChangedCoverActionCreator, () =>
    api.postLostFoundCover(id, file)
  );

export const asyncDeleteLostFound = (id) =>
  mutate(setIsLostFoundDeleteActionCreator, setIsLostFoundDeletedActionCreator, () =>
    api.deleteLostFound(id)
  );

export const asyncGetLostFoundStats = () => async (dispatch) => {
  try {
    const [daily, monthly] = await Promise.all([
      api.getLostFoundStatsDaily(),
      api.getLostFoundStatsMonthly(),
    ]);
    dispatch(setLostFoundStatsActionCreator({ daily, monthly }));
  } catch (error) {
    showErrorDialog(error.message);
  }
};
