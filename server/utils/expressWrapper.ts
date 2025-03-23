import { NextFunction, Request, Response } from "express";

import CustomError from "./CustomError";

const expressWrapper =
  (controller: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        error.status = 422;
        error.message = error.details[0].message;
      } else if (error.name === "JsonWebTokenError") {
        error.status = 401;
        error.message = "Unauthorized: No user provided";
      }
      next(new CustomError(error.status, error.message));
    }
  };

export default expressWrapper;
