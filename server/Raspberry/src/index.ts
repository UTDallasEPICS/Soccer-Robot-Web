import { WebSocketServer } from "ws"
import dotenv from "dotenv"

// Environment variables
dotenv.config({ path: "./.env" })
const LOCALHOST: string = process.env.LOCALHOST ?? "localhost"
const PORT_GM_RASPBERRY: number = parseInt(`${process.env.PORT_GM_RASPBERRY}`)
const PORT_WSS_CONTROLLER_RASPBERRY: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_RASPBERRY}`)

// Shared variables
let ready: boolean = true
let timer: number = 0
let score1: number = 10
let score2: number = 2

// FOR GAME MANAGER
const wss_gm = new WebSocketServer({ port: PORT_GM_RASPBERRY})

wss_gm.on("listening", () => {
    console.log(`WebSocket wss_gm is running on ws://${LOCALHOST}:${PORT_GM_RASPBERRY}`)
})

wss_gm.on("error", (error) => {
    console.log("WebSocket wss_gm error: " + error)
})

wss_gm.on("close", () => {
    console.log("WebSocket wss_gm closed")
})

wss_gm.on("connection", (ws: any, request) => {
    ws.on("message", (data: any) => {
        const { type, payload } = JSON.parse(data)
        if(type === "CHECK_READY"){ // should already be in
            console.log(`Telling GM: ready is ${ready}`)
            ws.send(JSON.stringify({
                "type": "IS_READY",
                "payload": ready
            }))
        }
        else if(type === "GAME_START"){
            timer = payload["timer"]
            const broadcastTimer = setInterval(() => {
                if(timer === 0){
                    clearInterval(broadcastTimer)
                    clearInterval(broadcastScore)
                    ws.send(JSON.stringify({
                        "type": "GAME_END",
                        "payload": {"timer": timer, "score1": score1, "score2": score2}
                    }))
                }
                else{
                    ws.send(JSON.stringify({
                        "type": "TIMER_UPDATE",
                        "payload": {"timer": timer}
                    }))
                    timer--
                }
            }, 1000)
            const broadcastScore = setInterval(() => {
                ws.send(JSON.stringify({
                    "type": "SCORE_UPDATE",
                    "payload": {"score1": score1, "score2": score2}
                }))
            }, 1000)
        }
    })
})

// FOR CONTROLLER
const wss_control = new WebSocketServer({ port: PORT_WSS_CONTROLLER_RASPBERRY})

wss_control.on("listening", () => {
    console.log(`WebSocket wss_control is running on ws://${LOCALHOST}:${PORT_WSS_CONTROLLER_RASPBERRY}`)
})

wss_control.on("error", (error) => {
    console.log("WebSocket wss_control error: " + error)
})

wss_control.on("close", () => {
    console.log("WebSocket wss_control closed")
})

wss_control.on("connection", (ws: any, request) => {
    ws.on("message", (data: any) => {
        const { type, payload } = JSON.parse(data)

        if(type === "KEY_INPUT"){ // should already be in
            const { keys, playernumber }: {keys: string, playernumber: number} = payload
            console.log(`Player ${playernumber} pressed ${keys}`)
        }
    })
})