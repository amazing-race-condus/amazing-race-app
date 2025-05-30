import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialGroups } from "./test_helper"

describe("Get Groups", () => {
  let ide: number

  let penalty_ide: number

  beforeAll(async () => {
    await prisma.group.deleteMany({})
    await prisma.group.createMany({
      data: initialGroups,
    })

    const firstGroup = await prisma.group.findFirst({})

    // const ide = firstGroup.id
    if (firstGroup) {
      ide = firstGroup.id
    } else {
      throw new Error("No groups found in the database")
    }
  })

  afterAll(async () => {
    await prisma.group.deleteMany({})
    await prisma.penalty.deleteMany({})
    await prisma.$disconnect()
    server.close()
  })

  //let ide: unknown

  it("Penalties are returned as json", async () => {
    const response = await request(app).get("/api/penalty")
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

  it("Penalty is created", async () => {
    const response = await request(app)
      .post(`/api/penalty/${ide.toString()}`)
      .send({
        group_id: ide,
        penalty_time: 30,
      })

    penalty_ide = response.body.id

    expect(response.status).toBe(200)
    expect(response.body.group_id).toBe(ide)
    expect(response.body.time).toBe(30)
  })

  it("Groups has penalty information", async () => {
    const response = await request(app)
      .get(`/api/groups/${ide.toString()}`)

    expect(response.status).toBe(200)
    expect(response.body.penalty[0].group_id).toBe(ide)
    expect(response.body.penalty[0].time).toBe(30)
  })

  it("Delete a penalty", async () => {
    const deleteRes = await request(app)
      .delete(`/api/penalty/${penalty_ide.toString()}`)

    expect(deleteRes.status).toBe(204)

    const response = await request(app)
      .get(`/api/groups/${ide.toString()}`)

    expect(response.status).toBe(200)
    expect(response.body.penalty.length).toBe(0)
  })
})
