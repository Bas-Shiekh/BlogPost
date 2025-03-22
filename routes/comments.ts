import { Router } from "express";
import { createComment, getCommentsByPost, updateComment, deleteComment } from "../controllers/comment";
import userAuthentication from "../middlewares/useAuth";

const commentRouter = Router();

// For a given post, you might use the postId as part of the URL:
// Create a comment on a specific post
commentRouter.post("/:postId", userAuthentication, createComment);

// Get all comments for a specific post
commentRouter.get("/:postId", getCommentsByPost);

// Update a specific comment
commentRouter.put("/:commentId", userAuthentication, updateComment);

// Delete a specific comment
commentRouter.delete("/:commentId", userAuthentication, deleteComment);

export default commentRouter;
