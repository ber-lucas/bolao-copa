import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Guilherme Azevedo',
      email: 'guilherme.azevedo@gmail.com',
      avatarUrl: 'https://github.com/ber-lucas.png',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Bolão da Família Azevedo',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    },
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T13:03:09.798Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T13:03:09.798Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoint: 2,
          secondTeamPoint: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()