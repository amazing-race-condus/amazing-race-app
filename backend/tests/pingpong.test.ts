import request from "supertest";
import { app, server, prisma } from "../src/index";

describe("Ping test", () => {
  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  it("GET /ping should pong", async () => {
    const response = await request(app).get("/ping");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Pongee!");
  })
})
