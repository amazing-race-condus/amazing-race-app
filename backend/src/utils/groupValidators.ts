import { Response } from "express"
import { prisma } from "../index"

const validateName = async (name: unknown, res: Response, eventId: number, id?: number): Promise<boolean> => {
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
  const existingNames = await prisma.group.findMany({
    where: {
      eventId: eventId,
      name: {
        equals: name.trim(),
        mode: "insensitive"
      }
    }
  })

  for (const existingName of existingNames) {
    if (existingName && existingName.id !== id) {
      res.status(400).json({ error: "Ryhmän nimi on jo käytössä. Syötä uniikki nimi" })
      return false
    }
  }
  return true
}

const validateMembers = (members: unknown, res: Response) : boolean => {
  if (!Number(members)) {
    res.status(400).json({ error: "Syötä jäsenten määrä numeromuodossa" })
    return false
  }
  const amount = Number(members)
  if (!Number.isInteger(amount)){
    res.status(400).json({ error: "Syötä kokonaisluku" })
    return false
  }
  if (Number(members) < 4) {
    res.status(400).json({ error: "Ryhmässä tulee olla vähintään 4 jäsentä" })
    return false
  }

  if (Number(members) > 6) {
    res.status(400).json({ error: "Ryhmässä voi olla korkeintaan 6 jäsentä" })
    return false
  }
  return true
}

export { validateName, validateMembers }
