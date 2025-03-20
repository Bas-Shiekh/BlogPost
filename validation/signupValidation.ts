import Joi from "joi";
import { signupInterface } from "../interfaces";

const signupValidation = (body: signupInterface) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().alphanum().min(5)
      .max(15),
    confirmationPassword: Joi.ref("password"),
  });

  return schema.validateAsync(body);
};

export default signupValidation;
