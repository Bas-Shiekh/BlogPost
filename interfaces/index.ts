import { Request } from "express";

interface signupInterface {
  name: string
  email: string;
  password: string;
  confirmationPassword: string;
}

interface loginInterface {
  email: string;
  password: string;
}

interface createUserInterface {
  name: string;
  email: string;
  password: string;
}

interface PayloadInterface {
  id: number;
  name: string;
  email: string;
}

interface CustomRequest extends Request {
  user?: {
    id?: number;
    name?: string;
    email?: string;
  };
}

interface CreatePostInterface {
  title: string;
  content: string;
  authorId?: number;
}

export {
  signupInterface,
  loginInterface,
  createUserInterface,
  PayloadInterface,
  CustomRequest,
  CreatePostInterface,
};