import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverError from "./controllers/errors/internalServerError";
import notFound from "./controllers/errors/notFound";
import authRouter from "./routes/auth";

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

app.set("port", 8080);

app.use(serverError);
app.use(notFound);

export default app;
