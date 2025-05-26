import request from "supertest"
import { app, server, prisma } from "../src/index"
import { Type } from "@prisma/client"

const initialCheckpoints = [
  {
    name: "Oodi",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Tripla",
    type: "INTERMEDIATE",
  },
];

describe("Get checkpoints", () => {
  beforeEach(async () => {
    await prisma.checkpoint.deleteMany({});
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  it("checkpoints are returned as json", async () => {
    const response = await request(app).get("/api/checkpoints");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });

  it("all checkpoints are returned", async () => {
    const response = await request(app).get("/api/checkpoints");
    expect(response.body.length).toBe(initialCheckpoints.length);
  });
});