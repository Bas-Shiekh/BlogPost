import { Router } from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getSpecificPost,
} from "../../controllers/post";

import userAuthentication from "../../middlewares/useAuth";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.post("/create", userAuthentication, createPost);
postRouter.put("/update/:id", userAuthentication, updatePost);
postRouter.delete("/delete/:id", userAuthentication, deletePost);
postRouter.get("/:id", getSpecificPost);

export default postRouter;
