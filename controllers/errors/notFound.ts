import { Request, Response, NextFunction } from "express";

const notFound = (request: Request, response: Response, next: NextFunction) => {
  response.status(404).json({ message: "Route is not found!" });
};

export default notFound;
