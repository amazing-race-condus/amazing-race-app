import request from "supertest"
import { app, server, prisma } from "../src/index"
import { users } from "./test_helper"


describe("when there is initially one user at db", () => {

  beforeEach(async () => {
    await prisma.user.deleteMany({})
    await request(app).post("/api/authentication")
      .send(users[0])
    await request(app).post("/api/authentication")
      .send(users[1])
  })
  it("regular user can login with valid password", async () => {

    const loginUser = {
      password: "User1234",
      admin: false
    }
    await request(app).post("/api/login")
      .send(loginUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)


  })
  it("admin can login with valid username and password", async () => {

    const loginUser = {
      username: "admin",
      password: "Admin123",
      admin: true
    }
    await request(app).post("/api/login")
      .send(loginUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)


  })

  it("admin can't login with invalid username", async () => {

    const loginUser = {
      username: "väärä",
      password: "Admin123",
      admin: true
    }
    const result = await request(app).post("/api/login")
      .send(loginUser)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Virheelliset tunnukset.")


  })

  it("admin can't login with invalid password", async () => {
    const loginUser = {
      username: "admin",
      password: "väärin!",
      admin: true
    }
    const result = await request(app).post("/api/login")
      .send(loginUser)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Virheelliset tunnukset.")
  })

  it("admin can't login without username", async () => {
    const loginUser = {
      username: null,
      password: "Admin123",
      admin: true
    }
    const result = await request(app).post("/api/login")
      .send(loginUser)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Anna käyttäjätunnus sekä pääkäyttäjän salasana.")
  })


  it("regular user can't login with invalid password", async () => {

    const loginUser = {
      password: "väärin!",
      admin: false
    }

    const result = await request(app).post("/api/login")
      .send(loginUser)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("Virheelliset tunnukset.")
  })

})


afterAll(async () => {
  await prisma.user.deleteMany({})
  await prisma.$disconnect()
  server.close()
})
