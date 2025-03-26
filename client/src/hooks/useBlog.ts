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
} from "../store/slices/blogSlice";

/**
 * Hook for accessing blog state and actions from Redux
 */
export const useBlog = () => {
  const dispatch = useAppDispatch();
  const { blogs, currentBlog, isLoading, error } = useAppSelector(
    (state) => state.blogs
  );

  const getBlogList = useCallback(
    (limit?: number) => {
      return dispatch(fetchBlogs(limit)).unwrap();
    },
    [dispatch]
  );

  const getBlog = useCallback(
    (id: string) => {
      return dispatch(fetchBlog(id)).unwrap();
    },
    [dispatch]
  );

  const createBlog = useCallback(
    (data: { title: string; content: string; published?: boolean }) => {
      return dispatch(createBlogAction(data)).unwrap();
    },
    [dispatch]
  );

  const updateBlog = useCallback(
    (
      id: string,
      data: { title: string; content: string; published?: boolean }
    ) => {
      return dispatch(updateBlogAction({ id, data })).unwrap();
    },
    [dispatch]
  );

  const deleteBlog = useCallback(
    (id: string) => {
      return dispatch(deleteBlogAction(id)).unwrap();
    },
    [dispatch]
  );

  const setCurrentBlog = useCallback(
    (blog: any) => {
      return dispatch(setCurrentBlogAction(blog));
    },
    [dispatch]
  );

  return {
    blogs,
    currentBlog,
    isLoading,
    error,
    fetchBlogs: getBlogList,
    fetchBlog: getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    setCurrentBlog,
    clearError: useCallback(() => dispatch(clearBlogError()), [dispatch]),
    clearCurrentBlog: useCallback(
      () => dispatch(clearCurrentBlog()),
      [dispatch]
    ),
  };
}
