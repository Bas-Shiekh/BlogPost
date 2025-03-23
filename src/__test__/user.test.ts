import request from "supertest";

import app from "../app";
import buildModels from "../database/build";
import prisma from "../database/connection";

beforeAll(() => buildModels());
afterAll(async () => {
  return await prisma.$disconnect();
});

describe("Validations tests should return errors messages to the user", () => {
  test("when user not enters name", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({})
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Name is required");
      });
  });

  test("when user not enters email", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({ name: "basil alsheikh" })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Email is required");
      });
  });

  test("when user enters not valid email", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({ name: "basil alsheikh", email: "basilelshakhe@gmailcom" })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Email must be a valid email");
      });
  });

  test("when user enters data without password", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({ name: "basil alsheikh", email: "basilelshakhe@gmail.com" })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Password is required");
      });
  });

  test("when user enters data with less than 5 characters password", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({
        name: "basil alsheikh",
        email: "basilelshakhe@gmail.com",
        password: "bas",
      })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual(
          "Password must be at least 5 characters long"
        );
      });
  });

  test("when user enters data with more than 15 characters password", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({
        name: "basil alsheikh",
        email: "basilelshakhe@gmail.com",
        password: "basilbasilbasilbasilbasilbasil",
      })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual(
          "Password must not exceed 15 characters"
        );
      });
  });

  test("when user enters data without confirmation password", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({
        name: "basil alsheikh",
        email: "basilelshakhe@gmail.com",
        password: "basil",
      })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual(
          '"confirmationPassword" is required'
        );
      });
  });

  test("when user enters data without confirmation password", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({
        name: "basil alsheikh",
        email: "basilelshakhe@gmail.com",
        password: "basil",
        confirmationPassword: "basil100",
      })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual(
          "Confirmation password must match the password"
        );
      });
  });

  test("when user login with empty email", async () => {
    await request(app)
      .post("/api/v1/login")
      .send({
        email: "",
        password: "basil",
      })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Email is required");
      });
  });

  test("when user login with not valid email", async () => {
    await request(app)
      .post("/api/v1/login")
      .send({
        email: "basilelshakhe@gmailcom",
        password: "basil",
      })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Email must be a valid email");
      });
  });

  test("when user login without password", async () => {
    await request(app)
      .post("/api/v1/login")
      .send({
        email: "basilelshakhe@gmail.com",
        password: "",
      })
      .expect(422)
      .expect((response) => {
        expect(response.body.message).toEqual("Password is required");
      });
  });

  test("when user login with invalid email or password", async () => {
    await request(app)
      .post("/api/v1/login")
      .send({
        email: "basilelshakhe@gmail.com",
        password: "basil200000",
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual("Incorrect email or password");
      });
  });

  test("when not has a token in cookies", async () => {
    await request(app)
      .get("/api/v1/auth")
      .set("Cookie", `token=`)
      .expect(401)
      .expect((response) => {
        expect(response.body.message).toEqual("Unauthenticated");
      });
  });

  test("when token not valid in cookies", async () => {
    await request(app)
      .get("/api/v1/auth")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJiYXNpZWxzaGFraGVAZ21haWwuY29tIiwibmFtZSI6ImJhc2lsIGFsc2hlaWtoIiwicGFzc3dvcmQiOiIkMmIkMTIkUFFoV0EuZjUvU2d5R041TUQxTGdvT3JPVllXY1c4S1RlZEpHNGdZRUVWSHN1blV6OU9ReGUiLCJpYXQiOjE3NDI2MzcxMzd9.5yXqFnkZgeP8pb3GsoUsWgvcI9cMArbntdjppeRmS3As`
      )
      .expect(401)
      .expect((response) => {
        expect(response.body.message).toEqual("Unauthorized: No user provided");
      });
  });

  test("when user logout", async () => {
    await request(app)
      .post("/api/v1/logout")
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual("Logged out successfully");
      });
  });
});

afterAll(() => prisma.$disconnect());
