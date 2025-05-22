import request from "supertest"
import { app, server, prisma } from "../src/index"

describe("Get checkpoints", () => {
  afterAll(async () => {
    await prisma.$disconnect()
    server.close()
  })

  it("checkpoints are returned as json", async () => {
    const response = await request(app).get("/checkpoints")
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })
})
