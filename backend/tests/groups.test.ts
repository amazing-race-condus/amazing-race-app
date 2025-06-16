import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialEvent, initialGroups, users } from "./test_helper"

// Module-level variables that can be shared across describe blocks
let groupId: unknown
let adminToken: string
let eventId: number

describe("Get Groups", () => {

  beforeAll(async () => {
    const response = await prisma.event.create({
      data: initialEvent,
    })

    eventId = response.id
  })

  beforeEach(async () => {
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
  })

  afterAll(async () => {
    await prisma.group.deleteMany({})
    await prisma.$disconnect()
    server.close()
  })

  // todo: fix later

  // it("Groups are returned as json", async () => {
  //   const response = await request(app).get("/api/groups")
  //     .query({ eventId : eventId })
  //   expect(response.status).toBe(200)
  //   expect(response.headers["content-type"]).toMatch(/application\/json/)
  // })

  it("Group is created", async () => {
    const response = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test group",
        members: 4,
        eventId : eventId
      })
    groupId = response.body.id
    expect(response.status).toBe(200)
    expect(response.body.name).toBe("Test group")
  })

  it("One group is returned", async () => {
    const response = await request(app)
      .get(`/api/groups/${groupId}`)
    expect(response.status).toBe(200)
  })

  it("Group is not created with existing name", async () => {
    const response = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test group",
        members: 4,
        eventId : eventId
      })
    expect(response.status).toBe(400)
    //expect(response.body.error).toBe("Ryhmän nimi on jo käytössä. Syötä uniikki nimi.")
  })

  it("Group is deleted", async () => {
    const response = await request(app)
      .delete(`/api/groups/${groupId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        id: groupId
      })
    expect(response.status).toBe(200)
  })

  it("Group can be specified to have easy hints", async () => {
    const response = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test group",
        members: 4,
        easy: true,
        eventId : eventId
      })
    expect(response.status).toBe(200)
    expect(response.body.easy).toBeTruthy()
  })
})

describe("modification of a group", () => {
  beforeAll(async () => {
    // Ensure we have an event created for this test suite
    if (!eventId) {
      const response = await prisma.event.create({
        data: initialEvent,
      })
      eventId = response.id
    }
  })

  beforeEach(async () => {
    // Set up authentication token
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token

    const groupsWithEventId = initialGroups.map(group => ({
      ...group,
      eventId
    }))

    await prisma.group.deleteMany({})
    await prisma.group.createMany({
      data: groupsWithEventId,
    })
  })

  afterAll(async () => {
    await prisma.group.deleteMany({})
    await prisma.$disconnect()
    server.close()
  })

  it("succeeds with status code 200 with valid data and id", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const response = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Modified group",
        members: 4,
        easy: true
      })
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: groupToModify.id,
      name: "Modified group",
      members: 4,
      easy: true
    })
  })

  it("fails with status code 400 and proper error message if modified name already exists", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const newGroup = {
      name: "Existing name",
      members: 4,
    }

    await request(app).post("/api/groups")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newGroup)

    const result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Existing name",
        members: 4,
        easy: true
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Ryhmän nimi on jo käytössä. Syötä uniikki nimi.")
    await prisma.group.deleteMany({})
  })
  it("fails with status code 400 and proper error message if data is invalid", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Invalid data",
        members: "aaa",
        easy: true
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Syötä jäsenten määrä numeromuodossa")
    await prisma.group.deleteMany({})
  })
})

afterAll(async () => {
  await prisma.group.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.$disconnect()
  server.close()
})
