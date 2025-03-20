import joi from "joi";
import { CreatePostInterface } from "../interfaces";

const createPostValidation = (body: CreatePostInterface) => {
  const schema = joi.object({
    title: joi.string().required(),
    content: joi.string().required(),
    authorId: joi.number().required(),
  });

  return schema.validateAsync(body);
};

export default createPostValidation;
