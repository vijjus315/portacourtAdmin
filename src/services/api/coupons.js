import { request } from "./apiClient";

const COUPON_ENDPOINTS = {
  LIST: "/coupons",
  DETAIL: (id) => `/coupons/${id}`,
};

export const fetchCoupons = (params = {}) =>
  request({
    endpoint: COUPON_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params,
  });

export const fetchCouponDetail = (id) =>
  request({
    endpoint: COUPON_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export default {
  fetchCoupons,
  fetchCouponDetail,
};
