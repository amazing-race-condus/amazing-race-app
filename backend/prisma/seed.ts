import { PrismaClient } from "./prisma"

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
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
  })
