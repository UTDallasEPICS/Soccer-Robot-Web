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
     const player = await prisma.player.create({
      data: {
        user_id: claims['sub'],
        username,
        email: claims['email']
      } 
    })
    msg = 200
    setCookie(event, 'sruser', username)
  } else {
    msg = 403
  }

  return msg
})

// 403 - username is not unique
// 200 went okay