import { NextFunction, Response } from "express";
import CustomError from "../utils/CustomError";
import { verifyToken } from "../utils/jwt";

const userAuthentication = async (
  request: any,
  response: Response,
  next: NextFunction
) => {
  try {
    const { token } = request.cookies;

    if (!token) throw new CustomError(401, "Unauthenticated");

    const user = await verifyToken(token);

    request.user = user;
    next();
  } catch (error) {
    next(new CustomError(401, "Unauthenticated"));
  }
};

export default userAuthentication;
