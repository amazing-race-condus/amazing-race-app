import { PrismaClient } from "./prisma"
import { AddGroup, AddCheckpoint } from "../../shared/types"

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
    await prisma.event.create({
      data: {
        name: "Eventti",
        minRouteTime: 90,
        maxRouteTime: 120
      },
    })
    console.log("Inserted event")
  } else {
    console.log("Event already exists")
  }

  const checkpoints: AddCheckpoint[] = [
    { name: "Katri Valan puisto", type: "START", eventId: 1, hint: null },
    { name: "Johanneksenkirkko", type: "INTERMEDIATE", eventId: 1, hint: null },
    { name: "Kulosaaren kenttä", type: "INTERMEDIATE", eventId: 1, hint: null },
    { name: "Katajanokka", type: "INTERMEDIATE", eventId: 1, hint: null },
    { name: "Lahnalahden puisto", type: "INTERMEDIATE", eventId: 1, hint: null },
    { name: "Oodi", type: "INTERMEDIATE", eventId: 1, hint: null },
    { name: "Kisahalli", type: "INTERMEDIATE", eventId: 1, hint: null },
    { name: "Luonnontieteellinen museo", type: "FINISH", eventId: 1, hint: null },
  ]

  await prisma.checkpoint.createMany({
    data: checkpoints,
    skipDuplicates: true,
  })

  const groups: AddGroup[] = [
    { name: "Pööpöilijät", members: 4 },
    { name: "Mestaritiimi", members: 6 },
    { name: "Kannunkulma", members: 4 },
    { name: "Luuserit", members: 5 },
    { name: "Nimetön", members: 4 },
    { name: "Höhlät", members: 5 },
    { name: "Mansikat", members: 7 },
    { name: "Kurikan nimipäivät", members: 8 },
    { name: "Penat", members: 4 },
    { name: "Vaivaiset", members: 6 },
    { name: "Fifit", members: 5 },
    { name: "Liiallisen pituuden suuret ystävät", members: 4 },
    { name: "Draamailijat", members: 7 }
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
          eventId: 1
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
