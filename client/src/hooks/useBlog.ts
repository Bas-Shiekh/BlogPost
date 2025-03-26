"use client";

import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "./index";
import {
  fetchBlogs,
  fetchBlog,
  createBlog as createBlogAction,
  updateBlog as updateBlogAction,
  deleteBlog as deleteBlogAction,
  clearBlogError,
  clearCurrentBlog,
  setCurrentBlog as setCurrentBlogAction,
  setFilters,
} from "../store/slices/blogSlice";
import type { BlogFilters } from "../lib/blog-api";

/**
 * Hook for accessing blog state and actions from Redux
 */
export const useBlog = () => {
  const dispatch = useAppDispatch();
  const { blogs, currentBlog, isLoading, error, filters } = useAppSelector(
    (state) => state.blogs
  );

  const getBlogList = useCallback(
    (newFilters?: BlogFilters) => {
      console.log("useBlog.getBlogList called with filters:", newFilters);
      return dispatch(fetchBlogs(newFilters)).unwrap();
    },
    [dispatch]
  );

  const getBlog = useCallback(
    (id: string) => {
      console.log("useBlog.getBlog called with ID:", id);
      return dispatch(fetchBlog(id)).unwrap();
    },
    [dispatch]
  );

  const createBlog = useCallback(
    (data: { title: string; content: string; published?: boolean }) => {
      console.log("useBlog.createBlog called with data:", data);
      return dispatch(createBlogAction(data)).unwrap();
    },
    [dispatch]
  );

  const updateBlog = useCallback(
    (
      id: string,
      data: { title: string; content: string; published?: boolean }
    ) => {
      console.log("useBlog.updateBlog called with ID:", id, "and data:", data);
      return dispatch(updateBlogAction({ id, data })).unwrap();
    },
    [dispatch]
  );

  const deleteBlog = useCallback(
    (id: string) => {
      console.log("useBlog.deleteBlog called with ID:", id);
      return dispatch(deleteBlogAction(id)).unwrap();
    },
    [dispatch]
  );

  const setCurrentBlog = useCallback(
    (blog: any) => {
      console.log("useBlog.setCurrentBlog called with blog:", blog);
      return dispatch(setCurrentBlogAction(blog));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: BlogFilters) => {
      console.log("useBlog.updateFilters called with filters:", newFilters);
      dispatch(setFilters(newFilters));
      return dispatch(fetchBlogs(newFilters)).unwrap();
    },
    [dispatch]
  );

  return {
    blogs,
    currentBlog,
    isLoading,
    error,
    filters,
    fetchBlogs: getBlogList,
    fetchBlog: getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    setCurrentBlog,
    updateFilters,
    clearError: useCallback(() => dispatch(clearBlogError()), [dispatch]),
    clearCurrentBlog: useCallback(
      () => dispatch(clearCurrentBlog()),
      [dispatch]
    ),
  };
}
