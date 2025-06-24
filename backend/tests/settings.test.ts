import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialEvent, users } from "./test_helper"

let adminToken: string
let userToken: string
let eventId: number



beforeEach(async () => {
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

beforeAll(async () => {
  const response = await prisma.event.create({
    data: initialEvent,
  })
  eventId = response.id
})

describe("Set route limits", () => {

  it("route limits can be set", async () => {
    const newLimits = {
      id: eventId,
      minRouteTime: 20,
      maxRouteTime: 100
    }
    const response = await request(app)
      .put("/api/settings/update_limits")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newLimits)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

  it("route limits can't be set with invalid token", async () => {
    const newLimits = {
      id: eventId,
      minRouteTime: 20,
      maxRouteTime: 100
    }
    const result = await request(app)
      .put("/api/settings/update_limits")
      .set("Authorization", `Bearer ${userToken}`)
      .send(newLimits)
      .expect(401)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")

  })

  it("limits are returned as json", async () => {
    const newLimits = {
      id: eventId,
      minRouteTime: 20,
      maxRouteTime: 100
    }
    await request(app)
      .put("/api/settings/update_limits")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newLimits)

    const response = await request(app)
      .get(`/api/settings/${eventId}/limits`)
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
    expect(response.body).toMatchObject({
      minRouteTime: 20,
      maxRouteTime: 100
    })
  })
})


afterAll(async () => {
  await prisma.group.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.$disconnect()
  server.close()
})
