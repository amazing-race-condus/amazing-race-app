import express, { Response, Request } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { getUserByAdminRights } from "../controllers/authentication.controller"


const loginRouter = express.Router()


loginRouter.post("/", async (req: Request, res: Response) => {
  const { username, password, admin } = req.body

  const user = await getUserByAdminRights(admin)

  if (!user) {
    res.status(400).json({ error: "Käyttäjää ei löydy." })
    return
  }

  if (user.admin === true) {

    if (!username || !password) {
      res.status(400).json({ error: "Anna käyttäjätunnus sekä pääkäyttäjän salasana." })
      return
    }

    if (username !== user.username) {
      res.status(400).json({ error: "Virheelliset tunnukset." })
      return

    }

  } else {

    if (!password) {
      res.status(400).json({ error: "Anna tavallisen käyttäjän salasana." })
      return
    }
  }

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)


  if (!(user && passwordCorrect)) {
    res.status(401).json({ error: "Virheelliset tunnukset." })
    return
  }

  const userForToken = {
    username: user.username,
    id: user.id,
    admin: user.admin
  }
  const secret = process.env.SECRET
  if (!secret) {
    res.status(500).json({ error: "SECRET is not defined in environment." })
    return
  }

  const token = jwt.sign(
    userForToken,
    secret,
    { expiresIn: 60*60*24 }
  )

  res
    .status(200)
    .send({
      token,
      username: user.username,
      id: user.id,
      admin: user.admin
    })
})

export default loginRouter
