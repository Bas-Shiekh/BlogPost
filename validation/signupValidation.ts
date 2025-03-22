import Joi from "joi";
import { signupInterface } from "../interfaces";

const signupValidation = (body: signupInterface) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Email must be a valid email",
    }),
    password: Joi.string().required().alphanum().min(5).max(15).messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.alphanum": "Password must contain only alphanumeric characters",
      "string.min": "Password must be at least 5 characters long",
      "string.max": "Password must not exceed 15 characters",
    }),
    confirmationPassword: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "string.empty": "Confirmation password is required",
        "any.only": "Confirmation password must match the password",
      }),
  });

  return schema.validateAsync(body);
};

export default signupValidation;
