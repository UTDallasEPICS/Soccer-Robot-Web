<template>
<p>Hello World</p>
<div>
    <button @click="listenForKey" class="border-black border-2"> Start Key Listen </button>
    <button @click="stopListeningForKey" class="border-black border-2"> Stop Key Listen </button>
</div>
<div>
    <p>Queue: {{ queue }}</p>
    <button @click="joinQueue" class="border-black border-2"> Join Queue </button>
    <button @click="leaveQueue" class="border-black border-2"> Leave Queue </button>
</div>
<div>
    <p>Timer: {{ timer }}</p>
    <p>Player 1 Score: {{ player1Score }}</p>
    <p>Player 2 Score: {{ player2Score }}</p>
</div>
<p>Current Username: {{ username }}</p>
<input v-model="username" placeholder="edit me" class="border-black border-2"/>
</template>

<script setup lang="ts">
const props = defineProps(["message"])
const ws = ref<WebSocket>()
const queue = ref([])
const timer = ref(0)
const player1Score = ref(0)
const player2Score = ref(0)
const username = ref("")

onMounted(() => {
    console.log("Component mounted")
    ws.value = new WebSocket("ws://localhost:8080")
    ws.value.onerror = (event) => {
        console.log("Error: " + event)
    }
    ws.value.onopen = (event) => {
        console.log("WebSocket connection established")
        if(ws.value){
            ws.value.send(JSON.stringify({
                type: "REQUESTQUEUE",
                payload: ""
            }))
            ws.value.send(JSON.stringify({
                type: "REQUESTTIMER",
                payload: ""
            }))
            ws.value.send(JSON.stringify({
                type: "REQUESTSCORE",
                payload: ""
            }))
        }
    }
    ws.value.onclose = (event) => {
        console.log("WebSocket connection closed")
    }
    ws.value.onmessage = (event) => {
        const { type, payload } = JSON.parse(event.data)
        console.log(`Received message => ${type} : ${payload}`)
        if (type === "QUEUEUPDATE") {
            queue.value = payload
        }
        else if (type === "TIMERUPDATE") {
            timer.value = payload
        }
        else if (type === "SCOREUPDATE") {
            player1Score.value = payload.player1
            player2Score.value = payload.player2
        }
    }
})

const logKey = (event: KeyboardEvent) => {
    console.log("Key pressed " + event.key)
    if(ws.value) {
        let message = {
            type: "KEY",
            payload: event.key
        }
        ws.value.send(JSON.stringify(message))
    }
}

const listenForKey = () => {
    window.addEventListener("keyup", logKey)
}

const stopListeningForKey = () => {
    window.removeEventListener("keyup", logKey)
}

const joinQueue = () => {
    if(ws.value) {
        let message = {
            type: "QUEUEJOIN",
            payload: username.value
        }
        ws.value.send(JSON.stringify(message))
    }
}

const leaveQueue = () => {
    if(ws.value) {
        let message = {
            type: "QUEUELEAVE",
            payload: username.value
        }
        ws.value.send(JSON.stringify(message))
    }
}

</script>