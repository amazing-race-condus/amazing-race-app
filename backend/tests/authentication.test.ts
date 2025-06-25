import request from "supertest"
import { app, server, prisma } from "../src/index"
import { users } from "./test_helper"
import jwt from "jsonwebtoken"

describe("Login", () => {

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

    expect(result.body.error).toContain("Virheelliset tunnukset")


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

    expect(result.body.error).toContain("Virheelliset tunnukset")
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

    expect(result.body.error).toContain("Anna käyttäjätunnus sekä pääkäyttäjän salasana")
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

    expect(result.body.error).toContain("Virheelliset tunnukset")
  })

})

describe("Changing admin password", () => {
  let adminToken: string
  let userToken: string

  beforeEach(async () => {
    const secret = process.env.SECRET ?? "ödjaödjaödjaödjaöj"
    adminToken = jwt.sign(
      {
        email: true,
      },
      secret,
      { expiresIn: 15 }
    )
    userToken = jwt.sign(
      {
        email: false,
      },
      secret,
      { expiresIn: 15 }
    )
  })

  it("admin password can be modified with valid token and valid password", async () => {

    const newPassword = {
      password: "Password123!",
    }
    await request(app).put("/api/authentication/reset_password")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newPassword)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const newLoginCredentials = {
      username: users[0].username,
      password: "Password123!",
      admin: users[0].admin
    }

    await request(app).post("/api/login")
      .send(newLoginCredentials)
      .expect(200)

  })
  it("admin password can't be modified with invalid token", async () => {

    const newPassword = {
      password: "Password123!",
    }
    const result = await request(app).put("/api/authentication/reset_password")
      .set("Authorization", `Bearer ${userToken}`)
      .send(newPassword)
      .expect(401)

    expect(result.body.error).toContain("Token invalid")

  })


  it("admin password can't be modified without token", async () => {

    const newPassword = {
      password: "Password123!",
    }
    const result = await request(app).put("/api/authentication/reset_password")
      .send(newPassword)
      .expect(401)

    expect(result.body.error).toContain("Token missing")

  })

  it("admin password can't be modified with login token", async () => {


    await request(app).post("/api/authentication")
      .send(users[0])
    const adminLoginResponse = await request(app).post("/api/login")
      .send(users[0])
    const loginToken = adminLoginResponse.body.token

    const newPassword = {
      password: "Password123!",
    }
    const result = await request(app).put("/api/authentication/reset_password")
      .set("Authorization", `Bearer ${loginToken}`)
      .send(newPassword)
      .expect(401)

    expect(result.body.error).toContain("Token missing")
  })

  it("admin password can't be modified with invalid password", async () => {

    let newPassword: { password: string } = {
      password: "Password",
    }
    let result = await request(app).put("/api/authentication/reset_password")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newPassword)
      .expect(400)

    expect(result.body.error).toContain("Salasanassa tulee olla ainakin yksi numero")

    newPassword = {
      password: "PW",
    }
    result = await request(app).put("/api/authentication/reset_password")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newPassword)
      .expect(400)

    expect(result.body.error).toContain("Salasanan tulee olla vähintään 8 kirjainta")

    newPassword = {
      password: "PASSWORD",
    }
    result = await request(app).put("/api/authentication/reset_password")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newPassword)
      .expect(400)

    expect(result.body.error).toContain("Salasanassa tulee olla ainakin yksi pieni kirjain")

    newPassword = {
      password: "password",
    }
    result = await request(app).put("/api/authentication/reset_password")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newPassword)
      .expect(400)

    expect(result.body.error).toContain("Salasanassa tulee olla ainakin yksi iso kirjain")
  })
})
describe("Changing regular user's password", () => {
  let adminToken: string
  let userToken: string

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


  it("regular user's password can be modified with valid token and valid password", async () => {

    const newPassword = { password: "Password123!", confirmPassword: "Password123!" }

    await request(app).patch("/api/authentication/change_password")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newPassword)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const newLoginCredentials = {
      username: users[1].username,
      password: "Password123!",
      admin: users[1].admin
    }

    await request(app).post("/api/login")
      .send(newLoginCredentials)
      .expect(200)
  })

  it("regular user's password can't be modified with invalid token", async () => {

    const newPassword = { password: "Password123!", confirmPassword: "Password123!" }

    const result = await request(app).patch("/api/authentication/change_password")
      .set("Authorization", `Bearer ${userToken}`)
      .send(newPassword)
      .expect(401)

    expect(result.body.error).toContain("Tämä toiminto on sallittu vain pääkäyttäjälle")

  })


  it("regular user's password can't be modified without token", async () => {

    const newPassword = { password: "Password123!", confirmPassword: "Password123!" }

    const result = await request(app).patch("/api/authentication/change_password")
      .send(newPassword)
      .expect(401)

    expect(result.body.error).toContain("Token missing")

  })


  it("regular user's password can't be modified with invalid password", async () => {

    const newPassword = { password: "Password", confirmPassword: "Password" }

    const result = await request(app).patch("/api/authentication/change_password")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newPassword)
      .expect(400)

    expect(result.body.error).toContain("Salasanassa tulee olla ainakin yksi numero")

  })

})


afterAll(async () => {
  await prisma.user.deleteMany({})
  await prisma.$disconnect()
  server.close()
})
