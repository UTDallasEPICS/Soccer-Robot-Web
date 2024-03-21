import { WebSocketServer } from "ws";

const port = 8080
const wss = new WebSocketServer({ port: port })

const gameManager = []
const queue = []
let timerInSeconds = 60
let player1Score = 10
let player2Score = 0

wss.on("listening", () => {
    console.log("WebSocket server listening on port " + port)
})

wss.on("connection", (ws, request) => {
    console.log("New connection!")
    ws.send("CONNECTED")
    ws.on("message", (data: any) => {
        const { type, payload } = JSON.parse(data)
        console.log(`Received message => ${type} : ${payload}`)

        if (type === "KEY") {
            console.log(`Key => ${payload}`)
        }
        else if (type === "QUEUEJOIN") {
            let username = payload
            if(queue.includes(username) == false) {
                queue.push(username)
                console.log(`Join Queue => ${username}`)
                broadcastQueue()
            }
        }
        else if (type === "QUEUELEAVE") {
            let username = payload
            if(queue.includes(username)) {
                queue.splice(queue.indexOf(username), 1)
                console.log(`Leave Queue => ${username}`)
                broadcastQueue()
            }
        }
        else if (type === "REQUESTQUEUE") {
            ws.send(JSON.stringify({
                type: "QUEUEUPDATE",
                payload: queue
            }))
        }
        else if (type === "REQUESTTIMER") {
            ws.send(JSON.stringify({
                type: "TIMERUPDATE",
                payload: timerInSeconds
            }))
        }
        else if (type === "REQUESTSCORE") {
            ws.send(JSON.stringify({
                type: "SCOREUPDATE",
                payload: {
                    player1: player1Score,
                    player2: player2Score
                }
            }))
        }
    })
})

wss.on("error", (error) => {
    console.log("WebSocket server error: " + error)
})

wss.on("close", () => {
    console.log("WebSocket server closed")
    clearInterval(timerInterval)
})

const broadcastQueue = () => {
    console.log("Broadcast Queue: " + queue)
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "QUEUEUPDATE",
            payload: queue
        }))
    })
}

const broadcastTimer = () => {
    console.log("Broadcast Timer: " + timerInSeconds)
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "TIMERUPDATE",
            payload: timerInSeconds
        }))
    })
}

const broadcastScore = () => {
    console.log("Broadcast Score: " + player1Score + " - " + player2Score)
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "SCOREUPDATE",
            payload: {
                player1: player1Score,
                player2: player2Score
            }
        }))
    })
}

const timerInterval = setInterval(() => {
    timerInSeconds++
    broadcastTimer()
}, 1000)

const playerScoreInterval = setInterval(() => {
    (Math.floor(Math.random() * 2) == 0) ? player1Score++ : player2Score++
    broadcastScore()
}, 5000)