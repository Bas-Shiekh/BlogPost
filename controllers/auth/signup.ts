import { NextFunction, Request, Response } from "express";
import { signupValidation } from "../../validation";
import { hash } from "bcryptjs";
import CustomError from "../../utils/CustomError";
import { signToken } from "../../utils/jwt";
import { createUserQuery, findUserQuery } from "../../queries/auth";

const signupController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmationPassword } = request.body;
    await signupValidation({ name, email, password, confirmationPassword });
    const doesUserExist = await findUserQuery(email);
    if (doesUserExist) throw new CustomError(422, "Email does already exists");

    const hashedPassword = await hash(password, 12);

    const userData = await createUserQuery({
      name,
      email,
      password: hashedPassword,
    });

    const token = await signToken({
      id: userData.id,
      name: userData.name,
      email: userData.email,
    });

    response.cookie("token", token).status(200).json({
      status: 200,
      message: "User was created successfully",
      data: userData,
    });
  } catch (error) {
    if (error.name === "ValidationError")
      next(new CustomError(400, error.details[0].message));
    else next(error);
  }
};

244088;
export default signupController;
