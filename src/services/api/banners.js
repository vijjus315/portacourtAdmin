import { request } from "./apiClient";

const BANNER_ENDPOINTS = {
  LIST: "/banners",
  DETAIL: (id) => `/banners/${id}`,
};

export const fetchBanners = (params = {}) =>
  request({
    endpoint: BANNER_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params,
  });

export const fetchBannerById = (id) =>
  request({
    endpoint: BANNER_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export const createBanner = (payload) =>
  request({
    endpoint: BANNER_ENDPOINTS.LIST,
    method: "POST",
    auth: true,
    data: payload,
  });

export const updateBanner = (id, payload) =>
  request({
    endpoint: BANNER_ENDPOINTS.DETAIL(id),
    method: "PUT",
    auth: true,
    data: payload,
  });

export const deleteBanner = (id) =>
  request({
    endpoint: BANNER_ENDPOINTS.DETAIL(id),
    method: "DELETE",
    auth: true,
  });

export default {
  fetchBanners,
  fetchBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};
