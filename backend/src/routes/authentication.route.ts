import express, { Response, Request } from "express"
import { createUser, getAllUsers, deleteUser, getUserByAdminRights, modifyUser, sendMailToUser } from "../controllers/authentication.controller"
import jwt, { JwtPayload } from "jsonwebtoken"

const authenticationRouter = express.Router()

const getTokenFrom = (req: Request): string | null => {
  const authorization = req.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "")
  }
  return null
}

authenticationRouter.get("/", async (_, res: Response) => {
  const allUsers = await getAllUsers()

  res.send(allUsers)
})


authenticationRouter.post("/", async (req: Request, res: Response) => {
  const { username, password, admin } = req.body
  const user = await getUserByAdminRights(admin)
  if (user) {
    if (user.admin) {
      res.status(400).json({ error: "Pääkäyttäjä on jo luotu" })
      return
    }
    res.status(400).json({ error: "Tavallinen käyttäjä on jo luotu" })
    return
  }

  const savedUser = await createUser(username, password, admin, res)

  res.status(201).json(savedUser)

})

authenticationRouter.post("/reset_password", async (req: Request, res: Response) => {

  const user = await getUserByAdminRights(true)

  if (!user) {
    res.status(404).json({ error: "Käyttäjää ei löydy" })
    return
  }

  const tokenForEmail = {
    email: true,
  }

  const secret = process.env.SECRET
  if (!secret) {
    res.status(500).json({ error: "SECRET is not defined in environment" })
    return
  }

  const token = jwt.sign(
    tokenForEmail,
    secret,
    { expiresIn: 60*15 }
  )

  try {
    await sendMailToUser(user.username, token, res)
    res.status(200).json({ message: "Sähköposti lähetetty onnistuneesti" })
  } catch (error) {
    console.error("Sähköpostin lähetys epäonnistui:", error)
    res.status(500).json({ error: "Sähköpostia ei voitu lähettää" })
  }

})

authenticationRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const user = await deleteUser(id)
  if (user) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})


authenticationRouter.put("/reset_password", async (req: Request, res: Response) => {
  const { password } = req.body
  const token = getTokenFrom(req)
  if (!token) {
    res.status(401).json({ error: "Token missing" })
    return
  }

  const secret = process.env.SECRET
  if (!secret) {
    res.status(500).json({ error: "SECRET is not defined in environment" })
    return
  }
  const decodedToken = jwt.verify(token, secret) as JwtPayload
  if (decodedToken.email !== true) {
    res.status(401).json({ error: "Token invalid" })
    return
  }
  const updatedUser = await modifyUser(password, res)
  res.status(200).json(updatedUser)
})

export default authenticationRouter

