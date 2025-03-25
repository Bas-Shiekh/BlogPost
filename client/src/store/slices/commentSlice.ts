import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { commentApi } from "../../lib/comment-api";
import type { Comment } from "../../lib/types";
import { addToast } from "./toastSlice";

/**
 * Comment state interface
 */
interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial comment state
 */
const initialState: CommentState = {
  comments: [],
  isLoading: false,
  error: null,
};

/**
 * Fetch comments async thunk
 */
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (blogId: string, { rejectWithValue, dispatch }) => {
    try {
      const comments = await commentApi.getComments(blogId);
      return comments;
    } catch (error: any) {
      dispatch(
        addToast({
          title: "Failed to fetch comments",
          description:
            error.response?.data?.message ||
            "An error occurred while fetching comments",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments."
      );
    }
  }
);

/**
 * Create comment async thunk
 */
export const createComment = createAsyncThunk(
  "comments/createComment",
  async (
    { blogId, content }: { blogId: string; content: string },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const comment = await commentApi.createComment(blogId, content);

      // Add user information from auth state
      const state = getState() as { auth: { user: any } };
      if (state.auth.user) {
        comment.author.name = state.auth.user.name;
      }

      dispatch(
        addToast({
          title: "Comment added",
          description: "Your comment has been posted successfully",
        })
      );

      return comment;
    } catch (error: any) {
      dispatch(
        addToast({
          title: "Failed to add comment",
          description:
            error.response?.data?.message ||
            "An error occurred while posting your comment",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment."
      );
    }
  }
);

/**
 * Update comment async thunk
 */
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (
    { commentId, content }: { commentId: string; content: string },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const comment = await commentApi.updateComment(commentId, content);

      // Add user information from auth state
      const state = getState() as { auth: { user: any } };
      if (state.auth.user) {
        comment.author.name = state.auth.user.name;
      }

      dispatch(
        addToast({
          title: "Comment updated",
          description: "Your comment has been updated successfully",
        })
      );

      return comment;
    } catch (error: any) {
      dispatch(
        addToast({
          title: "Failed to update comment",
          description:
            error.response?.data?.message ||
            "An error occurred while updating your comment",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment."
      );
    }
  }
);

/**
 * Delete comment async thunk
 */
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId: string, { rejectWithValue, dispatch }) => {
    try {
      await commentApi.deleteComment(commentId);

      dispatch(
        addToast({
          title: "Comment deleted",
          description: "Your comment has been deleted successfully",
        })
      );

      return commentId;
    } catch (error: any) {
      dispatch(
        addToast({
          title: "Failed to delete comment",
          description:
            error.response?.data?.message ||
            "An error occurred while deleting your comment",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment."
      );
    }
  }
);

/**
 * Comment slice for Redux
 */
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearCommentError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Comments
    builder.addCase(fetchComments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchComments.fulfilled,
      (state, action: PayloadAction<Comment[]>) => {
        state.isLoading = false;
        state.comments = action.payload;
      }
    );
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Comment
    builder.addCase(createComment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      createComment.fulfilled,
      (state, action: PayloadAction<Comment>) => {
        state.isLoading = false;
        state.comments.push(action.payload);
      }
    );
    builder.addCase(createComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Comment
    builder.addCase(updateComment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      updateComment.fulfilled,
      (state, action: PayloadAction<Comment>) => {
        state.isLoading = false;
        state.comments = state.comments.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
        );
      }
    );
    builder.addCase(updateComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Comment
    builder.addCase(deleteComment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      deleteComment.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      }
    );
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCommentError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
