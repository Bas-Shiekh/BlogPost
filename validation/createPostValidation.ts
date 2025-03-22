import joi from "joi";
import { CreatePostInterface } from "../interfaces";

const createPostValidation = (body: CreatePostInterface) => {
  const schema = joi.object({
    title: joi.string().required().messages({
      "string.base": "Title must be a string.",
      "any.required": "Title is required.",
    }),
    content: joi.string().required().messages({
      "string.base": "Content must be a string.",
      "any.required": "Content is required.",
    }),
    published: joi.boolean().required().messages({
      "boolean.base": "Published must be a boolean.",
      "any.required": "Published status is required.",
    }),
  });

  return schema.validateAsync(body);
};

export default createPostValidation;
