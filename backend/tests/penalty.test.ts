import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialCheckpoints, initialGroups, users } from "./test_helper"

const invalidToken = "fjäsfjaäfojafjaqfojoafjf"

describe("Penalties", () => {
  let groupId: number
  let checkpointId: number
  let penaltyId: number
  let userToken: string


  beforeAll(async () => {
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[1])
    const userLoginResponse = await request(app).post("/api/login")
      .send(users[1])
    userToken = userLoginResponse.body.token
    await prisma.group.deleteMany({})
    await prisma.group.createMany({
      data: initialGroups,
    })

    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })

    const firstGroup = await prisma.group.findFirst({})
    const firstCheckpoint = await prisma.checkpoint.findFirst({})

    if (firstCheckpoint) {
      checkpointId = firstCheckpoint.id
    } else {
      throw new Error("No checkpoints found in the database")
    }

    if (firstGroup) {
      groupId = firstGroup.id
    } else {
      throw new Error("No groups found in the database")
    }
  })

  afterAll(async () => {
    await prisma.group.deleteMany({})
    await prisma.checkpoint.deleteMany({})
    await prisma.penalty.deleteMany({})
    await prisma.$disconnect()
    server.close()
  })

  it("Penalties are returned as json", async () => {
    const response = await request(app)
      .get("/api/penalty")
      .set("Authorization", `Bearer ${userToken}`)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

  it("Penalties are not returned with invalid token", async () => {
    const result = await request(app)
      .get("/api/penalty")
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401)
    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("Penalty can be created", async () => {
    const response = await request(app)
      .post(`/api/penalty/${groupId.toString()}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        groupId: groupId,
        type: "SKIP",
        time: 30,
        checkpointId: checkpointId,
      })
    penaltyId = response.body.id

    expect(response.status).toBe(200)
    expect(response.body.groupId).toBe(groupId)
    expect(response.body.time).toBe(30)
    expect(response.body.type).toBe("SKIP")
  })

  it("Penalty can't be created with invalid token", async () => {
    const result = await request(app)
      .post(`/api/penalty/${groupId.toString()}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        groupId: groupId,
        type: "SKIP",
        time: 30,
        checkpointId: checkpointId,
      })
      .expect(401)

    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("Groups has penalty information", async () => {
    const response = await request(app)
      .get(`/api/groups/${groupId.toString()}`)

    expect(response.status).toBe(200)
    expect(response.body.penalty[0].groupId).toBe(groupId)
    expect(response.body.penalty[0].time).toBe(30)
  })

  it("Delete a penalty", async () => {
    const deleteRes = await request(app)
      .delete(`/api/penalty/${penaltyId.toString()}`)
      .set("Authorization", `Bearer ${userToken}`)

    expect(deleteRes.status).toBe(204)

    const response = await request(app)
      .get(`/api/groups/${groupId.toString()}`)

    expect(response.status).toBe(200)
    expect(response.body.penalty.length).toBe(0)
  })

  it("Penalty can't be deleted with invalid token", async () => {
    const deleteRes = await request(app)
      .delete(`/api/penalty/${penaltyId.toString()}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401)

    expect(deleteRes.body.error).toContain("Token missing or invalid")
  })
})
