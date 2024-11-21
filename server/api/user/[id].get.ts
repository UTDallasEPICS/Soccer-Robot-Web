
export default defineEventHandler(async (event) => {

    const prisma = event.context.prisma
    const claims = event.context.claims
    const id = getRouterParam(event, 'id')

    const player = await prisma.player.findUnique({
        where:{
            user_id: id
        }
    })

    return player

})
