import jwt from "jsonwebtoken"
import fs from 'fs'
import { loginRedirectUrl } from "../api/auth0"
import { PrismaClient } from "@prisma/client"
import { userStore } from "~/stores/user";

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  event.context.prisma = prisma
  const srtoken = getCookie(event, 'srtoken') || ''
  if(srtoken){
    try {
      const claims:any = jwt.verify(srtoken, fs.readFileSync(process.cwd() + '/cert-dev.pem'))
      if(claims instanceof Object && "nonce" in claims){
        event.context.claims = claims
        const id = claims['sub']
        const player = await prisma.player.findUnique({
          where:{
            user_id: id
          }
        })
        const store = userStore()
        if(player){
          store.set(player.username)
          // console.log(store.name)
          setCookie(event, 'sruser', JSON.stringify({username: player.username, user_id: player.user_id}))
        } else {
          store.set("")
          setCookie(event, 'sruser', '')
        }
      }
    } catch (error) {
      console.error(error)
      setCookie(event, 'srtoken', '')
      return await sendRedirect(event, loginRedirectUrl())
    }
  } else {
    setCookie(event, 'sruser', '')
    setCookie(event, 'srtoken', '')
  }
})



