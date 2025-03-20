import joi from "joi";
import { loginInterface } from "../interfaces";

const loginValidation = (body: loginInterface) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  return schema.validateAsync(body);
};

export default loginValidation;
