import { prisma } from "../index"
import { AddEvent } from "@/types"
import { validateName } from "../utils/eventValidators"
import { Response } from "express"

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
  const event = await prisma.event.findFirst({
    include: {
      group: true,
      checkpoints: true,
    },
    orderBy: {
      eventDate: "desc"
    }
  })
  return event

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


export const createEvent = async (event: AddEvent, res: Response) => {
  if (event.name === "" || event.name === null) {
    return null
  }

  const validName = await validateName(event.name, res )
  if (!validName) {
    return
  }
  const createdEvent = await prisma.event.create({
    data: {
      name: event.name,
      eventDate: event.eventDate
    }
  })
  return createdEvent
}


export const modifyEvent = async (eventId: number, name: string, eventDate: Date, res: Response) => {
  const id = eventId
  const data: Partial<{ name: string, eventDate: Date}> = {}

  const eventToModify = await prisma.event.findUnique({
    where: { id },
  })

  if (!eventToModify) {
    res.status(404).json({ error: "Tapahtumaa ei löydy" })
    return
  }
  if (name) {
    const validName = await validateName(name, res, eventId )
    if (!validName) {
      return
    }
  }

  if (name !== undefined) data.name = name
  if (eventDate !== undefined) data.eventDate = eventDate


  const updatedEvent = await prisma.event.update({
    where: { id },
    data
  })

  return updatedEvent
}

export const deleteEvent = async (eventId: number) => {
  const id = eventId
  const event = await prisma.event.delete({
    where: { id },
  })
  return event
}
