import request from "supertest";
import app from "../src/index";

describe("Ping test", () => {
  it("GET /ping should pong", async () => {
    const response = await request(app).get("/ping");
    expect(response.status).toBe(200);
  });
});
