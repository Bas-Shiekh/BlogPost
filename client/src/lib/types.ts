/**
 * Type definitions for the application
 */

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  commentCount: number;
  comments?: {
    author: { id: number; name: string};
    id: number;
    createdAt: string;
    content: string;
  }[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  blogId: string;
}
