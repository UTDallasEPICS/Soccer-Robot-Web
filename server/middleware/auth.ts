import jwt from "jsonwebtoken"
import fs from 'fs'
import { loginRedirectUrl } from "../api/auth0"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  event.context.prisma = prisma
  const srtoken = getCookie(event, 'srtoken') || ''
  if(srtoken){
    try {
      const claims:any = jwt.verify(srtoken, fs.readFileSync(process.cwd() + '/cert-dev.pem'))
      if(claims){
        event.context.claims = claims
        const id = claims['sub']
        const player = await prisma.player.findUnique({
          where:{
            user_id: id
          }
        })
        if(player){
          setCookie(event, 'sruser', 't')
        } else {
          setCookie(event, 'sruser', 'f')
        }
      }
    } catch (error) {
      console.error(error)
      setCookie(event, 'srtoken', '')
      return await sendRedirect(event, loginRedirectUrl())
    }
  } else {
    setCookie(event, 'sruser', 'f')
    setCookie(event, 'srtoken', '')
  }
})



