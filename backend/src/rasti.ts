import { PrismaClient } from "../prisma/prisma/"

const prisma = new PrismaClient

async function main() {
  await prisma.rasti.create({
    data: {
      name: "Oodi"
    }
  })

  const allRastit = await prisma.rasti.findMany()
  console.log(allRastit)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()
    process.exit(1)
  })
