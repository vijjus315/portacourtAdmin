import {
  request,
  setStoredTokens,
  setStoredUser,
  clearStoredTokens,
  clearStoredUser,
  getStoredUser,
} from "./apiClient";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  UPDATE_PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
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

export default {
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
};
