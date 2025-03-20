import prisma from "../../database/connection";
import { createUserInterface } from "../../interfaces";

// run inside `async` function
const createUserQuery = ({ name, email, password }: createUserInterface) =>
  prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

const findUserQuery = (email: string) =>
  prisma.user.findUnique({
    where: {
      email,
    },
  });

export { createUserQuery, findUserQuery };
