const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

afterAll(() => {
  User.destroy({ truncate: true, cascade: true })
    .then(() => {
      sequelize.close();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("Authentication test", () => {
  it("Should be able to register", async () => {
    const response = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({ email: "test@mail.com", password: "rahasia" });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("test@mail.com");
  });

  it("Should be able to login", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "test@mail.com", password: "rahasia" });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("Should not be able to login when email is invalid", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "test-invalid@mail.com", password: "rahasia" });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthenticated");
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("Should not be able to login when password is invalid", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "test@mail.com", password: "rahasiaaaa" });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthenticated");
    expect(response.body.message).toBe("Invalid email or password");
  });
});
