import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialEvent, users, distances2, checkpointsForRoutes2, initialGroups } from "./test_helper"

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

describe("Update distances", () => {

  it("distances can be set", async () => {

    const response = await request(app)
      .put(`/api/settings/${eventId}/update_distances`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(distances2)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

  it("distances can't be set with invalid token", async () => {

    const result = await request(app)
      .put(`/api/settings/${eventId}/update_distances`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(distances2)
      .expect(401)
    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })

  it("distances are returned as json", async () => {

    await request(app)
      .put(`/api/settings/${eventId}/update_distances`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(distances2)

    const response = await request(app)
      .get(`/api/settings/${eventId}/distances`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

})

describe("Creating routes", () => {

  beforeEach(async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.route.deleteMany({})
    await prisma.penalty.deleteMany({})
    await prisma.group.deleteMany({})
    await prisma.routeCheckpoint.deleteMany({})
    await prisma.checkpointDistance.deleteMany({})
    const checkpointsWithEventId = checkpointsForRoutes2.map(checkpoint => ({
      ...checkpoint,
      eventId: eventId
    }))

    await prisma.checkpoint.createMany({
      data: checkpointsWithEventId,
    })

    const groupsWithEventId = initialGroups.map(group => ({
      ...group,
      eventId: eventId
    }))

    await prisma.group.createMany({
      data: groupsWithEventId,
    })
  })

  it("routes can be created", async () => {

    await request(app)
      .put(`/api/settings/${eventId}/update_distances`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(distances2)

    const validationResult = await request(app)
      .get(`/api/settings/${eventId}/distances/validate`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(validationResult.body).toBe(true)

    const newLimits = {
      id: eventId,
      minRouteTime: 1,
      maxRouteTime: 1000
    }
    await request(app)
      .put("/api/settings/update_limits")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newLimits)

    const response = await request(app)
      .put(`/api/settings/${eventId}/create_routes`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(distances2)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)

    await request(app)
      .get(`/api/settings/${eventId}/routes_info`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)

    await request(app)
      .get(`/api/settings/${eventId}/active_routes_info`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
  }, 15000)

  it("routes can't be created with invalid token", async () => {
    await request(app)
      .put(`/api/settings/${eventId}/update_distances`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(distances2)

    const validationResult = await request(app)
      .get(`/api/settings/${eventId}/distances/validate`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(validationResult.body).toBe(true)

    const newLimits = {
      id: eventId,
      minRouteTime: 1,
      maxRouteTime: 1000
    }
    await request(app)
      .put("/api/settings/update_limits")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newLimits)

    const result = await request(app)
      .put(`/api/settings/${eventId}/create_routes`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(distances2)
      .expect(401)
    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")

  })
})



afterAll(async () => {
  await prisma.checkpoint.deleteMany({})
  await prisma.route.deleteMany({})
  await prisma.penalty.deleteMany({})
  await prisma.group.deleteMany({})
  await prisma.routeCheckpoint.deleteMany({})
  await prisma.checkpointDistance.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.$disconnect()
  server.close()
})
