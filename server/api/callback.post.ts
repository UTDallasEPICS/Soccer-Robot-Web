import jwt from "jsonwebtoken"
import fs from "fs"
import { verifyNonce } from "./auth0"
import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid"

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const srtoken = body.id_token
    const claims: any = jwt.verify(srtoken, fs.readFileSync(process.cwd()+"/cert-dev.pem"))
    // check for valid nonce claim
    if(claims instanceof Object && "nonce" in claims && verifyNonce(claims["nonce"].toString())){
        const user_id: string = claims["sub"]
        const email: string = claims["email"]
        const find_user = await prisma.player.findUnique({
            where: {
                user_id: user_id
            }
        })
        // if not in database yet, create new player in database
        let username: string
        if(find_user){
            username = find_user.username
        }
        else{
            username = nanoid()
            const user = await prisma.player.create({
                data: { user_id: user_id, username: username, email: email}, 
            })
        }
        setCookie(event, "srtoken", srtoken)
        setCookie(event, "sruser", username)
    }
    await sendRedirect(event, "/") 
})