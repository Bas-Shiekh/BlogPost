import joi from "joi";
import { UpdatePostInterface } from "../interfaces";

const updatePostValidation = (body: UpdatePostInterface) => {
  const schema = joi.object({
    title: joi.string().optional(),
    content: joi.string().optional(),
  });

  return schema.validateAsync(body);
};

export default updatePostValidation;
