import express from "express"
import dotenv from "dotenv"
import { WebSocket, WebSocketServer } from "ws"
import { createServer, IncomingMessage } from "http"
// import { createServer } from "https"
import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid"

const prisma = new PrismaClient()

// Environment variables
dotenv.config({ path: "./.env" })
const PORT_SSE_GM: number = parseInt(`${process.env.PORT_SSE_GM}`)
const PORT_GM_RASPBERRY: number = parseInt(`${process.env.PORT_GM_RASPBERRY}`)
const PORT_CLIENT_GM: number = parseInt(`${process.env.PORT_CLIENT_GM}`)
const PORT_EXPRESS_CONTROLLER_GAMEMANAGER: number = parseInt(`${process.env.PORT_EXPRESS_CONTROLLER_GAMEMANAGER}`)

// SHARED VARIABLES
const queue: Array<{username: string, user_id: string, ws: any}> = []
const players: Array<{username: string, user_id: string, ws: any, accepted: boolean}> = []
let CONFIRMATION_PASSWORD: string = "sousounofrieren" // "Tearful goodbyes aren’t our style. It’d be embarrassing when we meet again"
let CONTROLLER_ACCESS: string = "donutvampire" // the initial value does not do anything here
let timer: number = 0
let confirmation_timer: number = 0
let score1: number = 0
let score2: number = 0
enum GAME_STATE { NOT_PLAYING, SEND_CONFIRM, PLAYING, RESETTING }
let game_state: GAME_STATE = GAME_STATE.NOT_PLAYING

