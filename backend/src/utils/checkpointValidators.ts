import { Response } from "express"
import { prisma } from "../index"
import { Type } from "../../prisma/prisma"

const validateName = async (name: unknown, res: Response): Promise<boolean> => {
  if (typeof name !== "string") {
    res.status(400).json({ error: "Nimen tulee olla merkkijono" })
    return false
  }
  if  (name.length > 100 ) {
    res.status(400).json({ error: "Nimi on liian pitkä. Maksimi pituus on 100 kirjainta."})
    return false
  }

  if (name.length < 2 ) {
    res.status(400).json({ error: "Nimi on liian lyhyt. Minimi pituus on 2 kirjainta."})
    return false
  }

  const existingName = await prisma.checkpoint.findFirst({
    where: {
      name: {
        equals: name.trim(),
        mode: "insensitive"
      }
    }
  })
  if (existingName) {
    res.status(400).json({ error: "Rastin nimi on jo käytössä. Syötä uniikki nimi." })
    return false
  }

  return true
}

const validateCheckpointLayout = async (type: Type, res: Response): Promise<boolean> => {
  const allCheckpoints = await prisma.checkpoint.findMany()

  if (allCheckpoints.length >= 8) {
    res.status(400).json({ error: "Rastien maksimimäärä on 8 rastia."})
    return false
  }


  if (type === Type.START) {
    const existingStart = await prisma.checkpoint.findFirst({
      where: { type: Type.START }
    })
    if (existingStart) {
      res.status(400).json({ error: "Lähtörasti on jo luotu." })
      return false
    }
  } else if (type === Type.FINISH) {
    const existingFinish = await prisma.checkpoint.findFirst({
      where: { type: Type.FINISH }
    })
    if (existingFinish) {
      res.status(400).json({ error: "Maali on jo luotu." })
      return false
    }
  } else if (type === Type.INTERMEDIATE) {
    const intermediateCheckpoints = allCheckpoints.filter(c => c.type === "INTERMEDIATE").length
    if (intermediateCheckpoints >= 6) {
      res.status(400).json({ error: "Välirastien maksimimäärä on 6 rastia." })
      return false
    }
  }
  return true
}

export { validateName, validateCheckpointLayout }
