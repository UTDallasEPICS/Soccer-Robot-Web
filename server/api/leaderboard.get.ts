import { PrismaClient, Player } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  const {sortedColumn} = getQuery(event);

  const orderBy = {[(sortedColumn as string)]:  'desc' };

  const playerData = await prisma.Player.findMany({ orderBy: orderBy,
    take: 5
  }) as Player[];


  return playerData
})