// SECTION: GAME CYCLES
const gameCycle = setInterval( async () => {
    if(game_state == GAME_STATE.NOT_PLAYING){
        // Check for sufficient users in queue to send confirmation request
        if(queue.length >= 2){
            game_state = GAME_STATE.SEND_CONFIRM
            CONFIRMATION_PASSWORD = nanoid() // new password for each confirmation attempt
            queue[0].ws.send(JSON.stringify({
                "type": "MATCH_CONFIRMATION",
                "payload": CONFIRMATION_PASSWORD
            }))
            queue[1].ws.send(JSON.stringify({
                "type": "MATCH_CONFIRMATION",
                "payload": CONFIRMATION_PASSWORD
            }))
            confirmation_timer = 15 // 15 seconds to confirm
        }
    }
    else if(game_state == GAME_STATE.SEND_CONFIRM){
        // Check if received 2 confirmation response
        if(confirmation_timer == 0){ // time's up
            // 2 accepts -> start game
            if(players.length == 2 && players[0]["accepted"] && players[1]["accepted"]){
                game_state = GAME_STATE.PLAYING
                CONTROLLER_ACCESS = nanoid() // new access code for each game
                // tell Controller server to change access code
                await fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/accesspassword`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "accesspassword": CONTROLLER_ACCESS
                    })
                })
                console.log(players[0]["username"] + " vs " + players[1]["username"])
                // authorize players in Controller server to send key inputs
                // TODO: change this to 1 network request
                await fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/adduser`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "playernumber": 0,
                        "username": players[0]["username"],
                        "user_id": players[0]["user_id"]
                    })
                })
                await fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/adduser`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "playernumber": 1,
                        "username": players[1]["username"],
                        "user_id": players[1]["user_id"]
                    })
                })
                // give players the access code to connect to Controller server WebSocket
                queue[0].ws.send(JSON.stringify({
                    "type": "MATCH_START",
                    "payload": CONTROLLER_ACCESS
                }))
                queue[1].ws.send(JSON.stringify({
                    "type": "MATCH_START",
                    "payload": CONTROLLER_ACCESS
                }))
                // close ws because players are not in queue anymore
                queue[0]["ws"].close()
                queue[1]["ws"].close()
                queue.splice(0, 2)
                timer = 60
                // yay
            }
            else{ // did not get 2 accepts
                // find the player(s) that declined/did not respond and remove from queue/close ws connection
                // index of user queue[0] in players array
                const indexA: number = players.findIndex((element) => { return element["username"] === queue[0]["username"]})
                // index of user queue[1] in players array
                const indexB: number = players.findIndex((element) => { return element["username"] === queue[1]["username"]})
                let removeA: boolean = false
                let removeB: boolean = false
                if(indexA == -1 || players[indexA]["accepted"] === false){ // close connection for player A if did not respond or declined
                    queue[0]["ws"].close()
                    removeA = true
                }
                if(indexB == -1 || players[indexB]["accepted"] === false){ // close connection for player B if did not respond or declined
                    queue[1]["ws"].close()
                    removeB = true
                }
                // remove declined/did not respond players from queue
                if(removeA && removeB){
                    queue.splice(0, 2)
                }
                else if(removeA){
                    queue.splice(0, 1)
                }
                else if(removeB){
                    queue.splice(1, 1)
                }
                game_state = GAME_STATE.NOT_PLAYING
                players.splice(0, players.length) // clear array
            }
        }
        confirmation_timer--
    }
    else if(game_state == GAME_STATE.PLAYING){
        // Check when timer reaches 0
        console.log(`TIMER: ${timer} | ${players[0]["username"]} vs ${players[1]["username"]}`)
        timer--
        if(timer == 0){
            game_state = GAME_STATE.RESETTING
        }
    }
    else if(game_state == GAME_STATE.RESETTING){
        // Game end: remove players from authorization in Controller server and clear player array
        // TODO: change this to 1 network request
        await fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/removeuser`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "playernumber": 0,
                "username": players[0]["username"]
            })
        })
        await fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/removeuser`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "playernumber": 0,
                "username": players[1]["username"]
            })
        })
        players.splice(0, 2)
        game_state = GAME_STATE.NOT_PLAYING
    }
}, 1000)

// SECTION: WEBSOCKET LOGGED IN CLIENT <-> GAME MANAGER
const server_wss_CLIENT_GM = createServer()
const wss_client_gm = new WebSocketServer({ noServer: true })

wss_client_gm.on("connection", (ws: any, request: IncomingMessage, username: string, user_id: string) => {
    console.log("New connection!")

    // kick user if ws connection is lost or closed
    ws.onclose = (event: any) => {
        const index = queue.findIndex((element) => { return element["username"] === username })
        if(index != -1){
            console.log("REMOVING " + queue[index]["username"])
            queue.splice(index, 1)
        }
    }
    ws.on("message", (data: any) => {
        const { type, payload } = JSON.parse(data)
        console.log(`Received message => ${type} : ${payload}`)

        if(type === "JOIN_QUEUE"){ // should already be in
            const index = queue.findIndex((element) => { return element.username === username })
            // do not let in if user is in game
            const player_index = players.findIndex((element) => { return element.username === username })
            if(index == -1 && player_index == -1){
                console.log("ADDING " + username)
                queue.push({"username": username, "user_id": user_id, "ws": ws})
            }
        }
        else if(type === "LEAVE_QUEUE"){
            const index = queue.findIndex((element) => { return element["username"] === username })
            if(index != -1){
                console.log("REMOVING " + queue[index]["username"])
                queue.splice(index, 1)
            }
            ws.close()
        }
        else if(type === "CONFIRMATION"){
            const { password, accepted } : { password: string, accepted: boolean } = payload
            if(password === CONFIRMATION_PASSWORD){
                if(game_state === GAME_STATE.SEND_CONFIRM){
                    const player_index = players.findIndex((element) => { return element.username === username })
                    // make sure players do not accept/decline multiple times
                    if(player_index == -1){
                        // make sure users are the next 2 in queue
                        if(queue[0]["username"] === username || queue[1]["username"] === username){
                            players.push({"username": username, "user_id": user_id, "ws": ws, "accepted": accepted})
                            console.log(`Player ${username} has ${accepted ? "accepted" : "declined"}`)
                        }
                    }
                }
            }
        }
    })
    ws.send("CONNECTED")
})

wss_client_gm.on("error", (error) => {
    console.log("WSS_CLIENT_GM error: " + error)
})

wss_client_gm.on("close", () => {
    console.log("WSS_CLIENT_GM closed")
})

// check for upgrade request to websocket from a logged in user
server_wss_CLIENT_GM.on("upgrade", async (request, socket, head) => {
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

    if(!cookieObj["srtoken"]){ // if no srtoken cookie, close connection
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
    const find_user = await prisma.player.findUnique({
        where: {
            user_id: user_id
        }
    })
    if(!find_user){ // if user is not in database, close connection
        socket.destroy()
        return
    }

    // valid logged in user, upgrade connection to websocket
    wss_client_gm.handleUpgrade(request, socket, head, (ws) => {
        wss_client_gm.emit("connection", ws, request, find_user.username, user_id)
    })
})

server_wss_CLIENT_GM.listen(PORT_CLIENT_GM, () => {
    console.log(`SERVER_WSS_CLIENT_GM is running on http://localhost:${PORT_CLIENT_GM}`)
})

