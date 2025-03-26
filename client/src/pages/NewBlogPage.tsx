"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "../components/ui/Alert";
import { AlertCircle } from "lucide-react";

const NewBlogPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    content?: string;
  }>({});

  const navigate = useNavigate();
  const { createBlog, isLoading } = useBlog();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

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
    if (isLoading) return;

    if (!validateForm()) return;

    try {
      const result = await createBlog({
        title,
        content,
        published: true,
      });

      // Add a small delay before navigation to ensure Redux state is updated
      setTimeout(() => {
        navigate(`/blogs/${result.id}`);
      }, 100);
    } catch (error: any) {
      console.error("Error creating blog:", error);
      setError(error || "Failed to create blog. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog</CardTitle>
          <CardDescription>
            Share your thoughts with the community
          </CardDescription>
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
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Blog"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewBlogPage;
