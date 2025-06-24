import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialEvent, users } from "./test_helper"
import { AddEvent } from "@/types"

const newEvent = {
  name: "newEvent",
  eventDate: new Date()
}
let EventId: number
let userToken: string
let adminToken: string
const invalidToken = "fjäsfjaäfojafjaqfojoafjf"
const date = new Date()

describe("Get events", () => {

  beforeAll(async () => {
    await prisma.event.deleteMany({})
    await prisma.user.deleteMany({})
    const firstEvent = await prisma.event.create({
      data: initialEvent,
    })
    await request(app).post("/api/authentication")
      .send(users[1])
    const userLoginResponse = await request(app).post("/api/login")
      .send(users[1])
    userToken = userLoginResponse.body.token
    EventId = firstEvent.id
  })

  it("Events are returned as json", async () => {
    const response = await request(app)
      .get("/api/event/")
      .set("Authorization", `Bearer ${userToken}`)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
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

  it("Next event is returned as default event", async () => {

    const nextEvent = await prisma.event.create({
      data: {
        name: "Next Event",
        eventDate: new Date()
      },
    })
    const response = await request(app)
      .get("/api/event/default")
      .set("Authorization", `Bearer ${userToken}`)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
    expect(response.body).toMatchObject({
      id: nextEvent.id,
      name: "Next Event",
    })
  })
})

describe("Create event", () => {
  let adminToken: string
  let userToken: string
  const invalidToken = "fjäsfjaäfojafjaqfojoafjf"

  beforeAll(async () => {
    await prisma.event.deleteMany({})
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
      name: "newEvent"
    })
  })

  it("Event can't be created with invalid token", async () => {
    const result = await request(app)
      .post("/api/event/create")
      .send(newEvent)
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401)
    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("Event can't be created if a valid token belongs to a non-admin user", async () => {
    const result = await request(app)
      .post("/api/event/create")
      .send(newEvent)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(401)
    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })
})

describe("Event start and end times", () => {

  beforeAll(async () => {
    await prisma.event.deleteMany({})
    await prisma.user.deleteMany({})
    const firstEvent = await prisma.event.create({
      data: {
        name: "Test Event",
        eventDate: new Date()
      },
    })
    await request(app).post("/api/authentication")
      .send(users[1])
    const userLoginResponse = await request(app).post("/api/login")
      .send(users[1])
    userToken = userLoginResponse.body.token
    EventId = firstEvent.id
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
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

describe("Modification of an event", () => {
  beforeEach(async () => {
    await prisma.event.deleteMany({})
    await prisma.user.deleteMany({})
    const firstEvent = await prisma.event.create({
      data: {
        name: "Test Event",
        eventDate: new Date()
      },
    })
    await request(app).post("/api/authentication")
      .send(users[1])
    const userLoginResponse = await request(app).post("/api/login")
      .send(users[1])
    userToken = userLoginResponse.body.token
    EventId = firstEvent.id
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
  })

  it("succeeds with status code 200 with valid data, id and token", async () => {

    const response = await request(app)
      .put(`/api/event/${EventId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Modified event",
        eventDate: date
      })
      .expect(200)

    expect(response.body).toMatchObject({
      id: EventId,
      name: "Modified event"
    })
  })

  it("fails with status code 401 with valid data and invalid token", async () => {

    const result = await request(app)
      .put(`/api/event/${EventId}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        name: "Modified event",
        eventDate: date
      })
      .expect(401)

    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("fails with status code 401 if a valid token belongs to a non-admin user", async () => {

    const result = await request(app)
      .put(`/api/event/${EventId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Modified event",
        eventDate: date
      })
      .expect(401)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })

  it("fails with status code 400 and proper error message if modified name already exists", async () => {

    const eventToModify = await prisma.event.create({
      data: {
        name: "Event",
        eventDate: new Date()
      },
    })

    const result = await request(app)
      .put(`/api/event/${eventToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Event",
        eventDate: date
      })
      .expect(400)

    expect(result.body.error).toContain("Tapahtuman nimi on jo käytössä. Syötä uniikki nimi.")
    await prisma.checkpoint.deleteMany({})
  })
})

describe("Deletion of an event", () => {
  beforeEach(async () => {
    await prisma.event.deleteMany({})
    await prisma.user.deleteMany({})
    const firstEvent = await prisma.event.create({
      data: {
        name: "Test Event",
        eventDate: new Date()
      },
    })
    await request(app).post("/api/authentication")
      .send(users[1])
    const userLoginResponse = await request(app).post("/api/login")
      .send(users[1])
    userToken = userLoginResponse.body.token
    EventId = firstEvent.id
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
  })

  it("succeeds with status code 204 with valid id and valid token", async () => {

    const eventsAtStart = await prisma.event.findMany()
    expect(eventsAtStart.length).toBe(1)

    await request(app).delete(`/api/event/${EventId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(204)

    const eventsAtEnd = await prisma.event.findMany()
    expect(eventsAtEnd.length).toBe(0)


  })

  it("fails with status code 401 with valid id and invalid token", async () => {

    const result = await request(app).delete(`/api/event/${EventId}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401)

    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("fails with status code 401 if a valid token belongs to a non-admin user", async () => {

    const result = await request(app).delete(`/api/event/${EventId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(401)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })
})

afterAll(async () => {
  await prisma.event.deleteMany({})
  await prisma.$disconnect()
  server.close()
})

