import express from "express"
import { PrismaClient } from '@prisma/client'   
import { WebSocket, WebSocketServer } from "ws"
import { createServer, IncomingMessage } from "http"
import jwt from "jsonwebtoken"
import fs from "fs"
import dotenv from "dotenv"
import cors from 'cors';


interface JwtPayloadWithRole extends jwt.JwtPayload {
    role?: string;
  }
  
// Environment variables
dotenv.config({ path: "./.env" })
const LOCALHOST: string = process.env.LOCALHOST ?? "localhost"
const PORT_SERVER: number = parseInt(`${process.env.PORT_EXPRESS_CONTROLLER_GAMEMANAGER}`)
const PORT_WSS_CLIENT: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_CLIENT}`)
const PORT_WSS_RASPBERRY: number = parseInt(`${process.env.PORT_WSS_CONTROLLER_RASPBERRY}`)
let CONTROLLER_ACCESS: string = ""

// Temporary queue until Auth0+database is set up
// ws to close connection on POST /removeuser
const allowedUsers: Array<{"user_id": string, "playernumber": number, "ws": any}> = []
const prisma = new PrismaClient();  

const printCurrentUsers = () => {
    let output = ""
    allowedUsers.forEach((element) => {output += element["user_id"] + " "})
    return output
}

// WEBSOCKET RASPBERRY
// Make sure to set up Raspberry server first
const ws_raspberry = new WebSocket(`ws://localhost:${PORT_WSS_RASPBERRY}`)

ws_raspberry.onopen = (event) => {
    console.log(`WS_RASPBERRY CONNECTED ws://localhost:${PORT_WSS_RASPBERRY}`)
}

ws_raspberry.onerror = (error) => {
    console.log("WS_RASPBERRY error: " + error.message)
    console.error(error)
}
ws_raspberry.onclose = (event) => {
    console.log("WS_RASPBERRY closed")
}

// SECTION: EXPRESS SERVER: GAME_MANAGER -> CONTROLLER
// THIS IS A PRIVATE PORT
const app = express()
app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: '*'
}));

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, role');
    res.sendStatus(200);
});

app.listen(PORT_SERVER, () => {
    console.log(`Express Server is running on http://${LOCALHOST}:${PORT_SERVER}`);
})

app.post("/accesspassword", (request, response) => {
    CONTROLLER_ACCESS = request.body.accesspassword
    response.send(`CHANGED ACCESS PASSWORD TO ${CONTROLLER_ACCESS}`)
    console.log(`CHANGED ACCESS PASSWORD TO ${CONTROLLER_ACCESS}`)
})

app.post("/adduser", (request, response) => {
    const user_id: string = request.body.user_id
    const playernumber: number = request.body.playernumber
    let status = 400
    // If allowedUsers.lenth < 2 and user is not in allowedUsers
    if(allowedUsers.length < 2 && allowedUsers.findIndex((element) => {return element["user_id"] === user_id}) == -1){
        // ws is set after the player connects through WebSocket
        allowedUsers.push({"user_id": user_id, "playernumber": playernumber, "ws": null})
        response.send(`ADDED PLAYER ${playernumber} as ${user_id}`)
        console.log(`ADDED PLAYER ${playernumber} as ${user_id} | ALLOWED_USERS: ${printCurrentUsers()}`)
        status = 200
    }
    response.status(status).end()
})

app.post("/removeuser", (request, response) => {
    const user_id: string = request.body.user_id
    const index = allowedUsers.findIndex((element) => {return element["user_id"] === user_id})
    let status = 400
    // If user is in allowedUsers
    if(index != -1){
        if(allowedUsers[index]["ws"]){ // Close ws connection if connected
            allowedUsers[index]["ws"].close()
        }
        allowedUsers.splice(index, 1)
        response.send(`REMOVED ${user_id}`)
        console.log(`REMOVED ${user_id} | ALLOWED_USERS: ${printCurrentUsers()}`)
        status = 200
    }
    response.status(status).end()
})

app.post("/addusers", (request, response) => {
    /* Example request body
        {
            "users":[{"user_id":"abc","playernumber":0},{"user_id":"def","playernumber":1}]
        }
    */
    const users = request.body.users
    // console.log(Object.keys(users)) // [ '0', '1' , ...]
    let status = 400
    // If allowedUsers.lenth < 2 and user is not in allowedUsers
    Object.keys(users).forEach((key) => {
        const user_id = users[key]["user_id"]
        const playernumber = users[key]["playernumber"]
        if(allowedUsers.length < 2 && allowedUsers.findIndex((element) => {return element["user_id"] === user_id}) == -1){
            // ws is set after the player connects through WebSocket
            allowedUsers.push({"user_id": user_id, "playernumber": playernumber, "ws": null})
            // response.send(`ADDED PLAYER ${playernumber} as ${user_id}`)
            console.log(`ADDED PLAYER ${playernumber} as ${user_id} | ALLOWED_USERS: ${printCurrentUsers()}`)
            status = 200
        }
    })
    response.status(status).end()
})

app.post("/removeusers", (request, response) => {
    /* Example request body
    {
        "users":[{"user_id":"abc"},{"user_id":"def"}]
    }
    */
    const users = request.body.users
    // console.log(Object.keys(users)) // [ '0', '1' , ...]
    let status = 400
    Object.keys(users).forEach((key) => {
        const user_id = users[key]["user_id"]
        const index = allowedUsers.findIndex((element) => {return element["user_id"] === user_id})
        // If user is in allowedUsers
        if(index != -1){
            if(allowedUsers[index]["ws"]){ // Close ws connection if connected
                allowedUsers[index]["ws"].close()
            }
            allowedUsers.splice(index, 1)
            // response.send(`REMOVED ${user_id}`)
            console.log(`REMOVED ${user_id} | ALLOWED_USERS: ${printCurrentUsers()}`)
            status = 200
        }
    })
    response.status(status).end()
})

app.post("/shutdownrobot", (request, response) => {
    const role = request.headers.role

    // Check if the user has an 'admin' role
    if (role !== "admin") {
        return response.status(403).json({ message: "Unauthorized" });
    }
    
    // If admin, send shutdown command to Raspberry Pi
    ws_raspberry.send(JSON.stringify({
        "type": "ADMIN_INPUT",
        "payload": "ROBOT_SHUTDOWN"
    }))

    response.status(200).json({message: "Robot shutdown command sent!"});
});

app.post("/editMatchSettings", async (request, response) => {
    const role = request.headers.role;
    const { numPlayers, matchTime } = request.body;

    // Ensure that the user is an admin
    if (role !== "admin") {
        return response.status(403).json({ message: "Unauthorized" });
    }

    try {
        // Upsert the matchSettings record
        const updatedSettings = await prisma.matchSettings.upsert({
            where: { id: 1 },
            update: {
                numPlayers: parseInt(numPlayers),
                matchLength: matchTime,
            },
            create: {
                id: 1,
                numPlayers: parseInt(numPlayers),
                matchLength: matchTime,
            },
        });

        return response.status(200).json({
            message: "Match settings updated successfully.",
            data: updatedSettings,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Failed to update match settings."});
    }
});


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
            // example payload in form of "1010", corresponding to "wasd", 1 for on, 0 for off
            const regex = /[01][01][01][01]/
            if(regex.test(payload)){
                console.log(`PLAYER ${playernumber}: ${user_id} | ${type} : ${payload}`)
                // Forward KEY_INPUT to Raspberry server
                ws_raspberry.send(JSON.stringify({
                    "type": "KEY_INPUT",
                    "payload": {
                        "keys": payload,
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
    console.log(`SERVER is running on http://${LOCALHOST}:${PORT_WSS_CLIENT}`)
})
