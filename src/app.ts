import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverError from "./utils/errors/internalServerError";
import notFound from "./utils/errors/notFound";
import router from "./routes";
const app = express();

app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable("x-powered-by");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/v1", router);

app.set("port", 8000);

app.use(serverError);
app.use(notFound);

export default app;
