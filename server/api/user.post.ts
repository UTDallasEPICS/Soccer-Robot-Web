export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  const claims = event.context.claims
  const body = await readBody(event)
  const username = body.username
  const existingUsername = await prisma.player.findFirst({
    where: {
      user_id: claims['sub']
    }
  })
  
  let msg
  //console.log(existingUsername.user_id)
  if(!existingUsername.username){
     const player = await prisma.player.create({
      data: {
        user_id: claims['sub'],
        username,
        email: claims['email']
      }
      
    })
    msg = 200
  } else {
    msg = 403
    console.log('hello2')
  }

  return msg
})

// 403 - username is not unique
// 200 went okay