import { Request, Response } from "express";

const logoutController = (request: Request, response: Response) => {
  response.clearCookie("token");
  response.json({ status: 200, message: "Logged out successfully" });
};

export default logoutController;
