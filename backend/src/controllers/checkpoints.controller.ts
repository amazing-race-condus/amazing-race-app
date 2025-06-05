import { Response } from "express"
import { prisma } from "../../src/index"
import { Type } from "../../prisma/prisma/"
import { Checkpoint } from "@/types"
import { validateName, validateCheckpointLayout } from "../../utils/checkpointVaildators"

type newCheckpoint = Omit<Checkpoint, "id">

export const getAllCheckpoints = async () => {
  const allCheckpoints = await prisma.checkpoint.findMany()
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
  if (!data.name || !data.type) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu."})
    return
  }

  const validName = await validateName(data.name, res)
  if (!validName) {
    return
  }

  let parsedType: Type | undefined = undefined;


  if (!Object.values(Type).includes(data.type)) {
    res.status(400).json({ error: "Virheellinen tyyppi." })
    return
  }

  parsedType = data.type as Type

  const validCheckpointLayout = await validateCheckpointLayout(parsedType, res)
  if (!validCheckpointLayout) {
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
