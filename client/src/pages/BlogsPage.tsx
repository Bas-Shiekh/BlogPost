import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../hooks";
import { Button } from "../components/ui/Button";
import BlogList from "../components/BlogList";
import BlogSearchFilter, {
  type SearchFilters,
} from "../components/BlogSearchFilter";

const BlogsPage = () => {
  const { blogs, isLoading, fetchBlogs, filters, updateFilters } = useBlog();
  const [searchApplied, setSearchApplied] = useState(false);

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
    // Only run this effect once on mount
  }, [fetchBlogs]);

  const handleFilterChange = useCallback(
    async (newFilters: SearchFilters) => {
      setSearchApplied(!!newFilters.searchTerm);
      await updateFilters(newFilters);
    },
    [updateFilters]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Blogs</h1>
        <Button asChild>
          <Link to="/blogs/new">Create New Blog</Link>
        </Button>
      </div>

      <BlogSearchFilter
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {searchApplied && blogs.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No blogs found matching your search criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              handleFilterChange({
                searchTerm: "",
                searchField: "all",
                sortField: "createdAt",
                sortOrder: "desc",
              })
            }
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <BlogList blogs={blogs} isLoading={isLoading} />
      )}
    </div>
  );
};

export default BlogsPage;
