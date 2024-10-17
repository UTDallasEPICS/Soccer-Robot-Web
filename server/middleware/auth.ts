import jwt from "jsonwebtoken"
import fs from 'fs'
import { loginRedirectUrl } from "../api/auth0"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface JwtPayloadWithRole extends jwt.JwtPayload {
  role?: string;
}

export default defineEventHandler(async event => {
  event.context.prisma = prisma
  const srtoken = getCookie(event, 'srtoken') || ''
  if (srtoken) {
    try {
      const claims: JwtPayloadWithRole | string = jwt.verify(srtoken, fs.readFileSync(process.cwd() + '/cert-dev.pem')) as JwtPayloadWithRole
      if (typeof claims === 'object' && 'nonce' in claims) {
        event.context.claims = claims
        const id = claims['sub']
        const player = await prisma.player.findUnique({
          where: {
            user_id: id
          },
          select: {
            username: true,
            role: true
          }
        })
        
        if (player) {
          setCookie(event, 'sruser', JSON.stringify({ username: player.username, role: player.role }))
        } else {
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
