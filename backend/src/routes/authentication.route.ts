import express, { Response, Request } from "express"
import { createUser, getAllUsers, deleteUser, getUserByAdminRights, modifyUser, sendMailToUser, changePassword } from "../controllers/authentication.controller"
import { verifyToken } from "../utils/middleware"
import { User } from "@/types"

interface CustomRequest extends Request {
  user?: User
}

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

authenticationRouter.post("/reset_password", async (req: Request, res: Response) => {
  const { html } = req.body
  /*const user = await getUserByUsername(username, res)

  if (!user || user.admin !== true) {
    res.status(400).json({ error: "Sähköpostia ei voitu lähettää." })
    return
  }*/

  try {
    await sendMailToUser("katri.laamala@outlook.com", html)
    res.status(200).json({ message: "Sähköposti lähetetty onnistuneesti." })
  } catch (error) {
    console.error("Sähköpostin lähetys epäonnistui:", error)
    res.status(500).json({ error: "Sähköpostia ei voitu lähettää." })
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

authenticationRouter.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { username, password } = req.body
  const updatedUser = await modifyUser(id, username, password, res)

  res.status(200).json(updatedUser)

})

authenticationRouter.patch("/change_password", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (user?.admin === true) {
    const { password, confirmPassword } = req.body
    const updatedUser = await changePassword(password, confirmPassword, res)
    if (updatedUser) {
      res.status(200).json()
    }
  } else {
    res.status(403).json()
  }
})

export default authenticationRouter

