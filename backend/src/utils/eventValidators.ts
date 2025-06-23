import { Response } from "express"
import { prisma } from "../index"

export const validateName = async (name: unknown, res: Response, id?: number): Promise<boolean> => {
  if (typeof name !== "string") {
    res.status(400).json({ error: "Nimen tulee olla merkkijono" })
    return false
  }
  if  (name.length > 50 ) {
    res.status(400).json({ error: "Nimi on liian pitkä. Maksimi pituus on 50 kirjainta"})
    return false
  }

  if (name.length < 2 ) {
    res.status(400).json({ error: "Nimi on liian lyhyt. Minimi pituus on 2 kirjainta"})
    return false
  }
  const existingName = await prisma.event.findFirst({
    where: {
      name: {
        equals: name.trim(),
        mode: "insensitive"
      },
    }
  })
  if (existingName && existingName.id !== id) {
    res.status(400).json({ error: "Tapahtuman nimi on jo käytössä. Syötä uniikki nimi" })
    return false
  }
  return true
}
