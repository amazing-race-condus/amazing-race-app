import { prisma } from "../index"
import {Penalty } from "@/types"

type newPenalty = Omit<Penalty, "id">

export const getPenalties = async () => {
  const penalties = await prisma.penalty.findMany()
  return penalties
}

export const createPenalty = async (groupId: number, data: newPenalty) => {
  const newPenalty = await prisma.penalty.create({
    data: {
      groupId: groupId,
      time: data.time,
      type: data.type,
      checkpointId: data.checkpointId
    }
  })
  return newPenalty
}

export const getPenaltyByGroup = async (groupId: number) => {
  const penalty = await prisma.penalty.findMany({
    where: { groupId : groupId },
  })
  return penalty
}

export const deletePenalty = async (penaltyId: number) => {
  const id = penaltyId
  const deletedPenalty = await prisma.penalty.delete({
    where: { id }
  })
  return deletedPenalty
}

export const deleteAllPenaltiesOfGroup = async (groupId: number) => {
  const groupsPenalties = await prisma.penalty.deleteMany({
    where: { groupId : groupId }
  })
  return groupsPenalties
}
