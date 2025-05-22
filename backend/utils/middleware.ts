import { Request, Response, NextFunction } from "express"

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
    res.status(400).json({ error: "Malformatted id." })
  } else if (error instanceof Error && error.name === "ValidationError") {
    res.status(400).json({ error: error.message })
  } else if (error instanceof Error && error.name === "PrismaClientKnownRequestError"){
    res.status(500).json({error: "Request error from Prisma."})
  } else if (error instanceof Error && error.name === "PrismaClientValidationError") {
    res.status(400).json({ error: "Validation error from Prisma" })
  } else if (error instanceof Error && error.name === "PrismaClientUnknownRequestError") {
    res.status(500).json({error: "Unknown request error from Prisma."})
  } else {
    res.status(500).json({ error: "An unexpected error occurred." })
  }
  next(error)
}

export { unknownEndpoint, errorHandler }


