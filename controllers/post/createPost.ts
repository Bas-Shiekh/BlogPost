import { NextFunction, Response } from "express";
import { CustomRequest } from "../../interfaces";
import createPostValidation from "../../validation/createPostValidation";
import CustomError from "../../utils/CustomError";
import { createPostQuery } from "../../queries/post/post";

const createPost = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { title, content } = request.body;
    const id = request.user?.id;
    await createPostValidation({ title, content, authorId: id });
    const postData = await createPostQuery({ title, content, authorId: id });
    response.status(200).json({
      status: 200,
      message: "Post was created successfully",
      data: postData,
    });
  } catch (error) {
    if (error.name === "ValidationError")
      next(new CustomError(400, error.details[0].message));
    else next(error);
  }
};

export default createPost;
