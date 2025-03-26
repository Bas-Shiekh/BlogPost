"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../hooks";
import { Button } from "../components/ui/Button";
import BlogList from "../components/BlogList";

const HomePage = () => {
  const { blogs, isLoading, fetchBlogs } = useBlog();

  useEffect(() => {
    // Immediately invoke the function to fetch blogs
    const fetchData = async () => {
      try {
        await fetchBlogs(3);
      } catch (error) {
        console.error("Error fetching blogs in HomePage:", error);
      }
    };

    fetchData();
  }, [fetchBlogs]);

  return (
    <div className="space-y-8">
      <section className="py-12 text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Blog App</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share your thoughts, read interesting articles, and engage with the
          community.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link to="/blogs">Browse Blogs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/auth/login">Get Started</Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Blogs</h2>
          <Button asChild variant="ghost">
            <Link to="/blogs">View All</Link>
          </Button>
        </div>
        <BlogList blogs={blogs} isLoading={isLoading} />
      </section>
    </div>
  );
};

export default HomePage;
