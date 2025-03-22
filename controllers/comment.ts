import { Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import { IRequest } from "../interfaces";
import {
  createCommentQuery,
  getCommentsByPostQuery,
  updateCommentQuery,
  deleteCommentQuery,
  getCommentByIdQuery,
} from "../database/queries/comment";

export const createComment = async (
  req: IRequest<{ content: string; postId: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user?.id;

    if (!userId) throw new CustomError(401, "Unauthorized: No user provided");

    const newComment = await createCommentQuery({
      content,
      postId,
      authorId: userId,
    });

    res.status(201).json({
      status: 201,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPost = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.postId);

    const comments = await getCommentsByPostQuery(postId);

    res.json({
      status: 200,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: IRequest<{ content: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError(401, "Unauthorized: No user provided");
    }

    const comment = await getCommentByIdQuery(commentId, userId);
    if (!comment) throw new CustomError(404, "Comment not found");

    const updatedComment = await updateCommentQuery(commentId, { content });

    res.json({
      status: 200,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError(401, "Unauthorized: No user provided");
    }

    const comment = await getCommentByIdQuery(commentId, userId);
    if (!comment) throw new CustomError(404, "Comment not found");

    await deleteCommentQuery(commentId);

    res.json({
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
