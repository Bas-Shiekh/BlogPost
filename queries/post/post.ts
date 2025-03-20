import prisma from "../../database/connection";
import { CreatePostInterface } from "../../interfaces";

const getPostsQuery = () => prisma.post.findMany();

const getSpecificPostQuery = (id: number) =>
  prisma.post.findUnique({
    where: {
      id,
    },
  });

const createPostQuery = ({ title, content, authorId }: CreatePostInterface) =>
  prisma.post.create({
    data: {
      title,
      content,
      authorId,
      published: Date.now(),
    },
  });

export { getPostsQuery, getSpecificPostQuery, createPostQuery };
