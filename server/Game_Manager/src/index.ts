import express from "express"
import dotenv from "dotenv"
import { WebSocket, WebSocketServer } from "ws"

// Environment variables
dotenv.config({ path: "./.env" })
const PORT_SSE_GM: number = parseInt(`${process.env.PORT_SSE_GM}`)
const PORT_GM_RASPBERRY = parseInt(`${process.env.PORT_GM_RASPBERRY}`)
const PORT_CLIENT_GM = parseInt(`${process.env.PORT_CLIENT_GM}`)
const PORT_EXPRESS_CONTROLLER_GAMEMANAGER = parseInt(`${process.env.PORT_EXPRESS_CONTROLLER_GAMEMANAGER}`)
// TODO: RANDOMIZE THESE PASSWORDS EVERY REQUEST ITERATION
let CONFIRMATION_PASSWORD: string = process.env.CONFIRMATION_PASSWORD ?? ""
let CONTROLLER_ACCESS: string = process.env.CONTROLLER_ACCESS ?? ""

// SHARED VARIABLES
const queue: Array<{username: string, ws: any}> = []
const players: Array<{username: string, ws: any, accepted: boolean}> = []
let timer: number = 0
let score1: number = 0
let score2: number = 0
enum GAME_STATE { NOT_PLAYING, SEND_CONFIRM, PLAYING, RESETTING }
let game_state: GAME_STATE = GAME_STATE.NOT_PLAYING

// SECTION: GAME CYCLES
const gameCycle = setInterval(() => {
    if(game_state == GAME_STATE.NOT_PLAYING){
        // Check for sufficient users in queue to send confirmation request
        if(queue.length >= 2){
            game_state = GAME_STATE.SEND_CONFIRM
            queue[0].ws.send(JSON.stringify({
                "type": "MATCH_CONFIRMATION",
                "payload": CONFIRMATION_PASSWORD
            }))
            queue[1].ws.send(JSON.stringify({
                "type": "MATCH_CONFIRMATION",
                "payload": CONFIRMATION_PASSWORD
            }))
        }
    }
    else if(game_state == GAME_STATE.SEND_CONFIRM){
        // Check if received 2 confirmation response
        // TODO: Set a confirmation timer of 15 seconds
        if(players.length == 2){ // 2 confirmations
            // 2 accepts -> start game
            if(players[0]["accepted"] && players[1]["accepted"]){
                game_state = GAME_STATE.PLAYING
                console.log(players[0]["username"] + " vs " + players[1]["username"])
                
                // authorize players in Controller server to send key inputs
                fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/adduser`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "playernumber": 0,
                        "username": players[0]["username"]
                    })
                }).then(() => {
                    fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/adduser`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            "playernumber": 1,
                            "username": players[1]["username"]
                        })
                    }).then(() => { // give players the access code to connect to Controller server WebSocket
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
                    })
                })
            }
            else{
                // did not get 2 accepts
                // find the player(s) that declined and remove from queue/close ws connection
                const indexA: number = queue.findIndex((element) => { return element["username"] === players[0]["username"]})
                const indexB: number = queue.findIndex((element) => { return element["username"] === players[1]["username"]})
                if(players[0]["accepted"] === false && players[1]["accepted"] === false){
                    queue[0]["ws"].close()
                    queue[1]["ws"].close()
                    queue.splice(0, 2)
                }
                else{
                    const indexToRemove = (players[0]["accepted"]) ? indexB : indexA
                    queue[indexToRemove]["ws"].close()
                    // reset the confirmation of the other player
                    queue[1 - indexToRemove]["ws"].send(JSON.stringify({"type": "MATCH_CONFIRMATION_RESET", "payload": ""}))
                    queue.splice(indexToRemove, 1)
                }
                game_state = GAME_STATE.NOT_PLAYING
                players.splice(0, players.length) // clear array
            }
        }
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
        fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/removeuser`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "playernumber": 0,
                "username": players[0]["username"]
            })
        })
        fetch(`http://localhost:${PORT_EXPRESS_CONTROLLER_GAMEMANAGER}/removeuser`, {
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
const wss_client_gm = new WebSocketServer({ port: PORT_CLIENT_GM })

wss_client_gm.on("listening", () => {
    console.log(`wss_CLIENT_GM is running on ws://localhost:${PORT_CLIENT_GM}`)
})

// Temporary database of users
const allowedUsers: Array<string> = ["craz", "jojo", "koro", "frieren"]

wss_client_gm.on("connection", (ws: any, request) => {
    console.log("New connection!")

    // Get username from query parameters for now
    const url = request.url ? new URL(request.url, `http://${request.headers.host}`) : null; 
    const username = url?.searchParams.get("username") ?? ""

    // Authenticate/Authorization should be done here
    if (((username && allowedUsers.includes(username)) == false) 
        || (username && players.length > 0 && players[0]["username"] === username)
        || (username && players.length > 1 && players[1]["username"] === username)) {
        console.log("REJECTED: " + username)
        ws.close()
    }
    else{
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
                    queue.push({"username": username, "ws": ws})
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
                    if(true){ // TODO 
                    // if(game_state === GAME_STATE.SEND_CONFIRM){
                        const player_index = players.findIndex((element) => { return element.username === username })
                        // make sure players do not accept/decline multiple times
                        if(player_index == -1){
                            // make sure users are the next 2 in queue
                            if(queue[0]["username"] === username || queue[1]["username"] === username){
                                players.push({"username": username, "ws": ws, "accepted": accepted})
                                console.log(`Player ${username} has ${accepted ? "accepted" : "declined"}`)
                            }
                        }
                    }
                                              
                }
            }
        })
        ws.send("CONNECTED")
    }
})

wss_client_gm.on("error", (error) => {
    console.log("WSS_CLIENT_GM error: " + error)
})

wss_client_gm.on("close", () => {
    console.log("WSS_CLIENT_GM closed")
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