const { PrismaClient } = require('@prisma/client')
const { v4 } = require('uuid');
// npx prisma migrate dev --name init --preview-feature
const prisma = new PrismaClient()

async function main() {
  await prisma.cars.create({
    data: {
      id: v4(),
      name: 'Nikkei Asia',
      image_path: '1'
    }
  })

}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })