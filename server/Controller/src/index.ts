import express from "express"
import { WebSocket, WebSocketServer } from "ws"
import dotenv from "dotenv"

// Environment variables
dotenv.config({ path: "../../.env" })
const PORT_SERVER: number = parseInt(`${process.env.PORT_EXPRESS_CONTROLLER_GAMEMANAGER}`)
const PORT_WSS_CLIENT: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_CLIENT}`)
const PORT_WSS_RASPBERRY: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_RASPBERRY}`)
const CONTROLLER_PASSWORD = process.env.CONTROLLER_PASSWORD
let CONTROLLER_ACCESS = process.env.CONTROLLER_ACCESS

// WEBSOCKET RASPBERRY
// Make sure to set up Raspberry server first
// const ws_raspberry = new WebSocket(`ws://localhost:{PORT_WSS_RASPBERRY}`)

// EXPRESS SERVER: GAME_MANAGER -> CONTROLLER
const app = express()
app.use(express.json())

app.listen(PORT_SERVER, () => {
    console.log(`Express Server is running on http://localhost:${PORT_SERVER}`);
})

// WEBSOCKET SERVER: CLIENT -> CONTROLLER
const wss = new WebSocketServer({ port: PORT_WSS_CLIENT})

wss.on("listening", () => {
    console.log(`WSS_CONTROLLER_CLIENT is running on ws://localhost:${PORT_WSS_CLIENT}`)
})