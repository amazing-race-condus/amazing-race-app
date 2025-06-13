import express, { Response, Request } from "express"
import { createUser, getAllUsers, deleteUser, getUserByAdminRights } from "../controllers/authentication.controller"


const authenticationRouter = express.Router()

// GET POST ja DELETE endpointit voi poistaa, kun viedään tuotantoon
authenticationRouter.get("/", async (_, res: Response) => {
  const allUsers = await getAllUsers()

  res.send(allUsers)
})


authenticationRouter.post("/", async (req: Request, res: Response) => {
  const { username, password, admin } = req.body
  const user = await getUserByAdminRights(admin)
  if (user) {
    if (user.admin) {
      res.status(400).json({ error: "Pääkäyttäjä on jo luotu." })
      return
    }
    res.status(400).json({ error: "Tavallinen käyttäjä on jo luotu." })
    return
  }

  const savedUser = await createUser(username, password, admin, res)

  res.status(201).json(savedUser)

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

