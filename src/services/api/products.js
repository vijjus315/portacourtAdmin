import { request } from "./apiClient";

const PRODUCT_ENDPOINTS = {
  LIST: "/product",
  DETAIL: (id) => `/product/${id}`,
  CREATE: "/product",
  UPDATE: (id) => `/product/${id}`,
  DELETE: (id) => `/product/${id}`,
};

export const fetchProducts = (params = {}) =>
  request({
    endpoint: PRODUCT_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params,
  });

export const fetchProductDetail = (id) =>
  request({
    endpoint: PRODUCT_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export const createProduct = (data) =>
  request({
    endpoint: PRODUCT_ENDPOINTS.CREATE,
    method: "POST",
    auth: true,
    data,
  });

export const updateProduct = (id, data) =>
  request({
    endpoint: PRODUCT_ENDPOINTS.UPDATE(id),
    method: "PUT",
    auth: true,
    data,
  });

export const deleteProduct = (id) =>
  request({
    endpoint: PRODUCT_ENDPOINTS.DELETE(id),
    method: "DELETE",
    auth: true,
  });

export default {
  fetchProducts,
  fetchProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
};
