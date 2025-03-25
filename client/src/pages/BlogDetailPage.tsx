import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  fetchBlog,
  clearCurrentBlog,
  deleteBlog,
} from "../store/slices/blogSlice";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../store/slices/commentSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { formatDate } from "../lib/utils";
import CommentItem from "../components/CommentItem";
import { Pencil, Trash, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/AlertDialog";
import { Alert, AlertDescription } from "../components/ui/Alert";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get state from Redux
  const {
    currentBlog,
    error: blogError,
  } = useAppSelector((state) => state.blogs);
  const { comments, isLoading: isCommentsLoading } = useAppSelector(
    (state) => state.comments
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Local state
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch blog and comments when component mounts
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        await dispatch(fetchBlog(id)).unwrap();
        await dispatch(fetchComments(id)).unwrap();
      } catch (error) {
        console.error("Error loading blog data:", error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadData();

    // Cleanup function to clear current blog when component unmounts
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [id, dispatch]);

  // Check if the current user is the author of the blog
  const isAuthor = user?.id === currentBlog?.author.id;

  const validateComment = () => {
    setCommentError(null);

    if (!commentText.trim()) {
      setCommentError("Comment cannot be empty");
      return false;
    }

    if (commentText.length < 3) {
      setCommentError("Comment must be at least 3 characters");
      return false;
    }

    return true;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingComment || !id) return;

    if (!validateComment()) return;

    try {
      setIsCreatingComment(true);
      // Use direct dispatch to create comment
      await dispatch(
        createComment({ blogId: id, content: commentText })
      ).unwrap();
      setCommentText("");
      setCommentError(null);
    } catch (error: any) {
      console.error("Error creating comment:", error);
      setCommentError(error || "Failed to post comment. Please try again.");
    } finally {
      setIsCreatingComment(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!id) return;
    setDeleteError(null);

    try {
      setIsDeleting(true);
      // Use direct dispatch to delete blog
      await dispatch(deleteBlog(id)).unwrap();
      navigate("/blogs");
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      setDeleteError(error || "Failed to delete blog. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading state only on initial load
  if (isInitialLoad) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Show error state
  if (blogError) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{blogError}</AlertDescription>
      </Alert>
    );
  }

  // Show not found state
  if (!currentBlog) {
    return (
      <div className="text-center py-12">
        <p>Blog not found</p>
        <Button className="mt-4" onClick={() => navigate("/blogs")}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <article className="space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold">{currentBlog.title}</h1>

          {isAuthor && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/blogs/edit/${id}`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={currentBlog.author.avatar}
              alt={currentBlog.author.name}
            />
            <AvatarFallback>{currentBlog.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{currentBlog.author.name}</span>
          <span>•</span>
          <span>{formatDate(currentBlog.createdAt)}</span>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {currentBlog.content.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            {commentError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{commentError}</AlertDescription>
              </Alert>
            )}
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="mb-2"
              rows={3}
            />
            <Button type="submit" disabled={isCreatingComment}>
              {isCreatingComment ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        ) : (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p>Please log in to leave a comment.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link to="/auth/login">Login</Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {isCommentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onUpdate={(commentId, content) => {
                    return dispatch(updateComment({ commentId, content }));
                  }}
                  onDelete={(commentId) => {
                    return dispatch(deleteComment(commentId));
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete blog confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog? This action cannot be
              undone and all comments will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteBlog();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
