import {loginRedirectUrl, logoutRedirectUrl} from "../api/auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
const runtime = useRuntimeConfig()

import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()

const publicURLs = []

export default defineEventHandler(async event => {
    const srtoken = getCookie(event, "srtoken") || ""

    if(srtoken){
        
    }

    // if (!srtoken) {
    //     await sendRedirect(event, loginRedirectUrl());
    // } 
    // else {
    //     // theoretically logged in
    //     if (srtoken) {
    //         try {
    //             const claims = jwt.verify(srtoken, fs.readFileSync(process.cwd()+"/cert-dev.pem"))
    //         } catch(e){
    //             console.error(e)
    //             setCookie(event,"srtoken","")
    //             setCookie(event,"sruser","")
    //         }
    //     }
    // }
})