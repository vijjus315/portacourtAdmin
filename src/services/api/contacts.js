import { request } from "./apiClient";

const CONTACT_ENDPOINTS = {
  LIST: "/contacts",
  DETAIL: (id) => `/contacts/${id}`,
};

export const fetchContacts = (params = {}) =>
  request({
    endpoint: CONTACT_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params,
  });

export const fetchContactDetail = (id) =>
  request({
    endpoint: CONTACT_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export default {
  fetchContacts,
  fetchContactDetail,
};
