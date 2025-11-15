import {
  request,
  setStoredTokens,
  setStoredUser,
  clearStoredTokens,
  clearStoredUser,
  getStoredUser,
  getAccessToken,
} from "./apiClient";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  UPDATE_PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
  FILE_UPLOAD: "/auth/file-upload",
};

export const login = async (credentials) => {
  const response = await request({
    endpoint: AUTH_ENDPOINTS.LOGIN,
    method: "POST",
    data: credentials,
  });

  const payload = response?.body ?? {};
  const token =
    payload?.tokens?.accessToken ??
    payload?.tokens?.token ??
    payload?.token ??
    null;

  if (token) {
    setStoredTokens({ accessToken: token });
  }

  if (payload?.admin) {
    setStoredUser(payload.admin);
  } else if (payload) {
    const { tokens, token: _token, ...profile } = payload;
    if (Object.keys(profile).length > 0) {
      setStoredUser(profile);
    }
  }

  return response;
};

export const logout = async () => {
  try {
    await request({
      endpoint: AUTH_ENDPOINTS.LOGOUT,
      method: "POST",
      auth: true,
    });
  } finally {
    clearStoredTokens();
    clearStoredUser();
  }
};

export const getCurrentUser = () => getStoredUser();

export const updateProfile = async (payload) => {
  const response = await request({
    endpoint: AUTH_ENDPOINTS.UPDATE_PROFILE,
    method: "PUT",
    data: payload,
    auth: true,
  });

  if (response?.success) {
    const currentUser = getStoredUser() || {};
    setStoredUser({
      ...currentUser,
      name: payload.name ?? currentUser.name,
      phone: payload.phone ?? currentUser.phone ?? currentUser.phone_no,
      phone_no: payload.phone ?? currentUser.phone_no,
      phone_number: payload.phone ?? currentUser.phone_number,
      country_code: payload.country_code ?? currentUser.country_code,
    });
  }

  return response;
};

export const changePassword = async (payload) =>
  request({
    endpoint: AUTH_ENDPOINTS.CHANGE_PASSWORD,
    method: "POST",
    data: payload,
    auth: true,
  });

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  // File upload endpoint is at /api/v1/auth/file-upload (without /admin)
  // Get base URL and construct the correct endpoint
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4235/api/v1/admin";

  // Extract base domain and construct upload URL without /admin
  let baseUrl;
  if (API_BASE_URL.includes("staging.portacourts.com")) {
    baseUrl = "https://staging.portacourts.com/api/v1";
  } else if (API_BASE_URL.includes("portacourts.com")) {
    baseUrl = API_BASE_URL.replace(/\/admin\/?$/, "");
  } else {
    // For localhost or other environments, remove /admin
    baseUrl = API_BASE_URL.replace(/\/admin\/?$/, "");
  }

  const uploadUrl = `${baseUrl}/auth/file-upload`;

  // Use fetch directly for file upload with correct endpoint
  const token = getAccessToken();
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers,
    body: formData,
  });

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
      "File upload failed";
    throw new Error(message);
  }

  return payload?.body || [];
};

export default {
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  uploadFile,
};
