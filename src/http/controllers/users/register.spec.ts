import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Register (e2e) ", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(() => {
    app.close();
  });
  it("Should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });
});
