import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  blogApi,
  type CreateBlogData,
  type UpdateBlogData,
  type BlogFilters,
} from "../../lib/blog-api";
import type { Blog } from "../../lib/types";
import { addToast } from "./toastSlice";

/**
 * Blog state interface
 */
interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;
  filters: BlogFilters;
}

/**
 * Initial blog state
 */
const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  filters: {
    sortField: "createdAt",
    sortOrder: "desc",
  },
};

/**
 * Fetch blogs async thunk
 */
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (
    filters: BlogFilters = {},
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      // Get current filters from state and merge with new filters
      const state = getState() as { blogs: BlogState };
      const mergedFilters = { ...state.blogs.filters, ...filters };

      console.log("Fetching blogs with filters:", mergedFilters);
      const blogs = await blogApi.getBlogs(mergedFilters);
      console.log("Fetched blogs:", blogs);
      return { blogs, filters: mergedFilters };
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      dispatch(
        addToast({
          title: "Failed to fetch blogs",
          description:
            error.response?.data?.message ||
            "An error occurred while fetching blogs",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs."
      );
    }
  }
);

/**
 * Fetch blog async thunk
 */
export const fetchBlog = createAsyncThunk(
  "blogs/fetchBlog",
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log("Fetching blog with ID:", id);

      // First check if the blog is already in the blogs array
      const state = getState() as { blogs: BlogState };
      const existingBlogInList = state.blogs.blogs.find(
        (blog) => blog.id === id
      );

      if (existingBlogInList) {
        console.log("Blog found in existing list, using cached data");
        return existingBlogInList;
      }

      // If not in the list, fetch from API
      const blog = await blogApi.getBlog(id);
      console.log("Fetched blog from API:", blog);
      return blog;
    } catch (error: any) {
      console.error("Error fetching blog:", error);
      dispatch(
        addToast({
          title: "Failed to fetch blog",
          description:
            error.response?.data?.message ||
            "An error occurred while fetching the blog",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog."
      );
    }
  }
);

/**
 * Create blog async thunk
 */
export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (data: CreateBlogData, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log("Creating blog with data:", data);
      const blog = await blogApi.createBlog({
        ...data,
        published: true,
      });
      console.log("Blog created successfully:", blog);

      // Add author information from auth state
      const state = getState() as { auth: { user: any } };
      if (state.auth.user) {
        blog.author.name = state.auth.user.name;
      }

      dispatch(
        addToast({
          title: "Blog created",
          description: "Your blog has been published successfully",
        })
      );

      return blog;
    } catch (error: any) {
      console.error("Error creating blog:", error);
      dispatch(
        addToast({
          title: "Failed to create blog",
          description:
            error.response?.data?.message ||
            "An error occurred while creating the blog",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to create blog."
      );
    }
  }
);

/**
 * Update blog async thunk
 */
export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async (
    { id, data }: { id: string; data: UpdateBlogData },
    { rejectWithValue, dispatch }
  ) => {
    try {
      console.log("Updating blog with ID:", id, "and data:", data);
      const blog = await blogApi.updateBlog(id, {
        ...data,
        published: true,
      });
      console.log("Blog updated successfully:", blog);

      dispatch(
        addToast({
          title: "Blog updated",
          description: "Your blog has been updated successfully",
        })
      );

      return blog;
    } catch (error: any) {
      console.error("Error updating blog:", error);
      dispatch(
        addToast({
          title: "Failed to update blog",
          description:
            error.response?.data?.message ||
            "An error occurred while updating the blog",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to update blog."
      );
    }
  }
);

/**
 * Delete blog async thunk
 */
export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      console.log("Deleting blog with ID:", id);
      await blogApi.deleteBlog(id);
      console.log("Blog deleted successfully");

      dispatch(
        addToast({
          title: "Blog deleted",
          description: "Your blog has been deleted successfully",
        })
      );

      return id;
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      dispatch(
        addToast({
          title: "Failed to delete blog",
          description:
            error.response?.data?.message ||
            "An error occurred while deleting the blog",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to delete blog."
      );
    }
  }
);

/**
 * Blog slice for Redux
 */
const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    setCurrentBlog: (state, action: PayloadAction<Blog>) => {
      state.currentBlog = action.payload;
    },
    setFilters: (state, action: PayloadAction<BlogFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch Blogs
    builder.addCase(fetchBlogs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchBlogs.fulfilled,
      (
        state,
        action: PayloadAction<{ blogs: Blog[]; filters: BlogFilters }>
      ) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.filters = action.payload.filters;
      }
    );
    builder.addCase(fetchBlogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Single Blog
    builder.addCase(fetchBlog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchBlog.fulfilled,
      (state, action: PayloadAction<Blog>) => {
        state.isLoading = false;
        state.currentBlog = action.payload;

        // Also update the blog in the blogs array if it exists
        const index = state.blogs.findIndex(
          (blog) => blog.id === action.payload.id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        } else {
          // Add to blogs array if not already there
          state.blogs.push(action.payload);
        }
      }
    );
    builder.addCase(fetchBlog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Blog
    builder.addCase(createBlog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      createBlog.fulfilled,
      (state, action: PayloadAction<Blog>) => {
        state.isLoading = false;
        state.currentBlog = action.payload;

        // Add to blogs array if not already there
        if (!state.blogs.some((blog) => blog.id === action.payload.id)) {
          state.blogs.unshift(action.payload);
        }
      }
    );
    builder.addCase(createBlog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Blog
    builder.addCase(updateBlog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      updateBlog.fulfilled,
      (state, action: PayloadAction<Blog>) => {
        state.isLoading = false;
        state.currentBlog = action.payload;

        // Update in blogs array
        state.blogs = state.blogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog
        );
      }
    );
    builder.addCase(updateBlog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Blog
    builder.addCase(deleteBlog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      deleteBlog.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.isLoading = false;

        // Remove from blogs array
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);

        // Clear current blog if it's the one being deleted
        if (state.currentBlog?.id === action.payload) {
          state.currentBlog = null;
        }
      }
    );
    builder.addCase(deleteBlog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearBlogError, clearCurrentBlog, setCurrentBlog, setFilters } =
  blogSlice.actions;
export default blogSlice.reducer;
