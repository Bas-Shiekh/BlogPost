import { NextFunction, Response } from "express";
import CustomError from "../utils/CustomError";
import { verifyToken } from "../utils/jwt";

const userAuthentication = async (
  request: any,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) throw new CustomError(401, "Unauthenticated");

  const user = await verifyToken(token);

  request.user = user;
  next();
};

export default userAuthentication;
