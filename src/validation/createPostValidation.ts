import joi from "joi";
import { CreatePostInterface } from "../interfaces";

const createPostValidation = (body: CreatePostInterface) => {
  const schema = joi.object({
    title: joi.string().required().messages({
      "string.base": "Title must be a string",
      "any.required": "Title is required",
    }),
    content: joi.string().required().messages({
      "string.base": "Content must be a string",
      "any.required": "Content is required",
    }),
    authorId: joi.number().required().messages({
      "any.required": "Author ID is required",
      "number.base": "Author ID must be a number",
    }),
  });

  return schema.validateAsync(body);
};

export default createPostValidation;
