import { prisma } from "../../src/index"

export const getAllEvents = async () => {
  const events = await prisma.event.findMany({
    include: {
      group: true,
      checkpoints: true,
    }
  })
  return events
}

export const getEventById = async (eventId: number) => {
  const id = eventId
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      group: true,
      checkpoints: true,
    }
  })
  return event
}

export const startEvent = async (eventId: number) => {
  const id = eventId
  const now = new Date()
  // To do right way to add timezone
  const plus3h = new Date(now.getTime() + 3 * 60 * 60 * 1000)

  const event = await prisma.event.update({
    where: { id },
    data: {
      startTime: plus3h,
      endTime: null
    }
  })
  return event
}

export const endEvent = async (eventId: number) => {
  const id = eventId
  const now = new Date()
  // To do right way to add timezone
  const plus3h = new Date(now.getTime() + 3 * 60 * 60 * 1000)

  const event = await prisma.event.update({
    where: { id },
    data: { endTime : plus3h }
  })
  return event
}
