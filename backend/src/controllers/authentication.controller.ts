import { Response } from "express"
import { prisma } from "../index"
import { validatePassword } from "../utils/passwordValidator"
import bcrypt from "bcrypt"
import { Mailer } from "../utils/emailUtils"
import { setPasswordResetTime } from "../utils/middleware"

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

export const getUserByUsername = async (username: string, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { username: username },
    select: {
      id: true,
      username: true,
      admin: true
    }
  })
  if (!user) {
    res.status(404).json({ error: "Käyttäjää ei löydy" })
    return

  }
  return user
}

export const createUser = async (username: string, password: string, admin: boolean, res: Response) => {
  if (!password || !username) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu" })
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
    res.status(400).json({ error: "Käyttäjänimi on jo käytössä" })
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

export const modifyUser = async (password: string, res: Response) => {

  const userToModify = await getUserByAdminRights(true)
  if (!userToModify) {
    res.status(404).json({ error: "Käyttäjää ei löydy" })
    return
  }

  if (!password) {
    res.status(400).json({ error: "Salasana puuttuu" })
    return
  }

  const validPassword = await validatePassword(password, res)

  if (!validPassword) {
    return
  }


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)


  const updatedUser = await prisma.user.update({
    where: { id: userToModify.id },
    data: {
      passwordHash
    },
    select: {
      id: true,
      username: true,
      admin: true
    }
  })

  return updatedUser
}


export const sendMailToUser = async (to: string, token: string, res: Response) => {
  const url = process.env.FRONTEND_URL

  if (!url) {
    res.status(500).json({ error: "FRONTEND_URL is not defined in environment." })
    return
  }

  const resetUrl = `${url}/resetpassword/${token}`

  const message = {
    from: "amazingracecondus@gmail.com",
    to: to,
    subject: "Amazing Race Condus App: Salasanan vaihto",
    text: "Vaihda salasana 15 minuutin kuluessa: "+ resetUrl,
    html: `<p>Vaihda salasanasi klikkaamalla <a href="${resetUrl}">tästä</a>. Linkki on voimassa 15 minuuttia.</p>`
  }
  await Mailer(message)
}

export const changePassword = async (password: string, confirmPassword: string, res: Response) => {
  if ((!password || !confirmPassword) || (password !== confirmPassword)) {
    res.status(400).json({ error: "Salasanat eivät täsmää." })
    return
  }
  if (validatePassword(password, res)) {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const updatedUser = await prisma.user.updateMany({
      where: {
        admin: false
      },
      data: {
        passwordHash: passwordHash
      }
    })
    if (updatedUser.count !== 0) {
      setPasswordResetTime()
      return true
    } else {
      return false
    }
  }
}
