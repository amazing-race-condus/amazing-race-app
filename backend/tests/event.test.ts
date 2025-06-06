import request from "supertest"
import { app, server, prisma } from "../src/index"

describe("Penalties", () => {
  let EventId: number

  beforeAll(async () => {
    await prisma.event.deleteMany({})
    const firstEvent = await prisma.event.create({
      data: {
        name: "Test Event",
      },
    })

    EventId = firstEvent.id
  })

  afterAll(async () => {
    await prisma.event.deleteMany({})
    await prisma.$disconnect()
    server.close()
  })

  it("event is returned as json", async () => {
    const response = await request(app).get(`/api/event/${EventId}`)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
    expect(response.body).toMatchObject({
      id: EventId,
      name: "Test Event",
    })
  })

  it("Start time is set correctly", async () => {
    const response = await request(app)
      .put(`/api/event/start/${EventId}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: EventId,
      startTime: expect.any(String),
      endTime: null
    })
  })

  it("End time is set correctly", async () => {
    const response = await request(app)
      .put(`/api/event/end/${EventId}`)
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: EventId,
      startTime: expect.any(String),
      endTime: expect.any(String)
    })
  })
})
