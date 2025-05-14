import express, { Response } from "express"

const app = express()
const port = 3000

app.get("/", (_, res: Response) => {
  res.send("Hello World!")
})

app.get("/ping", (_, res: Response) => {
  res.send("Pong!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


export default app;
