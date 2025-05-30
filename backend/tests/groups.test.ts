import request from "supertest"
import { app, server, prisma } from "../src/index"

describe("Get Groups", () => {
  afterAll(async () => {
    await prisma.$disconnect()
    server.close()
  })

  let groupId: unknown

  it("Groups are returned as json", async () => {
    const response = await request(app).get("/api/groups")
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

  it("Group is created", async () => {
    const response = await request(app)
      .post("/api/groups")
      .send({
        name: "Test group",
        members: 4
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
      .send({
        name: "Test group",
        members: 4
      })
    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Ryhmän nimi on jo käytössä. Syötä uniikki nimi")
  })

  it("Group is deleted", async () => {
    const response = await request(app)
      .delete(`/api/groups/${groupId}`)
      .send({
        id: groupId
      })
    expect(response.status).toBe(200)
  })
})
