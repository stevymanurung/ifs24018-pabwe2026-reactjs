const TOKEN_KEY = "accessToken";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);

// Aset (foto/cover) dilayani dari origin server API, path-nya relatif (mis. img/...)
export const assetUrl = (path) =>
  path.startsWith("http")
    ? path
    : `${new URL(DELCOM_BASEURL).origin}/${path}`;

export async function apiFetch(path, { method = "GET", params = {}, body } = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null && v !== "")
  ).toString();
  const queryString = query ? `?${query}` : "";
  const url = `${DELCOM_BASEURL}${path}${queryString}`;

  const token = getAccessToken();
  const init = { method, headers: token ? { Authorization: `Bearer ${token}` } : {} };
  if (body) {
    init.body = body instanceof FormData ? body : new URLSearchParams(body);
  }

  const response = await fetch(url, init);
  const json = await response.json();
  // Sukses bila HTTP 2xx dan API tidak secara eksplisit menandai success=false
  // (respons sukses API tidak selalu memuat field `success`).
  if (!response.ok || json.success === false) {
    throw new Error(json.message);
  }
  return json;
}
