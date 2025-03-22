import { Router } from "express";
import authRouter from "./auth";
import postRouter from "./post";
import commentRouter from "./comments";

const router = Router();

router.use("/", authRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);

export default router;
