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

const postRouter = Router();

// Public routes
postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);

// Protected routes (require authentication)
postRouter.post("/", userAuthentication, createPost);
postRouter.put("/:id", userAuthentication, updatePost);
postRouter.delete("/:id", userAuthentication, deletePost);

export default postRouter;