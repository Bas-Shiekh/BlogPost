import { NextFunction, Response } from "express";
import CustomError from "../utils/CustomError";
import { verifyToken } from "../utils/jwt";
import { CustomRequest } from "../interfaces";

const userAuthentication = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { token } = request.cookies;

    if (!token) throw new CustomError(401, "Unauthenticated");

    const user = await verifyToken(token);
    if (user) request.user = user;
    next();
  } catch (error) {
    next(new CustomError(401, "Unauthenticated"));
  }
};

export default userAuthentication;
