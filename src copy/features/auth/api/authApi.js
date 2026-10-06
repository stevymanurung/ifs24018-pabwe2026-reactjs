import { apiFetch } from "../../../helpers/apiHelper";

export async function postLogin({ email, password }) {
  const json = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return json.data.token;
}

export async function postRegister({ name, email, password }) {
  const json = await apiFetch("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
  return json.message;
}
