import jwt from 'jsonwebtoken'
import fs from 'fs'
import { verifyNonce } from './auth0'
import { nanoid } from 'nanoid'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const srtoken = body.id_token
  const claims: any = jwt.verify(srtoken, fs.readFileSync(process.cwd()+"/cert-dev.pem"))
  // check for valid nonce claims
  if(claims instanceof Object && "nonce" in claims && verifyNonce(claims["nonce"].toString())){
    setCookie(event, 'srtoken', srtoken)
  }
  await sendRedirect(event, '/')
})