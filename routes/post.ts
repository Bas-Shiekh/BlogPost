// BlogPost/routes/post.ts
import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post";
import userAuthentication from "../middlewares/useAuth";
import expressWrapper from "../utils/expressWrapper";

const postRouter = Router();

// Public routes
postRouter.get("", expressWrapper(getAllPosts));
postRouter.get("/:id", expressWrapper(getPostById));

// Protected routes (require authentication)
postRouter.post("/", expressWrapper(userAuthentication), expressWrapper(createPost));
postRouter.put("/:id", expressWrapper(userAuthentication), expressWrapper(updatePost));
postRouter.delete("/:id", expressWrapper(userAuthentication), expressWrapper(deletePost));

export default postRouter;