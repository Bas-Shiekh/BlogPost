import prisma from "../connection";
import { createUserInterface } from "../../interfaces";

// run inside `async` function
export const createUserQuery = ({ name, email, password }: createUserInterface) =>
  prisma.user.create({
    data: {
      name,
      email,
      password,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

export const findUserQuery = (email: string) =>
  prisma.user.findUnique({
    where: {
      email,
    },
  });