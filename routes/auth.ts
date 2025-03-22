import { Response, Router } from "express";
import {
  logoutController,
  loginController,
  signupController,
} from "../controllers/auth";
import userAuthentication from "../middlewares/useAuth";
import expressWrapper from "../utils/expressWrapper";

const authRouter = Router();

authRouter.post("/login", expressWrapper(loginController));

authRouter.post("/signup", expressWrapper(signupController));

authRouter.post("/logout", expressWrapper(logoutController));

authRouter.get(
  "/auth",
  expressWrapper(userAuthentication),
  expressWrapper((request: any, response: Response) => {
    response.json({ status: 200, data: request.user });
  })
);

export default authRouter;
