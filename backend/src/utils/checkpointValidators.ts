import { Response } from "express"
import { prisma } from "../index"
import { Type } from "../../prisma/prisma"

const validateName = async (name: unknown, res: Response, eventId : number, id?:number): Promise<boolean> => {
  if (typeof name !== "string") {
    res.status(400).json({ error: "Nimen tulee olla merkkijono" })
    return false
  }
  if  (name.length > 100 ) {
    res.status(400).json({ error: "Nimi on liian pitkä. Maksimi pituus on 100 kirjainta." })
    return false
  }

  if (name.length < 2 ) {
    res.status(400).json({ error: "Nimi on liian lyhyt. Minimi pituus on 2 kirjainta." })
    return false
  }

  const existingName = await prisma.checkpoint.findFirst({
    where: {
      eventId : eventId,
      name: {
        equals: name.trim(),
        mode: "insensitive"
      }
    }
  })
  if (existingName && existingName.id !== id) {
    res.status(400).json({ error: "Rastin nimi on jo käytössä. Syötä uniikki nimi." })
    return false
  }

  return true
}

const validateHint = async (hint: unknown, res: Response, id?: number): Promise<boolean> => {
  if (typeof hint !== "string") {
    res.status(400).json({ error: "Vihjeen tulee olla merkkijono." })
    return false
  }

  if  (hint.length > 2000 ) {
    res.status(400).json({ error: "Vihje on liian pitkä. Enimmäispituus on 2000 merkkiä." })
    return false
  }

  if  (hint !== "" && !(hint.startsWith("http://") || hint.startsWith("https://"))) {
    res.status(400).json({ error: "Vihjeen tulee alkaa http:// tai https://." })
    return false
  }

  const existingHint = await prisma.checkpoint.findFirst({
    where: {
      OR: [
        {
          hint: {
            equals: hint.trim(),
            mode: "insensitive"
          }
        },
        {
          easyHint: {
            equals: hint.trim(),
            mode: "insensitive"
          }
        },
      ]
    },
  })

  if (existingHint && existingHint.hint !== "" && existingHint.easyHint !== "" && existingHint.id !== id) {
    res.status(400).json({ error: "Vihje on jo käytössä. Syötä uniikki vihje." })
    return false
  }

  return true
}


const validateCheckpointLayout = async (type: Type, res: Response, eventId: number, id?: number): Promise<boolean> => {
  const allCheckpoints = await prisma.checkpoint.findMany({
    where: {
      eventId: eventId
    }
  })

  if (allCheckpoints.length >= 8 && !id) {
    res.status(400).json({ error: "Rastien maksimimäärä on 8 rastia."})
    return false
  }


  if (type === Type.START) {
    const existingStart = await prisma.checkpoint.findFirst({
      where: { type: Type.START, eventId : eventId }
    })
    if (existingStart && existingStart.id !== id) {
      res.status(400).json({ error: "Lähtörasti on jo luotu." })
      return false
    }
  } else if (type === Type.FINISH) {
    const existingFinish = await prisma.checkpoint.findFirst({
      where: { type: Type.FINISH , eventId : eventId}
    })
    if (existingFinish && existingFinish.id !== id) {
      res.status(400).json({ error: "Maali on jo luotu." })
      return false
    }
  } else if (type === Type.INTERMEDIATE) {
    const intermediateCheckpoints = allCheckpoints.filter(c => c.type === "INTERMEDIATE")
    if (id && intermediateCheckpoints.some(c => c.id === id)) {
      return true
    } else if (intermediateCheckpoints.length >= 6) {
      res.status(400).json({ error: "Välirastien maksimimäärä on 6 rastia." })
      return false
    }
  }
  return true
}

export { validateName, validateCheckpointLayout, validateHint }
