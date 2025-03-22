import { NextFunction, Response } from "express";
import { CustomRequest } from "../../interfaces";
import { getSpecificPostQuery } from "../../queries/post/post";

const getSpecificPost = async (request: CustomRequest, response: Response, next: NextFunction) => {
  try {
    const id = request.params.id;
    const postData = await getSpecificPostQuery(+id);
    response.json(200).json({ status: 200, data: postData });
  } catch (error) {
    next(error);
  }
};

export default getSpecificPost;
