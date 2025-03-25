import { useAppSelector, useAppDispatch } from "./index";
import {
  fetchComments,
  createComment as createCommentAction,
  updateComment as updateCommentAction,
  deleteComment as deleteCommentAction,
  clearCommentError,
  clearComments,
} from "../store/slices/commentSlice";

/**
 * Hook for accessing comment state and actions from Redux
 */
export function useComment() {
  const dispatch = useAppDispatch();
  const { comments, isLoading, error } = useAppSelector(
    (state) => state.comments
  );

  const getComments = async (blogId: string) => {
    return dispatch(fetchComments(blogId)).unwrap();
  };

  const createComment = async (blogId: string, content: string) => {
    return dispatch(createCommentAction({ blogId, content })).unwrap();
  };

  const updateComment = async (commentId: string, content: string) => {
    return dispatch(updateCommentAction({ commentId, content })).unwrap();
  };

  const deleteComment = async (commentId: string) => {
    return dispatch(deleteCommentAction(commentId)).unwrap();
  };

  return {
    comments,
    isLoading,
    error,
    fetchComments: getComments,
    createComment,
    updateComment,
    deleteComment,
    clearError: () => dispatch(clearCommentError()),
    clearComments: () => dispatch(clearComments()),
  };
}
