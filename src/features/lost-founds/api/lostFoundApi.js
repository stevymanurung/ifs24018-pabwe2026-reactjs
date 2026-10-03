import { apiFetch } from "../../../helpers/apiHelper";

// filter: { status: "lost" | "found", is_completed: 1 | 0, is_me: 1 }
export async function getLostFounds(filters = {}) {
  const json = await apiFetch("/lost-founds", { params: filters });
  return json.data.lost_founds;
}

export async function getLostFound(id) {
  const json = await apiFetch(`/lost-founds/${id}`);
  return json.data.lost_found;
}

export async function postLostFound({ title, description, status }) {
  const json = await apiFetch("/lost-founds", {
    method: "POST",
    body: { title, description, status },
  });
  return json.message;
}

export async function putLostFound(id, { title, description, status, is_completed }) {
  const json = await apiFetch(`/lost-founds/${id}`, {
    method: "PUT",
    body: { title, description, status, is_completed },
  });
  return json.message;
}

export async function postLostFoundCover(id, file) {
  const body = new FormData();
  body.append("cover", file);
  const json = await apiFetch(`/lost-founds/${id}/cover`, { method: "POST", body });
  return json.message;
}

export async function deleteLostFound(id) {
  const json = await apiFetch(`/lost-founds/${id}`, { method: "DELETE" });
  return json.message;
}

export async function getLostFoundStatsDaily() {
  const json = await apiFetch("/lost-founds/stats/daily");
  return json.data;
}

export async function getLostFoundStatsMonthly() {
  const json = await apiFetch("/lost-founds/stats/monthly");
  return json.data;
}
