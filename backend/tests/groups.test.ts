import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialGroups } from "./test_helper"

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
    expect(response.body.error).toBe("Ryhmän nimi on jo käytössä. Syötä uniikki nimi.")
  })

  it("Group is deleted", async () => {
    const response = await request(app)
      .delete(`/api/groups/${groupId}`)
      .send({
        id: groupId
      })
    expect(response.status).toBe(200)
  })

  it("Group can be specified to have easy hints", async () => {
    const response = await request(app)
      .post("/api/groups")
      .send({
        name: "Test group",
        members: 4,
        easy: true
      })
    expect(response.status).toBe(200)
    expect(response.body.easy).toBeTruthy()
  })
})

describe("modification of a group", () => {
  beforeEach(async () => {
    await prisma.group.deleteMany({})
    await prisma.group.createMany({
      data: initialGroups,
    })
  })

  it("succeeds with status code 200 with valid data and id", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const response = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
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

    await request(app).post("/api/groups").send(newGroup)

    const result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
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


