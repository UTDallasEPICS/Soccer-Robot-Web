import express from "express"
import { WebSocket, WebSocketServer } from "ws"
import { createServer, IncomingMessage } from "http"
import jwt from "jsonwebtoken"
import fs from "fs"
import dotenv from "dotenv"

// Environment variables
dotenv.config({ path: "./.env" })
const PORT_SERVER: number = parseInt(`${process.env.PORT_EXPRESS_CONTROLLER_GAMEMANAGER}`)
const PORT_WSS_CLIENT: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_CLIENT}`)
const PORT_WSS_RASPBERRY: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_RASPBERRY}`)
let CONTROLLER_ACCESS: string = ""

// Temporary queue until Auth0+database is set up
// ws to close connection on POST /removeuser
const allowedUsers: Array<{"username": string, "user_id": string, "playernumber": number, "ws": any}> = []

const printCurrentUsers = () => {
    let output = ""
    allowedUsers.forEach((element) => {output += element["username"] + " "})
    return output
}

// WEBSOCKET RASPBERRY
// Make sure to set up Raspberry server first
const ws_raspberry = new WebSocket(`ws://localhost:${PORT_WSS_RASPBERRY}`)
console.log(`WS_RASPBERRY CONNECTED ws://localhost:${PORT_WSS_RASPBERRY}`)

// SECTION: EXPRESS SERVER: GAME_MANAGER -> CONTROLLER
// THIS IS A PRIVATE PORT
const app = express()
app.use(express.json())

app.listen(PORT_SERVER, () => {
    console.log(`Express Server is running on http://localhost:${PORT_SERVER}`);
})

app.post("/accesspassword", (request, response) => {
    CONTROLLER_ACCESS = request.body.accesspassword
    response.send(`CHANGED ACCESS PASSWORD TO ${CONTROLLER_ACCESS}`)
    console.log(`CHANGED ACCESS PASSWORD TO ${CONTROLLER_ACCESS}`)
})

app.post("/adduser", (request, response) => {
    const username: string = request.body.username
    const user_id: string = request.body.user_id
    const playernumber: number = request.body.playernumber
    let status = 400
    // If allowedUsers.lenth < 2 and user is not in allowedUsers
    if(allowedUsers.length < 2 && allowedUsers.findIndex((element) => {return element["username"] === username}) == -1){
        // ws is set after the player connects through WebSocket
        allowedUsers.push({"username": username, "user_id": user_id, "playernumber": playernumber, "ws": null})
        response.send(`ADDED PLAYER ${playernumber} as ${username}`)
        console.log(`ADDED PLAYER ${playernumber} as ${username} | ALLOWED_USERS: ${printCurrentUsers()}`)
        status = 200
    }
    response.status(status).end()
})

app.post("/removeuser", (request, response) => {
    const username: string = request.body.username
    const index = allowedUsers.findIndex((element) => {return element["username"] === username})
    let status = 400
    // If user is in allowedUsers
    if(index != -1){
        if(allowedUsers[index]["ws"]){ // Close ws connection if connected
            allowedUsers[index]["ws"].close()
        }
        allowedUsers.splice(index, 1)
        response.send(`REMOVED ${username}`)
        console.log(`REMOVED ${username} | ALLOWED_USERS: ${printCurrentUsers()}`)
        status = 200
    }
    response.status(status).end()
})

// SECTION: WEBSOCKET SERVER: CLIENT -> CONTROLLER
const server = createServer()
const wss = new WebSocketServer({ noServer: true })

wss.on("error", (error) => {
    console.log("WebSocket server error: " + error)
})

wss.on("close", () => {
    console.log("WebSocket server closed")
})

wss.on("connection", (ws: any, request: IncomingMessage, user_id: string) => {
    console.log("WSS_CONTROLLER_CLIENT: New connection!")

    const index = allowedUsers.findIndex((element) => { return element["user_id"] === user_id})
    const playernumber = allowedUsers[index]["playernumber"]

    ws.on("message", (data: any) => {
        const { type, payload } = JSON.parse(data)
        
        if(type === "KEY_INPUT"){
            if(payload === "w" || payload === "a" || payload === "s" || payload === "d"){
                console.log(`PLAYER ${playernumber}: ${user_id} | ${type} : ${payload}`)
                // Forward KEY_INPUT to Raspberry server
                ws_raspberry.send(JSON.stringify({
                    "type": "KEY_INPUT",
                    "payload": {
                        "key": payload,
                        "playernumber": playernumber
                    }
                }))
            }
        }
    })
    allowedUsers[index]["ws"] = ws
    ws.send("CONNECTED")
})

// check for upgrade request to websocket from a logged in user
server.on("upgrade", async (request, socket, head) => {
    // Get cookies
    const cookies = request.headers["cookie"] ?? ""
    if(cookies === ""){ // if no cookies, close connection
        socket.destroy()
        return
    }
    const cookiepairs = cookies.split(";");
    const cookiesplittedPairs = cookiepairs.map(cookie => cookie.split("="));
    const cookieObj: { [key: string]: string } = {}
    cookiesplittedPairs.forEach((pair) => {
        // set each cookie value in the cookieObj
        cookieObj[decodeURIComponent(pair[0].trim())] = decodeURIComponent(pair[1].trim())
    })

    if(!(cookieObj["srtoken"] && cookieObj["accesspassword"])){ // if no srtoken cookie or accesspassword cookie, close connection
        socket.destroy()
        return
    }

    if(cookieObj["accesspassword"] !== CONTROLLER_ACCESS){ // if accesspassword is invalid, close connection
        socket.destroy()
        return
    }

    // Authenticate using jwt from cookie srtoken
    const srtoken = cookieObj["srtoken"]
    const claims: any = jwt.verify(srtoken, fs.readFileSync(process.cwd()+"/cert-dev.pem"), (error, decoded) => {
        if(error){ 
            socket.destroy()
            return
        }
        return decoded
    })

    if(!(claims instanceof Object && claims["sub"])){ // if jwt is invalid, close connection
        socket.destroy()
        return
    }
    const user_id: string = claims["sub"]
    
    if(allowedUsers.findIndex((element) => { return element["user_id"] === user_id}) === -1){ // if user is not in allowedUsers, close connection
        socket.destroy()
        return
    }

    // valid logged in user, upgrade connection to websocket
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request, user_id)
    })
})

server.listen(PORT_WSS_CLIENT, () => {
    console.log(`SERVER is running on http://localhost:${PORT_WSS_CLIENT}`)
})