import { Response, NextFunction } from "express";
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
  req: IRequest<CreatePostInterface>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, published } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError(401, "Unauthorized: No user provided");
    }

    const newPost = await createPostQuery({
      title,
      content,
      published,
      authorId: userId,
    });

    res.status(201).json({
      status: 201,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, sortField, sortOrder } = req.query;

    // Call the query function with proper type conversions
    const posts = await getAllPostsQuery({
      search: typeof search === "string" ? search : undefined,
      sortField: sortField === "updatedAt" ? "updatedAt" : "createdAt", // default to createdAt if not 'updatedAt'
      sortOrder: sortOrder === "desc" ? "desc" : "asc", // default to asc if not 'desc'
    });

    res.json({
      status: 200,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await getPostByIdQuery(postId);

    if (!post) {
      throw new CustomError(404, "Post not found");
    }

    res.json({
      status: 200,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const { title, content, published } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError(401, "Unauthorized: No user provided");
    }

    // Get the post to verify ownership
    const post = await getPostByIdQuery(postId);
    if (!post) {
      throw new CustomError(404, "Post not found");
    }

    // Verify the user owns the post
    if (post.authorId !== userId) {
      throw new CustomError(
        403,
        "Forbidden: You can only update your own posts"
      );
    }

    const updatedPost = await updatePostQuery(postId, {
      title,
      content,
      published,
    });

    res.json({
      status: 200,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError(401, "Unauthorized: No user provided");
    }

    // Get the post to verify ownership
    const post = await getPostByIdQuery(postId);
    if (!post) {
      throw new CustomError(404, "Post not found");
    }

    // Verify the user owns the post
    if (post.authorId !== userId) {
      throw new CustomError(
        403,
        "Forbidden: You can only delete your own posts"
      );
    }

    await deletePostQuery(postId);

    res.json({
      status: 200,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};