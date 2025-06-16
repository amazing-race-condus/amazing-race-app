import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialCheckpoints, checkpoints, intermediateCheckpoints, users } from "./test_helper"

let adminToken: string

describe("Get all checkpoints", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token

    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })
  })

  it("checkpoints are returned as json", async () => {
    const response = await request(app)
      .get("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

  it("all checkpoints are returned", async () => {
    const response = await request(app)
      .get("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.body.length).toBe(initialCheckpoints.length)
  })
})

describe("Viewing a specific checkpoint", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token

    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })
  })

  it("succeeds with a valid id", async () => {
    const checkpointsAtStart = await prisma.checkpoint.findMany()
    const checkpointToView = checkpointsAtStart[0]
    const response = await request(app)
      .get(`/api/checkpoints/${checkpointToView.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
    expect(response.body).toMatchObject({
      id: checkpointToView.id,
      name: checkpointToView.name,
      type: checkpointToView.type,
    })
  })

  it("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "5a3d"
    const response = await request(app)
      .get(`/api/checkpoints/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(400)
  })
})

describe("Addition of a new checkpoint", () => {
  let adminToken: string

  beforeEach(async () => {
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
  })

  it("succeeds with valid data", async () => {
    const newCheckpoint = {
      name: "Tennispalatsi",
      type: "INTERMEDIATE",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(201)
  })

  it("fails with status code 400 if data is missing", async () => {
    const newCheckpoint = {
      type: "INTERMEDIATE",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    const result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Kaikkia vaadittuja tietoja ei ole annettu.")
  })

  it("fails with status code 400 and proper error message with too long or short name", async () => {
    let newCheckpoint = {
      name: "S",
      type: "INTERMEDIATE",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    let result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Nimi on liian lyhyt. Minimi pituus on 2 kirjainta.")
    let checkpointsAtEnd = await prisma.checkpoint.findMany()
    let names = checkpointsAtEnd.map(c => c.name)
    expect(names).not.toContain("S")

    newCheckpoint = {
      name: "S".repeat(101),
      type: "INTERMEDIATE",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Nimi on liian pitkä. Maksimi pituus on 100 kirjainta.")
    checkpointsAtEnd = await prisma.checkpoint.findMany()
    names = checkpointsAtEnd.map(c => c.name)
    expect(names).not.toContain("S".repeat(101))
  })

  it("fails with status code 400 and proper error message if chekpoint with type start or finish already exists", async () => {

    await prisma.checkpoint.createMany({
      data: initialCheckpoints
    })

    let newCheckpoint = {
      name: "Lähtö",
      type: "START",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    let result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Lähtörasti on jo luotu.")

    newCheckpoint = {
      name: "Maali",
      type: "FINISH",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Maali on jo luotu.")
    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    const names = checkpointsAtEnd.map(c => c.name)
    expect(names).not.toContain("Lähtö")
    expect(names).not.toContain("Maali")
    await prisma.checkpoint.deleteMany({})
  })

  it("fails with status code 400 and proper error message if there is already 8 checkpoints", async () => {
    await prisma.checkpoint.createMany({
      data: checkpoints,
    })

    const newCheckpoint = {
      name: "Välirasti",
      type: "INTERMEDIATE",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    const result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Rastien maksimimäärä on 8 rastia.")
    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    const names = checkpointsAtEnd.map(c => c.name)
    expect(names).not.toContain("Välirasti")
    await prisma.checkpoint.deleteMany({})

  })

  it("fails with status code 400 and proper error message if there is already 6 intermediate checkpoints", async () => {
    await prisma.checkpoint.createMany({
      data: intermediateCheckpoints,
    })

    const newCheckpoint = {
      name: "Välirasti",
      type: "INTERMEDIATE",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    const result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    const names = checkpointsAtEnd.map(c => c.name)
    expect(names).not.toContain("Välirasti")
    expect(result.body.error).toContain("Välirastien maksimimäärä on 6 rastia.")
    await prisma.checkpoint.deleteMany({})
  })


  it("fails with status code 400 and proper error message if type is invalid", async () => {
    const newCheckpoint = {
      name: "Rasti",
      type: "INVALID",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi"
    }

    const result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    const names = checkpointsAtEnd.map(c => c.name)
    expect(names).not.toContain("Rasti")
    expect(result.body.error).toContain("Virheellinen tyyppi.")
  })

  it("fails with status code 400 if checkpoint name already in use", async () => {

    const newCheckpoint = {
      name: "Musiikkitalo",
      type: "INTERMEDIATE",
      hint: "http://www.google.com",
      easyHint: "http://www.google.fi",
    }

    await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCheckpoint)

    const sameChckpoint = { ...newCheckpoint }

    const result = await request(app).post("/api/checkpoints")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sameChckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Rastin nimi on jo käytössä. Syötä uniikki nimi.")
    await prisma.checkpoint.deleteMany({})
  })
})

describe("Deletion of a checkpoint", () => {
  let adminToken: string
  beforeEach(async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
  })

  it("succeeds with status code 204 if id is valid", async () => {

    const checkpointsAtStart = await prisma.checkpoint.findMany()
    const checkpointToDelete =checkpointsAtStart[0]

    await request(app).delete(`/api/checkpoints/${checkpointToDelete.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(204)


    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length-1)

    const ids = checkpointsAtEnd.map(c => c.id)
    expect(ids).not.toContain(checkpointToDelete.id)

  })
})

describe("modification of a checkpoint", () => {
  let adminToken: string
  beforeEach(async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    adminToken = adminLoginResponse.body.token
  })

  // todo: fix later

  // it("succeeds with status code 200 with valid data and id", async () => {

  //   const checkpointsAtStart = await prisma.checkpoint.findMany()

  //   const checkpointToModify = checkpointsAtStart[0]

  //   const response = await request(app)
  //     .put(`/api/checkpoints/${checkpointToModify.id}`)
  //     .set("Authorization", `Bearer ${adminToken}`)
  //     .send({
  //       name: "Modified checkpoint",
  //       type: "FINISH",
  //       hint:"http://vihje.com",
  //       easyHint: "http://helppovihje.com"
  //     })
  //     .expect(200)

  //   expect(response.body).toMatchObject({
  //     id: checkpointToModify.id,
  //     name: "Modified checkpoint",
  //     type: "FINISH",
  //     hint:"http://vihje.com",
  //     easyHint: "http://helppovihje.com"
  //   })
  // })

  // it("fails with status code 400 and proper error message if modified name already exists", async () => {

  //   const checkpointsAtStart = await prisma.checkpoint.findMany()

  //   const checkpointToModify = checkpointsAtStart[0]

  //   const newcheckpoint = {
  //     name: "Existing name",
  //     type: "INTERMEDIATE",
  //     hint:"http://vihje.com",
  //     easyHint: "http://helppovihje.com",
  //     eventId: 1
  //   }

  // await request(app).post("/api/checkpoints").send(newcheckpoint)

  // await request(app)
  //   .put(`/api/checkpoints/${checkpointToModify.id}`)
  //   .send({
  //     name: "Existing name",
  //     type: "INTERMEDIATE",
  //     hint:"http://vihje12.com",
  //     easyHint: "http://helppovihje12.com"
  //   })
  //   .expect(400)
  //   .expect("Content-Type", /application\/json/)

  //   //expect(result.body.error).toContain("Rastin nimi on jo käytössä. Syötä uniikki nimi.")
  //   await prisma.checkpoint.deleteMany({})
  // })

  it("fails with status code 400 and proper error message if data is invalid", async () => {

    const checkpointsAtStart = await prisma.checkpoint.findMany()

    const checkpointToModify = checkpointsAtStart[0]

    const result = await request(app)
      .put(`/api/checkpoints/${checkpointToModify.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Modified checkpoint",
        type: "TYYPPI",
        hint:"http://vihje.com",
        easyHint: "http://helppovihje.com"
      })
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Virheellinen tyyppi.")
    await prisma.checkpoint.deleteMany({})
  })

  // todo fix later
  // it("succeeds with status code 200 with same type than before", async () => {

  //   const checkpointsAtStart = await prisma.checkpoint.findMany()

  //   const checkpointToModify = checkpointsAtStart[2]

  //   const response = await request(app)
  //     .put(`/api/checkpoints/${checkpointToModify.id}`)
  //     .set("Authorization", `Bearer ${adminToken}`)
  //     .send({
  //       name: "Modified checkpoint",
  //       type: checkpointToModify.type,
  //       hint:"http://vihje.com",
  //       easyHint: "http://helppovihje.com"
  //     })
  //     .expect(200)

  //   expect(response.body).toMatchObject({
  //     id: checkpointToModify.id,
  //     name: "Modified checkpoint",
  //     type: checkpointToModify.type,
  //     hint:"http://vihje.com",
  //     easyHint: "http://helppovihje.com"
  //   })
  //   await prisma.checkpoint.deleteMany({})
  // })
})


afterAll(async () => {
  await prisma.checkpoint.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.$disconnect()
  server.close()
})
