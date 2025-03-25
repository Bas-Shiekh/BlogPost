import apiClient from "./api-client";
import type { Comment } from "./types";

export interface CommentResponse {
  status: number;
  message: string;
  data: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    postId: number;
    authorId: number;
  };
}

export interface CommentsResponse {
  status: number;
  data: Array<{
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    postId: number;
    authorId: number;
    author: { name: string };
  }>;
}

// Comment API functions
export const commentApi = {
  // Get all comments for a blog
  getComments: async (blogId: string): Promise<Comment[]> => {
    try {
      const response = await apiClient.get<CommentsResponse>(
        `/comments/${blogId}`
      );
      // Convert the response format to match our Comment type
      const comments: Comment[] = response.data.data.map((item) => ({
        id: item.id.toString(),
        content: item.content,
        createdAt: item.createdAt,
        blogId: item.postId.toString(),
        author: {
          id: item.authorId.toString(),
          name: item.author.name, // We'll need to get this from the user context or another API call
        },
      }));

      return comments;
    } catch (error: any) {
      console.error(
        `Error fetching comments for blog ${blogId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create a new comment
  createComment: async (blogId: string, content: string): Promise<Comment> => {
    try {
      const response = await apiClient.post<CommentResponse>(
        `/comments/${blogId}`,
        { content }
      );
      const item = response.data.data;
      // Convert the response format to match our Comment type
      const comment: Comment = {
        id: item.id.toString(),
        content: item.content,
        createdAt: item.createdAt,
        blogId: item.postId.toString(),
        author: {
          id: item.authorId.toString(),
          name: "", // We'll need to get this from the user context
        },
      };

      return comment;
    } catch (error: any) {
      console.error(
        `Error creating comment for blog ${blogId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update an existing comment
  updateComment: async (
    commentId: string,
    content: string
  ): Promise<Comment> => {
    try {
      const response = await apiClient.put<CommentResponse>(
        `/comments/${commentId}`,
        { content }
      );
      const item = response.data.data;
      // Convert the response format to match our Comment type
      const comment: Comment = {
        id: item.id.toString(),
        content: item.content,
        createdAt: item.createdAt,
        blogId: item.postId.toString(),
        author: {
          id: item.authorId.toString(),
          name: "", // We'll need to get this from the user context
        },
      };

      return comment;
    } catch (error: any) {
      console.error(
        `Error updating comment ${commentId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
    } catch (error: any) {
      console.error(
        `Error deleting comment ${commentId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
