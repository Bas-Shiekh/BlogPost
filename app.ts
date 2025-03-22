import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverError from "./utils/errors/internalServerError";
import notFound from "./utils/errors/notFound";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import commentRouter from "./routes/comments";
const app = express();

app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable("x-powered-by");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1", authRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.set("port", 8000);

app.use(serverError);
app.use(notFound);

export default app;
