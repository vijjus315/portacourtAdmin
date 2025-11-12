import { request } from "./apiClient";

const COURT_ENDPOINTS = {
  LIST: "/court",
  DETAIL: (id) => `/court/${id}`,
  CREATE: "/court",
  UPDATE: (id) => `/court/${id}`,
  DELETE: (id) => `/court/${id}`,
};

export const fetchCourts = (params = {}) =>
  request({
    endpoint: COURT_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params,
  });

export const fetchCourtDetail = (id) =>
  request({
    endpoint: COURT_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export const createCourt = (data) =>
  request({
    endpoint: COURT_ENDPOINTS.CREATE,
    method: "POST",
    auth: true,
    data,
  });

export const updateCourt = (id, data) =>
  request({
    endpoint: COURT_ENDPOINTS.UPDATE(id),
    method: "PUT",
    auth: true,
    data,
  });

export const deleteCourt = (id) =>
  request({
    endpoint: COURT_ENDPOINTS.DELETE(id),
    method: "DELETE",
    auth: true,
  });

export default {
  fetchCourts,
  fetchCourtDetail,
  createCourt,
  updateCourt,
  deleteCourt,
};
