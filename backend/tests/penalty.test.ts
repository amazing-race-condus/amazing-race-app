import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialCheckpoints, initialGroups, users } from "./test_helper"

describe("Penalties", () => {
  let groupId: number
  let checkpointId: number
  let penaltyId: number
  let adminToken: string


  beforeAll(async () => {
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
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

  // todo: fix later

  // it("Penalties are returned as json", async () => {
  //   const response = await request(app).get("/api/penalty")
  //   expect(response.status).toBe(200)
  //   expect(response.headers["content-type"]).toMatch(/application\/json/)
  // })

  it("Penalty is created", async () => {
    const response = await request(app)
      .post(`/api/penalty/${groupId.toString()}`)
      .set("Authorization", `Bearer ${adminToken}`)
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
      .set("Authorization", `Bearer ${adminToken}`)

    expect(deleteRes.status).toBe(204)

    const response = await request(app)
      .get(`/api/groups/${groupId.toString()}`)

    expect(response.status).toBe(200)
    expect(response.body.penalty.length).toBe(0)
  })
})
