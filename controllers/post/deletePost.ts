import { NextFunction, Response } from "express";
import { CustomRequest } from "../../interfaces";

const deletePost = async (request: CustomRequest, response: Response, next: NextFunction) => {
  try {
    const postId = request.params.id;
    const deletedData = deletePostQuery()
  } catch (error) {
    next(error)
  }
};

export default deletePost;
