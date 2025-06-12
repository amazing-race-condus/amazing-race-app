import { Response } from "express"
import { prisma } from "../index"

export const getAllUsers = async () => {

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true
    }
  })
  return users
}

export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username: username },
    select: {
      id: true,
      username: true,
      passwordHash: true
    }
  })
  return user
}

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
    }
  })
  return user
}

export const createUser = async (username: string, password: string, res: Response) => {

  if (!password || !username) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu." })
    return
  }

  const savedUser = await prisma.user.create({
    data: {
      username: username,
      passwordHash: password,
    },
    select: {
      id: true,
      username: true
    }
  })
  return savedUser
}

export const deleteUser = async (userId: number) => {
  const id = userId
  const user = await prisma.user.delete({
    where: { id },
  })
  return user
}
