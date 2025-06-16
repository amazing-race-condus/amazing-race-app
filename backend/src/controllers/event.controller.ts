import { prisma } from "../index"
import { AddEvent } from "@/types"

export const getAllEvents = async () => {
  const events = await prisma.event.findMany({
    include: {
      group: true,
      checkpoints: true,
    }
  })
  return events
}

export const getDefaultEvent = async () => {
  const events = await prisma.event.findFirst({
    include: {
      group: true,
      checkpoints: true,
    },
    orderBy: {
      eventDate: "desc"
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

  const event = await prisma.event.update({
    where: { id },
    data: {
      startTime: now,
      endTime: null
    }
  })
  return event
}

export const endEvent = async (eventId: number) => {
  const id = eventId
  const now = new Date()
  const start = await prisma.event.findUnique({
    where: {
      id: id
    }, select: {
      startTime: true
    }
  })

  if (start?.startTime === null) {
    return null
  }
  const event = await prisma.event.update({
    where: { id },
    data: { endTime : now }
  })
  return event
}


export const createEvent = async (event: AddEvent) => {
  if (event.name === "" || event.name === null) {
    return null
  }
  const createdEvent = await prisma.event.create({
    data: {
      name: event.name,
      eventDate: event.eventDate
    }
  })
  return createdEvent
}
