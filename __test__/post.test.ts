import request from "supertest";

import app from "../app";
import buildModels from "../database/build";
import prisma from "../database/connection";

beforeAll(() => buildModels());
afterAll(async () => {
  return await prisma.$disconnect();
});

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJiYXNpZWxzaGFraGVAZ21haWwuY29tIiwibmFtZSI6ImJhc2lsIGFsc2hlaWtoIiwicGFzc3dvcmQiOiIkMmIkMTIkUFFoV0EuZjUvU2d5R041TUQxTGdvT3JPVllXY1c4S1RlZEpHNGdZRUVWSHN1blV6OU9ReGUiLCJpYXQiOjE3NDI2NDc1ODZ9.0sxBZ2spPfQ0ZrdIm1sMLw_txBboRT9rzoAHaKGr-X8";

describe("Validations tests should return errors messages to the user", () => {
  test("when user create a post without enters data", async () => {
    await request(app)
      .post("/api/v1/posts/")
      .set("Cookie", token)
      .send({})
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Name is required");
      });
  });
});

afterAll(() => prisma.$disconnect());
