import apiClient from "./api-client";
import type { Blog } from "./types";
import type {
  SearchField,
  SortField,
  SortOrder,
} from "../components/BlogSearchFilter";

export interface CreateBlogData {
  title: string;
  content: string;
  published?: boolean;
}

export interface UpdateBlogData {
  title: string;
  content: string;
  published?: boolean;
}

export interface BlogResponse {
  status: number;
  message: string;
  data: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    published: boolean;
    authorId: number;
  };
}

export interface BlogsResponse {
  status: number;
  data: Array<{
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    published: boolean;
    authorId: number;
    author: {
      id: number;
      name: string;
      email: string;
    };
    comments: Array<{
      id: number;
      content: string;
      createdAt: string;
      author: {
        id: number;
        name: string;
      };
    }>;
  }>;
}

export interface DeleteBlogResponse {
  status: number;
  message: string;
}

export interface BlogFilters {
  limit?: number;
  searchTerm?: string;
  searchField?: SearchField;
  sortField?: SortField;
  sortOrder?: SortOrder;
}

// Blog API functions
export const blogApi = {
  // Get all blog posts with filtering and sorting
  getBlogs: async (filters: BlogFilters = {}): Promise<Blog[]> => {
    try {
      console.log("Fetching blogs with filters:", filters);

      // Build query parameters
      const params: Record<string, string | number> = {};

      if (filters.limit) {
        params.limit = filters.limit;
      }

      if (filters.searchTerm) {
        params.search = filters.searchTerm;
        if (filters.searchField && filters.searchField !== "all") {
          params.searchField = filters.searchField;
        }
      }

      if (filters.sortField) {
        params.sortField = filters.sortField;
        params.sortOrder = filters.sortOrder || "desc";
      }

      const response = await apiClient.get<BlogsResponse>("/posts", { params });
      console.log("Blogs API response:", response.data);

      // Convert the response format to match our Blog type
      const blogs: Blog[] = response.data.data.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        content: item.content,
        excerpt: item.content.substring(0, 150) + "...",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt || item.createdAt,
        author: {
          id: item.author.id.toString(),
          name: item.author.name,
          avatar: undefined,
        },
        commentCount: item.comments?.length || 0,
      }));

      console.log("Processed blogs:", blogs);
      return blogs;
    } catch (error: any) {
      console.error(
        "Error fetching blogs:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get a specific blog post
  getBlog: async (id: string): Promise<Blog> => {
    try {
      console.log("Fetching blog with ID:", id);
      const response = await apiClient.get<{
        status: number;
        data: {
          id: number;
          title: string;
          content: string;
          createdAt: string;
          updatedAt: string;
          published: boolean;
          authorId: number;
          author: {
            id: number;
            name: string;
            email: string;
          };
          comments: Array<{
            id: number;
            content: string;
            createdAt: string;
            author: {
              id: number;
              name: string;
            };
          }>;
        };
      }>(`/posts/${id}`);

      console.log("Blog API response:", response.data);
      const item = response.data.data;

      // Convert the response format to match our Blog type
      const blog: Blog = {
        id: item.id.toString(),
        title: item.title,
        content: item.content,
        excerpt: item.content.substring(0, 150) + "...",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt || item.createdAt,
        author: {
          id: item.author.id.toString(),
          name: item.author.name,
          avatar: undefined,
        },
        commentCount: item.comments?.length || 0,
      };

      return blog;
    } catch (error: any) {
      console.error(
        `Error fetching blog ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create a new blog post
  createBlog: async (data: CreateBlogData): Promise<Blog> => {
    try {
      // Ensure published is set to true by default if not provided
      const blogData = {
        ...data,
        published: data.published !== undefined ? data.published : true,
      };

      const response = await apiClient.post<BlogResponse>("/posts", blogData);

      // Convert the response format to match our Blog type
      const blog: Blog = {
        id: response.data.data.id.toString(),
        title: response.data.data.title,
        content: response.data.data.content,
        excerpt: response.data.data.content.substring(0, 150) + "...",
        createdAt: response.data.data.createdAt,
        updatedAt: response.data.data.updatedAt || response.data.data.createdAt,
        author: {
          id: response.data.data.authorId.toString(),
          name: "", // We'll need to get this from the user context
          avatar: undefined,
        },
        commentCount: 0,
      };

      return blog;
    } catch (error: any) {
      console.error(
        "Error creating blog:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update an existing blog post
  updateBlog: async (id: string, data: UpdateBlogData): Promise<Blog> => {
    try {
      // Ensure published is set to true by default if not provided
      const blogData = {
        ...data,
        published: data.published !== undefined ? data.published : true,
      };

      const response = await apiClient.put<BlogResponse>(
        `/posts/${id}`,
        blogData
      );

      // Convert the response format to match our Blog type
      const blog: Blog = {
        id: response.data.data.id.toString(),
        title: response.data.data.title,
        content: response.data.data.content,
        excerpt: response.data.data.content.substring(0, 150) + "...",
        createdAt: response.data.data.createdAt,
        updatedAt: response.data.data.updatedAt || response.data.data.createdAt,
        author: {
          id: response.data.data.authorId.toString(),
          name: "", // We'll need to get this from the user context
          avatar: undefined,
        },
        commentCount: 0,
      };

      return blog;
    } catch (error: any) {
      console.error(
        `Error updating blog ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete a blog post
  deleteBlog: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<DeleteBlogResponse>(`/posts/${id}`);
    } catch (error: any) {
      console.error(
        `Error deleting blog ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
