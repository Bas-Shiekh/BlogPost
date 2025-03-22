import { Request } from "express";

export interface signupInterface {
  name: string;
  email: string;
  password: string;
  confirmationPassword: string;
}

export interface loginInterface {
  email: string;
  password: string;
}

export interface createUserInterface {
  name: string;
  email: string;
  password: string;
}

export interface PayloadInterface {
  id: number;
  name: string;
  email: string;
}

// Define the shape of the request body for creating a post
export interface CreatePostInterface {
  title: string;
  content?: string;
  published?: boolean;
  authorId: number;
}

// Extend Express Request to include an optional `user` and a generic body type
export interface IRequest<T = any> extends Request {
  user?: PayloadInterface;
  body: T;
}

export interface UpdatePostInterface {
  title?: string;
  content?: string;
  published?: boolean;
}

export interface PostQuery {
  search?: string;
  sortField?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateCommentInterface {
  content: string;
  postId: number;
  authorId: number;
}

export interface UpdateCommentInterface {
  content?: string;
}