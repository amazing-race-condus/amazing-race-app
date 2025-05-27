import request from "supertest"
import { app, server, prisma } from "../src/index"
import { initialCheckpoints, finalCheckpoints, intermediateCheckpoints } from "./test_helper"


describe("Get all checkpoints", () => {
  beforeEach(async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })
  })

  it("checkpoints are returned as json", async () => {
    const response = await request(app).get("/api/checkpoints")
    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toMatch(/application\/json/)
  })

  it("all checkpoints are returned", async () => {
    const response = await request(app).get("/api/checkpoints")
    expect(response.body.length).toBe(initialCheckpoints.length)
  })
})

describe("Viewing a specific checkpoint", () => {

  beforeEach(async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })
  })

  it("succeeds with a valid id", async () => {
    const checkpointsAtStart = await prisma.checkpoint.findMany()

    const checkpointToView = checkpointsAtStart[0]

    const response = await request(app).get(`/api/checkpoints/${checkpointToView.id}`)
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
    const response = await request(app).get(`/api/checkpoints/${invalidId}`)
    expect(response.status).toBe(400)
  })
})

describe("Addition of a new checkpoint", () => {

  beforeEach(async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })
  })

  it("succeeds with valid data", async () => {
    const newCheckpoint = {
      name: "Tennispalatsi",
      type: "INTERMEDIATE"
    }

    await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(201)
      .expect("Content-Type", /application\/json/)


    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length+1)
    const names = checkpointsAtEnd.map(c => c.name)
    expect(names).toContain("Tennispalatsi")
  })

  it("fails with status code 400 and proper error message if data invalid", async () => {
    const newCheckpoint = {
      type: "INTERMEDIATE"
    }

    const result = await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length)
    expect(result.body.error).toContain("Kaikkia vaadittuja tietoja ei ole annettu.")
  })

  it("fails with status code 400 and proper error message with too long or short name", async () => {
    let newCheckpoint = {
      name: "S",
      type: "INTERMEDIATE"
    }

    let result = await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    let checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length)
    expect(result.body.error).toContain("Nimi on liian lyhyt. Minimi pituus on 2 kirjainta.")

    newCheckpoint = {
      name: "S".repeat(101),
      type: "INTERMEDIATE"
    }

    result = await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length)
    expect(result.body.error).toContain("Nimi on liian pitkä. Maksimi pituus on 100 kirjainta.")
  })

  it("fails with status code 400 and proper error message if chekpoint with type start or finish already exists", async () => {
    let newCheckpoint = {
      name: "Lähtö",
      type: "START"
    }

    let result = await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    let checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length)
    expect(result.body.error).toContain("Lähtörasti on jo luotu.")

    newCheckpoint = {
      name: "Maali",
      type: "FINISH"
    }

    result = await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length)
    expect(result.body.error).toContain("Maali on jo luotu.")
  })

  it("fails with status code 400 and proper error message if there is already 8 checkpoints", async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: finalCheckpoints,
    })

    const newCheckpoint = {
      name: "Välirasti",
      type: "INTERMEDIATE"
    }

    const result = await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(finalCheckpoints.length)
    expect(result.body.error).toContain("Rastien maksimimäärä on 8 rastia.")

  })

  it("fails with status code 400 and proper error message if there is already 6 intermediate checkpoints", async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: intermediateCheckpoints,
    })

    const newCheckpoint = {
      name: "Välirasti",
      type: "INTERMEDIATE"
    }

    const result = await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(intermediateCheckpoints.length)
    expect(result.body.error).toContain("Välirastien maksimimäärä on 6 rastia.")

  })


  it("fails with status code 400 and proper error message if type is invalid", async () => {
    const newCheckpoint = {
      name: "Rasti",
      type: "INVALID"
    }

    const result = await request(app).post("/api/checkpoints")
      .send(newCheckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length)
    expect(result.body.error).toContain("Virheellinen tyyppi.")
  })

  it("fails with status code 400 if checkpoint name already in use", async () => {

    const newCheckpoint = {
      name: "Musiikkitalo",
      type: "INTERMEDIATE"
    }

    await request(app).post("/api/checkpoints").send(newCheckpoint)

    const sameChckpoint = { ...newCheckpoint }

    const result = await request(app).post("/api/checkpoints")
      .send(sameChckpoint)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length+1)
    expect(result.body.error).toContain("Rastin nimi on jo käytössä.")
  })
})

describe("Deletion of a checkpoint", () => {
  beforeEach(async () => {
    await prisma.checkpoint.deleteMany({})
    await prisma.checkpoint.createMany({
      data: initialCheckpoints,
    })
  })

  it("succeeds with status code 204 if id is valid", async () => {

    const checkpointsAtStart = await prisma.checkpoint.findMany()
    const checkpointToDelete =checkpointsAtStart[0]

    const response = await request(app).delete(`/api/checkpoints/${checkpointToDelete.id}`)
    expect(response.status).toBe(204)

    const checkpointsAtEnd = await prisma.checkpoint.findMany()
    expect(checkpointsAtEnd.length).toBe(initialCheckpoints.length-1)



    const ids = checkpointsAtEnd.map(c => c.id)
    expect(ids).not.toContain(checkpointToDelete.id)

  })
})


afterAll(async () => {
  await prisma.checkpoint.deleteMany({})
  await prisma.checkpoint.createMany({
    data: finalCheckpoints,
  })
  await prisma.$disconnect()
  server.close()
})
