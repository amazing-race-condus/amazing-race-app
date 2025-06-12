import bcrypt from "bcrypt"
import express, { Response, Request } from "express"
import { createUser, getAllUsers, deleteUser } from "../controllers/authentication.controller"
import { validatePassword } from "../utils/passwordValidator"

const authenticationRouter = express.Router()

authenticationRouter.get("/", async (_, res: Response) => {
  const allUsers = await getAllUsers()

  res.send(allUsers)
})


authenticationRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!validatePassword(password, res)) {
    return
  }


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const savedPassword = await createUser(username, passwordHash, res)

  res.status(201).json(savedPassword)

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


export default authenticationRouter

