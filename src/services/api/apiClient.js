const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4235/api/v1/admin";

const TOKEN_STORAGE_KEY = "chefDadminAuthTokens";
const USER_SESSION_KEY = "chefDadminUser";
const USER_UPDATE_EVENT = "auth:user-update";

const dispatchUserEvent = (detail) => {
  if (
    typeof window === "undefined" ||
    typeof window.dispatchEvent !== "function"
  ) {
    return;
  }

  try {
    window.dispatchEvent(new CustomEvent(USER_UPDATE_EVENT, { detail }));
  } catch (error) {
    console.warn("Unable to dispatch user update event", error);
  }
};

class ApiError extends Error {
  constructor(message, response, data) {
    super(message);
    this.name = "ApiError";
    this.response = response;
    this.data = data;
  }
}

const buildUrl = (endpoint, params) => {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  const sanitizedEndpoint =
    typeof endpoint === "string" && endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

  const url = new URL(sanitizedEndpoint, base);

  if (params) {
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => url.searchParams.append(key, item));
        } else {
          url.searchParams.append(key, value);
        }
      });
  }

  return url.toString();
};

export const getStoredTokens = () => {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to read stored tokens", error);
    return null;
  }
};

export const getAccessToken = () => {
  const tokens = getStoredTokens();
  if (!tokens) {
    return null;
  }

  if (typeof tokens === "string") {
    return tokens;
  }

  return tokens.accessToken ?? tokens.token ?? null;
};

export const setStoredTokens = (tokens) => {
  try {
    if (!tokens) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return;
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.warn("Unable to persist tokens", error);
  }
};

export const clearStoredTokens = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to clear tokens", error);
  }
};

export const getStoredUser = () => {
  try {
    const raw = sessionStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to read stored user", error);
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (!user) {
      sessionStorage.removeItem(USER_SESSION_KEY);
      dispatchUserEvent(null);
      return;
    }
    sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    dispatchUserEvent(user);
  } catch (error) {
    console.warn("Unable to persist user session", error);
  }
};

export const clearStoredUser = () => {
  try {
    sessionStorage.removeItem(USER_SESSION_KEY);
    dispatchUserEvent(null);
  } catch (error) {
    console.warn("Unable to clear user session", error);
  }
};

export const request = async ({
  endpoint,
  method = "GET",
  data,
  params,
  headers: customHeaders,
  auth = false,
}) => {
  const headers = new Headers({
    Accept: "application/json",
    ...customHeaders,
  });

  const config = { method, headers };

  if (data !== undefined && data !== null) {
    if (!(data instanceof FormData)) {
      headers.set("Content-Type", "application/json");
      config.body = JSON.stringify(data);
    } else {
      config.body = data;
    }
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url = buildUrl(endpoint, params);
  const response = await fetch(url, config);

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  let payload;
  try {
    payload = isJson ? await response.json() : await response.text();
  } catch (error) {
    payload = null;
  }

  if (!response.ok || (payload && payload.success === false)) {
    const message =
      (payload && payload.message) ||
      response.statusText ||
      "Request failed with an unknown error.";
    throw new ApiError(message, response, payload);
  }

  return payload;
};

export default {
  request,
  setStoredTokens,
  getStoredTokens,
  clearStoredTokens,
  setStoredUser,
  getStoredUser,
  clearStoredUser,
};
