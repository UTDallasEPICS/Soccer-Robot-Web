<template>
    <div class="flex flex-col">
        <div>
            <TopNavBar></TopNavBar>
            <BottomNavBar></BottomNavBar>
        </div>
        <div class="flex justify-center py-6">
            <div class="flex flex-col">
                <Scoreboard></Scoreboard>
                <span class="py-4 pr-6">
                    <VideoStream></VideoStream>
                </span>
            </div>
            <QueueContainer @join-queue="joinQueue" @leave-queue="leaveQueue"></QueueContainer>
        </div>
    </div>
</template>

<script setup lang="ts">
const ws_queue = ref<WebSocket>()
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
        }
        else if(type === "MATCH_CONFIRMATION_RESET"){
        }
        else if(type === "MATCH_START"){
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
</script>