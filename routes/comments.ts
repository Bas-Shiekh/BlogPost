import { Router } from "express";
import { createComment, getCommentsByPost, updateComment, deleteComment } from "../controllers/comment";
import userAuthentication from "../middlewares/useAuth";
import expressWrapper from "../utils/expressWrapper";

const commentRouter = Router();

// For a given post, you might use the postId as part of the URL:
// Create a comment on a specific post
commentRouter.post(
  "/:postId",
  expressWrapper(userAuthentication),
  expressWrapper(createComment)
);

// Get all comments for a specific post
commentRouter.get("/:postId", expressWrapper(getCommentsByPost));

// Update a specific comment
commentRouter.put("/:commentId", expressWrapper(userAuthentication), expressWrapper(updateComment));

// Delete a specific comment
commentRouter.delete("/:commentId", expressWrapper(userAuthentication), expressWrapper(deleteComment));

export default commentRouter;
