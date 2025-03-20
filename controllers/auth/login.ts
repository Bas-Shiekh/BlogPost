import { NextFunction, Request, Response } from "express";
import { compare } from "bcryptjs";
import CustomError from "../../utils/CustomError";
import { signToken } from "../../utils/jwt";
import { loginValidation } from "../../validation";
import { findUserQuery } from "../../queries/auth";

const loginController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = request.body;
    await loginValidation({ email, password });

    const userData = await findUserQuery(email);

    if (!userData) throw new CustomError(400, "Incorrect username or password");

    const isCompareSuccess = await compare(password, userData.password);

    if (!isCompareSuccess)
      throw new CustomError(400, "Incorrect username or password");

    const token = await signToken({
      id: userData.id,
      name: userData.name,
      email: userData.email,
    });

    response.cookie("token", token, { httpOnly: true }).status(200).json({
      status: 200,
      message: "You logged in successfully",
      data: userData,
    });
  } catch (error) {
    if (error.name === "ValidationError")
      next(new CustomError(400, error.details[0].message));
    else next(error);
  }
};

export default loginController;
