import prisma from "../connection"; // Your Prisma client instance
import { CreateCommentInterface } from "../../interfaces";


export const createCommentQuery = async (data: CreateCommentInterface) => {
  return prisma.comment.create({data});
};

export const getCommentsByPostQuery = async (postId: number) => {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getCommentByIdQuery = async (commentId: number, userId: number) => {
  return prisma.comment.findUnique({
    where: { id: commentId, authorId: userId },
  });
};
export const updateCommentQuery = async (commentId: number, data: { content: string }) => {
  return prisma.comment.update({
    where: { id: commentId },
    data,
  });
};

export const deleteCommentQuery = async (commentId: number) => {
  return prisma.comment.delete({
    where: { id: commentId },
  });
};
