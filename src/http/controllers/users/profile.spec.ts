import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("profile (e2e) ", () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(() => {
    app.close();
  });
  it("Should be able get users profile", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();
    console.log("oi", profileResponse.body);
    expect(profileResponse.statusCode).toEqual(200);

    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: "johndoe@example.com",
      })
    );
  });
});
