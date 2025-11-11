import { request } from "./apiClient";

const BOOKING_ENDPOINTS = {
  LIST: "/booking",
  DETAIL: (id) => `/booking/${id}`,
  UPDATE_STATUS: (id) => `/booking/${id}/status`,
};

export const fetchBookings = (params) =>
  request({
    endpoint: BOOKING_ENDPOINTS.LIST,
    method: "GET",
    params,
    auth: true,
  });

export const fetchBookingDetail = (id) =>
  request({
    endpoint: BOOKING_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export const updateBookingStatus = (id, data) =>
  request({
    endpoint: BOOKING_ENDPOINTS.UPDATE_STATUS(id),
    method: "PATCH",
    data,
    auth: true,
  });

export default {
  fetchBookings,
  fetchBookingDetail,
  updateBookingStatus,
};

