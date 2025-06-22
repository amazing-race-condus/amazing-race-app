import { Request, Response, NextFunction } from "express"
import { User } from "@/types"
import jwt from "jsonwebtoken"

let passwordResetTime: number | null = null

interface CustomRequest extends Request {
  token?: string | null
  user?: User | null
}

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "Unknown endpoint" })
}

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Error && error.name === "CastError") {
    res.status(400).json({ error: "Malformatted id" })
  } else if (error instanceof Error && error.name === "ValidationError") {
    res.status(400).json({ error: error.message })
  } else if (error instanceof Error && error.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Token missing or invalid" })
  } else if (error instanceof Error && error.name === "TokenExpiredError") {
    res.status(401).json({
      error: "Token expired"
    })
  } else if (error instanceof Error && error.name === "PrismaClientKnownRequestError") {
    const lastLine = error.message
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .at(-1)
    res.status(400).json({ error: lastLine ?? "Unknown Prisma error" })
  } else if (error instanceof Error && error.name === "PrismaClientValidationError") {
    res.status(400).json({ error: "Validation error from Prisma" })
  } else if (error instanceof Error && error.name === "PrismaClientUnknownRequestError") {
    res.status(500).json({error: "Unknown request error from Prisma"})
  } else {
    res.status(500).json({ error: "An unexpected error occurred" })
  }
  next(error)
}

const tokenExtractor = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "")
  } else {
    req.token = null
  }
  next()
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const secret = process.env.SECRET
  if (!secret) {
    res.status(500).json({ error: "SECRET is not defined in environment" })
    return
  }

  try {
    console.log(req.token)
    const decodedToken = jwt.verify(req.token ?? "", secret) as jwt.JwtPayload
    if (!decodedToken.id) {
      res.status(400).json({ error: "Invalid token" })
      return
    } else if (!decodedToken.admin && passwordResetTime) {
      if (passwordResetTime > decodedToken.iat!) {
        res.status(400).json({ error: "Invalid token" })
        return
      }
    }

    req.user = decodedToken as User
    next()
  } catch (error) {
    next(error)
  }
}

export const setPasswordResetTime = () => {
  passwordResetTime = Math.floor(Date.now() / 1000)
}


export { unknownEndpoint, errorHandler, tokenExtractor, verifyToken }


