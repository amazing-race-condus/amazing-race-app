import { PrismaClient } from "./prisma"
import { AddGroup, AddCheckpoint, Event } from "../../shared/types"

const prisma = new PrismaClient()

console.log(process.env.DATABASE_URL)

type Distances = {
  [from: string]: {
    [to: string]: number
  }
}

async function main() {
  const existing = await prisma.event.findUnique({
    where: { name: "Eventti" },
  }) 

  if (!existing) {
    await prisma.event.createMany({
      data: [{
        name: "Eventti",
        minRouteTime: 90,
        maxRouteTime: 120
      },
      {
        name: "Eventti2",
        minRouteTime: 80,
        maxRouteTime: 100
      }]
    })
    console.log("Inserted event")
  } else {
    console.log("Event already exists")
  }

  const event = await prisma.event.findUnique({
    where: { name: "Eventti" },
  })

  const checkpoints: AddCheckpoint[] = [
    { name: "Katri Valan puisto", type: "START", hint: null, easyHint: null, eventId: event!.id },
    { name: "Johanneksenkirkko", type: "INTERMEDIATE", hint: null, easyHint: null, eventId: event!.id },
    { name: "Kulosaaren kenttä", type: "INTERMEDIATE", hint: null, easyHint: null, eventId: event!.id },
    { name: "Katajanokka", type: "INTERMEDIATE", hint: null, easyHint: null, eventId: event!.id },
    { name: "Lahnalahden puisto", type: "INTERMEDIATE", hint: null, easyHint: null, eventId: event!.id },
    { name: "Oodi", type: "INTERMEDIATE", hint: null, easyHint: null, eventId: event!.id },
    { name: "Kisahalli", type: "INTERMEDIATE", hint: null, easyHint: null, eventId: event!.id },
    { name: "Luonnontieteellinen museo", type: "FINISH", hint: null, easyHint: null, eventId: event!.id },
  ]

  await prisma.checkpoint.createMany({
    data: checkpoints,
    skipDuplicates: true,
  })

  const groups: AddGroup[] = [
    { name: "Pööpöilijät", members: 4, easy: true, eventId: event!.id },
    { name: "Mestaritiimi", members: 6, easy: false, eventId: event!.id },
    { name: "Kannunkulma", members: 4, easy: true, eventId: event!.id },
    { name: "Luuserit", members: 5, easy: false, eventId: event!.id },
    { name: "Nimetön", members: 4, easy: true, eventId: event!.id },
    { name: "Höhlät", members: 5, easy: false, eventId: event!.id },
    { name: "Mansikat", members: 7, easy: true, eventId: event!.id },
    { name: "Kurikan nimipäivät", members: 8, easy: true, eventId: event!.id },
    { name: "Penat", members: 4, easy: false, eventId: event!.id },
    { name: "Vaivaiset", members: 6, easy: false, eventId: event!.id },
    { name: "Fifit", members: 5, easy: true, eventId: event!.id },
    { name: "Liiallisen pituuden suuret ystävät", members: 4, easy: true, eventId: event!.id },
    { name: "Draamailijat", members: 7, easy: false, eventId: event!.id }
  ]

  await prisma.group.createMany({
    data: groups,
    skipDuplicates: true
  })

  const distances: Distances = {
    "Katri Valan puisto": {
      "Oodi": 18,
      "Kisahalli": 16,
      "Lahnalahden puisto": 27,
      "Katajanokka": 29,
      "Kulosaaren kenttä": 14,
      "Johanneksenkirkko": 30
    },
    "Oodi": {
      "Kisahalli": 11,
      "Lahnalahden puisto": 20,
      "Katajanokka": 20,
      "Kulosaaren kenttä": 24,
      "Johanneksenkirkko": 15,
      "Luonnontieteellinen museo": 9
    },
    "Kisahalli": {
      "Oodi": 11,
      "Lahnalahden puisto": 30,
      "Katajanokka": 20,
      "Kulosaaren kenttä": 25,
      "Johanneksenkirkko": 18,
      "Luonnontieteellinen museo": 14
    },
    "Lahnalahden puisto": {
      "Oodi": 20,
      "Kisahalli": 30,
      "Katajanokka": 36,
      "Kulosaaren kenttä": 32,
      "Johanneksenkirkko": 34,
      "Luonnontieteellinen museo": 22
    },
    "Katajanokka": {
      "Oodi": 20,
      "Kisahalli": 20,
      "Lahnalahden puisto": 36,
      "Kulosaaren kenttä": 34,
      "Johanneksenkirkko": 20,
      "Luonnontieteellinen museo": 18
    },
    "Kulosaaren kenttä": {
      "Oodi": 24,
      "Kisahalli": 25,
      "Lahnalahden puisto": 32,
      "Katajanokka": 34,
      "Johanneksenkirkko": 34,
      "Luonnontieteellinen museo": 25
    },
    "Johanneksenkirkko": {
      "Oodi": 15,
      "Kisahalli": 18,
      "Lahnalahden puisto": 34,
      "Katajanokka": 20,
      "Kulosaaren kenttä": 34,
      "Luonnontieteellinen museo": 16
    }
  }

  const checkpointNames = Object.keys(distances)

  const allCheckpoints = await prisma.checkpoint.findMany({
    where: {
      name: {
        in: [
          ...checkpointNames,
          ...checkpointNames.flatMap(name => Object.keys(distances[name as keyof typeof distances]))
        ],
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  const checkpointMap: Record<string, number> = {}
  allCheckpoints.forEach(cp => {
    checkpointMap[cp.name] = cp.id
  })

  const checkpointDistances: {
    fromId: number,
    toId: number,
    time: number,
    eventId: number,
  }[] = []

  for (const fromName in distances) {
    const fromId = checkpointMap[fromName]
    for (const toName in distances[fromName]) {
      const toId = checkpointMap[toName]
      const time = distances[fromName][toName]
      if (fromId != null && toId != null) {
        checkpointDistances.push({
          fromId,
          toId,
          time,
          eventId: event!.id
        })
      }
    }
  }

  await prisma.checkpointDistance.createMany({
    data: checkpointDistances,
    skipDuplicates: true
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
  })
