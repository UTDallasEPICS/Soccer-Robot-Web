<template>
    <div class="flex flex-col">
        <div>
            <TopNavBar></TopNavBar>
            <BottomNavBar></BottomNavBar>
        </div>
        <div class="flex justify-center py-6">
            <div class="flex flex-col">
                <Scoreboard :timer="Number(timer ?? 0)" :user1="player1?.username ?? ''" :user2="player2?.username ?? ''" :user1score="player1?.score ?? 0" :user2score="player2?.score ?? 0"></Scoreboard>
                <span class="py-4 pr-6">
                    <VideoStream></VideoStream>
                </span>
            </div>
            <QueueContainer :queueUsers="queue" @join-queue="joinQueue" @leave-queue="leaveQueue"></QueueContainer>
            <ConfirmMatchOverlay v-if="confirmationRequest" @confirm-response="confirmMatch"/>
        </div>
    </div>
</template>

<script setup lang="ts">
const ws_queue = ref<WebSocket>()
const ws_controller = ref<WebSocket>()
const confirmationRequest = ref(false)
const confirmationPassword = ref("")

const sse = ref()
const queue = ref<Array<string>>()
const timer = ref<Number>(0)
const player1 = ref<{score: number, username: string}>()
const player2 = ref<{score: number, username: string}>()

const joinQueue = () => {
    ws_queue.value = new WebSocket(`ws://localhost:${useRuntimeConfig().public.PORT_CLIENT_GM}`)
    ws_queue.value.onerror = (event) => {
        console.log("Error: " + event)
        return
    }
    ws_queue.value.onclose = (event) => {
        console.log("WebSocket connection closed")
    }
    ws_queue.value.onmessage = (event) => {
        const { type, payload } = JSON.parse(event.data)
        console.log(`Received message => ${type} : ${payload}`)
        if(type === "MATCH_CONFIRMATION") {
            confirmationPassword.value = payload
            confirmationRequest.value = true
        }
        else if(type === "MATCH_CONFIRMATION_RESET"){
            confirmationRequest.value = false
        }
        else if(type === "MATCH_START"){
            confirmationRequest.value = false
            ws_controller.value = new WebSocket(`ws://localhost:${useRuntimeConfig().public.PORT_WSS_CONTROLLER_CLIENT}`)
        }
    }
    ws_queue.value.onopen = (event) => {
        console.log("WebSocket connection established")
        let message = {
            "type": "JOIN_QUEUE",
            "payload": ""
        }
        ws_queue.value?.send(JSON.stringify(message))
    }
}

const leaveQueue = () => {
    if(ws_queue.value?.OPEN) {
        let message = {
            type: "LEAVE_QUEUE",
            payload: ""
        }
        ws_queue.value.send(JSON.stringify(message))
    }
}

const confirmMatch = (accepted: boolean) => {
    if(ws_queue.value?.OPEN){
        ws_queue.value.send(JSON.stringify({
            type: "CONFIRMATION",
            payload: {"password": confirmationPassword.value, "accepted": accepted}
        }))
    }
}

if(process.client){
    sse.value = new EventSource(`http://localhost:${useRuntimeConfig().public.PORT_SSE_GM}/sse-info`)
    sse.value.addEventListener("message", (message: any) => {
        const data = JSON.parse(message.data)
        const type = data["type"]
        if(type === "UPDATE_QUEUE"){
            const payload: Array<string> = data["payload"]
            queue.value = payload
        }
        else if(type === "UPDATE_TIMER"){
            const payload: number = data["payload"]
            timer.value = payload
        }
        else if(type === "UPDATE_SCORE"){
            const payload: any = data["payload"]
            const { player1: p1, player2: p2 } : {player1: {score: number, username: string}, player2: {score: number, username: string}} = payload
            player1.value = p1
            player2.value = p2
        }
    })
}
</script>