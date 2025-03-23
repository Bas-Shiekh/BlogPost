import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

const serverError: ErrorRequestHandler = (error, request, response, next) => {
  response.status(error.status || 500).json({ message: error.message || "Internal server error!" });
}

export default serverError;