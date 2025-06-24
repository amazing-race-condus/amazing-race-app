import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialEvent, users } from "./test_helper"
import { AddEvent } from "@/types"

describe("Events", () => {
  let EventId: number
  let adminToken: string
  let userToken: string
  const invalidToken = "fjäsfjaäfojafjaqfojoafjf"

  beforeAll(async () => {
    await prisma.event.deleteMany({})
    const firstEvent = await prisma.event.create({
      data: initialEvent,
    })
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
    await request(app).post("/api/authentication")
      .send(users[1])
    const userLoginResponse = await request(app).post("/api/login")
      .send(users[1])
    userToken = userLoginResponse.body.token

    EventId = firstEvent.id
  })

  afterAll(async () => {
    await prisma.event.deleteMany({})
    await prisma.$disconnect()
    server.close()
  })

  it("Event is returned as json", async () => {
    const response = await request(app)
      .get(`/api/event/${EventId}`)
      .set("Authorization", `Bearer ${userToken}`)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
    expect(response.body).toMatchObject({
      id: EventId,
      name: "eventti1",
    })
  })

  it("Event can be created with valid token", async () => {
    const newEvent: AddEvent = {
      name: "newEvent",
      eventDate: new Date("2025-01-01")
    }
    const response = await request(app)
      .post("/api/event/create")
      .send(newEvent)
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      name: "newEvent",
    })
  })

  it("Event can't be created with invalid token", async () => {
    const newEvent = {
      name: "newEvent"
    }
    const result = await request(app)
      .post("/api/event/create")
      .send(newEvent)
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401)
    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("Event can't be created if a valid token belongs to a non-admin user", async () => {
    const newEvent = {
      name: "newEvent"
    }
    const result = await request(app)
      .post("/api/event/create")
      .send(newEvent)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(401)
    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })

  it("Start time is set correctly", async () => {
    const response = await request(app)
      .put(`/api/event/start/${EventId}`)
      .set("Authorization", `Bearer ${adminToken}`)

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
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: EventId,
      startTime: expect.any(String),
      endTime: expect.any(String)
    })
  })

  it("Start time or end time can't be set with invalid token", async () => {

    let result = await request(app)
      .put(`/api/event/end/${EventId}`)
      .set("Authorization", `Bearer ${invalidToken}`)

    expect(result.body.error).toContain("Token missing or invalid")

    result = await request(app)
      .put(`/api/event/start/${EventId}`)
      .set("Authorization", `Bearer ${invalidToken}`)

    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("Start time or end time can't be set if a valid token belongs to a non-admin user", async () => {

    let result = await request(app)
      .put(`/api/event/end/${EventId}`)
      .set("Authorization", `Bearer ${userToken}`)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")

    result = await request(app)
      .put(`/api/event/start/${EventId}`)
      .set("Authorization", `Bearer ${userToken}`)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })

})
