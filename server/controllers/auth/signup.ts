import { Request, Response } from "express";
import { signupValidation } from "../../validation";
import { hash } from "bcryptjs";
import CustomError from "../../utils/CustomError";
import { signToken } from "../../utils/jwt";
import { createUserQuery, findUserQuery } from "../../database/queries/auth";

const signupController = async (request: Request, response: Response) => {
  // Data validation
  const { name, email, password, confirmationPassword } = request.body;
  await signupValidation({ name, email, password, confirmationPassword });

  // Check if user already exists
  const doesUserExist = await findUserQuery(email);
  if (doesUserExist) throw new CustomError(422, "Email does already exists");

  // Hash password
  const hashedPassword = await hash(password, 12);

  // Create user
  const userInfo = await createUserQuery({
    name,
    email,
    password: hashedPassword,
  });

  // Generate a JWT token with the user details
  const token = await signToken(userInfo);

  // Send response
  response
    .status(200)
    .json({ status: 200, message: "User was created successfully", userInfo, token });
};

export default signupController;
