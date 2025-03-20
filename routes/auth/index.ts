import { Response, Router } from "express";
import {
  logoutController,
  loginController,
  signupController,
} from "../../controllers/auth";
import userAuthentication from "../../middlewares/useAuth";

const authRouter = Router();

authRouter.post("/login", loginController);

authRouter.post("/signup", signupController);

authRouter.post("/logout", logoutController);

authRouter.get(
  "/auth",
  userAuthentication,
  (request: any, response: Response) => {
    response.json({ status: 200, data: request.user });
  }
);

export default authRouter;
