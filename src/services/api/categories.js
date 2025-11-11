import { request } from "./apiClient";

const CATEGORY_ENDPOINTS = {
  LIST: "/categories",
  DETAIL: (id) => `/categories/${id}`,
};

export const fetchCategories = (params = {}) =>
  request({
    endpoint: CATEGORY_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params,
  });

export const fetchCategoryById = (id) =>
  request({
    endpoint: CATEGORY_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export const createCategory = (payload) =>
  request({
    endpoint: CATEGORY_ENDPOINTS.LIST,
    method: "POST",
    auth: true,
    data: payload,
  });

export const updateCategory = (id, payload) =>
  request({
    endpoint: CATEGORY_ENDPOINTS.DETAIL(id),
    method: "PUT",
    auth: true,
    data: payload,
  });

export const deleteCategory = (id) =>
  request({
    endpoint: CATEGORY_ENDPOINTS.DETAIL(id),
    method: "DELETE",
    auth: true,
  });

export default {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
