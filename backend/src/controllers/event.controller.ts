import { prisma } from "../index"
<<<<<<< HEAD
<<<<<<< HEAD
import { AddEvent } from "@/types"
=======
import { Event } from "@/types"
>>>>>>> 12b89a7 (Add calender and backend functionality for event creation)
=======
import { AddEvent } from "@/types"
>>>>>>> 5270bc3 (Fixes to event creation functionality)

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

<<<<<<< HEAD
<<<<<<< HEAD
export const createEvent = async (event: AddEvent) => {
=======
export const createEvent = async (event: Event) => {
>>>>>>> 12b89a7 (Add calender and backend functionality for event creation)
=======
export const createEvent = async (event: AddEvent) => {
>>>>>>> 5270bc3 (Fixes to event creation functionality)
  if (event.name === "" || event.name === null) {
    return null
  }
  const createdEvent = await prisma.event.create({
    data: {
      name: event.name,
<<<<<<< HEAD
      eventDate: event.eventDate
=======
      //eventDate: event.eventDate
>>>>>>> 12b89a7 (Add calender and backend functionality for event creation)
    }
  })
  return createdEvent
}
