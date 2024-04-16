import express from "express"
import dotenv from "dotenv"
import { WebSocket, WebSocketServer } from "ws"

// Environment variables
dotenv.config({ path: "./.env" })
const PORT_SSE_GM: number = parseInt(`${process.env.PORT_SSE_GM}`)
const PORT_GM_RASPBERRY = parseInt(`${process.env.PORT_GM_RASPBERRY}`)

// SHARED VARIABLES
const queue: Array<{username: string, ws: any}> = []
let timer: number = 0
let score1: number = 0
let score2: number = 0

// SERVER SENT EVENTS
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

// WEBSOCKET GAME MANAGER <-> RASPBERRY
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