import { apiFetch } from "../../../helpers/apiHelper";

export async function getUsers() {
  const json = await apiFetch("/users");
  return json.data.users;
}

export async function getProfile() {
  const json = await apiFetch("/users/me");
  return json.data.user;
}

export async function putProfile({ name, email }) {
  const json = await apiFetch("/users/me", { method: "PUT", body: { name, email } });
  return json.message;
}

export async function postProfilePhoto(file) {
  const body = new FormData();
  body.append("photo", file);
  const json = await apiFetch("/users/me/photo", { method: "POST", body });
  return json.message;
}

export async function putProfilePassword({ password, newPassword }) {
  const json = await apiFetch("/users/me/password", {
    method: "PUT",
    body: { password, new_password: newPassword },
  });
  return json.message;
}
