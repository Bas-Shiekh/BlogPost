import prisma from "../connection"; // Your Prisma client instance
import { PostQuery } from "../../interfaces";
export const createPostQuery = async (data: {
  title: string;
  content?: string;
  published?: boolean;
  authorId: number;
}) => {
  return prisma.post.create({ data });
};
export const getAllPostsQuery = async (query: PostQuery) => {
  const { search, sortField = "createdAt", sortOrder = "asc" } = query;

  return prisma.post.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            // Search in the related author's name.
            { author: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: {
      [sortField]: sortOrder,
    },
    // Include the related author in the result so you can see the author details
    include: {
      author: true,
    },
  });
};

export const getPostByIdQuery = async (id: number) => {
  return prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });
};

export const updatePostQuery = async (id: number, data: {
  title?: string;
  content?: string;
  published?: boolean;
}) => {
  return prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePostQuery = async (id: number) => {
  return prisma.post.delete({
    where: { id },
  });
};
