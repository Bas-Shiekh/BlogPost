import { Response } from "express";
import CustomError from "../utils/CustomError";
import {
  createPostQuery,
  getAllPostsQuery,
  getPostByIdQuery,
  updatePostQuery,
  deletePostQuery,
} from "../database/queries/post";
import { CreatePostInterface, IRequest } from "../interfaces";

export const createPost = async (
  request: IRequest<CreatePostInterface>,
  response: Response
) => {
  const { title, content, published } = request.body;
  const userId = request.user.id;

  const newPost = await createPostQuery({
    title,
    content,
    published,
    authorId: userId,
  });

  response.status(201).json({
    status: 201,
    message: "Post created successfully",
    data: newPost,
  });
};

export const getAllPosts = async (request: IRequest, response: Response) => {
  const { search, sortField, sortOrder } = request.query;

  // Call the query function with proper type conversions
  const posts = await getAllPostsQuery({
    search: typeof search === "string" ? search : undefined,
    sortField: sortField === "updatedAt" ? "updatedAt" : "createdAt", // default to createdAt if not 'updatedAt'
    sortOrder: sortOrder === "desc" ? "desc" : "asc", // default to asc if not 'desc'
  });

  response.json({
    status: 200,
    data: posts,
  });
};

export const getPostById = async (request: IRequest, response: Response) => {
  const postId = parseInt(request.params.id, 10);
  const post = await getPostByIdQuery(postId);

  if (!post) {
    throw new CustomError(404, "Post not found");
  }

  response.json({
    status: 200,
    data: post,
  });
};

export const updatePost = async (request: IRequest, response: Response) => {
  const postId = parseInt(request.params.id, 10);
  const { title, content, published } = request.body;
  const userId = request.user.id;

  // Get the post to verify ownership
  const post = await getPostByIdQuery(postId);
  if (!post) {
    throw new CustomError(404, "Post not found");
  }

  // Verify the user owns the post
  if (post.authorId !== userId) {
    throw new CustomError(403, "Forbidden: You can only update your own posts");
  }

  const updatedPost = await updatePostQuery(postId, {
    title,
    content,
    published,
  });

  response.json({
    status: 200,
    message: "Post updated successfully",
    data: updatedPost,
  });
};

export const deletePost = async (request: IRequest, response: Response) => {
  const postId = parseInt(request.params.id, 10);
  const userId = request.user.id;

  // Get the post to verify ownership
  const post = await getPostByIdQuery(postId);
  if (!post) {
    throw new CustomError(404, "Post not found");
  }

  // Verify the user owns the post
  if (post.authorId !== userId) {
    throw new CustomError(403, "Forbidden: You can only delete your own posts");
  }

  await deletePostQuery(postId);

  response.json({
    status: 200,
    message: "Post deleted successfully",
  });
};
