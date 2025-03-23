import joi from "joi";
import { loginInterface } from "../interfaces";

const loginValidation = (body: loginInterface) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Email must be a valid email",
    }),
    password: joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  });

  return schema.validateAsync(body);
};

export default loginValidation;
