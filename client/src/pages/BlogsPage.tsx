import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../hooks";
import { Button } from "../components/ui/Button";
import BlogList from "../components/BlogList";

const BlogsPage = () => {
  const { blogs, isLoading, fetchBlogs } = useBlog();

  useEffect(() => {
    // Immediately invoke the function to fetch blogs
    const fetchData = async () => {
      try {
        await fetchBlogs();
      } catch (error) {
        console.error("Error fetching blogs in BlogsPage:", error);
      }
    };

    fetchData();
  }, [fetchBlogs]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Blogs</h1>
        <Button asChild>
          <Link to="/blogs/new">Create New Blog</Link>
        </Button>
      </div>
      <BlogList blogs={blogs} isLoading={isLoading} />
    </div>
  );
};

export default BlogsPage;
