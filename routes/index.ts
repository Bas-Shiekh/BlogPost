import { Router } from "express";
import postRouter from "./post";
import authRouter from "./auth";

const router = Router();

router.use("/user", authRouter);
router.use("/post", postRouter);

export default router;
