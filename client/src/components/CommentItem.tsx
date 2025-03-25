import { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import type { Comment } from "../lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { formatDate } from "../lib/utils";
import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/AlertDialog";
import { Alert, AlertDescription } from "./ui/Alert";

interface CommentItemProps {
  comment?: Comment;
  onUpdate: (commentId?: string, content?: string) => Promise<any>;
  onDelete: (commentId?: string) => Promise<any>;
}

export default function CommentItem({
  comment,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayName, setDisplayName] = useState(
    comment?.author.name || "Anonymous"
  );

  // Effect to update display name if it's the current user's comment
  useEffect(() => {
    // If the comment has no author name but belongs to the current user
    if (
      (!comment?.author.name || comment.author.name === "") &&
      user?.id === Number(comment?.author.id)
    ) {
      setDisplayName(user.name);
    } else if (comment?.author.name) {
      setDisplayName(comment.author.name);
    }
  }, [comment, user]);

  // Check if the current user is the author of the comment
  const isAuthor = user?.id === Number(comment?.author.id);

  const validateComment = () => {
    setError(null);

    if (!editedContent?.trim()) {
      setError("Comment cannot be empty");
      return false;
    }

    if (editedContent.length < 3) {
      setError("Comment must be at least 3 characters");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    // Skip update if content hasn't changed
    if (editedContent?.trim() === comment?.content) {
      setIsEditing(false);
      return;
    }

    if (!validateComment()) return;

    try {
      setIsUpdating(true);
      await onUpdate(comment ? comment.id : '', editedContent);
      setIsEditing(false);
      setError(null);
    } catch (error: any) {
      console.error("Error updating comment:", error);
      setError(error || "Failed to update comment. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setError(null);

    try {
      setIsDeleting(true);
      await onDelete(comment?.id);
      setShowDeleteDialog(false);
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      setError(error || "Failed to delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={comment?.author.avatar} alt={displayName} />
        <AvatarFallback>{displayName.charAt(0) || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{displayName}</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(comment ? comment?.createdAt : '')}
            </span>
          </div>

          {isAuthor && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            {error && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment?.content);
                  setError(null);
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{comment?.content}</p>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
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
