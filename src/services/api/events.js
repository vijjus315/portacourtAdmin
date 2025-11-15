import { request } from "./apiClient";

const EVENT_ENDPOINTS = {
  LIST: "/event",
  DETAIL: (id) => `/event/${id}`,
  CREATE: "/event",
  UPDATE: (id) => `/event/${id}`,
  DELETE: (id) => `/event/${id}`,
};

export const fetchEvents = (params = {}) =>
  request({
    endpoint: EVENT_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params,
  });

export const fetchEventDetail = (id) =>
  request({
    endpoint: EVENT_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export const createEvent = (data) =>
  request({
    endpoint: EVENT_ENDPOINTS.CREATE,
    method: "POST",
    auth: true,
    data,
  });

export const updateEvent = (id, data) =>
  request({
    endpoint: EVENT_ENDPOINTS.UPDATE(id),
    method: "PUT",
    auth: true,
    data,
  });

export const deleteEvent = (id) =>
  request({
    endpoint: EVENT_ENDPOINTS.DELETE(id),
    method: "DELETE",
    auth: true,
  });

export default {
  fetchEvents,
  fetchEventDetail,
  createEvent,
  updateEvent,
  deleteEvent,
};
