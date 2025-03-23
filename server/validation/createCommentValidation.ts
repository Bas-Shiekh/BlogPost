import joi from "joi";
import { UpdateCommentInterface } from "../interfaces";

const createOrUpdateCommentValidation = (body: UpdateCommentInterface) => {
  const schema = joi.object({
    content: joi.string().required(),
  });

  return schema.validateAsync(body);
};

export default createOrUpdateCommentValidation;
