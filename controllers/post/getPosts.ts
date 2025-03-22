import { NextFunction, Response } from "express";
import { CustomRequest } from "../../interfaces";
import { getPostsQuery } from "../../queries/post/post";

const getPosts = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const postsData = await getPostsQuery();
    response.json(200).json({ status: 200, data: postsData });
  } catch (error) {
    next(error);
  }
};

export default getPosts;
