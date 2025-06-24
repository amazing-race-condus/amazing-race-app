import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialEvent, initialGroups, users } from "./test_helper"
import { AddGroup } from "@/types"

let adminToken: string
let userToken: string
let eventId: number
const invalidToken = "fjäsfjaäfojafjaqfojoafjf"

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

describe("Get Groups", () => {
  let groupId: unknown


  it("groups are returned as json", async () => {
    const response = await request(app)
      .get("/api/groups")
      .set("Authorization", `Bearer ${userToken}`)
      .query({ eventId : eventId })
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

  it("groups are not returned with invalid token", async () => {

    const result = await request(app)
      .get("/api/groups")
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401)

    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("group can be created", async () => {
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

  it("group can't be created with invalid token", async () => {
    const result = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        name: "Test group",
        members: 4,
        eventId : eventId
      })
      .expect(401)

    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("group can't be created if a valid token belongs to a non-admin user", async () => {
    const result = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Test group",
        members: 4,
        eventId : eventId
      })
      .expect(401)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })


  it("one group is returned", async () => {
    const response = await request(app)
      .get(`/api/groups/${groupId}`)
    expect(response.status).toBe(200)
  })

  it("group is not created with existing name", async () => {
    const response = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test group",
        members: 4,
        eventId : eventId
      })
    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Ryhmän nimi on jo käytössä. Syötä uniikki nimi")
  })

  it("group can be deleted", async () => {
    const response = await request(app)
      .delete(`/api/groups/${groupId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        id: groupId
      })
    expect(response.status).toBe(200)
  })

  it("group can't be deleted with invalid token", async () => {
    const result = await request(app)
      .delete(`/api/groups/${groupId}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        id: groupId
      })
      .expect(401)

    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("group can't be deleted if a valid token belongs to a non-admin user", async () => {
    const result = await request(app)
      .delete(`/api/groups/${groupId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        id: groupId
      })
      .expect(401)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })

  it("group can be specified to have easy hints", async () => {
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

describe("Modification of a group", () => {
  beforeEach(async () => {
    const groupsWithEventId = initialGroups.map(group => ({
      ...group,
      eventId
    }))

    await prisma.group.deleteMany({})
    await prisma.group.createMany({
      data: groupsWithEventId,
    })
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
  it("fails with status code 401 with valid data and invalid token", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        name: "Modified group",
        members: 4,
        easy: true
      })
      .expect(401)

    expect(result.body.error).toContain("Token missing or invalid")
  })

  it("fails with status code 401 if a valid token belongs to a non-admin user ", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Modified group",
        members: 4,
        easy: true
      })
      .expect(401)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")
  })

  it("fails with status code 400 and proper error message if modified name already exists", async () => {
    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const newGroup: AddGroup = {
      name: "Existing name",
      members: 4,
      eventId: eventId,
      easy: false
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

    expect(result.body.error).toContain("Ryhmän nimi on jo käytössä. Syötä uniikki nimi")
    await prisma.group.deleteMany({})
  })
  it("fails with status code 400 and proper error message if data is invalid", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    let result = await request(app)
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

    result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Invalid data",
        members: 20.5,
        easy: true
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Syötä kokonaisluku")

    result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Invalid data",
        members: 2,
        easy: true
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Ryhmässä tulee olla vähintään 4 jäsentä")

    result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Invalid data",
        members: 7,
        easy: true
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Ryhmässä voi olla korkeintaan 6 jäsentä")

    result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "S".repeat(51),
        members: 4,
        easy: true
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Nimi on liian pitkä. Maksimi pituus on 50 kirjainta")

    result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "S",
        members: 4,
        easy: true
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Nimi on liian lyhyt. Minimi pituus on 2 kirjainta")
    result = await request(app)
      .put(`/api/groups/${groupToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: 4,
        members: 4,
        easy: true
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Nimen tulee olla merkkijono")
    await prisma.group.deleteMany({})
  })
})

describe("Modification of a group's status", () => {
  beforeEach(async () => {
    const groupsWithEventId = initialGroups.map(group => ({
      ...group,
      eventId
    }))

    await prisma.group.deleteMany({})
    await prisma.group.createMany({
      data: groupsWithEventId,
    })
  })

  it("setting group as not started succeeds with status code 200 with valid token and id", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const response = await request(app)
      .put(`/api/groups/${groupToModify.id}/dnf`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: groupToModify.id,
      dnf: true
    })
  })

  it("setting group as disqualified succeeds with status code 200 with valid token and id", async () => {

    const groupsAtStart = await prisma.group.findMany()

    const groupToModify = groupsAtStart[0]

    const response = await request(app)
      .put(`/api/groups/${groupToModify.id}/disqualify`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: groupToModify.id,
      disqualified: true
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
