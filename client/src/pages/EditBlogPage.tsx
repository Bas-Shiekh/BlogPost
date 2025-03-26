import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlog, useAuth } from "../hooks";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { Skeleton } from "../components/ui/Skeleton";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { AlertCircle } from "lucide-react";

const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentBlog,
    isLoading: isFetching,
    error: blogError,
    fetchBlog,
    updateBlog,
  } = useBlog();
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    content?: string;
  }>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch blog data
  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id, fetchBlog]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  // Set form values when blog data is loaded
  useEffect(() => {
    if (currentBlog && !isInitialized) {
      setTitle(currentBlog.title);
      setContent(currentBlog.content);
      setIsInitialized(true);
    }
  }, [currentBlog, isInitialized]);

  // Check if the current user is the author of the blog
  const isAuthor = user?.id === currentBlog?.author.id;

  // Redirect if the user is not the author
  useEffect(() => {
    if (currentBlog && !isAuthor && isAuthenticated) {
      navigate(`/blogs/${id}`);
    }
  }, [currentBlog, isAuthor, isAuthenticated, id, navigate]);

  const validateForm = () => {
    const errors: {
      title?: string;
      content?: string;
    } = {};
    let isValid = true;

    // Reset errors
    setValidationErrors({});
    setError(null);

    // Title validation
    if (!title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    } else if (title.length < 5) {
      errors.title = "Title must be at least 5 characters";
      isValid = false;
    }

    // Content validation
    if (!content.trim()) {
      errors.content = "Content is required";
      isValid = false;
    } else if (content.length < 20) {
      errors.content = "Content must be at least 20 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating || !id) return;

    if (!validateForm()) return;

    try {
      setIsUpdating(true);
      await updateBlog(id, {
        title,
        content,
        published: true,
      });
      navigate(`/blogs/${id}`);
    } catch (error: any) {
      setError(error || "Failed to update blog. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-1/4" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (blogError) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{blogError}</AlertDescription>
      </Alert>
    );
  }

  if (!currentBlog) {
    return <div className="text-center py-12">Blog not found</div>;
  }

  if (!isAuthor && isAuthenticated) {
    return (
      <div className="text-center py-12">
        You don't have permission to edit this blog
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
          <CardDescription>Make changes to your blog post</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter your blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {validationErrors.title && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px]"
                required
              />
              {validationErrors.content && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.content}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/blogs/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditBlogPage;
