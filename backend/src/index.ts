import express, { Response, Request } from "express"
import { PrismaClient } from "../prisma/prisma/"
import cors from "cors"

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())
const port = 3000

app.get("/", (_, res: Response) => {
  res.send("Hello World!")
})

app.get("/ping", (_, res: Response) => {
  res.send("Pongee!")
})

app.get("/pipeline", async (_, res: Response) => {

  const allRastit = await prisma.rasti.findMany()

  res.send(allRastit)
})

app.post("/pipeline", async (req: Request, res: Response) => {
  const body = req.body
  const savedRasti = await prisma.rasti.create({
    data: {
      name: body.name
    }
  })
  res.status(201).json(savedRasti)
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, server, prisma };
