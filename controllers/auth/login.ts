import { Request, Response } from "express";
import { compare } from "bcryptjs";
import CustomError from "../../utils/CustomError";
import { signToken } from "../../utils/jwt";
import { loginValidation } from "../../validation";
import { findUserQuery } from "../../database/queries/auth";

const loginController = async (
  request: Request,
  response: Response
) => {
  // Data validation
  const { email, password } = request.body;
  await loginValidation({ email, password });

  // Find user
  const userInfo = await findUserQuery(email);

  if (!userInfo) throw new CustomError(400, "Incorrect email or password");

  // Compare password
  const isPasswordCorrect = await compare(password, userInfo.password);

  if (!isPasswordCorrect)
    throw new CustomError(400, "Incorrect email or password");

  // Generate token
  const token = await signToken(userInfo);

  // Send response
  response
    .cookie("token", token, { httpOnly: true })
    .status(200)
    .json({ status: 200, message: "You logged in successfully", userInfo });
};

export default loginController;
