import { Response } from "express";
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
  request: IRequest<{ content: string; postId: number }>,
  response: Response
) => {
  const { content } = request.body;
  const { postId } = request.params;
  const userId = request.user?.id;

  const newComment = await createCommentQuery({
    content,
    postId: parseInt(postId),
    authorId: userId,
  });

  response.status(201).json({
    status: 201,
    message: "Comment created successfully",
    data: newComment,
  });
};

export const getCommentsByPost = async (
  request: IRequest,
  response: Response
) => {
  const postId = parseInt(request.params.postId);

  const comments = await getCommentsByPostQuery(postId);

  response.json({
    status: 200,
    data: comments,
  });
};

export const updateComment = async (
  request: IRequest<{ content: string }>,
  response: Response
) => {
  const commentId = parseInt(request.params.commentId, 10);
  const { content } = request.body;
  const userId = request.user.id;

  const comment = await getCommentByIdQuery(commentId, userId);
  if (!comment) throw new CustomError(404, "Comment not found");

  const updatedComment = await updateCommentQuery(commentId, { content });

  response.json({
    status: 200,
    message: "Comment updated successfully",
    data: updatedComment,
  });
};

export const deleteComment = async (request: IRequest, response: Response) => {
  const commentId = parseInt(request.params.commentId, 10);
  const userId = request.user.id;

  const comment = await getCommentByIdQuery(commentId, userId);
  if (!comment) throw new CustomError(404, "Comment not found");

  await deleteCommentQuery(commentId);

  response.json({
    status: 200,
    message: "Comment deleted successfully",
  });
};
