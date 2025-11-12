import { request } from "./apiClient";

const BLOG_ENDPOINTS = {
  LIST: "/blog",
  DETAIL: (id) => `/blog/${id}`,
  CREATE: "/blog",
  UPDATE: (id) => `/blog/${id}`,
  DELETE: (id) => `/blog/${id}`,
};

export const fetchBlogs = (params = {}) =>
  request({
    endpoint: BLOG_ENDPOINTS.LIST,
    method: "GET",
    auth: true,
    params,
  });

export const fetchBlogDetail = (id) =>
  request({
    endpoint: BLOG_ENDPOINTS.DETAIL(id),
    method: "GET",
    auth: true,
  });

export const createBlog = (data) =>
  request({
    endpoint: BLOG_ENDPOINTS.CREATE,
    method: "POST",
    auth: true,
    data,
  });

export const updateBlog = (id, data) =>
  request({
    endpoint: BLOG_ENDPOINTS.UPDATE(id),
    method: "PUT",
    auth: true,
    data,
  });

export const deleteBlog = (id) =>
  request({
    endpoint: BLOG_ENDPOINTS.DELETE(id),
    method: "DELETE",
    auth: true,
  });

export default {
  fetchBlogs,
  fetchBlogDetail,
  createBlog,
  updateBlog,
  deleteBlog,
};
