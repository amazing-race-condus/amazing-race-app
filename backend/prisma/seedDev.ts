import { PrismaClient } from "./prisma"
import { AddGroup, AddCheckpoint } from "../../frontend/src/types"

const prisma = new PrismaClient()

console.log(process.env.DATABASE_URL)

async function main() {
  const existing = await prisma.event.findUnique({
    where: { name: "Eventti" },
  }) 

  if (!existing) {
    await prisma.event.create({
      data: { name: "Eventti" },
    })
    console.log("Inserted event")
  } else {
    console.log("Event already exists")
  }

  const checkpoints: AddCheckpoint[] = [
    { name: "Oodi", type: "START" },
    { name: "Eläintarha", type: "INTERMEDIATE" },
    { name: "Kumpulan kampus", type: "INTERMEDIATE" },
    { name: "Vallila", type: "INTERMEDIATE" },
    { name: "Linnanmäki", type: "INTERMEDIATE" },
    { name: "Katri Valan puisto", type: "INTERMEDIATE" },
    { name: "Populus", type: "INTERMEDIATE" },
    { name: "Korkeasaari", type: "FINISH" },
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
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
  })
