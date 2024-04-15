import express from "express"
import { WebSocket, WebSocketServer } from "ws"
import dotenv from "dotenv"

// Environment variables
dotenv.config({ path: "../../.env" })
const PORT_SERVER: number = parseInt(`${process.env.PORT_EXPRESS_CONTROLLER_GAMEMANAGER}`)
const PORT_WSS_CLIENT: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_CLIENT}`)
const PORT_WSS_RASPBERRY: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_RASPBERRY}`)
let CONTROLLER_ACCESS: string = process.env.CONTROLLER_ACCESS ?? ""

// Temporary queue until Auth0+database is set up
// ws to close connection on POST /removeuser
const allowedUsers: Array<{"username": string, "playernumber": number, "ws": any}> = []

const printCurrentUsers = () => {
    let output = ""
    allowedUsers.forEach((element) => {output += element["username"] + " "})
    return output
}

// WEBSOCKET RASPBERRY
// Make sure to set up Raspberry server first
const ws_raspberry = new WebSocket(`ws://localhost:${PORT_WSS_RASPBERRY}`)
console.log(`WS_RASPBERRY CONNECTED ws://localhost:${PORT_WSS_RASPBERRY}`)

// EXPRESS SERVER: GAME_MANAGER -> CONTROLLER
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
    const playernumber: number = request.body.playernumber
    let status = 400
    // If allowedUsers.lenth < 2 and user is not in allowedUsers
    if(allowedUsers.length < 2 && allowedUsers.findIndex((element) => {return element["username"] === username}) == -1){
        // ws is set after the player connects through WebSocket
        allowedUsers.push({"username": username, "playernumber": playernumber, "ws": null})
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

// WEBSOCKET SERVER: CLIENT -> CONTROLLER
const wss = new WebSocketServer({ port: PORT_WSS_CLIENT})

wss.on("listening", () => {
    console.log(`WSS_CONTROLLER_CLIENT is running on ws://localhost:${PORT_WSS_CLIENT}`)
})

wss.on("error", (error) => {
    console.log("WebSocket server error: " + error)
})

wss.on("close", () => {
    console.log("WebSocket server closed")
})

wss.on("connection", (ws: any, request) => {
    console.log("WSS_CONTROLLER_CLIENT: New connection!")
    // Username and accesspassword passed through query parameters
    const url = request.url ? new URL(request.url, `http://${request.headers.host}`) : null
    const username = url?.searchParams.get("username") ?? ""
    const accesspassword = url?.searchParams.get("accesspassword") ?? ""
    // Reject ws connection if accesspassword is wrong or username is not in allowedUsers
    if(!(accesspassword && accesspassword === CONTROLLER_ACCESS && username && allowedUsers.findIndex((element) => { return element["username"] === username}) != -1)){
        ws.close()
        console.log(`WSS_CONTROLLER_CLIENT: REJECTED ${username}`)
    }
    else{
        const index = allowedUsers.findIndex((element) => { return element["username"] === username})
        const playernumber = allowedUsers[index]["playernumber"]
        ws.on("message", (data: any) => {
            const { type, payload } = JSON.parse(data)
            
            if(type === "KEY_INPUT"){
                if(payload === "w" || payload === "a" || payload === "s" || payload === "d"){
                    console.log(`PLAYER ${playernumber}: ${username} | ${type} : ${payload}`)
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
    }
})