// SECTION: SERVER SENT EVENTS
const app_sse = express()

const sse_clients: Array<any> = []

app_sse.listen(PORT_SSE_GM, () => {
    console.log(`SSE is running on http://localhost:${PORT_SSE_GM}`)
})

app_sse.get("/", (request, response) => {
    response.send("SSE SERVER")
})

// Establish SSE connection
app_sse.get("/sse-info", (request, response) => {
    const headers = {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache"
    }
    response.writeHead(200, headers)

    const clientID = Date.now()
    const newClient = {
        id: clientID,
        response: response
    }
    console.log("sse-info: " + clientID)
    sse_clients.push(newClient)

    request.on("close", () => {
        console.log("Client Connection closed")
    })
})

// Broadcast Queue, Timer, and Score1/Score2
const broadcastQueue = setInterval(() => {
    const queue_users: Array<string> = []
    queue.forEach((user) => {
        queue_users.push(user["username"])
    })
    const queue_update = JSON.stringify({"type": "UPDATE_QUEUE", "payload": queue_users})
    sse_clients.forEach((client) => {
        client["response"].write("data: " + queue_update +"\n\n")
    })
}, 1000)

const broadcastTimer = setInterval(() => {
    const timer_update = JSON.stringify({"type": "UPDATE_TIMER", "payload": timer})
    sse_clients.forEach((client) => {
        client["response"].write("data: " + timer_update +"\n\n")
    })
}, 1000)

const broadcastScore = setInterval(() => {
    const score_update = JSON.stringify({"type": "UPDATE_SCORE", "payload": {"score1": score1, "score2": score2 }})
    sse_clients.forEach((client) => {
        client["response"].write("data: " + score_update +"\n\n")
    })
}, 1000)

// SECTION: WEBSOCKET GAME MANAGER <-> RASPBERRY
// Make sure to set up Raspberry server first
const ws_raspberry = new WebSocket(`ws://localhost:${PORT_GM_RASPBERRY}`)

ws_raspberry.onopen = (event) => {
    console.log(`WS_RASPBERRY CONNECTED ws://localhost:${PORT_GM_RASPBERRY}`)
}

ws_raspberry.onerror = (error) => {
    console.log("WS_RASPBERRY error: " + error)
}
ws_raspberry.onclose = (event) => {
    console.log("WS_RASPBERRY closed")
}

ws_raspberry.onmessage = (event) => {
    const { type, payload } = JSON.parse(event.data.toString())
    console.log(`Received message => ${type} : ${payload}`)
    if(type === "TIMER") {
        timer = payload
    }
    else if(type === "SCORE"){
        score1 = payload["score1"]
        score2 = payload["score2"]
    }
}