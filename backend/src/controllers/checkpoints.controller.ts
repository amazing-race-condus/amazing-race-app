import { Response } from "express"
import { prisma } from "../index"
import { Type } from "../../prisma/prisma/"
import { Checkpoint, CheckpointType } from "@/types"
import { validateName, validateHint, validateCheckpointLayout } from "../utils/checkpointValidators"

type newCheckpoint = Omit<Checkpoint, "id">

export const getAllCheckpoints = async (eventId: number) => {
  const allCheckpoints = await prisma.checkpoint.findMany({
    where: {
      eventId: eventId
    }
  }
  )
  return allCheckpoints
}

export const getCheckpointById = async (checkpointId: number) => {
  const id = checkpointId
  const checkpoint = await prisma.checkpoint.findUnique({
    where: { id },
  })
  return checkpoint
}

export const createCheckpoint = async (data: newCheckpoint, res: Response) => {
  if (!data.name || !data.type ) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu." })
    return
  }

  let parsedType: Type | undefined = undefined

  if (!Object.values(Type).includes(data.type)) {
    res.status(400).json({ error: "Virheellinen tyyppi." })
    return
  }

  parsedType = data.type as Type

  const validCheckpointLayout = await validateCheckpointLayout(parsedType, res, data.eventId!)
  if (!validCheckpointLayout) {
    return
  }

  const validName = await validateName(data.name, res, data.eventId!)
  if (!validName) {
    return
  }

  const validHint = await validateHint(data.hint, res)
  if (!validHint) {
    return
  }

  const validEasyHint = await validateHint(data.hint, res)
  if (!validEasyHint) {
    return
  }

  const savedCheckpoint = await prisma.checkpoint.create({
    data: {
      name: data.name,
      type: data.type,
      hint: data.hint,
      easyHint: data.easyHint,
      eventId: data.eventId
    }
  })
  return savedCheckpoint
}

export const deleteCheckpoint = async (checkpointId: number) => {
  const id = checkpointId
  await prisma.checkpoint.delete({
    where: {
      id: id,
    }
  })
}

export const modifyCheckpoint = async (checkpointId: number, name: string, type: CheckpointType, hint: string, easyHint: string, res: Response) => {
  const id = checkpointId
  const data: Partial<{ name: string, type: CheckpointType, hint: string, easyHint: string}> = {}
  const checkpointToModify = await prisma.checkpoint.findUnique({
    where: { id },
  })
  if (!checkpointToModify) {
    res.status(404).json({ error: "Rastia ei löydy" })
    return
  }

  let parsedType: Type | undefined = undefined
  if (!Object.values(Type).includes(type)) {
    res.status(400).json({ error: "Virheellinen tyyppi." })
    return
  }
  parsedType = type as Type
  const validCheckpointLayout = await validateCheckpointLayout(parsedType, res, checkpointId)
  if (!validCheckpointLayout) {
    return
  }

  // FIX: Pass correct eventId and checkpointId to validateName, handle possible null eventId
  if (checkpointToModify.eventId === null || checkpointToModify.eventId === undefined) {
    res.status(400).json({ error: "Rastilla ei ole tapahtumaa." })
    return
  }
  const validName = await validateName(name, res, checkpointToModify.eventId, checkpointId)
  if (!validName) {
    return
  }

  const validHint = await validateHint(hint, res, checkpointId)
  if (!validHint) {
    return
  }

  const validEasyHint = await validateHint(easyHint, res, checkpointId)
  if (!validEasyHint) {
    return
  }

  if (type !== undefined) data.type = type
  if (name !== undefined) data.name = name
  if (hint !== undefined) data.hint = hint
  if (easyHint !== undefined) data.easyHint = easyHint

  const updatedCheckpoint = await prisma.checkpoint.update({
    where: { id },
    data
  })
  return updatedCheckpoint
}
