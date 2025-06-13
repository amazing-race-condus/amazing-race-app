import { Response } from "express"
import { prisma } from "../index"
import { validatePassword } from "../utils/passwordValidator"
import bcrypt from "bcrypt"

export const getAllUsers = async () => {

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      admin: true
    }
  })
  return users
}

export const getUserByAdminRights = async (admin: boolean) => {
  const user = await prisma.user.findFirst({
    where: { admin: admin },
    select: {
      id: true,
      username: true,
      passwordHash: true,
      admin: true
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
      admin: true
    }
  })
  return user
}

export const createUser = async (username: string, password: string, admin: boolean, res: Response) => {
  if (!password || !username) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu." })
    return
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: username.trim(),
        mode: "insensitive"
      }
    }
  })
  if (existingUser) {
    res.status(400).json({ error: "Käyttäjänimi on jo käytössä." })
    return false
  }
  const validPassword = await validatePassword(password, res)

  if (!validPassword) {
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const savedUser = await prisma.user.create({
    data: {
      username: username,
      passwordHash: passwordHash,
      admin: admin
    },
    select: {
      id: true,
      username: true,
      admin: true
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
