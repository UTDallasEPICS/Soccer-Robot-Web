
//

export default defineEventHandler(async (event) => {

  const prisma = event.context.prisma
  const claims = event.context.claims

  const body = await readBody(event)
  const username = body.username

  const existingUsername = await prisma.player.findFirst({
    where: {
      username
    }
  })
  
  let msg
  if(!existingUsername){
     const player = await prisma.player.update({
      where: {
        user_id: claims['sub'],
      },
      data: {
        username,
      },
      select: {
        username: true,
        role: true
      } 
    })
    msg = 200
    setCookie(event, 'sruser', JSON.stringify(player))
  } else {
    msg = 403
  }

  return msg
})

// 403 - username is not unique
// 200 went okay