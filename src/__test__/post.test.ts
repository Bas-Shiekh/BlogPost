import request from "supertest";

import app from "../app";
import buildModels from "../database/build";
import prisma from "../database/connection";
import { signToken } from "../utils/jwt";

let token: any = "";

beforeAll(async () => {
  await buildModels();

  await prisma.user.deleteMany({ where: { email: "test@example.com" } });
  const user = await prisma.user.create({
    data: {
      name: "basil",
      email: "test@example.com",
      password: "hashedpassword", // Ensure this matches hashing logic
    },
    select: {
      name: true,
      email: true,
      id: true,
    },
  });

  token = await signToken(user);
});
afterAll(async () => {
  return await prisma.$disconnect();
});

describe("Validations tests should return errors messages to the user", () => {
  test("when user create a post without enters data", async () => {
    await request(app)
      .post("/api/v1/posts/")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Title is required");
      });
  });

  test("when user create a post with title", async () => {
    await request(app)
      .post("/api/v1/posts/")
      .set("Authorization", `Bearer ${token}`)
      .send({title: "first title from test"})
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Content is required");
      });
  });

  test("when user create a post with valid data", async () => {
    await request(app)
      .post("/api/v1/posts/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "first title from test",
        content: "first content from test to first post",
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.message).toEqual("Post created successfully");
      });
  });
});

afterAll(() => prisma.$disconnect());
