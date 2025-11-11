import { request } from "./apiClient";

const USER_ENDPOINTS = {
  USERS_BY_ROLE: "/users/users-by-role",
  LIST: "/auth/users",
};

export const fetchUsersByRole = ({ roleType, page, limit, search }) =>
  request({
    endpoint: USER_ENDPOINTS.USERS_BY_ROLE,
    method: "POST",
    auth: true,
    data: {
      role_type: roleType,
      page,
      limit,
      search,
    },
  });

export const fetchUsers = ({ search, limit, offset }) =>
  request({
    endpoint: USER_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params: {
      search,
      limit,
      offset,
    },
  });

export default {
  fetchUsersByRole,
  fetchUsers,
};
